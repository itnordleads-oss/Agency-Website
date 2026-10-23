import {
  AGENCY_PROJECT_CATEGORIES,
  AGENCY_PROJECTS,
  PROJECT_CATEGORY_LABELS,
  type AgencyProject,
  type AgencyProjectCategory,
} from "../content/agencyProjects";

export { AGENCY_PROJECT_CATEGORIES };

/** Canonical public portfolio order (live gallery sites only). */
export const PUBLIC_PORTFOLIO_PROJECT_SLUGS = [
  "relay",
  "brewnns",
  "ridgeline",
  "halden",
  "stemline",
] as const;

const PUBLIC_PORTFOLIO_SLUG_ORDER = new Map<string, number>(
  PUBLIC_PORTFOLIO_PROJECT_SLUGS.map((slug, index) => [slug, index])
);

/** Interactive portfolio demos hosted under `/demos/*` (dummy data only). */
export function isInteractiveDemoProject(project: AgencyProject): boolean {
  return (
    project.published === true &&
    project.isDemo === true &&
    typeof project.projectUrl === "string" &&
    project.projectUrl.startsWith("/demos/")
  );
}

/** Openable `/demos/*` showcases for the Projects page (separate from live portfolio). */
export function getInteractiveDemoProjects(): AgencyProject[] {
  return AGENCY_PROJECTS.filter(isInteractiveDemoProject);
}

/** Projects approved for public display — live portfolio only, never concept demos. */
export function getPublishedProjects(): AgencyProject[] {
  const published = AGENCY_PROJECTS.filter(
    (project) => project.published === true && project.isDemo === false
  );
  published.sort(
    (a, b) =>
      (PUBLIC_PORTFOLIO_SLUG_ORDER.get(a.slug) ?? 999) -
      (PUBLIC_PORTFOLIO_SLUG_ORDER.get(b.slug) ?? 999)
  );
  if (import.meta.env.DEV && published.length !== PUBLIC_PORTFOLIO_PROJECT_SLUGS.length) {
    console.error(
      `[agencyProjects] Expected ${PUBLIC_PORTFOLIO_PROJECT_SLUGS.length} public portfolio projects, got ${published.length}.`
    );
  }
  return published;
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
