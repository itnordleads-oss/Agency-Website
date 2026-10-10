/**
 * Master timeline for the homepage hero workflow animation.
 *
 * Elapsed windows are contiguous — no blank pause between scenes.
 * Each segment fills from its icon to the next icon at a constant play rate.
 * The scene clock stays 1:1 with play time so stage motion never jumps,
 * rewinds, or changes speed at a handoff.
 *
 * Scene 6 holds through 97.8%, then the progress bar rewinds smoothly to empty
 * before a brief zero hold and the next cycle.
 */

export const NLA_DURATION_MS = 34_000;

/** Scene 6 climax hold end — `nla-s6` stays fully visible through 97.8%. */
export const NLA_HOLD_END_PERCENT = 97.8;
export const NLA_HOLD_END_MS = (NLA_HOLD_END_PERCENT / 100) * NLA_DURATION_MS;

/** Progress bar rewinds from full → empty after the finale hold. */
export const NLA_PROGRESS_RESET_MS = 1200;

/** Brief fully-zero pause once the bar has rewound, before scene 1 restarts. */
export const NLA_ZERO_HOLD_MS = 180;

export const NLA_CYCLE_MS = NLA_HOLD_END_MS + NLA_PROGRESS_RESET_MS + NLA_ZERO_HOLD_MS;

export type NlaSceneWindow = {
  id: number;
  startPercent: number;
  endPercent: number;
  startMs: number;
  endMs: number;
};

function sceneWindow(id: number, startPercent: number, endPercent: number): NlaSceneWindow {
  return {
    id,
    startPercent,
    endPercent,
    startMs: (startPercent / 100) * NLA_DURATION_MS,
    endMs: (endPercent / 100) * NLA_DURATION_MS,
  };
}

/**
 * Contiguous workflow windows. Former 2% pauses (14–16, 32–34, …) are
 * absorbed into the outgoing scene so the next icon/scene starts immediately.
 */
export const NLA_SCENES: readonly NlaSceneWindow[] = [
  sceneWindow(1, 0, 16),
  sceneWindow(2, 16, 34),
  sceneWindow(3, 34, 54),
  sceneWindow(4, 54, 70),
  sceneWindow(5, 70, 84),
  sceneWindow(6, 84, 100),
];

/** Five connectors sit between the six dots — one window per scene 1–5. */
export const NLA_SEGMENTS: readonly NlaSceneWindow[] = NLA_SCENES.slice(0, 5);

/**
 * CSS keyframe ranges where each scene's main content is actually on screen.
 * Values come from homeV2CampaignAnimation.css (nla-s*, empty-wrap, orb, hub,
 * note, b1, nla-s6) — not guessed.
 */
export type NlaCssVisibleWindow = {
  id: number;
  firstPercent: number;
  lastPercent: number;
};

export const NLA_CSS_VISIBLE: readonly NlaCssVisibleWindow[] = [
  { id: 1, firstPercent: 0, lastPercent: 12 },
  { id: 2, firstPercent: 19, lastPercent: 30 },
  { id: 3, firstPercent: 36, lastPercent: 48 },
  { id: 4, firstPercent: 56.5, lastPercent: 64 },
  { id: 5, firstPercent: 73, lastPercent: 80 },
  { id: 6, firstPercent: 84.5, lastPercent: 97.8 },
];

/**
 * Full CSS scene windows including overlapping enter/exit crossfades.
 * Neighbors share the official handoff percents so a 1:1 scene clock never
 * lands in a blank gap and never steps backward.
 */
export const NLA_CSS_SCENE_RANGE: readonly NlaCssVisibleWindow[] = [
  { id: 1, firstPercent: 0, lastPercent: 16.4 },
  { id: 2, firstPercent: 14, lastPercent: 34.5 },
  { id: 3, firstPercent: 32.5, lastPercent: 54.5 },
  { id: 4, firstPercent: 52.5, lastPercent: 70.5 },
  { id: 5, firstPercent: 68.5, lastPercent: 85 },
  { id: 6, firstPercent: 82, lastPercent: 100 },
];

export type NlaMasterPhase = "play" | "reset" | "zero";

export type NlaMasterState = {
  phase: NlaMasterPhase;
  /** Elapsed time inside the current cycle, 0 … NLA_CYCLE_MS. */
  cycleElapsedMs: number;
  /** Scene stage clock — includes enter/exit crossfade keyframes. */
  sceneClockMs: number;
  /** Linear play clock for timeline dots (tracks segment fills 1:1). */
  progressClockMs: number;
  /** scaleX for the five progress fills, in order. */
  scales: readonly [number, number, number, number, number];
};

function wrapCycleElapsed(elapsedMs: number): number {
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) {
    return 0;
  }
  return elapsedMs % NLA_CYCLE_MS;
}

/**
 * 1:1 play clock. Remapping each scene onto a shorter CSS slice made handoffs
 * jump (scene 5→6 even ran backward) and changed speed between segments.
 */
export function getSceneClockMs(playElapsedMs: number): number {
  return Math.min(Math.max(playElapsedMs, 0), NLA_HOLD_END_MS);
}

/** Hold the finale until late reset, then ease scene 6 out toward 100%. */
const RESET_SCENE_FADE_START = 0.75;

export function getResetSceneClockMs(cycleElapsedMs: number): number {
  const resetT = getProgressResetT(cycleElapsedMs);
  if (resetT <= RESET_SCENE_FADE_START) {
    return NLA_HOLD_END_MS;
  }

  const fadeT = (resetT - RESET_SCENE_FADE_START) / (1 - RESET_SCENE_FADE_START);
  return NLA_HOLD_END_MS + (NLA_DURATION_MS - NLA_HOLD_END_MS) * fadeT;
}

/** Linear play clock for timeline dot keyframes (matches segment fill timing). */
export function getProgressClockMs(playElapsedMs: number): number {
  return Math.min(Math.max(playElapsedMs, 0), NLA_HOLD_END_MS);
}

/** 0 during play, 0→1 while the progress bar rewinds after the finale hold. */
export function getProgressResetT(cycleElapsedMs: number): number {
  if (cycleElapsedMs < NLA_HOLD_END_MS) {
    return 0;
  }
  const resetEnd = NLA_HOLD_END_MS + NLA_PROGRESS_RESET_MS;
  if (cycleElapsedMs >= resetEnd) {
    return 1;
  }
  return (cycleElapsedMs - NLA_HOLD_END_MS) / NLA_PROGRESS_RESET_MS;
}

export function getVirtualPlayMsDuringReset(cycleElapsedMs: number): number {
  // Linear rewind — even segment pace (ease-in-out was rushing the middle).
  return NLA_HOLD_END_MS * (1 - getProgressResetT(cycleElapsedMs));
}

export function isCssVisiblePercent(percent: number): boolean {
  return NLA_CSS_VISIBLE.some(
    (window) => percent + 0.05 >= window.firstPercent && percent - 0.05 <= window.lastPercent
  );
}

export function isCssScenePercent(percent: number): boolean {
  return NLA_CSS_SCENE_RANGE.some(
    (window) => percent + 0.05 >= window.firstPercent && percent - 0.05 <= window.lastPercent
  );
}

/**
 * Linear fill for one segment from its scene start → next icon/scene start.
 * 0 before the scene, 1 from the instant the next icon arrives through the finale.
 */
export function segmentScaleDuringPlay(elapsedMs: number, segmentIndex: number): number {
  const segment = NLA_SEGMENTS[segmentIndex];
  if (!segment) {
    return 0;
  }
  if (elapsedMs < segment.startMs) {
    return 0;
  }
  if (elapsedMs >= segment.endMs) {
    return 1;
  }
  return (elapsedMs - segment.startMs) / (segment.endMs - segment.startMs);
}

export function segmentScalesDuringPlay(
  elapsedMs: number
): [number, number, number, number, number] {
  return [
    segmentScaleDuringPlay(elapsedMs, 0),
    segmentScaleDuringPlay(elapsedMs, 1),
    segmentScaleDuringPlay(elapsedMs, 2),
    segmentScaleDuringPlay(elapsedMs, 3),
    segmentScaleDuringPlay(elapsedMs, 4),
  ];
}

export function getMasterState(elapsedMs: number): NlaMasterState {
  const cycleElapsedMs = wrapCycleElapsed(elapsedMs);

  if (cycleElapsedMs < NLA_HOLD_END_MS) {
    return {
      phase: "play",
      cycleElapsedMs,
      sceneClockMs: getSceneClockMs(cycleElapsedMs),
      progressClockMs: getProgressClockMs(cycleElapsedMs),
      scales: segmentScalesDuringPlay(cycleElapsedMs),
    };
  }

  const resetEnd = NLA_HOLD_END_MS + NLA_PROGRESS_RESET_MS;
  if (cycleElapsedMs < resetEnd) {
    const virtualPlayMs = getVirtualPlayMsDuringReset(cycleElapsedMs);
    return {
      phase: "reset",
      cycleElapsedMs,
      sceneClockMs: getResetSceneClockMs(cycleElapsedMs),
      progressClockMs: virtualPlayMs,
      scales: segmentScalesDuringPlay(virtualPlayMs),
    };
  }

  return {
    phase: "zero",
    cycleElapsedMs,
    sceneClockMs: 0,
    progressClockMs: 0,
    scales: [0, 0, 0, 0, 0],
  };
}
