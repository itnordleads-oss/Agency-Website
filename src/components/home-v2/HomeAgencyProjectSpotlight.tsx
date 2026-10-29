import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { AgencyProject } from "../../content/agencyProjects";
import { getProjectCategoryLabel, getProjectPath } from "../../lib/agencyProjects";
import { navigateAppPath } from "../../App";
import ProjectVisual from "../projects/ProjectVisual";
import "./homeAgencyProjectSpotlight.css";

type HomeAgencyProjectSpotlightProps = {
  projects: AgencyProject[];
};

type IndicatorMetrics = {
  left: number;
  width: number;
};

function navigateProject(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  event.preventDefault();
  navigateAppPath(href);
}

function resolveActiveProject(
  projects: AgencyProject[],
  activeProjectSlug: string
): AgencyProject | null {
  if (projects.length === 0) {
    return null;
  }
  return projects.find((entry) => entry.slug === activeProjectSlug) ?? null;
}

function canUsePointerDepth() {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Homepage project spotlight — curated interactive showcase stage.
 * One active slug drives preview, metadata, and CTA atomically.
 */
export default function HomeAgencyProjectSpotlight({ projects }: HomeAgencyProjectSpotlightProps) {
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const indexRef = useRef<HTMLDivElement | null>(null);
  const browserRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [activeProjectSlug, setActiveProjectSlug] = useState(() => projects[0]?.slug ?? "");
  const [swapKey, setSwapKey] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [indicator, setIndicator] = useState<IndicatorMetrics>({ left: 0, width: 0 });

  useEffect(() => {
    if (projects.length > 0 && !projects.some((entry) => entry.slug === activeProjectSlug)) {
      setActiveProjectSlug(projects[0]?.slug ?? "");
    }
  }, [projects, activeProjectSlug]);

  // Preload featured thumbnails so rapid switching stays immediate.
  useEffect(() => {
    const images = projects
      .map((project) => project.thumbnail)
      .filter((src): src is string => Boolean(src));
    images.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, [projects]);

  // One-time section reveal when the showcase enters view.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "40px 0px" }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const activeProject = resolveActiveProject(projects, activeProjectSlug);

  const updateIndicator = useCallback(() => {
    const list = indexRef.current;
    const active = activeProject ? tabRefs.current[activeProject.slug] : null;
    if (!list || !active) {
      return;
    }
    const listRect = list.getBoundingClientRect();
    const tabRect = active.getBoundingClientRect();
    setIndicator({
      left: tabRect.left - listRect.left + list.scrollLeft,
      width: tabRect.width,
    });
  }, [activeProject]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, revealed, swapKey]);

  useEffect(() => {
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);
    const list = indexRef.current;
    list?.addEventListener("scroll", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      list?.removeEventListener("scroll", onResize);
    };
  }, [updateIndicator]);

  useEffect(() => {
    const root = indexRef.current;
    if (!root) {
      return;
    }
    root.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [activeProjectSlug, reduceMotion]);

  const onBrowserPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || !canUsePointerDepth() || !browserRef.current) {
      return;
    }
    const rect = browserRef.current.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) {
      return;
    }
    const px = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const py = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    browserRef.current.style.setProperty("--spotlight-tilt-x", `${(-py * 1.6).toFixed(2)}deg`);
    browserRef.current.style.setProperty("--spotlight-tilt-y", `${(px * 1.8).toFixed(2)}deg`);
    browserRef.current.style.setProperty("--spotlight-shift-x", `${(px * 3).toFixed(2)}px`);
    browserRef.current.style.setProperty("--spotlight-shift-y", `${(py * 2.5).toFixed(2)}px`);
  };

  const resetBrowserPointer = () => {
    if (!browserRef.current) {
      return;
    }
    browserRef.current.style.setProperty("--spotlight-tilt-x", "0deg");
    browserRef.current.style.setProperty("--spotlight-tilt-y", "0deg");
    browserRef.current.style.setProperty("--spotlight-shift-x", "0px");
    browserRef.current.style.setProperty("--spotlight-shift-y", "0px");
  };

  if (!activeProject) {
    return null;
  }

  const liveUrl =
    !activeProject.isDemo && activeProject.projectUrl ? activeProject.projectUrl : null;
  const href = liveUrl ?? getProjectPath(activeProject.slug);
  const categoryLabel = getProjectCategoryLabel(activeProject.category);
  const serviceLabel = activeProject.services?.[0];
  const technologies = (activeProject.technologies ?? []).slice(0, 4);
  const activeIndex = Math.max(
    0,
    projects.findIndex((entry) => entry.slug === activeProject.slug)
  );
  const panelId = `${baseId}-panel`;
  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const progressLabel = `${String(activeIndex + 1).padStart(2, "0")} / ${String(
    projects.length
  ).padStart(2, "0")}`;

  const activateSlug = (slug: string) => {
    if (!projects.some((entry) => entry.slug === slug) || slug === activeProjectSlug) {
      return;
    }
    setActiveProjectSlug(slug);
    setSwapKey((value) => value + 1);
  };

  const activateIndex = (index: number) => {
    const next = projects[index];
    if (!next) {
      return;
    }
    activateSlug(next.slug);
  };

  const onSelectKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % projects.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (index - 1 + projects.length) % projects.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = projects.length - 1;
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateIndex(index);
      return;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    activateIndex(nextIndex);
    document.getElementById(tabId(nextIndex))?.focus();
  };

  return (
    <div
      ref={rootRef}
      className={`home-agency-spotlight${revealed ? " is-revealed" : ""}${
        reduceMotion ? " is-reduced-motion" : ""
      }`}
      data-active-project={activeProject.slug}
    >
      <div
        className="home-agency-spotlight__stage"
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(activeIndex)}
      >
        <div className="home-agency-spotlight__stage-glow" aria-hidden />

        <div
          key={`${activeProject.slug}-${swapKey}`}
          className={`home-agency-spotlight__active${
            reduceMotion ? "" : " home-agency-spotlight__active--enter"
          }`}
          data-project-slug={activeProject.slug}
        >
          <div className="home-agency-spotlight__preview">
            <div
              ref={browserRef}
              className="home-agency-spotlight__browser"
              onPointerMove={onBrowserPointerMove}
              onPointerLeave={resetBrowserPointer}
            >
              <div className="home-agency-spotlight__chrome" aria-hidden>
                <span />
                <span />
                <span />
                <div className="home-agency-spotlight__address">
                  {liveUrl ? "Live website" : activeProject.isDemo ? "Concept" : "Preview"}
                </div>
                <div className="home-agency-spotlight__progress">{progressLabel}</div>
              </div>
              <div className="home-agency-spotlight__visual">
                {activeProject.isDemo ? (
                  <span className="home-agency-spotlight__badge">Concept</span>
                ) : liveUrl ? (
                  <span className="home-agency-spotlight__badge">Live</span>
                ) : null}
                <div className="home-agency-spotlight__visual-inner">
                  {activeProject.thumbnail ? (
                    <img
                      src={activeProject.thumbnail}
                      alt={activeProject.thumbnailAlt || ""}
                      className="home-agency-spotlight__image"
                      loading={activeIndex === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  ) : (
                    <ProjectVisual
                      key={activeProject.slug}
                      motif={activeProject.visualMotif}
                      variant={1}
                      density="rich"
                      className="home-agency-spotlight__project-visual"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="home-agency-spotlight__meta">
            <div className="home-agency-spotlight__story">
              <div className="home-agency-spotlight__pills">
                {activeProject.isDemo ? (
                  <span className="home-agency-spotlight__pill">Concept</span>
                ) : liveUrl ? (
                  <span className="home-agency-spotlight__pill home-agency-spotlight__pill--live">
                    Live
                  </span>
                ) : null}
                <span className="home-agency-spotlight__pill">{categoryLabel}</span>
              </div>
              <h3 className="home-agency-spotlight__title">{activeProject.title}</h3>
              <p className="home-agency-spotlight__desc">{activeProject.homepageDescription}</p>
            </div>

            <div className="home-agency-spotlight__details">
              <p className="home-agency-spotlight__detail-label">Delivery focus</p>
              <div className="home-agency-spotlight__stack">
                {serviceLabel ? <strong>{serviceLabel}</strong> : null}
                {technologies.length > 0 ? (
                  <ul className="home-agency-spotlight__tech" aria-label="Technologies">
                    {technologies.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <a
                href={href}
                className="home-agency-spotlight__cta"
                target={liveUrl ? "_blank" : undefined}
                rel={liveUrl ? "noopener noreferrer" : undefined}
                aria-label={
                  liveUrl
                    ? `Visit website: ${activeProject.title}`
                    : `View project: ${activeProject.title}`
                }
                onClick={liveUrl ? undefined : (event) => navigateProject(event, href)}
              >
                <span>{liveUrl ? "Visit Website" : "View Project"}</span>
                <span className="home-agency-spotlight__cta-arrow" aria-hidden>
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={indexRef}
        className="home-agency-spotlight__index"
        role="tablist"
        aria-label="Selected projects"
        aria-orientation="horizontal"
      >
        <span
          className="home-agency-spotlight__indicator"
          aria-hidden
          style={{
            transform: `translateX(${indicator.left}px)`,
            width: `${indicator.width}px`,
          }}
        />
        {projects.map((entry, index) => {
          const selected = entry.slug === activeProject.slug;

          return (
            <button
              type="button"
              role="tab"
              id={tabId(index)}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              key={entry.slug}
              ref={(node) => {
                tabRefs.current[entry.slug] = node;
              }}
              className={`home-agency-spotlight__row${selected ? " is-active" : ""}`}
              data-project-slug={entry.slug}
              onClick={() => activateSlug(entry.slug)}
              onKeyDown={(event) => onSelectKeyDown(event, index)}
            >
              <span className="home-agency-spotlight__num">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="home-agency-spotlight__index-copy">
                <span className="home-agency-spotlight__name">{entry.title}</span>
                <span className="home-agency-spotlight__index-category">
                  {getProjectCategoryLabel(entry.category)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
