import React from "react";
import type { AgencyProject } from "../../content/agencyProjects";
import ProjectVisual from "./ProjectVisual";

type ProjectGalleryProps = {
  project: AgencyProject;
};

/**
 * Visual gallery for project detail pages.
 * Uses concept frames when screenshot assets are not provided.
 */
export default function ProjectGallery({ project }: ProjectGalleryProps) {
  const items = project.gallery ?? [];
  if (items.length === 0 && !project.heroImage && !project.thumbnail) {
    return null;
  }

  return (
    <section
      className="relative mx-auto max-w-7xl px-3 pb-10 min-[341px]:px-4 sm:px-6 md:pb-14"
      aria-labelledby="project-gallery-heading"
    >
      <h2 id="project-gallery-heading" className="section-title mb-4 text-left md:mb-5">
        Project Gallery
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.length > 0
          ? items.map((item) => (
              <figure
                key={`${item.variant}-${item.alt}`}
                className="group overflow-hidden rounded-xl border border-white/[0.1] bg-black/30 transition-[border-color,transform] duration-200 hover:border-white/20 motion-reduce:transform-none"
              >
                <div className="aspect-[16/10] overflow-hidden p-3 transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none sm:p-4">
                  {project.thumbnail && item.variant === 1 ? (
                    <img
                      src={project.thumbnail}
                      alt={item.alt}
                      className="h-full w-full rounded-lg object-cover object-top"
                      loading="lazy"
                    />
                  ) : (
                    <ProjectVisual
                      motif={project.visualMotif}
                      variant={item.variant}
                      density="rich"
                      className="h-full"
                    />
                  )}
                </div>
                <figcaption className="sr-only">{item.alt}</figcaption>
              </figure>
            ))
          : null}
      </div>
    </section>
  );
}
