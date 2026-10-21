import React, { useEffect, useId, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { AgencyProject } from "../../content/agencyProjects";
import { getProjectCategoryLabel, getProjectPath } from "../../lib/agencyProjects";
import { navigateAppPath } from "../../App";
import ProjectVisual from "../projects/ProjectVisual";
import "./homeAgencyProjectSpotlight.css";

type HomeAgencyProjectSpotlightProps = {
  projects: AgencyProject[];
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

/**
 * Homepage project spotlight.
 *
 * Critical invariant: one `activeProjectSlug` → one `activeProject` object →
 * every visible field (selector, visual, metadata, CTA). One keyed render
 * boundary changes that object atomically, so stale project fields cannot
 * remain in the DOM.
 */
export default function HomeAgencyProjectSpotlight({ projects }: HomeAgencyProjectSpotlightProps) {
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const [activeProjectSlug, setActiveProjectSlug] = useState(() => projects[0]?.slug ?? "");

  // Keep selection valid if centralized featured data changes identity/order.
  useEffect(() => {
    if (projects.length > 0 && !projects.some((entry) => entry.slug === activeProjectSlug)) {
      setActiveProjectSlug(projects[0]?.slug ?? "");
    }
  }, [projects, activeProjectSlug]);

  const activeProject = resolveActiveProject(projects, activeProjectSlug);

  if (!activeProject) {
    return null;
  }

  // Derive ALL presentation fields from the same object — never from parallel state.
  const liveUrl =
    !activeProject.isDemo && activeProject.projectUrl ? activeProject.projectUrl : null;
  const href = liveUrl ?? getProjectPath(activeProject.slug);
  const categoryLabel = getProjectCategoryLabel(activeProject.category);
  const serviceLabel = activeProject.services?.[0];
  const technologies = (activeProject.technologies ?? []).slice(0, 3).join(" · ");
  const activeIndex = Math.max(
    0,
    projects.findIndex((entry) => entry.slug === activeProject.slug)
  );
  const panelId = `${baseId}-panel`;
  const tabId = (index: number) => `${baseId}-tab-${index}`;

  const activateSlug = (slug: string) => {
    if (!projects.some((entry) => entry.slug === slug)) {
      return;
    }
    if (slug === activeProjectSlug) {
      return;
    }
    setActiveProjectSlug(slug);
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
    <div className="home-agency-spotlight" data-active-project={activeProject.slug}>
      <div
        className="home-agency-spotlight__stage"
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(activeIndex)}
      >
        {/* One atomic active-project surface; deliberately no exiting layers. */}
        <div
          key={activeProject.slug}
          className={`home-agency-spotlight__active${
            reduceMotion ? "" : " home-agency-spotlight__active--enter"
          }`}
          data-project-slug={activeProject.slug}
        >
          <div className="home-agency-spotlight__visual">
            {activeProject.isDemo ? (
              <span className="home-agency-spotlight__badge">Concept Project</span>
            ) : liveUrl ? (
              <span className="home-agency-spotlight__badge">Live</span>
            ) : null}
            <div className="home-agency-spotlight__visual-inner">
              {activeProject.thumbnail ? (
                <img
                  src={activeProject.thumbnail}
                  alt={activeProject.thumbnailAlt || ""}
                  className="home-agency-spotlight__image"
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

          <div className="home-agency-spotlight__meta">
            <div className="home-agency-spotlight__story">
              <div className="home-agency-spotlight__pills">
                {activeProject.isDemo ? (
                  <span className="home-agency-spotlight__pill">Concept Project</span>
                ) : liveUrl ? (
                  <span className="home-agency-spotlight__pill">Live</span>
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
                {technologies ? <span>{technologies}</span> : null}
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
                {liveUrl ? "Visit website" : "View Project"}
                <ArrowRight className="home-agency-spotlight__cta-arrow h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        className="home-agency-spotlight__index"
        role="tablist"
        aria-label="Selected projects"
        aria-orientation="horizontal"
      >
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
              className={`home-agency-spotlight__row${selected ? " is-active" : ""}`}
              data-project-slug={entry.slug}
              onClick={() => activateSlug(entry.slug)}
              onKeyDown={(event) => onSelectKeyDown(event, index)}
            >
              <span className="home-agency-spotlight__accent" aria-hidden />
              <span className="home-agency-spotlight__num">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="home-agency-spotlight__index-copy">
                <span className="home-agency-spotlight__name">{entry.title}</span>
                <span className="home-agency-spotlight__index-category">
                  {getProjectCategoryLabel(entry.category)}
                </span>
              </span>
              <ArrowRight className="home-agency-spotlight__index-arrow h-4 w-4" aria-hidden />
            </button>
          );
        })}
      </div>
    </div>
  );
}
