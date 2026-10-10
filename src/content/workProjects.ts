/**
 * Agency Work / Case Studies content (F7).
 *
 * Publication rule:
 * - Only items with `published: true` may render on the public /work page.
 * - Do NOT invent clients, projects, metrics, or screenshots.
 * - Leadership-approved projects are added here when provided.
 *
 * Current state: no approved projects → /work stays unpublished.
 */

export type WorkProject = {
  slug: string;
  title: string;
  /** Public client name only when leadership approved. */
  client?: string;
  industry?: string;
  summary: string;
  challenge?: string;
  solution?: string;
  services?: string[];
  technologies?: string[];
  /** Qualitative or quantitative outcomes only when verified/approved. */
  outcome?: string;
  /** Path under /public or approved asset URL. */
  image?: string;
  imageAlt?: string;
  published: boolean;
};

/**
 * Source list for Work projects.
 * Keep unpublished drafts out of this array, or set published: false.
 * Empty until leadership supplies approved case studies.
 */
export const WORK_PROJECTS: WorkProject[] = [];
