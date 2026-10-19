import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import { SecondaryButton } from "../Buttons";
import type { AgencyProject } from "../../content/agencyProjects";
import { getProjectCategoryLabel } from "../../lib/agencyProjects";
import {
  getDefaultHeroStateId,
  getHeroState,
  getHeroStates,
} from "../../lib/projectDetailInteraction";
import { navigateAppPath } from "../../App";
import ProjectVisual from "./ProjectVisual";

type ProjectDetailHeroProps = {
  project: AgencyProject;
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function canUsePointerParallax(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

/**
 * Premium case-study hero shared by every project detail route.
 * Layout is shared; hero states and visuals stay motif-specific.
 */
export default function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  const categoryLabel = getProjectCategoryLabel(project.category);
  const primaryService = project.services?.join(" / ") ?? "";
  const heroStates = getHeroStates(project.visualMotif);
  const [activeStateId, setActiveStateId] = useState(() =>
    getDefaultHeroStateId(project.visualMotif)
  );
  const visualRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    setActiveStateId(getDefaultHeroStateId(project.visualMotif));
  }, [project.slug, project.visualMotif]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const activeState = getHeroState(project.visualMotif, activeStateId);

  const metaItems = [
    project.projectType ? { label: "Project Type", value: project.projectType } : null,
    primaryService ? { label: "Primary Service", value: primaryService } : null,
    project.platform ? { label: "Platform", value: project.platform } : null,
  ].filter((item): item is { label: string; value: string } => item !== null);

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
      node.style.setProperty("--detail-hero-shift-x", `${(x * 4).toFixed(2)}px`);
      node.style.setProperty("--detail-hero-shift-y", `${(y * 3).toFixed(2)}px`);
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    const node = visualRef.current;
    if (!node) {
      return;
    }
    node.style.setProperty("--detail-hero-shift-x", "0px");
    node.style.setProperty("--detail-hero-shift-y", "0px");
  }, []);

  return (
    <section
      className="project-detail__hero relative mx-auto max-w-7xl px-3 pb-10 min-[341px]:px-4 sm:px-6 md:pb-14 lg:max-w-[84rem]"
      aria-labelledby="project-detail-title"
    >
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-14">
        <div className="project-detail__hero-copy min-w-0 space-y-3.5 sm:space-y-4">
          <div className="project-detail__enter project-detail__enter--eyebrow">
            <SectionEyebrow label={project.isDemo ? "CONCEPT PROJECT" : "PROJECT / CASE STUDY"} />
          </div>

          <h1
            id="project-detail-title"
            className="project-detail__enter project-detail__enter--title hero-title text-white"
            style={{ textWrap: "balance" }}
          >
            {project.title}
          </h1>

          <p className="project-detail__enter project-detail__enter--copy project-detail__prose text-body text-base leading-relaxed text-white/74 sm:text-lg">
            {project.shortDescription}
          </p>

          {metaItems.length > 0 ? (
            <dl className="project-detail__enter project-detail__enter--meta project-detail__hero-meta">
              {metaItems.map((item) => (
                <div key={item.label} className="project-detail__hero-meta-item">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="project-detail__enter project-detail__enter--meta text-sm font-medium text-white/55">
              {[categoryLabel, project.services?.[0]].filter(Boolean).join(" / ")}
            </p>
          )}

          <div className="project-detail__enter project-detail__enter--actions flex flex-wrap items-center gap-3 pt-1">
            <SecondaryButton
              onClick={() => navigateAppPath("/projects")}
              className="project-detail__back-btn"
            >
              <span className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to Projects
              </span>
            </SecondaryButton>
            {project.projectUrl ? (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 self-center text-sm font-semibold text-[#A4F4FD] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D2FF]"
              >
                {project.isDemo ? "View Demo" : "Visit website"}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            ) : null}
          </div>
        </div>

        <div className="project-detail__enter project-detail__enter--visual project-detail__hero-visual">
          <div
            ref={visualRef}
            className={`project-detail__hero-frame project-detail__hero-frame--${project.visualMotif} project-detail__hero-frame--assembled`}
            data-hero-state={activeState.id}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
          >
            <div className="project-detail__hero-layers" aria-hidden>
              {project.heroImage || project.thumbnail ? (
                <img
                  src={project.heroImage || project.thumbnail}
                  alt={project.thumbnailAlt || `${project.title} concept preview`}
                  className="project-detail__hero-media"
                />
              ) : (
                <ProjectVisual
                  key={`${project.slug}-hero-${activeState.id}`}
                  motif={project.visualMotif}
                  variant={activeState.variant}
                  density="rich"
                  interactionState={activeState.id}
                  className="project-detail__hero-visual-core h-full min-h-[16rem] lg:min-h-[22rem]"
                />
              )}
            </div>

            {/* Hotspots: tap/focus regions map to storytelling states without cluttering chrome. */}
            <div
              className="project-detail__hero-hotspots"
              role="group"
              aria-label="Concept visual states"
            >
              {heroStates.map((state, index) => (
                <button
                  key={`${project.slug}-${state.id}`}
                  type="button"
                  className={`project-detail__hero-hotspot project-detail__hero-hotspot--${index + 1}${
                    activeStateId === state.id ? " is-active" : ""
                  }`}
                  aria-pressed={activeStateId === state.id}
                  aria-label={`${state.label} view`}
                  onClick={() => setActiveStateId(state.id)}
                  onFocus={() => setActiveStateId(state.id)}
                  onMouseEnter={() => {
                    if (canUsePointerParallax()) {
                      setActiveStateId(state.id);
                    }
                  }}
                />
              ))}
            </div>
          </div>

          <p className="project-detail__hero-state-label" aria-live="polite">
            {activeState.label}
          </p>
        </div>
      </div>
    </section>
  );
}
