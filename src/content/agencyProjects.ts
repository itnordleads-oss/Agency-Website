/**
 * Agency Projects / Portfolio content.
 *
 * Publication rule:
 * - Only items with `published: true` may appear on /projects.
 * - Do NOT invent clients, projects, metrics, screenshots, or URLs.
 * - Leadership-approved projects are added here when provided.
 *
 * Current state: no approved projects → /projects stays unpublished (nav hidden).
 */

export const AGENCY_PROJECT_CATEGORIES = [
  "software",
  "websites",
  "mobile",
  "shopify",
  "wordpress",
] as const;

export type AgencyProjectCategory = (typeof AGENCY_PROJECT_CATEGORIES)[number];

export type AgencyProjectGalleryItem = {
  src: string;
  alt: string;
};

export type AgencyProject = {
  slug: string;
  title: string;
  shortDescription: string;
  summary: string;
  category: AgencyProjectCategory;
  /** Service labels shown on cards/detail (approved names only). */
  services?: string[];
  /** Verified technology labels only — omit when unknown. */
  technologies?: string[];
  /** Path under /public or approved asset URL. */
  thumbnail?: string;
  thumbnailAlt?: string;
  gallery?: AgencyProjectGalleryItem[];
  challenge?: string;
  solution?: string;
  whatWeBuilt?: string[];
  /** Factual delivery summary only — never invent metrics. */
  outcome?: string;
  /** Live project URL only when a real public URL exists. */
  projectUrl?: string;
  /** Optional overview facts — omit empty placeholders. */
  projectType?: string;
  platform?: string;
  status?: string;
  featured?: boolean;
  published: boolean;
};

/**
 * Source list for portfolio projects.
 * Keep unpublished drafts out of this array, or set published: false.
 * Empty until leadership supplies approved case studies.
 */
export const AGENCY_PROJECTS: AgencyProject[] = [];

export const PROJECT_CATEGORY_LABELS: Record<AgencyProjectCategory, string> = {
  software: "Software",
  websites: "Websites",
  mobile: "Mobile",
  shopify: "Shopify",
  wordpress: "WordPress",
};
