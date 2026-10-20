import React from "react";
import type { AgencyProject } from "../../content/agencyProjects";
import ProjectCard from "./ProjectCard";
import "./featuredProjects.css";

type FeaturedProjectsProps = {
  projects: AgencyProject[];
};

/**
 * Editorial featured layout: large primary + two compact stacked cards.
 * Side cards stay content-height so they do not stretch into empty space.
 */
export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (projects.length === 0) {
    return null;
  }

  const [primary, ...rest] = projects;
  const side = rest.slice(0, 2);

  return (
    <section
      className="projects-section-reveal relative mx-auto max-w-7xl px-3 pb-5 min-[341px]:px-4 sm:px-6 md:pb-6"
      aria-labelledby="featured-projects-heading"
    >
      <div className="mb-4 space-y-1.5 md:mb-5">
        <h2
          id="featured-projects-heading"
          className="section-title text-left"
          style={{ textWrap: "balance" }}
        >
          Featured projects
        </h2>
        <p className="text-body max-w-2xl text-sm leading-relaxed text-white/66">
          A dominant concept leads the portfolio, with supporting work shown for context.
        </p>
      </div>

      <div className="featured-projects__grid">
        <div className="featured-projects__primary">
          <ProjectCard project={primary} variant="featured" enterIndex={0} />
        </div>
        {side.length > 0 ? (
          <div className="featured-projects__side">
            {side.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                variant="compact"
                enterIndex={index + 1}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
