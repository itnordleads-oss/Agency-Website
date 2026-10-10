import assert from "node:assert/strict";
import { test } from "node:test";
import {
  NLA_CYCLE_MS,
  NLA_CSS_SCENE_RANGE,
  NLA_CSS_VISIBLE,
  NLA_DURATION_MS,
  NLA_HOLD_END_MS,
  NLA_PROGRESS_RESET_MS,
  NLA_SCENES,
  NLA_SEGMENTS,
  NLA_ZERO_HOLD_MS,
  getMasterState,
  getProgressResetT,
  getResetSceneClockMs,
  getSceneClockMs,
  isCssScenePercent,
  segmentScaleDuringPlay,
} from "./nlaTimeline.ts";

test("master constants come from the 34s CSS timeline", () => {
  assert.equal(NLA_SCENES.length, 6);
  assert.equal(NLA_SEGMENTS.length, 5);
  assert.equal(NLA_SEGMENTS[0]?.startMs, 0);
  assert.equal(NLA_SEGMENTS[0]?.endMs, 5_440);
  assert.equal(NLA_SEGMENTS[1]?.startMs, 5_440);
  assert.equal(NLA_SEGMENTS[1]?.endMs, 11_560);
  assert.equal(NLA_SEGMENTS[4]?.startMs, 23_800);
  assert.equal(NLA_SEGMENTS[4]?.endMs, 28_560);
  assert.equal(NLA_HOLD_END_MS, 33_252);
  assert.equal(NLA_PROGRESS_RESET_MS, 1200);
  assert.equal(NLA_ZERO_HOLD_MS, 180);
  assert.equal(NLA_CYCLE_MS, 34_632);
  assert.deepEqual(
    NLA_SCENES.map((scene) => scene.startPercent),
    [0, 16, 34, 54, 70, 84]
  );
});

test("adjacent scenes share an exact handoff — no blank pause window", () => {
  for (let index = 0; index < NLA_SCENES.length - 1; index += 1) {
    const current = NLA_SCENES[index];
    const next = NLA_SCENES[index + 1];
    assert.ok(current && next);
    assert.equal(current.endPercent, next.startPercent);
  }
});

test("scene clock stays inside a scene CSS window (including crossfades)", () => {
  const formerPauseMidPercents = [15, 33, 53, 69, 83];
  for (const percent of formerPauseMidPercents) {
    const clockPercent =
      (getSceneClockMs((percent / 100) * NLA_DURATION_MS) / NLA_DURATION_MS) * 100;
    assert.ok(
      isCssScenePercent(clockPercent),
      `elapsed ${percent}% mapped to blank CSS ${clockPercent}%`
    );
  }

  for (let ms = 0; ms < NLA_HOLD_END_MS; ms += 50) {
    const clockPercent = (getSceneClockMs(ms) / NLA_DURATION_MS) * 100;
    assert.ok(
      isCssScenePercent(clockPercent),
      `elapsed ${ms}ms mapped to blank CSS ${clockPercent}%`
    );
  }
});

test("fully-visible content windows remain inside scene crossfade ranges", () => {
  for (const visible of NLA_CSS_VISIBLE) {
    const range = NLA_CSS_SCENE_RANGE.find((item) => item.id === visible.id);
    assert.ok(range);
    assert.ok(visible.firstPercent >= range!.firstPercent - 0.05);
    assert.ok(visible.lastPercent <= range!.lastPercent + 0.05);
  }
});

test("scene clock stays 1:1 with play time and never steps backward", () => {
  let previous = 0;
  for (let ms = 0; ms <= NLA_HOLD_END_MS; ms += 16) {
    const clock = getSceneClockMs(ms);
    assert.equal(clock, ms);
    assert.ok(clock + 1e-9 >= previous);
    previous = clock;
  }
  assert.equal(getSceneClockMs(NLA_HOLD_END_MS + 50), NLA_HOLD_END_MS);
});

test("each handoff stays on the official scene boundary", () => {
  for (let index = 0; index < NLA_SEGMENTS.length; index += 1) {
    const segment = NLA_SEGMENTS[index];
    const nextRange = NLA_CSS_SCENE_RANGE[index + 1];
    assert.ok(segment && nextRange);
    assert.equal(getSceneClockMs(segment.endMs), segment.endMs);
    const clockPercent = (segment.endMs / NLA_DURATION_MS) * 100;
    assert.ok(
      isCssScenePercent(clockPercent),
      `handoff ${clockPercent}% is not inside a scene CSS window`
    );
    assert.ok(clockPercent + 0.05 >= nextRange.firstPercent);
    assert.ok(clockPercent - 0.05 <= nextRange.lastPercent);
  }
});

test("each segment stays at 0 until its scene starts", () => {
  for (const [index, segment] of NLA_SEGMENTS.entries()) {
    assert.equal(segmentScaleDuringPlay(segment.startMs - 1, index), 0);
    assert.equal(segmentScaleDuringPlay(segment.startMs, index), 0);
  }
});

test("each segment fills continuously and hits 1 when the next icon arrives", () => {
  for (const [index, segment] of NLA_SEGMENTS.entries()) {
    const mid = segment.startMs + (segment.endMs - segment.startMs) / 2;
    assert.equal(segmentScaleDuringPlay(mid, index), 0.5);
    assert.equal(segmentScaleDuringPlay(segment.endMs, index), 1);
    assert.equal(segmentScaleDuringPlay(segment.endMs + 1, index), 1);
  }
});

test("the next segment starts from the same icon the previous segment just reached", () => {
  for (let index = 0; index < NLA_SEGMENTS.length - 1; index += 1) {
    const current = NLA_SEGMENTS[index];
    const next = NLA_SEGMENTS[index + 1];
    assert.ok(current && next);
    assert.equal(current.endMs, next.startMs);
    assert.equal(segmentScaleDuringPlay(current.endMs, index), 1);
    assert.equal(segmentScaleDuringPlay(current.endMs, index + 1), 0);
    assert.ok(segmentScaleDuringPlay(next.startMs + 1, index + 1) > 0);
  }
});

test("all five segments stay filled through the finale hold", () => {
  const state = getMasterState(NLA_HOLD_END_MS - 1);
  assert.equal(state.phase, "play");
  assert.deepEqual(state.scales, [1, 1, 1, 1, 1]);
  const clockPercent = (state.sceneClockMs / NLA_DURATION_MS) * 100;
  assert.ok(clockPercent >= 97 && clockPercent <= 97.8);
});

test("progress clock tracks play elapsed linearly through the hold", () => {
  const mid = getMasterState(NLA_DURATION_MS / 2);
  assert.equal(mid.progressClockMs, NLA_DURATION_MS / 2);
  assert.equal(mid.sceneClockMs, NLA_DURATION_MS / 2);
  assert.equal(getMasterState(NLA_HOLD_END_MS - 1).progressClockMs, NLA_HOLD_END_MS - 1);

  const resetStart = getMasterState(NLA_HOLD_END_MS);
  assert.equal(resetStart.phase, "reset");
  assert.equal(resetStart.progressClockMs, NLA_HOLD_END_MS);
  assert.equal(resetStart.sceneClockMs, NLA_HOLD_END_MS);
  assert.deepEqual(resetStart.scales, [1, 1, 1, 1, 1]);
});

test("reset keeps the finale on screen until the late crossfade into the loop", () => {
  const midResetMs = NLA_HOLD_END_MS + NLA_PROGRESS_RESET_MS / 2;
  assert.equal(getResetSceneClockMs(midResetMs), NLA_HOLD_END_MS);
  assert.equal(getMasterState(midResetMs).sceneClockMs, NLA_HOLD_END_MS);

  const lateResetMs = NLA_HOLD_END_MS + NLA_PROGRESS_RESET_MS * 0.9;
  const lateClock = getResetSceneClockMs(lateResetMs);
  assert.ok(lateClock > NLA_HOLD_END_MS);
  assert.ok(lateClock < NLA_DURATION_MS);
});

test("after the hold the bar rewinds smoothly before resting at zero", () => {
  const resetMid = getMasterState(NLA_HOLD_END_MS + NLA_PROGRESS_RESET_MS / 2);
  assert.equal(resetMid.phase, "reset");
  assert.ok(getProgressResetT(resetMid.cycleElapsedMs) > 0.4);
  assert.ok(getProgressResetT(resetMid.cycleElapsedMs) < 0.6);
  assert.ok(resetMid.scales.some((scale) => scale > 0 && scale < 1));
  assert.ok(resetMid.progressClockMs < NLA_HOLD_END_MS);
  assert.ok(resetMid.progressClockMs > 0);

  const rewindDone = getMasterState(NLA_HOLD_END_MS + NLA_PROGRESS_RESET_MS);
  assert.equal(rewindDone.phase, "zero");
  assert.deepEqual(rewindDone.scales, [0, 0, 0, 0, 0]);
  assert.equal(rewindDone.progressClockMs, 0);

  const midZero = getMasterState(NLA_HOLD_END_MS + NLA_PROGRESS_RESET_MS + NLA_ZERO_HOLD_MS / 2);
  assert.equal(midZero.phase, "zero");
  assert.deepEqual(midZero.scales, [0, 0, 0, 0, 0]);
});

test("the next cycle starts from scene 1 after the clean zero hold", () => {
  const restart = getMasterState(NLA_CYCLE_MS);
  assert.equal(restart.phase, "play");
  assert.equal(restart.sceneClockMs, 0);
  assert.deepEqual(restart.scales, [0, 0, 0, 0, 0]);

  const firstTick = getMasterState(NLA_CYCLE_MS + 1);
  assert.equal(firstTick.phase, "play");
  assert.ok(firstTick.scales[0] > 0);
  assert.equal(firstTick.scales[1], 0);
});

test("three wrapped cycles keep the same phase boundaries", () => {
  for (const cycle of [0, 1, 2]) {
    const origin = cycle * NLA_CYCLE_MS;
    assert.equal(getMasterState(origin + NLA_SEGMENTS[0].endMs).scales[0], 1);
    assert.equal(getMasterState(origin + NLA_SEGMENTS[0].endMs).scales[1], 0);
    assert.equal(getMasterState(origin + NLA_HOLD_END_MS).phase, "reset");
    assert.deepEqual(getMasterState(origin + NLA_HOLD_END_MS).scales, [1, 1, 1, 1, 1]);
    const zeroAt = origin + NLA_HOLD_END_MS + NLA_PROGRESS_RESET_MS;
    assert.equal(getMasterState(zeroAt).phase, "zero");
    assert.deepEqual(getMasterState(zeroAt).scales, [0, 0, 0, 0, 0]);
  }
});
