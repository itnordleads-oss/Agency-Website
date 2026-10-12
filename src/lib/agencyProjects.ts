import {
  AGENCY_PROJECT_CATEGORIES,
  AGENCY_PROJECTS,
  PROJECT_CATEGORY_LABELS,
  type AgencyProject,
  type AgencyProjectCategory,
} from "../content/agencyProjects";

export { AGENCY_PROJECT_CATEGORIES };

/** Projects approved for public display. */
export function getPublishedProjects(): AgencyProject[] {
  return AGENCY_PROJECTS.filter((project) => project.published === true);
}

/** True when at least one published project exists. */
export function isProjectsPublished(): boolean {
  return getPublishedProjects().length > 0;
}

export function getPublishedProjectBySlug(slug: string): AgencyProject | undefined {
  return getPublishedProjects().find((project) => project.slug === slug);
}

export function getFeaturedProjects(limit = 3): AgencyProject[] {
  const featured = getPublishedProjects().filter((project) => project.featured);
  if (featured.length > 0) {
    return featured.slice(0, limit);
  }
  return getPublishedProjects().slice(0, limit);
}

export function getRelatedProjects(slug: string, limit = 3): AgencyProject[] {
  const current = getPublishedProjectBySlug(slug);
  const others = getPublishedProjects().filter((project) => project.slug !== slug);

  if (!current) {
    return others.slice(0, limit);
  }

  const sameCategory = others.filter((project) => project.category === current.category);
  const rest = others.filter((project) => project.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

/** Categories that appear in published project data (for filters). */
export function getPublishedProjectCategories(): AgencyProjectCategory[] {
  const order = new Map(
    AGENCY_PROJECT_CATEGORIES.map((category, index) => [category, index] as const)
  );
  const seen = new Set<AgencyProjectCategory>();
  for (const project of getPublishedProjects()) {
    seen.add(project.category);
  }
  return Array.from(seen).sort((a, b) => (order.get(a) ?? 99) - (order.get(b) ?? 99));
}

export function getProjectCategoryLabel(category: AgencyProjectCategory): string {
  return PROJECT_CATEGORY_LABELS[category];
}

export function getProjectPath(slug: string): string {
  return `/projects/${slug}`;
}

export function getProjectDeliverables(project: AgencyProject): string[] {
  if (project.deliverables && project.deliverables.length > 0) {
    return [...project.deliverables];
  }
  if (project.whatWeBuilt && project.whatWeBuilt.length > 0) {
    return [...project.whatWeBuilt];
  }
  return [];
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
