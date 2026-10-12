import React from "react";
import type { AgencyProject } from "../../content/agencyProjects";
import ProjectCard from "./ProjectCard";

type RelatedProjectsProps = {
  projects: AgencyProject[];
};

export default function RelatedProjects({ projects }: RelatedProjectsProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      className="relative mx-auto min-w-0 max-w-7xl px-3 pb-12 min-[341px]:px-4 sm:px-6 md:pb-16"
      aria-labelledby="related-projects-heading"
    >
      <div className="mb-6 space-y-2 md:mb-8">
        <h2 id="related-projects-heading" className="section-title text-left">
          Related Projects
        </h2>
        <p className="text-body max-w-2xl text-sm text-white/65 sm:text-base">
          More selected work from the same portfolio.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-7">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
