import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SectionEyebrow from "../SectionEyebrow";
import ProjectVisual from "./ProjectVisual";
import type { AgencyProject } from "../../content/agencyProjects";
import { getPublishedProjects } from "../../lib/agencyProjects";
import { useSiteCopy } from "../../lib/useSiteCopy";
import "./projectsHero.css";

const AUTOPLAY_MS = 5500;
const TRANSITION_MS = 560;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function canUsePointerParallax(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function statusLabel(project: AgencyProject, liveLabel: string) {
  if (!project.status) {
    return liveLabel;
  }
  return project.status.toLowerCase() === "live" ? liveLabel : project.status;
}

function HeroPreviewCard({
  project,
  categoryLabel,
  liveLabel,
  layer,
  indexLabel,
  swapKey,
}: {
  project: AgencyProject;
  categoryLabel: string;
  liveLabel: string;
  layer: "front" | "mid" | "back";
  indexLabel?: string;
  /** Remount key for front-layer crossfade when project changes. */
  swapKey?: string;
}) {
  const alt = project.thumbnailAlt || `${project.title} preview`;
  const isFront = layer === "front";

  return (
    <article
      className={`projects-hero-preview projects-hero-preview--${layer}`}
      aria-hidden={isFront ? undefined : true}
    >
      <div className="projects-hero-preview__frame">
        {project.thumbnail ? (
          <img
            key={isFront ? swapKey : undefined}
            src={project.thumbnail}
            alt={isFront ? alt : ""}
            className={`projects-hero-preview__shot${isFront ? " projects-hero-preview__shot--active" : ""}`}
            loading={isFront ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
          />
        ) : (
          <ProjectVisual
            motif={project.visualMotif}
            variant={1}
            density="rich"
            className="h-full"
          />
        )}
      </div>
      {isFront ? (
        <div key={swapKey ? `meta-${swapKey}` : undefined} className="projects-hero-preview__meta">
          <div className="projects-hero-preview__meta-row">
            {indexLabel ? (
              <span className="projects-hero-preview__index">{indexLabel}</span>
            ) : null}
            <span className="projects-hero-preview__category">{categoryLabel}</span>
            {project.status ? (
              <span className="projects-hero-preview__status">{liveLabel}</span>
            ) : null}
          </div>
          <p className="projects-hero-preview__title">{project.title}</p>
        </div>
      ) : (
        <span className="projects-hero-preview__caption">{project.title}</span>
      )}
    </article>
  );
}

/**
 * Premium portfolio hero — real project screenshots in an autoplay stack carousel.
 * Left editorial copy stays static; only the showcase rotates.
 */
export default function ProjectsHero() {
  const { projectsPage } = useSiteCopy();
  const visualRef = useRef<HTMLDivElement | null>(null);
  const parallaxFrameRef = useRef<number | null>(null);
  const autoplayTimerRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const hoverPausedRef = useRef(false);
  const visibilityPausedRef = useRef(false);
  const reducedMotionRef = useRef(prefersReducedMotion());
  const activeIndexRef = useRef(0);

  /** Full published portfolio — hero carousel cycles every live project. */
  const showcase = useMemo(() => getPublishedProjects(), []);
  const cueRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion());

  const count = showcase.length;
  const primary = count > 0 ? showcase[activeIndex % count] : null;
  const secondary = count > 1 ? showcase[(activeIndex + 1) % count] : null;
  const tertiary = count > 2 ? showcase[(activeIndex + 2) % count] : null;

  const categoryLabels = projectsPage.categories as Record<string, string>;
  const categoryFor = useCallback(
    (project: AgencyProject) => categoryLabels[project.category] || project.category,
    [categoryLabels]
  );
  const liveLabel = projectsPage.card.liveBadge;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const clearAutoplay = useCallback(() => {
    if (autoplayTimerRef.current !== null) {
      window.clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const clearTransition = useCallback(() => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  const canAutoplay = useCallback(() => {
    return (
      count > 1 &&
      !reducedMotionRef.current &&
      !hoverPausedRef.current &&
      !visibilityPausedRef.current &&
      typeof document !== "undefined" &&
      !document.hidden
    );
  }, [count]);

  const startAutoplay = useCallback(() => {
    clearAutoplay();
    if (!canAutoplay()) {
      return;
    }
    autoplayTimerRef.current = window.setInterval(() => {
      setIsAdvancing(true);
      setActiveIndex((current) => (current + 1) % count);
      clearTransition();
      transitionTimerRef.current = window.setTimeout(() => {
        setIsAdvancing(false);
        transitionTimerRef.current = null;
      }, TRANSITION_MS);
    }, AUTOPLAY_MS);
  }, [canAutoplay, clearAutoplay, clearTransition, count]);

  const goToIndex = useCallback(
    (nextIndex: number) => {
      if (count < 1) {
        return;
      }
      const normalized = ((nextIndex % count) + count) % count;
      if (normalized === activeIndexRef.current) {
        // Still restart autoplay so a re-click resets the clock.
        startAutoplay();
        return;
      }
      setIsAdvancing(true);
      setActiveIndex(normalized);
      clearTransition();
      transitionTimerRef.current = window.setTimeout(() => {
        setIsAdvancing(false);
        transitionTimerRef.current = null;
      }, reducedMotionRef.current ? 180 : TRANSITION_MS);
      startAutoplay();
    },
    [clearTransition, count, startAutoplay]
  );

  // Reduced-motion listener
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const enabled = media.matches;
      reducedMotionRef.current = enabled;
      setReducedMotion(enabled);
      if (enabled) {
        clearAutoplay();
      } else if (!hoverPausedRef.current && !visibilityPausedRef.current) {
        startAutoplay();
      }
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [clearAutoplay, startAutoplay]);

  // Preload current + next thumbnails
  useEffect(() => {
    if (count < 1) {
      return;
    }
    const current = showcase[activeIndex % count];
    const next = showcase[(activeIndex + 1) % count];
    for (const project of [current, next]) {
      if (!project?.thumbnail) {
        continue;
      }
      const image = new Image();
      image.src = project.thumbnail;
    }
  }, [activeIndex, count, showcase]);

  // Keep the active indicator visible inside the cue row ONLY.
  // Never use element.scrollIntoView() here — it hijacks the page's vertical scroll.
  useEffect(() => {
    const node = cueRefs.current[activeIndex];
    const scroller = node?.parentElement;
    if (!node || !scroller) {
      return;
    }
    const scrollerRect = scroller.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const leftOverflow = nodeRect.left - scrollerRect.left;
    const rightOverflow = nodeRect.right - scrollerRect.right;
    let nextLeft = scroller.scrollLeft;
    if (leftOverflow < 0) {
      nextLeft += leftOverflow - 12;
    } else if (rightOverflow > 0) {
      nextLeft += rightOverflow + 12;
    } else {
      return;
    }
    scroller.scrollTo({
      left: Math.max(0, nextLeft),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [activeIndex, reducedMotion]);

  // Start / cleanup autoplay
  useEffect(() => {
    startAutoplay();
    return () => {
      clearAutoplay();
      clearTransition();
    };
  }, [clearAutoplay, clearTransition, startAutoplay]);

  // Page Visibility API
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        visibilityPausedRef.current = true;
        clearAutoplay();
        return;
      }
      visibilityPausedRef.current = false;
      startAutoplay();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [clearAutoplay, startAutoplay]);

  // Parallax cleanup
  useEffect(() => {
    return () => {
      if (parallaxFrameRef.current !== null) {
        window.cancelAnimationFrame(parallaxFrameRef.current);
      }
    };
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!canUsePointerParallax() || prefersReducedMotion()) {
      return;
    }
    const node = visualRef.current;
    if (!node) {
      return;
    }
    const { clientX, clientY } = event;
    if (parallaxFrameRef.current !== null) {
      window.cancelAnimationFrame(parallaxFrameRef.current);
    }
    parallaxFrameRef.current = window.requestAnimationFrame(() => {
      parallaxFrameRef.current = null;
      const rect = node.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) {
        return;
      }
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      node.style.setProperty("--hero-shift-x", `${(x * 3).toFixed(2)}px`);
      node.style.setProperty("--hero-shift-y", `${(y * 2.5).toFixed(2)}px`);
    });
  }, []);

  const onShowcaseEnter = useCallback(() => {
    hoverPausedRef.current = true;
    clearAutoplay();
  }, [clearAutoplay]);

  const onShowcaseLeave = useCallback(() => {
    hoverPausedRef.current = false;
    const node = visualRef.current;
    if (node) {
      node.style.setProperty("--hero-shift-x", "0px");
      node.style.setProperty("--hero-shift-y", "0px");
    }
    startAutoplay();
  }, [startAutoplay]);

  return (
    <section
      className="projects-hero-shell relative mx-auto"
      aria-labelledby="projects-hero-title"
    >
      <div className="projects-hero liquid-glass relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 projects-hero__atmosphere"
          aria-hidden
        />

        <div className="projects-hero__layout relative z-10">
          <div className="projects-hero__copy min-w-0">
            <div className="projects-hero__enter projects-hero__enter--eyebrow">
              <SectionEyebrow label={projectsPage.hero.eyebrow} />
            </div>
            <h1
              id="projects-hero-title"
              className="projects-hero__enter projects-hero__enter--title projects-hero-title"
            >
              {projectsPage.hero.title}
            </h1>
            <p className="projects-hero__enter projects-hero__enter--copy projects-hero-copy">
              {projectsPage.hero.subtitle}
            </p>

            {count > 0 ? (
              <div
                className="projects-hero__enter projects-hero__enter--cue projects-hero-cue"
                role="group"
                aria-label="Portfolio projects"
              >
                {showcase.map((project, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={project.slug}
                      ref={(node) => {
                        cueRefs.current[index] = node;
                      }}
                      type="button"
                      className={`projects-hero-cue__item${isActive ? " is-active" : ""}`}
                      aria-label={`Show ${project.title} project`}
                      aria-pressed={isActive}
                      onClick={() => goToIndex(index)}
                    >
                      <span className="projects-hero-cue__dot" aria-hidden />
                      <span className="projects-hero-cue__label">{project.title}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div
            ref={visualRef}
            className={`projects-hero-visual projects-hero__enter projects-hero__enter--visual min-w-0${
              isAdvancing ? " is-advancing" : ""
            }${reducedMotion ? " is-reduced-motion" : ""}`}
            onPointerMove={onPointerMove}
            onPointerEnter={onShowcaseEnter}
            onPointerLeave={onShowcaseLeave}
          >
            <div className="projects-hero-visual__stack" aria-live="off">
              {tertiary ? (
                <HeroPreviewCard
                  key={`back-${tertiary.slug}`}
                  project={tertiary}
                  categoryLabel={categoryFor(tertiary)}
                  liveLabel={statusLabel(tertiary, liveLabel)}
                  layer="back"
                />
              ) : null}
              {secondary ? (
                <HeroPreviewCard
                  key={`mid-${secondary.slug}`}
                  project={secondary}
                  categoryLabel={categoryFor(secondary)}
                  liveLabel={statusLabel(secondary, liveLabel)}
                  layer="mid"
                />
              ) : null}
              {primary ? (
                <HeroPreviewCard
                  key={`front-${primary.slug}`}
                  project={primary}
                  categoryLabel={categoryFor(primary)}
                  liveLabel={statusLabel(primary, liveLabel)}
                  layer="front"
                  indexLabel={padIndex(activeIndex)}
                  swapKey={primary.slug}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
