/**
 * F3 — Development Studio public navigation.
 *
 * English chrome labels only. Full localized nav copy remains F10.
 * `/work` stays unpublished until F7 content is approved for publication.
 * Product routes (`/platform`, `/workflow`, product pricing) are retired in F9
 * (redirect to agency destinations) and are not listed in the public studio navbar.
 */

export type StudioNavItemId = "home" | "services" | "about" | "work" | "contact";

export type StudioNavItem = {
  id: StudioNavItemId;
  label: string;
  path: string;
};

/** Flip to `true` only when F7 work/case-study content is approved to publish. */
export const IS_WORK_NAV_PUBLISHED = false;

const STUDIO_NAV_ITEMS: StudioNavItem[] = [
  { id: "home", label: "Home", path: "/" },
  { id: "services", label: "Services", path: "/services" },
  { id: "about", label: "About", path: "/about" },
  { id: "work", label: "Work", path: "/work" },
  { id: "contact", label: "Contact", path: "/contact" },
];

/** Public header / mobile / footer navigation (Work omitted while unpublished). */
export function getPublishedStudioNavItems(): StudioNavItem[] {
  return STUDIO_NAV_ITEMS.filter((item) => item.id !== "work" || IS_WORK_NAV_PUBLISHED);
}

export function getStudioNavHref(id: StudioNavItemId): string {
  const item = STUDIO_NAV_ITEMS.find((entry) => entry.id === id);
  return item?.path ?? "/";
}

export function resolveActiveStudioNavId(path: string): StudioNavItemId | null {
  const normalized = path.replace(/\/+$/, "") || "/";

  if (normalized === "/") {
    return "home";
  }
  if (normalized === "/services") {
    return "services";
  }
  if (normalized === "/about") {
    return "about";
  }
  if (normalized === "/work" && IS_WORK_NAV_PUBLISHED) {
    return "work";
  }
  if (normalized === "/contact") {
    return "contact";
  }

  return null;
}

/** Footer Explore column. */
export const FOOTER_EXPLORE_NAV_IDS: StudioNavItemId[] = ["home", "services"];

/** Footer Company column (Terms is appended separately). */
export const FOOTER_COMPANY_NAV_IDS: StudioNavItemId[] = ["about", "contact"];
