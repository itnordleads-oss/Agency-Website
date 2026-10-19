import React, { useEffect, useState } from "react";
import type { AgencyProject, AgencyProjectGalleryLayout } from "../../content/agencyProjects";
import { getGalleryEmphasisClass } from "../../lib/projectDetailInteraction";
import ProjectVisual from "./ProjectVisual";

type ProjectGalleryProps = {
  project: AgencyProject;
};

function layoutClass(layout: AgencyProjectGalleryLayout | undefined, index: number): string {
  if (layout === "full" || index === 0) {
    return "project-detail-gallery__item--full";
  }
  return "project-detail-gallery__item--half";
}

/**
 * Editorial visual gallery for project detail pages.
 * Large lead frame + balanced secondary pair; optional active emphasis.
 */
export default function ProjectGallery({ project }: ProjectGalleryProps) {
  const items = project.gallery ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [project.slug]);

  if (items.length === 0 && !project.heroImage && !project.thumbnail) {
    return null;
  }

  return (
    <section
      className="project-detail__section project-detail__reveal-band relative mx-auto max-w-7xl px-3 min-[341px]:px-4 sm:px-6 lg:max-w-[84rem]"
      aria-labelledby="project-gallery-heading"
    >
      <h2 id="project-gallery-heading" className="project-detail__h2 mb-5 text-left md:mb-7">
        Visual Gallery
      </h2>
      <div className="project-detail-gallery">
        {items.map((item, index) => {
          const caption = item.caption || item.alt;
          const isActive = index === activeIndex;
          return (
            <figure
              key={`${project.slug}-${item.variant}-${index}`}
              className={`project-detail-gallery__item group ${layoutClass(item.layout, index)} ${getGalleryEmphasisClass(index)}${
                isActive ? " is-active" : ""
              }`}
            >
              <button
                type="button"
                className="project-detail-gallery__hit"
                aria-pressed={isActive}
                aria-label={`${caption} — activate concept frame`}
                onClick={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onMouseEnter={() => {
                  if (
                    typeof window !== "undefined" &&
                    typeof window.matchMedia === "function" &&
                    window.matchMedia("(hover: hover) and (pointer: fine)").matches
                  ) {
                    setActiveIndex(index);
                  }
                }}
              >
                <div className="project-detail-gallery__frame">
                  {project.thumbnail && item.variant === 1 ? (
                    <img
                      src={project.thumbnail}
                      alt=""
                      className="h-full w-full rounded-lg object-cover object-top"
                      loading="lazy"
                    />
                  ) : (
                    <ProjectVisual
                      motif={project.visualMotif}
                      variant={item.variant}
                      density="rich"
                      interactionState={`gallery-${index}`}
                      className="h-full"
                    />
                  )}
                </div>
              </button>
              <figcaption className="project-detail-gallery__caption">{caption}</figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
