import React, { useEffect, useRef } from "react";
import {
  BadgeCheck,
  Brain,
  Building2,
  CalendarCheck2,
  Check,
  Inbox,
  MessageCircle,
  ScanSearch,
  Send,
  ShieldCheck,
  UserRound,
  UserX,
  Wand2,
} from "lucide-react";
import { getMasterState, NLA_HOLD_END_MS, type NlaMasterPhase } from "./nlaTimeline";
import "./homeV2CampaignAnimation.css";

const SKIP_CSS_CLOCK = new Set(["nla-shine"]);

type NlaRoot = HTMLDivElement & {
  __nlaSeek?: (elapsedMs: number) => ReturnType<typeof getMasterState>;
  __nlaGetState?: () => ReturnType<typeof getMasterState>;
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function collectWorkflowAnimations(root: HTMLElement): Animation[] {
  return root.getAnimations({ subtree: true }).filter((animation) => {
    if (!(animation instanceof CSSAnimation)) {
      return false;
    }
    return !SKIP_CSS_CLOCK.has(animation.animationName);
  });
}

function seekWorkflowAnimations(
  sceneClockMs: number,
  progressClockMs: number,
  phase: NlaMasterPhase,
  animations: Animation[]
) {
  // Keep timeline dots on the finale while the bar rewinds — reversing the
  // dot keyframes made the loop look like a hard reset.
  const timelineClockMs = phase === "reset" ? NLA_HOLD_END_MS : progressClockMs;

  for (const animation of animations) {
    const effect = animation.effect;
    const target = effect && "target" in effect ? effect.target : null;
    const useProgressClock = target instanceof Element && Boolean(target.closest(".nla__timeline"));

    animation.currentTime = useProgressClock ? timelineClockMs : sceneClockMs;
    animation.pause();
  }
}

function applyTimelineStage(
  timeline: HTMLElement | null,
  scales: readonly number[],
  phase: NlaMasterPhase
) {
  if (!timeline) {
    return;
  }

  if (phase === "zero" || phase === "reset") {
    timeline.dataset.nlaFillingSeg = "0";
    return;
  }

  let fillingSeg = 0;
  for (let index = 0; index < scales.length; index += 1) {
    const scale = scales[index] ?? 0;
    if (scale > 0 && scale < 1) {
      fillingSeg = index + 1;
      break;
    }
  }

  timeline.dataset.nlaFillingSeg = String(fillingSeg);
}

function applySegmentScales(
  fills: HTMLElement[],
  scales: readonly number[],
  phase: NlaMasterPhase
) {
  for (let index = 0; index < fills.length; index += 1) {
    const fill = fills[index];
    const scale = scales[index] ?? 0;
    if (!fill) {
      continue;
    }

    fill.style.transformOrigin = "left center";
    // Master clock owns fill timing — never CSS-ease between seeks/frames
    // (same pattern as testimonials marquee / pre-sync `transition: none`).
    fill.style.transition = "none";

    // Hide first so scaleX(1) → scaleX(0) is never painted as a rewind.
    if (phase === "zero" || scale <= 0) {
      fill.style.opacity = "0";
      fill.style.visibility = "hidden";
      fill.style.transform = "scaleX(0)";
      continue;
    }

    fill.style.visibility = "visible";
    fill.style.opacity = "1";
    fill.style.transform = `scaleX(${scale})`;
  }
}

function applySegmentTracks(segments: HTMLElement[], phase: NlaMasterPhase) {
  for (const segment of segments) {
    segment.style.transition = "none";
    segment.style.backgroundColor = phase === "zero" ? "transparent" : "";
  }
}

/**
 * Visual-first workflow animation
 * Short titles + short results only — cause→effect motion, strong climax.
 */

export default function HomeV2CampaignAnimation() {
  const rootRef = useRef<NlaRoot | null>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) {
      return;
    }

    const fills = [...node.querySelectorAll<HTMLElement>(".nla__seg-fill")];
    const segments = [...node.querySelectorAll<HTMLElement>(".nla__seg")];
    const timeline = node.querySelector<HTMLElement>(".nla__timeline");
    let frameId = 0;
    let cycleStartMs = performance.now();
    let pausedAtMs: number | null = null;
    let lockedElapsedMs: number | null = null;
    let visible = true;
    let cachedAnimations: Animation[] = [];
    let warmupFrames = 0;

    const animationsForSeek = () => {
      if (warmupFrames < 12 || cachedAnimations.length === 0) {
        cachedAnimations = collectWorkflowAnimations(node);
        warmupFrames += 1;
      }
      return cachedAnimations;
    };

    const applyElapsed = (elapsedMs: number) => {
      const state = getMasterState(elapsedMs);
      node.dataset.nlaPhase = state.phase;
      seekWorkflowAnimations(
        state.sceneClockMs,
        state.progressClockMs,
        state.phase,
        animationsForSeek()
      );
      applySegmentScales(fills, state.scales, state.phase);
      applySegmentTracks(segments, state.phase);
      applyTimelineStage(timeline, state.scales, state.phase);
      // Flush layout so getComputedStyle / bounding boxes match the seek
      // immediately — including after viewport / media-query changes.
      void node.offsetWidth;
      return state;
    };

    node.__nlaSeek = (elapsedMs: number) => {
      lockedElapsedMs = elapsedMs;
      cycleStartMs = performance.now() - elapsedMs;
      return applyElapsed(elapsedMs);
    };
    node.__nlaGetState = () => getMasterState(lockedElapsedMs ?? performance.now() - cycleStartMs);

    if (prefersReducedMotion()) {
      return () => {
        delete node.__nlaSeek;
        delete node.__nlaGetState;
      };
    }

    const tick = (now: number) => {
      if (pausedAtMs === null && visible) {
        applyElapsed(lockedElapsedMs ?? now - cycleStartMs);
      }
      frameId = window.requestAnimationFrame(tick);
    };

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                visible = entry.isIntersecting;
                entry.target.classList.toggle("nla--offscreen", !entry.isIntersecting);
                if (!entry.isIntersecting) {
                  pausedAtMs = performance.now();
                } else if (pausedAtMs !== null) {
                  cycleStartMs += performance.now() - pausedAtMs;
                  pausedAtMs = null;
                }
              }
            },
            { rootMargin: "200px" }
          );

    observer?.observe(node);
    applyElapsed(0);
    frameId = window.requestAnimationFrame(tick);

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (pausedAtMs === null) {
          pausedAtMs = performance.now();
        }
        return;
      }
      if (pausedAtMs !== null && visible) {
        cycleStartMs += performance.now() - pausedAtMs;
        pausedAtMs = null;
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      delete node.__nlaSeek;
      delete node.__nlaGetState;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="nla"
      data-nla-phase="play"
      role="img"
      aria-label="How it works: no leads yet, AI finds companies, finds real contacts, sends personal messages, gets replies, 18 meetings booked, and shows the leads won."
    >
      <div className="nla__stage" aria-hidden="true">
        <div className="nla__stage-glow" />
        <div className="nla__stage-shine" />

        {/* 1 — Problem: premium empty pipeline (first impression) */}
        <div className="nla__scene nla__scene--1">
          <div className="nla__tag nla__tag--1">No leads yet</div>
          <div className="nla__focus nla__focus--empty">
            <div className="nla__empty-board">
              <span className="nla__empty-wash" />
              <span className="nla__empty-ring nla__empty-ring--1" />
              <span className="nla__empty-ring nla__empty-ring--2" />
              <div className="nla__void">
                <span className="nla__void-core" />
                <Inbox />
                <span className="nla__void-zero">0</span>
              </div>
              <div className="nla__ghosts">
                <span className="nla__ghost nla__ghost--1">
                  <UserRound />
                </span>
                <span className="nla__ghost nla__ghost--2">
                  <UserRound />
                </span>
                <span className="nla__ghost nla__ghost--3">
                  <UserRound />
                </span>
                <span className="nla__ghost nla__ghost--4">
                  <Building2 />
                </span>
              </div>
            </div>
            <div className="nla__zeros">
              <span className="nla__zero-pill">
                <Building2 />
                <em>0</em>
                <small>companies</small>
              </span>
              <span className="nla__zero-pill">
                <UserRound />
                <em>0</em>
                <small>leads</small>
              </span>
              <span className="nla__zero-pill">
                <CalendarCheck2 />
                <em>0</em>
                <small>meetings</small>
              </span>
            </div>
          </div>
        </div>

        {/* 2 — AI finds companies */}
        <div className="nla__scene nla__scene--2">
          <div className="nla__tag nla__tag--2">AI finds companies</div>
          <div className="nla__focus nla__focus--find">
            <div className="nla__orb">
              <span className="nla__orb-core" />
              <Brain />
              <span className="nla__ring nla__ring--1" />
              <span className="nla__ring nla__ring--2" />
              <span className="nla__radar" />
              <span className="nla__scan" />
              <span className="nla__beam nla__beam--1" />
              <span className="nla__beam nla__beam--2" />
              <span className="nla__beam nla__beam--3" />
              <span className="nla__beam nla__beam--4" />
            </div>
            <div className="nla__orbit">
              <span className="nla__co nla__co--1">
                <Building2 />
              </span>
              <span className="nla__co nla__co--2">
                <Building2 />
              </span>
              <span className="nla__co nla__co--3">
                <Building2 />
              </span>
              <span className="nla__co nla__co--4">
                <Building2 />
              </span>
            </div>
          </div>
          <div className="nla__hit nla__hit--2">
            <span className="nla__hit-num">1,248</span>
            <span className="nla__hit-txt">companies</span>
          </div>
        </div>

        {/* 3 — Contacts: company hub scanned → people extracted + verified */}
        <div className="nla__scene nla__scene--3">
          <div className="nla__tag nla__tag--3">Finds real contacts</div>
          <div className="nla__focus nla__focus--verify">
            <div className="nla__hub">
              <span className="nla__hub-core" />
              <Building2 />
              <span className="nla__hub-ring" />
              <span className="nla__hub-scan" />
              <span className="nla__extract nla__extract--1" />
              <span className="nla__extract nla__extract--2" />
              <span className="nla__extract nla__extract--3" />
            </div>
            <div className="nla__people">
              <div className="nla__person nla__person--1">
                <span className="nla__person-face">
                  <UserRound />
                </span>
                <span className="nla__person-meta">
                  <i />
                  <i />
                </span>
                <span className="nla__tick">
                  <ShieldCheck />
                </span>
              </div>
              <div className="nla__person nla__person--2">
                <span className="nla__person-face">
                  <UserRound />
                </span>
                <span className="nla__person-meta">
                  <i />
                  <i />
                </span>
                <span className="nla__tick">
                  <ShieldCheck />
                </span>
              </div>
              <div className="nla__person nla__person--3">
                <span className="nla__person-face">
                  <UserRound />
                </span>
                <span className="nla__person-meta">
                  <i />
                  <i />
                </span>
                <span className="nla__tick">
                  <ShieldCheck />
                </span>
              </div>
              <div className="nla__person nla__person--x">
                <span className="nla__person-face">
                  <UserX />
                </span>
                <span className="nla__person-meta">
                  <i />
                  <i />
                </span>
              </div>
            </div>
          </div>
          <div className="nla__hit nla__hit--3">
            <span className="nla__hit-num">4,317</span>
            <span className="nla__hit-txt">verified</span>
          </div>
        </div>

        {/* 4 — Personal messages (visual only — no message copy) */}
        <div className="nla__scene nla__scene--4">
          <div className="nla__tag nla__tag--4">Sends personal messages</div>
          <div className="nla__focus nla__focus--send">
            <div className="nla__craft">
              <span className="nla__craft-stamp">
                <Wand2 />
              </span>
              <div className="nla__craft-card">
                <span className="nla__craft-glow" />
                <span className="nla__craft-avatar">
                  <UserRound />
                  <span className="nla__craft-verified">
                    <BadgeCheck />
                  </span>
                </span>
                <span className="nla__craft-bars">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="nla__craft-send">
                  <Send />
                </span>
              </div>
              <div className="nla__targets">
                <span className="nla__target nla__target--1">
                  <UserRound />
                </span>
                <span className="nla__target nla__target--2">
                  <UserRound />
                </span>
                <span className="nla__target nla__target--3">
                  <UserRound />
                </span>
              </div>
            </div>
            <div className="nla__fly">
              <span className="nla__fly-item nla__fly-item--1">
                <Send />
              </span>
              <span className="nla__fly-item nla__fly-item--2">
                <Send />
              </span>
              <span className="nla__fly-item nla__fly-item--3">
                <Send />
              </span>
            </div>
          </div>
          <div className="nla__hit nla__hit--4">
            <span className="nla__hit-num">4,317</span>
            <span className="nla__hit-txt">sent</span>
          </div>
        </div>

        {/* 5 — Replies */}
        <div className="nla__scene nla__scene--5">
          <div className="nla__tag nla__tag--5">Gets replies</div>
          <div className="nla__focus nla__focus--reply">
            <div className="nla__bubbles">
              <div className="nla__bubble nla__bubble--1">
                <MessageCircle />
              </div>
              <div className="nla__bubble nla__bubble--2 nla__bubble--hot">
                <BadgeCheck />
              </div>
              <div className="nla__bubble nla__bubble--3">
                <MessageCircle />
              </div>
              <div className="nla__bubble nla__bubble--4 nla__bubble--hot">
                <BadgeCheck />
              </div>
            </div>
          </div>
          <div className="nla__hit nla__hit--5">
            <span className="nla__hit-num">186</span>
            <span className="nla__hit-txt">replies</span>
          </div>
        </div>

        {/* 6 — Meetings climax: confirm → glow → confetti → meetings + leads → loop */}
        <div className="nla__scene nla__scene--6">
          <div className="nla__tag nla__tag--6">18 Meetings Booked</div>
          <div className="nla__focus nla__focus--book">
            <span className="nla__success-wash" />
            <div className="nla__cal">
              <CalendarCheck2 />
              <span className="nla__cal-check">
                <Check />
              </span>
              <span className="nla__cal-ring" />
              <span className="nla__cal-glow" />
            </div>
            <div className="nla__burst">
              <span className="nla__spark nla__spark--1" />
              <span className="nla__spark nla__spark--2" />
              <span className="nla__spark nla__spark--3" />
              <span className="nla__spark nla__spark--4" />
              <span className="nla__spark nla__spark--5" />
              <span className="nla__spark nla__spark--6" />
              <span className="nla__spark nla__spark--7" />
              <span className="nla__spark nla__spark--8" />
              <span className="nla__confetti nla__confetti--1" />
              <span className="nla__confetti nla__confetti--2" />
              <span className="nla__confetti nla__confetti--3" />
              <span className="nla__confetti nla__confetti--4" />
              <span className="nla__confetti nla__confetti--5" />
              <span className="nla__confetti nla__confetti--6" />
            </div>
            <div className="nla__won-leads">
              <span className="nla__won nla__won--1">
                <UserRound />
              </span>
              <span className="nla__won nla__won--2">
                <UserRound />
              </span>
              <span className="nla__won nla__won--3">
                <UserRound />
              </span>
              <span className="nla__won nla__won--4">
                <UserRound />
              </span>
              <span className="nla__won nla__won--5">
                <UserRound />
              </span>
            </div>
          </div>
          <div className="nla__finale">
            <div className="nla__hit nla__hit--6 nla__hit--final">
              <span className="nla__hit-num">18</span>
              <span className="nla__hit-txt">meetings</span>
            </div>
            <div className="nla__hit nla__hit--leads">
              <span className="nla__hit-num">4,317</span>
              <span className="nla__hit-txt">leads</span>
            </div>
          </div>
        </div>
      </div>

      <div className="nla__timeline" aria-hidden="true" data-nla-filling-seg="0">
        {/* Segments sit between dots — the line never passes through circle centers. */}
        <ol className="nla__timeline-dots">
          <li className="nla__dot nla__dot--1">
            <Inbox />
          </li>
          <li className="nla__seg">
            <span className="nla__seg-fill nla__seg-fill--1" />
          </li>
          <li className="nla__dot nla__dot--2">
            <ScanSearch />
          </li>
          <li className="nla__seg">
            <span className="nla__seg-fill nla__seg-fill--2" />
          </li>
          <li className="nla__dot nla__dot--3">
            <ShieldCheck />
          </li>
          <li className="nla__seg">
            <span className="nla__seg-fill nla__seg-fill--3" />
          </li>
          <li className="nla__dot nla__dot--4">
            <Send />
          </li>
          <li className="nla__seg">
            <span className="nla__seg-fill nla__seg-fill--4" />
          </li>
          <li className="nla__dot nla__dot--5">
            <MessageCircle />
          </li>
          <li className="nla__seg">
            <span className="nla__seg-fill nla__seg-fill--5" />
          </li>
          <li className="nla__dot nla__dot--6">
            <CalendarCheck2 />
          </li>
        </ol>
      </div>

      <div className="nla__static" aria-hidden="true">
        <div className="nla__static-flow">
          <span>
            <Inbox /> No leads
          </span>
          <span>→</span>
          <span>
            <ScanSearch /> Find
          </span>
          <span>→</span>
          <span>
            <Send /> Message
          </span>
          <span>→</span>
          <span className="nla__static-ok">
            <CalendarCheck2 /> Meetings
          </span>
        </div>
      </div>
    </div>
  );
}
