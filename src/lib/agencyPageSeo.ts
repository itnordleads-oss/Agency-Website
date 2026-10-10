/**
 * F11 — per-route SEO copy for public agency pages.
 *
 * Titles follow: `{Page} — {site name}` for secondary pages, and the approved /
 * provisional home SEO title for `/`. Descriptions stay factual and provisional
 * until leadership-approved page copy lands (F5/F6/F10).
 */

import {
  getSeoDescription,
  getSeoSiteName,
  getSeoTitle,
  LAYOUT_BRAND_FALLBACK,
} from "./studioBranding";
import { IS_WORK_NAV_PUBLISHED } from "./studioNavigation";

export type AgencySeoPageId = "home" | "services" | "about" | "contact" | "terms" | "work";

export type AgencyPageSeo = {
  id: AgencySeoPageId;
  pathname: string;
  title: string;
  description: string;
  /** Whether the route should appear in sitemap / be treated as indexable. */
  indexable: boolean;
};

function pageTitle(pageLabel: string): string {
  return `${pageLabel} — ${getSeoSiteName()}`;
}

/**
 * Public agency routes that belong in the sitemap when indexable.
 * Product routes (`/platform`, `/workflow`, `/landing/*`) are intentionally absent.
 * `/work` is included only when F7 publishes it.
 */
export function getAgencySitemapPathnames(): string[] {
  const paths = ["/", "/services", "/about", "/contact", "/terms"];
  if (IS_WORK_NAV_PUBLISHED) {
    paths.splice(4, 0, "/work");
  }
  return paths;
}

export function getAgencyPageSeo(id: AgencySeoPageId): AgencyPageSeo {
  const siteDescription = getSeoDescription();

  switch (id) {
    case "home":
      return {
        id,
        pathname: "/",
        title: getSeoTitle(),
        description: siteDescription,
        indexable: true,
      };
    case "services":
      return {
        id,
        pathname: "/services",
        title: pageTitle("Services"),
        description:
          "Services offered by the agency. Page content is published here as it is approved.",
        indexable: true,
      };
    case "about":
      return {
        id,
        pathname: "/about",
        title: pageTitle("About"),
        description: "About the agency — background, approach, and how we work with clients.",
        indexable: true,
      };
    case "contact": {
      const siteName = getSeoSiteName();
      const contactTarget = siteName === LAYOUT_BRAND_FALLBACK ? "the agency" : siteName;
      return {
        id,
        pathname: "/contact",
        title: pageTitle("Contact"),
        description: `Contact ${contactTarget} to start a conversation about your project.`,
        indexable: true,
      };
    }
    case "terms":
      return {
        id,
        pathname: "/terms",
        title: pageTitle("Terms"),
        description:
          "Terms & Conditions governing use of this website, inquiries, cookies, acceptable use, and related legal information.",
        indexable: true,
      };
    case "work":
      return {
        id,
        pathname: "/work",
        title: pageTitle("Work"),
        description: "Selected agency work and case studies, when published.",
        indexable: IS_WORK_NAV_PUBLISHED,
      };
    default: {
      const _exhaustive: never = id;
      throw new Error(`Unknown agency SEO page id: ${_exhaustive}`);
    }
  }
}
