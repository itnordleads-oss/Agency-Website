import React from "react";
import { ArrowRight } from "lucide-react";
import type { AgencyProject } from "../../content/agencyProjects";
import { getProjectPath } from "../../lib/agencyProjects";
import { navigateAppPath } from "../../App";
import { useSiteCopy } from "../../lib/useSiteCopy";
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
 * Image-led portfolio card with subtle pointer hover.
 * Height is driven by controlled preview aspect-ratio + compact content.
 */
export default function ProjectCard({
  project,
  variant = "standard",
  enterIndex,
}: ProjectCardProps) {
  const { projectsPage, t } = useSiteCopy();
  const liveUrl = !project.isDemo && project.projectUrl ? project.projectUrl : null;
  const interactiveDemoUrl =
    project.isDemo && project.projectUrl?.startsWith("/demos/") ? project.projectUrl : null;
  const href = liveUrl ?? interactiveDemoUrl ?? getProjectPath(project.slug);
  const isProductionApp =
    liveUrl !== null &&
    (project.projectType === "Software product" || project.visualMotif === "dashboard");
  const liveCtaLabel = isProductionApp
    ? projectsPage.card.openApplication
    : projectsPage.card.visitWebsite;
  const liveBadgeLabel = isProductionApp
    ? projectsPage.card.productionBadge
    : projectsPage.card.liveBadge;
  const categoryLabels = projectsPage.categories as Record<string, string>;
  const categoryLabel = categoryLabels[project.category] || project.category;
  const { ref, onPointerMove, onPointerLeave } = useProjectCardTilt();
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (liveUrl) {
      return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    navigateAppPath(href);
  };

  const ariaLabel = liveUrl
    ? `${liveCtaLabel}: ${project.title}`
    : interactiveDemoUrl
      ? t("projectsPage.card.openDemoAria", { title: project.title })
      : project.isDemo
        ? t("projectsPage.card.viewConceptAria", { title: project.title })
        : t("projectsPage.card.viewProjectAria", { title: project.title });

  const previewAlt =
    project.thumbnailAlt || t("projectsPage.card.previewAlt", { title: project.title });

  return (
    <a
      ref={ref}
      href={href}
      target={liveUrl ? "_blank" : undefined}
      rel={liveUrl ? "noopener noreferrer" : undefined}
      onClick={onClick}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`project-card group overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.02] text-left no-underline outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D2FF] project-card--${variant}${
        liveUrl || interactiveDemoUrl ? " project-card--live" : ""
      }${typeof enterIndex === "number" ? " project-card-enter" : ""}`}
      style={
        typeof enterIndex === "number"
          ? { animationDelay: `${Math.min(enterIndex, 5) * 40}ms` }
          : undefined
      }
      aria-label={ariaLabel}
    >
      <span className="project-card__shine" aria-hidden />
      <div className="project-card__media-wrap relative overflow-hidden border-b border-white/[0.08] bg-gradient-to-br from-[#12203a] via-[#0C111B] to-[#0a1628]">
        <div className="project-card__media absolute inset-0 p-2.5 sm:p-3">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={previewAlt}
              className="project-card__shot h-full w-full rounded-xl object-cover object-top"
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
        {interactiveDemoUrl ? (
          <span className="project-card__concept-badge absolute left-2.5 top-2.5 z-10 rounded-full border border-[#00D2FF]/30 bg-[#0C111B]/88 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[#A4F4FD] backdrop-blur-sm">
            {projectsPage.card.interactiveDemo}
          </span>
        ) : project.isDemo ? (
          <span className="project-card__concept-badge absolute left-2.5 top-2.5 z-10 rounded-full border px-2.5 py-0.5 font-semibold uppercase backdrop-blur-sm">
            {projectsPage.card.conceptProject}
          </span>
        ) : liveUrl ? (
          <span
            className={`project-card__concept-badge absolute left-2.5 top-2.5 z-10 rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] backdrop-blur-sm${
              isProductionApp
                ? " border-emerald-400/35 bg-[#0C111B]/9 text-emerald-200"
                : " border-[#00D2FF]/30 bg-[#0C111B]/88 text-[#A4F4FD]"
            }`}
          >
            {liveBadgeLabel}
          </span>
        ) : null}
      </div>

      <div
        className={`project-card__body relative z-[1] ${
          isCompact ? "px-3.5 py-3 sm:px-4 sm:py-3.5" : isFeatured ? "px-4 sm:px-5" : ""
        }`}
      >
        <h3
          className={`project-card__title font-bold tracking-tight text-white ${
            isFeatured
              ? "text-xl sm:text-2xl"
              : isCompact
                ? "text-base sm:text-lg"
                : "text-lg sm:text-xl"
          }`}
        >
          {project.title}
        </h3>

        {project.label && !isCompact ? <p className="project-card__type">{project.label}</p> : null}

        <p className="project-card__description line-clamp-2">{project.shortDescription}</p>

        <div className="project-card__meta-row">
          <span className="project-card__category">{categoryLabel}</span>
          {!isCompact && project.services?.[0] ? (
            <span className="project-card__service">{project.services[0]}</span>
          ) : null}
        </div>

        {project.technologies && project.technologies.length > 0 && !isCompact ? (
          <ul className="project-card__tech-list" aria-label="Technologies">
            {project.technologies.slice(0, isFeatured ? 4 : 3).map((tech) => (
              <li key={tech} className="project-card__tech-tag">
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="project-card__cta">
          <span>{liveUrl ? liveCtaLabel : projectsPage.card.visitWebsite}</span>
          <ArrowRight className="project-card__arrow h-4 w-4" aria-hidden />
        </div>
      </div>
    </a>
  );
}
