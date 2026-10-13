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
      className="relative mx-auto min-w-0 max-w-7xl px-3 pb-10 min-[341px]:px-4 sm:px-6 md:pb-14"
      aria-labelledby="related-projects-heading"
    >
      <div className="mb-5 space-y-2 md:mb-6">
        <h2 id="related-projects-heading" className="section-title text-left">
          Related Projects
        </h2>
        <p className="text-body max-w-2xl text-sm text-white/65 sm:text-base">
          More selected concept work from the same portfolio.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-5">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} enterIndex={index} />
        ))}
      </div>
    </section>
  );
}
