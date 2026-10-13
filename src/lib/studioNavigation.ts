/**
 * F3 — Development Studio public navigation.
 *
 * English chrome labels only. Full localized nav copy remains F10.
 * Canonical portfolio route is `/projects`. Legacy `/work` maps there when published.
 * Product routes (`/platform`, `/workflow`, product pricing) are retired in F9
 * (redirect to agency destinations) and are not listed in the public studio navbar.
 */

export type StudioNavItemId = "home" | "services" | "projects" | "about" | "contact" | "work";

export type StudioNavItem = {
  id: StudioNavItemId;
  label: string;
  path: string;
};

/**
 * @deprecated Prefer checking published project content via agencyProjects.
 * Kept for older call sites during the /work → /projects migration.
 */
export const IS_WORK_NAV_PUBLISHED = true;

const STUDIO_NAV_ITEMS: StudioNavItem[] = [
  { id: "home", label: "Home", path: "/" },
  { id: "services", label: "Services", path: "/services" },
  { id: "projects", label: "Projects", path: "/projects" },
  { id: "about", label: "About", path: "/about" },
  { id: "contact", label: "Contact", path: "/contact" },
];

/** Public header / mobile / footer navigation. */
export function getPublishedStudioNavItems(): StudioNavItem[] {
  return STUDIO_NAV_ITEMS;
}

export function getStudioNavHref(id: StudioNavItemId): string {
  if (id === "work") {
    return "/projects";
  }
  const item = STUDIO_NAV_ITEMS.find((entry) => entry.id === id);
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
  if (normalized === "/contact") {
    return "contact";
  }

  return null;
}

/** Footer Explore column. */
export const FOOTER_EXPLORE_NAV_IDS: StudioNavItemId[] = ["home", "services", "projects"];

/** Footer Company column (Terms is appended separately). */
export const FOOTER_COMPANY_NAV_IDS: StudioNavItemId[] = ["about", "contact"];
