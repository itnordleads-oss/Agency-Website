import React, { useEffect, useState } from "react";
import type { AgencyProject } from "../../content/agencyProjects";
import { getBuildPreviewLabel, getBuildPreviewVariant } from "../../lib/projectDetailInteraction";
import ProjectVisual from "./ProjectVisual";

type ProjectBuildFeaturesProps = {
  project: AgencyProject;
  items: string[];
};

/**
 * Interactive “What We Built” module shared across project detail routes.
 * Active item updates a motif-specific preview; all items stay readable.
 */
export default function ProjectBuildFeatures({ project, items }: ProjectBuildFeaturesProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [project.slug]);

  if (items.length === 0) {
    return null;
  }

  const safeIndex = Math.min(activeIndex, items.length - 1);
  const variant = getBuildPreviewVariant(safeIndex);
  const previewLabel = getBuildPreviewLabel(project.visualMotif, safeIndex);

  const selectIndex = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="project-detail__built">
      <ol className="project-detail__built-list" aria-label="What we built">
        {items.map((item, index) => {
          const active = index === safeIndex;
          return (
            <li key={`${project.slug}-${item}`}>
              <button
                type="button"
                className={`project-detail__built-item${
                  active ? " project-detail__built-item--active" : ""
                }`}
                aria-pressed={active}
                onClick={() => selectIndex(index)}
                onFocus={() => selectIndex(index)}
                onMouseEnter={() => {
                  if (
                    typeof window !== "undefined" &&
                    typeof window.matchMedia === "function" &&
                    window.matchMedia("(hover: hover) and (pointer: fine)").matches
                  ) {
                    selectIndex(index);
                  }
                }}
              >
                <span className="project-detail__built-index" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="project-detail__built-label">{item}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="project-detail__built-preview" aria-hidden>
        <div className="project-detail__built-preview-frame">
          <ProjectVisual
            key={`${project.slug}-built-${safeIndex}`}
            motif={project.visualMotif}
            variant={variant}
            density="rich"
            interactionState={`built-${safeIndex}`}
            label={previewLabel}
            className="project-detail__built-visual h-full min-h-[12rem]"
          />
        </div>
        <p className="project-detail__built-preview-caption">{previewLabel}</p>
      </div>
    </div>
  );
}
