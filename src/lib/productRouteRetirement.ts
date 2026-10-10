/**
 * F9 — retired ADealForge product surfaces.
 *
 * Client-side navigation uses these redirects so Vite preview and SPA deep links
 * match worker 301 behavior in production.
 */

export const PRODUCT_ROUTE_REDIRECTS: Readonly<Record<string, string>> = {
  "/platform": "/services",
  "/workflow": "/services",
};

/** Product landing prefix → agency destination. */
export const PRODUCT_LANDING_REDIRECT = "/services";

export function normalizeAppPath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

/** Resolve a product-era path to its agency replacement, or null if not retired. */
export function resolveProductRouteRedirect(pathname: string): string | null {
  const normalized = normalizeAppPath(pathname);

  if (PRODUCT_ROUTE_REDIRECTS[normalized]) {
    return PRODUCT_ROUTE_REDIRECTS[normalized];
  }

  if (normalized === "/landing" || normalized.startsWith("/landing/")) {
    return PRODUCT_LANDING_REDIRECT;
  }

  return null;
}
