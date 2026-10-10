/**
 * F14 — resolve the public site origin for sitemap/robots and release checks.
 *
 * Never defaults to adealforge.com or any guessed production domain.
 * Set SITE_ORIGIN, PUBLIC_SITE_ORIGIN, or VITE_STUDIO_DOMAIN at build/deploy time.
 */

/** Retired product host — must not be used as the Agency Website origin. */
export const RETIRED_PRODUCT_HOST = "adealforge.com";

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
      const origin = `${url.protocol}//${url.host}`;
      if (url.hostname.replace(/^www\./i, "").toLowerCase() === RETIRED_PRODUCT_HOST) {
        throw new Error(`SITE_ORIGIN must not be ${RETIRED_PRODUCT_HOST} for the Agency Website.`);
      }
      return origin;
    } catch (error) {
      if (error instanceof Error && error.message.includes(RETIRED_PRODUCT_HOST)) {
        throw error;
      }
      continue;
    }
  }

  return null;
}
