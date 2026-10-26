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

export type AgencySeoPageId =
  "home" | "services" | "about" | "careers" | "contact" | "terms" | "projects" | "work";

export type AgencyPageSeo = {
  id: AgencySeoPageId;
  pathname: string;
  title: string;
  description: string;
  /** Optional Open Graph description when it differs from the meta description. */
  ogDescription?: string;
  /** Optional Twitter description when it differs from the meta description. */
  twitterDescription?: string;
  /** Whether the route should appear in sitemap / be treated as indexable. */
  indexable: boolean;
};

function pageTitle(pageLabel: string): string {
  return `${pageLabel} | ${getSeoSiteName()}`;
}

/**
 * Public agency routes that belong in the sitemap when indexable.
 * Product routes (`/platform`, `/workflow`, `/landing/*`) are intentionally absent.
 */
export function getAgencySitemapPathnames(): string[] {
  return ["/", "/services", "/about", "/careers", "/projects", "/contact", "/terms"];
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
        ogDescription:
          "Custom software, websites, mobile apps, Shopify stores, and WordPress development built through a clear and practical process.",
        twitterDescription:
          "Custom software and digital product development for teams that need clear, practical delivery.",
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
    case "careers":
      return {
        id,
        pathname: "/careers",
        title: pageTitle("Careers"),
        description:
          "Careers at the agency: future opportunities, studio working style, and how to get in touch.",
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
    case "projects":
      return {
        id,
        pathname: "/projects",
        title: pageTitle("Projects"),
        description:
          "Portfolio of software, website, mobile, Shopify, and WordPress project concepts and selected work.",
        indexable: true,
      };
    case "work":
      // Legacy SEO id — canonical portfolio is /projects.
      return {
        id,
        pathname: "/projects",
        title: pageTitle("Projects"),
        description:
          "Portfolio of software, website, mobile, Shopify, and WordPress project concepts and selected work.",
        indexable: true,
      };
    default: {
      const _exhaustive: never = id;
      throw new Error(`Unknown agency SEO page id: ${_exhaustive}`);
    }
  }
}
