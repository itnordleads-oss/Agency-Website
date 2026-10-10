/**
 * F11 — resolve the public site origin for sitemap/robots generation.
 *
 * Never defaults to adealforge.com or any other guessed production domain.
 * Approved domain is injected at deploy/build via env (same family as VITE_STUDIO_DOMAIN).
 */

/**
 * @returns {string | null} Absolute origin such as `https://example.com`, or null when TBC.
 */
export function resolveSiteOrigin() {
  const candidates = [
    process.env.SITE_ORIGIN,
    process.env.PUBLIC_SITE_ORIGIN,
    process.env.VITE_STUDIO_DOMAIN,
  ];

  for (const raw of candidates) {
    if (typeof raw !== "string") {
      continue;
    }
    const trimmed = raw.trim();
    if (!trimmed) {
      continue;
    }

    let value = trimmed.replace(/\/+$/, "");
    if (!/^https?:\/\//i.test(value)) {
      value = `https://${value}`;
    }

    try {
      const url = new URL(value);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        continue;
      }
      return `${url.protocol}//${url.host}`;
    } catch {
      continue;
    }
  }

  return null;
}

/** Retired product host — must not appear in agency sitemap/robots artifacts. */
export const RETIRED_PRODUCT_HOST = "adealforge.com";
