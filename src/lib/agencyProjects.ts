import {
  AGENCY_PROJECTS,
  PROJECT_CATEGORY_LABELS,
  type AgencyProject,
  type AgencyProjectCategory,
} from "../content/agencyProjects";

/** Projects approved for public display. */
export function getPublishedProjects(): AgencyProject[] {
  return AGENCY_PROJECTS.filter((project) => project.published === true);
}

/** True when at least one published project exists (public /projects allowed). */
export function isProjectsPublished(): boolean {
  return getPublishedProjects().length > 0;
}

export function getPublishedProjectBySlug(slug: string): AgencyProject | undefined {
  return getPublishedProjects().find((project) => project.slug === slug);
}

export function getRelatedProjects(slug: string, limit = 3): AgencyProject[] {
  return getPublishedProjects()
    .filter((project) => project.slug !== slug)
    .slice(0, limit);
}

/** Categories that appear in published project data (for optional filters). */
export function getPublishedProjectCategories(): AgencyProjectCategory[] {
  const seen = new Set<AgencyProjectCategory>();
  for (const project of getPublishedProjects()) {
    seen.add(project.category);
  }
  return Array.from(seen);
}

export function getProjectCategoryLabel(category: AgencyProjectCategory): string {
  return PROJECT_CATEGORY_LABELS[category];
}

export function getProjectPath(slug: string): string {
  return `/projects/${slug}`;
}

/**
 * Map legacy /work paths onto canonical /projects paths.
 * /work → /projects, /work/:slug → /projects/:slug
 */
export function mapWorkPathToProjects(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/work") {
    return "/projects";
  }
  if (normalized.startsWith("/work/")) {
    const slug = normalized.slice("/work/".length);
    return slug ? `/projects/${slug}` : "/projects";
  }
  return null;
}
