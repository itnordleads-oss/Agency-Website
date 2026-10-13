import React from "react";
import { ArrowRight } from "lucide-react";
import type { AgencyProject } from "../../content/agencyProjects";
import { getProjectCategoryLabel, getProjectPath } from "../../lib/agencyProjects";
import { navigateAppPath } from "../../App";
import ProjectVisual from "./ProjectVisual";
import { useProjectCardTilt } from "./useProjectCardTilt";
import "./projectCard.css";

type ProjectCardProps = {
  project: AgencyProject;
  /** Featured primary (larger), compact side card, or standard grid card. */
  variant?: "standard" | "featured" | "compact";
  /** Stagger index for entrance animation. */
  enterIndex?: number;
};

/**
 * Image-led portfolio card with subtle 3D hover.
 * Height is driven by controlled preview aspect-ratio + compact content.
 */
export default function ProjectCard({
  project,
  variant = "standard",
  enterIndex,
}: ProjectCardProps) {
  const href = getProjectPath(project.slug);
  const categoryLabel = getProjectCategoryLabel(project.category);
  const { ref, onPointerMove, onPointerLeave } = useProjectCardTilt();
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";
  const isStandard = variant === "standard";
  const descriptionClampClass = isStandard
    ? "line-clamp-3"
    : isFeatured
      ? "line-clamp-3"
      : "line-clamp-2";

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    navigateAppPath(href);
  };

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`project-card group overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.02] text-left no-underline outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D2FF] project-card--${variant}${
        typeof enterIndex === "number" ? " project-card-enter" : ""
      }`}
      style={
        typeof enterIndex === "number"
          ? { animationDelay: `${Math.min(enterIndex, 5) * 40}ms` }
          : undefined
      }
      aria-label={`View project: ${project.title}${project.isDemo ? " (Concept Project)" : ""}`}
    >
      <span className="project-card__shine" aria-hidden />
      <div className="project-card__media-wrap relative overflow-hidden border-b border-white/[0.08] bg-gradient-to-br from-[#12203a] via-[#0C111B] to-[#0a1628]">
        <div className="project-card__media absolute inset-0 p-2.5 sm:p-3">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.thumbnailAlt || `${project.title} preview`}
              className="h-full w-full rounded-xl object-cover object-top"
              loading="lazy"
            />
          ) : (
            <ProjectVisual
              motif={project.visualMotif}
              variant={1}
              density={isFeatured ? "rich" : "default"}
              className="h-full"
            />
          )}
        </div>
        {project.isDemo ? (
          <span className="project-card__concept-badge absolute left-2.5 top-2.5 z-10 rounded-full border border-white/12 bg-[#0C111B]/88 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/75 backdrop-blur-sm">
            Concept Project
          </span>
        ) : null}
      </div>

      <div
        className={`project-card__body relative z-[1] ${
          isCompact ? "gap-2 p-3.5 sm:p-4" : isFeatured ? "gap-2 p-4 sm:p-5" : "gap-2.5 p-4 sm:p-5"
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="status-pill project-card__meta-pill">{categoryLabel}</span>
          {!isCompact &&
            project.services?.slice(0, isFeatured ? 2 : 1).map((service) => (
              <span key={service} className="status-pill project-card__meta-pill">
                {service}
              </span>
            ))}
        </div>

        <div className="space-y-1">
          <h3
            className={`font-bold tracking-tight text-white ${
              isFeatured
                ? "text-xl sm:text-2xl"
                : isCompact
                  ? "text-base sm:text-lg"
                  : "text-lg sm:text-xl"
            }`}
          >
            {project.title}
          </h3>
          {project.label && !isCompact ? (
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-white/50">
              {project.label}
            </p>
          ) : null}
          <p className={`${descriptionClampClass} text-[0.9375rem] leading-relaxed text-white/70`}>
            {project.shortDescription}
          </p>
        </div>

        {project.technologies && project.technologies.length > 0 && !isCompact ? (
          <ul className="flex min-h-[1.625rem] flex-wrap content-start gap-1.5">
            {project.technologies.slice(0, 3).map((tech) => (
              <li key={tech} className="project-card__tech-tag">
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="project-card__cta flex items-center gap-2 text-sm font-semibold text-[#A4F4FD] transition-colors group-hover:text-white group-focus-visible:text-white">
          <span>View Project</span>
          <ArrowRight
            className="project-card__arrow h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
            aria-hidden
          />
        </div>
      </div>
    </a>
  );
}
