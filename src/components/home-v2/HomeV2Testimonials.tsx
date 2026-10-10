import React, { useEffect, useRef } from "react";
import SectionEyebrow from "../SectionEyebrow";
import GlassCard from "../GlassCard";
import { isTestimonialsModuleEnabled } from "../../lib/trustModules";
import { useHomepageCopy, useHomepageVariant } from "./homepageVariantContext";
import "./homeV2TestimonialsCarousel.css";

type TestimonialItem = {
  quote: string;
  name: string;
  title: string;
  company: string;
  result: string;
  logoInitials: string;
};

function TestimonialCard({ item, isV3Aligned }: { item: TestimonialItem; isV3Aligned: boolean }) {
  if (isV3Aligned) {
    return (
      <GlassCard
        contentClassName="flex h-full min-h-0 flex-col"
        className="testimonials-carousel__card-surface liquid-glass--borderless h-full border border-white/20 bg-white/[0.02] p-5"
      >
        <div className="flex min-h-[2.55rem] shrink-0 items-start">
          <span className="inline-flex w-fit rounded-full border border-accent-soft/25 bg-accent-soft/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-accent-soft">
            {item.result}
          </span>
        </div>

        <p className="mt-3 min-h-0 flex-1 text-sm leading-snug text-white/75">“{item.quote}”</p>

        <div className="mt-auto flex shrink-0 items-center gap-3 border-t border-white/[0.08] pt-4">
          <span
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-xs font-bold tracking-wide text-[#A4F4FD]"
            aria-hidden
          >
            {item.logoInitials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-5 text-white">{item.name}</p>
            <p className="truncate text-xs leading-4 text-white/50">
              {item.title}, {item.company}
            </p>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="testimonials-carousel__card-surface liquid-glass--borderless flex h-full flex-col justify-between border border-white/20 bg-white/[0.02] p-5">
      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-accent-soft/25 bg-accent-soft/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-accent-soft">
          {item.result}
        </span>
        <p className="text-sm leading-snug text-white/75">“{item.quote}”</p>
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-white/[0.08] pt-4">
        <span
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-xs font-bold tracking-wide text-[#A4F4FD]"
          aria-hidden
        >
          {item.logoInitials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{item.name}</p>
          <p className="truncate text-xs text-white/50">
            {item.title}, {item.company}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

function getSetStride(set: HTMLElement, track: HTMLElement) {
  const clone = track.querySelector<HTMLElement>(".testimonials-carousel__set--clone");
  if (clone) {
    // Exact start-to-start distance (set width + trailing gap). Avoids subpixel
    // mismatch from offsetWidth + parsed margin that makes the loop reset visible.
    return clone.offsetLeft - set.offsetLeft;
  }

  const styles = window.getComputedStyle(set);
  const marginRight = Number.parseFloat(styles.marginRight) || 0;
  return set.offsetWidth + marginRight;
}

/**
 * Seamless infinite marquee (LEFT → RIGHT):
 * two identical sets, GPU translate3d over exactly one set stride, invisible wrap.
 *
 * Continuous autoplay only — no hover/wheel/trackpad/drag/hold pause or scrub.
 * Page scroll over the carousel stays native. This section has no click nav controls.
 */
function useTestimonialsMarquee(
  viewportRef: React.RefObject<HTMLDivElement | null>,
  setRef: React.RefObject<HTMLDivElement | null>,
  itemCount: number
) {
  useEffect(() => {
    const viewport = viewportRef.current;
    const set = setRef.current;
    const track = viewport?.querySelector<HTMLElement>(".testimonials-carousel__track");
    if (!viewport || !set || !track || itemCount === 0) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      return;
    }

    const mobileMq = window.matchMedia("(max-width: 767.98px)");
    let frameId = 0;
    let lastTs = 0;
    let stride = 0;
    // Track X in [-stride, 0). Increasing offset moves content LEFT → RIGHT.
    // ~18% faster than the original 28px/s scrollLeft marquee.
    let offset = 0;
    const pixelsPerSecond = 33;
    let activeCard: Element | null = null;
    let lastActiveSyncTs = 0;
    // Mobile inset-glow sync is visual-only; avoid layout-thrashing every frame.
    const activeSyncIntervalMs = 120;

    /**
     * Mobile URL-bar / container-query reflows can briefly report a 0 (or tiny)
     * stride. Accepting that value makes tick skip motion forever if ResizeObserver
     * does not fire again — the carousel looks permanently paused on mobile.
     */
    const measureStride = () => {
      const next = getSetStride(set, track);
      if (next > 1) {
        stride = next;
        return true;
      }
      return false;
    };

    const wrapOffset = () => {
      if (stride <= 0) {
        return;
      }
      // Keep offset in [-stride, 0) so clone/original stay visually aligned at wrap.
      while (offset >= 0) {
        offset -= stride;
      }
      while (offset < -stride) {
        offset += stride;
      }
    };

    const applyTransform = () => {
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
    };

    const clearActiveCard = () => {
      if (activeCard) {
        activeCard.classList.remove("is-active");
        activeCard = null;
      }
    };

    const syncActiveCard = (ts = 0) => {
      if (!mobileMq.matches) {
        clearActiveCard();
        return;
      }

      if (ts > 0 && ts - lastActiveSyncTs < activeSyncIntervalMs) {
        return;
      }
      lastActiveSyncTs = ts;

      const cards = viewport.querySelectorAll(".testimonials-carousel__card");
      if (cards.length === 0) {
        return;
      }

      const viewportRect = viewport.getBoundingClientRect();
      const centerX = viewportRect.left + viewportRect.width / 2;
      let nextActive: Element | null = null;
      let bestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - centerX);
        if (distance < bestDistance) {
          bestDistance = distance;
          nextActive = card;
        }
      });

      if (nextActive === activeCard) {
        return;
      }

      if (activeCard) {
        activeCard.classList.remove("is-active");
      }
      activeCard = nextActive;
      activeCard?.classList.add("is-active");
    };

    const tick = (ts: number) => {
      try {
        if (!lastTs) {
          lastTs = ts;
        }
        const deltaMs = Math.min(ts - lastTs, 48);
        lastTs = ts;

        // Self-heal after a transient bad measure (common on mobile cqi/layout).
        if (stride <= 0) {
          measureStride();
        }

        if (stride > 0 && !reduceMotion.matches) {
          offset += (pixelsPerSecond * deltaMs) / 1000;
          wrapOffset();
          applyTransform();
        }

        syncActiveCard(ts);
      } finally {
        // Always chain the next frame — an exception in sync must not kill autoplay.
        frameId = window.requestAnimationFrame(tick);
      }
    };

    measureStride();
    // Start mid-loop so both sets already buffer the viewport.
    if (stride > 0) {
      offset = -stride * 0.5;
      applyTransform();
    }
    syncActiveCard(performance.now());

    const onMobileChange = () => {
      syncActiveCard(performance.now());
    };

    const resizeObserver = new ResizeObserver(() => {
      const previousStride = stride;
      if (!measureStride()) {
        return;
      }
      if (previousStride > 0 && stride > 0) {
        offset = (offset / previousStride) * stride;
      }
      wrapOffset();
      applyTransform();
      syncActiveCard(performance.now());
    });
    resizeObserver.observe(set);
    resizeObserver.observe(viewport);

    // Block native HTML drag (text/image) so the marquee cannot be scrubbed.
    const onDragStart = (event: DragEvent) => {
      event.preventDefault();
    };
    viewport.addEventListener("dragstart", onDragStart);
    mobileMq.addEventListener("change", onMobileChange);

    // Mobile browsers throttle RAF while backgrounded; reset timing on return
    // so the first visible frame does not look stalled.
    const onVisibilityChange = () => {
      if (!document.hidden) {
        lastTs = 0;
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    frameId = window.requestAnimationFrame(tick);

    const onReduceChange = () => {
      if (reduceMotion.matches) {
        track.style.transform = "";
        clearActiveCard();
      } else {
        lastTs = 0;
        measureStride();
      }
    };
    reduceMotion.addEventListener("change", onReduceChange);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      reduceMotion.removeEventListener("change", onReduceChange);
      mobileMq.removeEventListener("change", onMobileChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      viewport.removeEventListener("dragstart", onDragStart);
      track.style.transform = "";
      clearActiveCard();
    };
  }, [viewportRef, setRef, itemCount]);
}

export default function HomeV2Testimonials() {
  const { testimonials } = useHomepageCopy();
  const variant = useHomepageVariant();
  const isV3Aligned = variant === "v3";
  const items = (Array.isArray(testimonials.items) ? testimonials.items : []) as TestimonialItem[];
  const viewportRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);

  useTestimonialsMarquee(viewportRef, setRef, items.length);

  if (!isTestimonialsModuleEnabled() || items.length === 0) {
    return null;
  }

  return (
    <section
      id="v2-testimonials"
      className="relative min-w-0 py-12 sm:py-14 md:py-16"
      aria-labelledby="v2-testimonials-heading"
    >
      <div className="testimonials-carousel__glow" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-3 min-[341px]:px-4 sm:px-6">
        <div className="mx-auto mb-8 max-w-2xl space-y-2.5 text-center md:mb-10">
          <div className="flex justify-center">
            <SectionEyebrow label={testimonials.eyebrow} />
          </div>
          <h2 id="v2-testimonials-heading" className="section-title">
            {testimonials.title}
          </h2>
        </div>

        {/*
          Nested in max-w-7xl so the original 100vw breakout restores desktop full-bleed.
          At 2560px+ CSS cancels the breakout so the strip stays in the centered shell.
        */}
        <div className="testimonials-carousel">
          <div
            ref={viewportRef}
            className="testimonials-carousel__viewport"
            role="region"
            aria-label="Customer stories carousel"
          >
            <div className="testimonials-carousel__track">
              <div ref={setRef} className="testimonials-carousel__set">
                {items.map((item) => (
                  <div
                    key={`original-${item.name}-${item.company}`}
                    className="testimonials-carousel__card"
                  >
                    <TestimonialCard item={item} isV3Aligned={isV3Aligned} />
                  </div>
                ))}
              </div>

              <div
                className="testimonials-carousel__set testimonials-carousel__set--clone"
                aria-hidden="true"
              >
                {items.map((item) => (
                  <div
                    key={`clone-${item.name}-${item.company}`}
                    className="testimonials-carousel__card"
                  >
                    <TestimonialCard item={item} isV3Aligned={isV3Aligned} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
