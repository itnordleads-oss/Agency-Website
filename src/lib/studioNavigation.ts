/**
 * F3 — Development Studio public navigation.
 *
 * Route ids/paths stay language-stable. Visible labels come from i18n
 * (`nav.studio.*`) via `getPublishedStudioNavItems(labels)`.
 * Canonical portfolio route is `/projects`. Legacy `/work` redirects there.
 * Product routes (`/platform`, `/workflow`, product pricing) are retired in F9
 * (redirect to agency destinations) and are not listed in the public studio navbar.
 */

export type StudioNavItemId =
  "home" | "services" | "projects" | "about" | "careers" | "contact" | "work";

export type StudioNavItem = {
  id: StudioNavItemId;
  label: string;
  path: string;
};

export type StudioNavLabels = Partial<Record<Exclude<StudioNavItemId, "work">, string>>;

/**
 * @deprecated Prefer checking published project content via agencyProjects.
 * Kept for older call sites during the /work → /projects migration.
 */
export const IS_WORK_NAV_PUBLISHED = true;

const STUDIO_NAV_PATHS: ReadonlyArray<{
  id: Exclude<StudioNavItemId, "work">;
  path: string;
  fallbackLabel: string;
}> = [
  { id: "home", path: "/", fallbackLabel: "Home" },
  { id: "about", path: "/about", fallbackLabel: "About" },
  { id: "services", path: "/services", fallbackLabel: "Services" },
  { id: "projects", path: "/projects", fallbackLabel: "Projects" },
  { id: "careers", path: "/careers", fallbackLabel: "Careers" },
  { id: "contact", path: "/contact", fallbackLabel: "Contact" },
];

/** Public header / mobile / footer navigation. */
export function getPublishedStudioNavItems(labels?: StudioNavLabels): StudioNavItem[] {
  return STUDIO_NAV_PATHS.map((item) => ({
    id: item.id,
    path: item.path,
    label: labels?.[item.id] || item.fallbackLabel,
  }));
}

export function getStudioNavHref(id: StudioNavItemId): string {
  if (id === "work") {
    return "/projects";
  }
  const item = STUDIO_NAV_PATHS.find((entry) => entry.id === id);
  return item?.path ?? "/";
}

export function resolveActiveStudioNavId(path: string): StudioNavItemId | null {
  const normalized = path.replace(/\/+$/, "") || "/";

  if (normalized === "/") {
    return "home";
  }
  if (normalized === "/services" || normalized.startsWith("/services/")) {
    return "services";
  }
  if (normalized === "/projects" || normalized.startsWith("/projects/")) {
    return "projects";
  }
  if (normalized === "/about") {
    return "about";
  }
  if (normalized === "/careers") {
    return "careers";
  }
  if (normalized === "/contact") {
    return "contact";
  }

  return null;
}

/** Footer Explore column. Canonical portfolio route is `/projects`. */
export const FOOTER_EXPLORE_NAV_IDS: StudioNavItemId[] = ["home", "services", "projects"];

/** Footer Company column (Terms is appended separately). */
export const FOOTER_COMPANY_NAV_IDS: StudioNavItemId[] = ["about", "careers", "contact"];
