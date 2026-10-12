/**
 * Compatibility shim — portfolio content lives in `agencyProjects.ts`.
 * Kept so older F7 imports continue to type-check during the /work → /projects migration.
 */

import {
  AGENCY_PROJECTS,
  type AgencyProject,
} from "./agencyProjects";

/** @deprecated Use AgencyProject from agencyProjects.ts */
export type WorkProject = {
  slug: string;
  title: string;
  client?: string;
  industry?: string;
  summary: string;
  challenge?: string;
  solution?: string;
  services?: string[];
  technologies?: string[];
  outcome?: string;
  image?: string;
  imageAlt?: string;
  published: boolean;
};

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

/** @deprecated Prefer AGENCY_PROJECTS / getPublishedProjects() */
export const WORK_PROJECTS: WorkProject[] = AGENCY_PROJECTS.map(toWorkProject);
