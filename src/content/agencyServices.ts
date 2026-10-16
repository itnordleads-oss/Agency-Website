/**
 * Approved agency service catalog (homepage + detail route ids).
 * Do not invent additional services beyond this list.
 */

export const AGENCY_SERVICE_IDS = [
  "software-development",
  "website-development",
  "mobile-app-development",
  "shopify-stores",
  "wordpress-websites",
  "custom-wordpress-theme-development",
] as const;

export type AgencyServiceId = (typeof AGENCY_SERVICE_IDS)[number];

export function isAgencyServiceId(value: string): value is AgencyServiceId {
  return (AGENCY_SERVICE_IDS as readonly string[]).includes(value);
}

export function getAgencyServicePath(id: AgencyServiceId): string {
  return `/services/${id}`;
}
