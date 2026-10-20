import React from "react";
import type { AgencyProject } from "../../content/agencyProjects";
import ProjectCard from "./ProjectCard";

type RelatedProjectsProps = {
  projects: AgencyProject[];
};

/**
 * Compact related work strip for project detail pages.
 * Expects already-filtered projects (current slug excluded upstream).
 */
export default function RelatedProjects({ projects }: RelatedProjectsProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      className="project-detail__section relative mx-auto min-w-0 max-w-7xl px-3 pb-10 min-[341px]:px-4 sm:px-6 md:pb-12"
      aria-labelledby="related-projects-heading"
    >
      <div className="mb-5 space-y-1.5 md:mb-6">
        <h2 id="related-projects-heading" className="project-detail__h2 text-left">
          Related Projects
        </h2>
        <p className="text-body max-w-2xl text-sm text-white/62">More live gallery sites.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} variant="compact" />
        ))}
      </div>
    </section>
  );
}
