/**
 * Compatibility shim for F7 Work helpers.
 * Canonical portfolio APIs live in `agencyProjects.ts`.
 */

import {
  getPublishedProjectBySlug,
  getPublishedProjects,
  isProjectsPublished,
} from "./agencyProjects";
import type { WorkProject } from "../content/workProjects";
import type { AgencyProject } from "../content/agencyProjects";

function toWorkProject(project: AgencyProject): WorkProject {
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    challenge: project.challenge,
    solution: project.solution,
    services: project.services,
    technologies: project.technologies,
    outcome: project.outcome,
    image: project.thumbnail,
    imageAlt: project.thumbnailAlt,
    published: project.published,
  };
}

/** @deprecated Prefer getPublishedProjects() */
export function getPublishedWorkProjects(): WorkProject[] {
  return getPublishedProjects().map(toWorkProject);
}

/** @deprecated Prefer isProjectsPublished() */
export function isWorkPagePublished(): boolean {
  return isProjectsPublished();
}

/** @deprecated Prefer getPublishedProjectBySlug() */
export function getPublishedWorkProjectBySlug(slug: string): WorkProject | undefined {
  const project = getPublishedProjectBySlug(slug);
  return project ? toWorkProject(project) : undefined;
}
