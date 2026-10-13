import React from "react";
import type { AgencyProject, AgencyProjectGalleryLayout } from "../../content/agencyProjects";
import ProjectVisual from "./ProjectVisual";
import "./projectDetail.css";

type ProjectGalleryProps = {
  project: AgencyProject;
};

function layoutClass(layout: AgencyProjectGalleryLayout | undefined): string {
  switch (layout) {
    case "full":
      return "project-detail-gallery__item--full";
    case "wide":
      return "project-detail-gallery__item--wide";
    case "portrait":
      return "project-detail-gallery__item--portrait";
    default:
      return "";
  }
}

/**
 * Editorial visual gallery for project detail pages.
 * Uses concept frames when screenshot assets are not provided.
 */
export default function ProjectGallery({ project }: ProjectGalleryProps) {
  const items = project.gallery ?? [];
  if (items.length === 0 && !project.heroImage && !project.thumbnail) {
    return null;
  }

  return (
    <section
      className="project-detail__section relative mx-auto max-w-7xl px-3 pb-10 min-[341px]:px-4 sm:px-6 md:pb-12 lg:max-w-[84rem]"
      aria-labelledby="project-gallery-heading"
    >
      <h2 id="project-gallery-heading" className="section-title mb-5 text-left md:mb-7">
        Visual Gallery
      </h2>
      <div className="project-detail-gallery">
        {items.map((item, index) => (
          <figure
            key={`${item.variant}-${item.alt}-${index}`}
            className={`project-detail-gallery__item group overflow-hidden rounded-2xl border border-white/[0.1] bg-black/25 ${layoutClass(item.layout)}`}
          >
            <div className="project-detail-gallery__frame bg-gradient-to-br from-[#12203a] via-[#0C111B] to-[#0a1628] motion-reduce:transform-none">
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
            <figcaption className="px-4 py-2.5 text-xs leading-snug text-white/45">
              {item.alt}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
