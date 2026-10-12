import React from "react";
import type { AgencyProject } from "../../content/agencyProjects";
import ProjectCard from "./ProjectCard";
import "./featuredProjects.css";

type FeaturedProjectsProps = {
  projects: AgencyProject[];
};

/**
 * Editorial featured layout: large primary + two compact stacked cards.
 * Heights stay content-driven via controlled preview aspect ratios.
 */
export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (projects.length === 0) {
    return null;
  }

  const [primary, ...rest] = projects;
  const side = rest.slice(0, 2);

  return (
    <section
      className="relative mx-auto max-w-7xl px-3 pb-5 min-[341px]:px-4 sm:px-6 md:pb-7"
      aria-labelledby="featured-projects-heading"
    >
      <div className="mb-5 space-y-2 md:mb-6">
        <h2 id="featured-projects-heading" className="section-title text-left">
          Featured projects
        </h2>
        <p className="text-body max-w-2xl text-sm text-white/65 sm:text-base">
          Selected concept work across software, web, mobile, commerce, and content — each labeled
          as a Concept Project.
        </p>
      </div>

      <div className="featured-projects__grid">
        <div className="featured-projects__primary">
          <ProjectCard project={primary} variant="featured" />
        </div>
        {side.length > 0 ? (
          <div className="featured-projects__side">
            {side.map((project) => (
              <ProjectCard key={project.slug} project={project} variant="compact" />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
