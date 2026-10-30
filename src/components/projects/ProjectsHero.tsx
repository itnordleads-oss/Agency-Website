import React, { useCallback, useEffect, useMemo, useRef } from "react";
import SectionEyebrow from "../SectionEyebrow";
import ProjectVisual from "./ProjectVisual";
import type { AgencyProject } from "../../content/agencyProjects";
import { getFeaturedProjects } from "../../lib/agencyProjects";
import { useSiteCopy } from "../../lib/useSiteCopy";
import "./projectsHero.css";

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

function HeroPreviewCard({
  project,
  categoryLabel,
  liveLabel,
  layer,
  indexLabel,
}: {
  project: AgencyProject;
  categoryLabel: string;
  liveLabel: string;
  layer: "front" | "mid" | "back";
  indexLabel?: string;
}) {
  const alt = project.thumbnailAlt || `${project.title} preview`;

  return (
    <article
      className={`projects-hero-preview projects-hero-preview--${layer}`}
      aria-hidden={layer !== "front" ? true : undefined}
    >
      <div className="projects-hero-preview__frame">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={layer === "front" ? alt : ""}
            className="projects-hero-preview__shot"
            loading={layer === "front" ? "eager" : "lazy"}
            decoding="async"
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
      {layer === "front" ? (
        <div className="projects-hero-preview__meta">
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
 * Premium portfolio hero — real project screenshots in a layered showcase.
 * Desktop: editorial two-column composition. Mobile: single-preview stack.
 */
export default function ProjectsHero() {
  const { projectsPage } = useSiteCopy();
  const visualRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  const showcase = useMemo(() => getFeaturedProjects(3), []);
  const primary = showcase[0] ?? null;
  const secondary = showcase[1] ?? null;
  const tertiary = showcase[2] ?? null;

  const categoryLabels = projectsPage.categories as Record<string, string>;
  const categoryFor = (project: AgencyProject) =>
    categoryLabels[project.category] || project.category;

  const liveLabel = projectsPage.card.liveBadge;

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
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
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      const rect = node.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) {
        return;
      }
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      node.style.setProperty("--hero-shift-x", `${(x * 4).toFixed(2)}px`);
      node.style.setProperty("--hero-shift-y", `${(y * 3).toFixed(2)}px`);
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    const node = visualRef.current;
    if (!node) {
      return;
    }
    node.style.setProperty("--hero-shift-x", "0px");
    node.style.setProperty("--hero-shift-y", "0px");
  }, []);

  return (
    <section
      className="projects-hero-shell relative mx-auto max-w-7xl"
      aria-labelledby="projects-hero-title"
    >
      <div className="projects-hero liquid-glass relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(720px circle at 12% -8%, rgba(61,129,227,0.2), transparent 55%), radial-gradient(540px circle at 92% 100%, rgba(0,210,255,0.1), transparent 52%)",
          }}
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
            {primary ? (
              <p className="projects-hero__enter projects-hero__enter--cue projects-hero-cue">
                <span className="projects-hero-cue__dot" aria-hidden />
                {primary.title}
                {secondary ? ` · ${secondary.title}` : null}
                {tertiary ? ` · ${tertiary.title}` : null}
              </p>
            ) : null}
          </div>

          <div
            ref={visualRef}
            className="projects-hero-visual projects-hero__enter projects-hero__enter--visual min-w-0"
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
          >
            <div className="projects-hero-visual__stack">
              {tertiary ? (
                <HeroPreviewCard
                  project={tertiary}
                  categoryLabel={categoryFor(tertiary)}
                  liveLabel={liveLabel}
                  layer="back"
                />
              ) : null}
              {secondary ? (
                <HeroPreviewCard
                  project={secondary}
                  categoryLabel={categoryFor(secondary)}
                  liveLabel={liveLabel}
                  layer="mid"
                />
              ) : null}
              {primary ? (
                <HeroPreviewCard
                  project={primary}
                  categoryLabel={categoryFor(primary)}
                  liveLabel={
                    primary.status?.toLowerCase() === "live"
                      ? liveLabel
                      : primary.status || liveLabel
                  }
                  layer="front"
                  indexLabel="01"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
