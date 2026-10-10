import { WORK_PROJECTS, type WorkProject } from "../content/workProjects";

/** Projects approved for public display. */
export function getPublishedWorkProjects(): WorkProject[] {
  return WORK_PROJECTS.filter((project) => project.published === true);
}

/** True when at least one published project exists (public /work allowed). */
export function isWorkPagePublished(): boolean {
  return getPublishedWorkProjects().length > 0;
}

export function getPublishedWorkProjectBySlug(slug: string): WorkProject | undefined {
  return getPublishedWorkProjects().find((project) => project.slug === slug);
}
