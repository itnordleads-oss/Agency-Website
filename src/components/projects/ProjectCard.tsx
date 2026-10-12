import React from "react";
import { ArrowRight } from "lucide-react";
import type { AgencyProject } from "../../content/agencyProjects";
import { getProjectCategoryLabel, getProjectPath } from "../../lib/agencyProjects";
import { navigateAppPath } from "../../App";

type ProjectCardProps = {
  project: AgencyProject;
};

/**
 * Image-led portfolio card for /projects.
 * Distinct from Services cards: large preview, visual hierarchy, whole-card link.
 */
export default function ProjectCard({ project }: ProjectCardProps) {
  const href = getProjectPath(project.slug);
  const categoryLabel = getProjectCategoryLabel(project.category);
  const viewLabel = `View project: ${project.title}`;

  const goToProject = () => {
    navigateAppPath(href);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToProject();
    }
  };

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={viewLabel}
      onClick={goToProject}
      onKeyDown={onKeyDown}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.02] transition-[border-color,transform,background-color] duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D2FF] motion-reduce:transform-none"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.08] bg-gradient-to-br from-[#12203a] via-[#0C111B] to-[#0a1628]">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.thumbnailAlt || `${project.title} preview`}
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-end p-5"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(420px circle at 20% 0%, rgba(0,210,255,0.16), transparent 55%), radial-gradient(380px circle at 90% 80%, rgba(61,129,227,0.14), transparent 50%)",
            }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
              {categoryLabel}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="status-pill">{categoryLabel}</span>
          {project.services?.slice(0, 2).map((service) => (
            <span key={service} className="status-pill">
              {service}
            </span>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">{project.title}</h3>
          <p className="text-sm leading-relaxed text-white/65">{project.shortDescription}</p>
        </div>

        {project.technologies && project.technologies.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="rounded-md border border-white/[0.08] bg-black/20 px-2 py-0.5 text-[0.6875rem] text-white/55"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex items-center gap-2 pt-2 text-sm font-semibold text-[#A4F4FD] transition-colors group-hover:text-white">
          <span>View Project</span>
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
            aria-hidden
          />
        </div>
      </div>
    </article>
  );
}
