/**
 * Shared sitemap/robots content validators.
 * Used by both the pre-release artifact check (scripts/check-release-seo.mjs)
 * and the post-deploy production smoke check (scripts/check-production-smoke.mjs)
 * so both enforce one consistent contract.
 * Pure functions: they return findings and never exit or print.
 */

import fs from "fs";
import path from "path";

const FORBIDDEN_HOST_PATTERN = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[?::1\]?)$/i;
const FORBIDDEN_HOST_SUFFIX = /\.(workers\.dev|pages\.dev)$/i;
const STAGING_HOST_PATTERN = /(^|[.-])staging[.-]/i;

export function isForbiddenHostname(hostname) {
  return (
    FORBIDDEN_HOST_PATTERN.test(hostname) ||
    FORBIDDEN_HOST_SUFFIX.test(hostname) ||
    STAGING_HOST_PATTERN.test(hostname)
  );
}

/** Product surfaces excluded from agency sitemap until F9 redirects remove them. */
export const SITEMAP_EXCLUDED_SPA_ROUTES = new Set(["/platform", "/workflow"]);

/** SPA routes are derived from App.tsx page guards so a routing refactor fails loudly. */
export function getExpectedSpaRoutes(rootDir) {
  const appSource = fs.readFileSync(path.join(rootDir, "src", "App.tsx"), "utf8");
  const routes = new Set(["/"]);
  for (const match of appSource.matchAll(/is\w+Page\s*=\s*path\s*===\s*"(\/[^"]*)"/g)) {
    routes.add(match[1]);
  }
  if (routes.size < 2) {
    throw new Error(
      "Could not derive SPA routes from src/App.tsx — route extraction found only `/`."
    );
  }
  return routes;
}

/** Indexable agency SPA routes for sitemap expectations. */
export function getIndexableSpaRoutes(rootDir) {
  const routes = getExpectedSpaRoutes(rootDir);
  for (const excluded of SITEMAP_EXCLUDED_SPA_ROUTES) {
    routes.delete(excluded);
  }
  return routes;
}

/**
 * Expected sitemap URLs. When `siteOrigin` is null (domain TBC), returns empty set.
 */
export function getExpectedSitemapUrls(spaRoutes, siteOrigin, landingPages = []) {
  const expected = new Set();
  if (!siteOrigin) {
    return expected;
  }
  for (const route of spaRoutes) {
    if (SITEMAP_EXCLUDED_SPA_ROUTES.has(route)) {
      continue;
    }
    expected.add(route === "/" ? `${siteOrigin}/` : `${siteOrigin}${route}`);
  }
  for (const page of landingPages) {
    expected.add(`${siteOrigin}/landing/${page.slug}/`);
  }
  return expected;
}

/**
 * Validates sitemap XML content. `label` prefixes findings (e.g. "dist/sitemap.xml"
 * vs "production /sitemap.xml"). Returns { failures, warnings, urls }.
 */
export function validateSitemapContent(xml, { label, productionHost, expectedUrls }) {
  const failures = [];
  const warnings = [];

  if (!xml.trim()) {
    failures.push(`${label} is empty.`);
    return { failures, warnings, urls: [], routeSetFailures: [] };
  }

  if (/&(?!amp;|lt;|gt;|quot;|apos;|#)/.test(xml)) {
    failures.push(`${label} contains an unescaped \`&\` — not well-formed XML.`);
  }

  const withoutDecl = xml.replace(/<\?xml[^?]*\?>/, "");
  const stack = [];
  let xmlError = null;
  for (const match of withoutDecl.matchAll(
    /<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g
  )) {
    const [, closing, tag, attrs] = match;
    const selfClosing = attrs.trimEnd().endsWith("/");
    if (!closing && !selfClosing) {
      stack.push(tag);
    } else if (closing) {
      const open = stack.pop();
      if (open !== tag) {
        xmlError = `mismatched tag: expected </${open ?? "?"}> but found </${tag}>`;
        break;
      }
    }
  }
  if (!xmlError && stack.length > 0) {
    xmlError = `unclosed tag(s): <${stack.join(">, <")}>`;
  }
  if (xmlError) {
    failures.push(`${label} is not well-formed XML: ${xmlError}.`);
    return { failures, warnings, urls: [], routeSetFailures: [] };
  }
  if (!/<urlset[^>]*xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/.test(xml)) {
    failures.push(`${label} <urlset> is missing the sitemap 0.9 xmlns declaration.`);
  }

  if (/adealforge\.com/i.test(xml)) {
    failures.push(
      `${label} must not reference adealforge.com (retired product domain; configure SITE_ORIGIN instead).`
    );
  }

  const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 0) {
    if (!productionHost) {
      warnings.push(
        `${label} contains no <loc> entries — expected while SITE_ORIGIN is unset (domain blocker).`
      );
      return { failures, warnings, urls: [], routeSetFailures: [] };
    }
    failures.push(`${label} contains no <loc> entries.`);
    return { failures, warnings, urls: [], routeSetFailures: [] };
  }

  const seen = new Set();
  for (const loc of locs) {
    let url;
    try {
      url = new URL(loc);
    } catch {
      failures.push(`${label} has a malformed <loc>: ${loc}`);
      continue;
    }
    if (url.protocol !== "https:") {
      failures.push(`${label} <loc> is not HTTPS: ${loc}`);
    }
    if (url.hostname !== productionHost) {
      failures.push(`${label} <loc> is not on the production host: ${loc}`);
    } else if (isForbiddenHostname(url.hostname)) {
      failures.push(`${label} <loc> uses a local/staging/preview host: ${loc}`);
    }
    if (url.search || url.hash) {
      failures.push(`${label} <loc> must not contain query/fragment: ${loc}`);
    }
    if (url.pathname.includes("//")) {
      failures.push(`${label} <loc> has an unnormalized path: ${loc}`);
    }
    if (url.pathname !== "/" && url.pathname !== url.pathname.toLowerCase()) {
      failures.push(`${label} <loc> has a non-normalized (uppercase) path: ${loc}`);
    }
    const isLanding = url.pathname.startsWith("/landing/");
    if (isLanding && !url.pathname.endsWith("/")) {
      failures.push(`${label} landing URL must keep its trailing slash: ${loc}`);
    }
    if (!isLanding && url.pathname.length > 1 && url.pathname.endsWith("/")) {
      failures.push(`${label} SPA route must not have a trailing slash: ${loc}`);
    }
    if (seen.has(loc)) {
      failures.push(`${label} contains a duplicate URL: ${loc}`);
    }
    seen.add(loc);
  }

  const routeSetFailures = [];
  if (expectedUrls) {
    for (const url of expectedUrls) {
      if (!seen.has(url)) {
        routeSetFailures.push(`${label} is missing an expected route: ${url}`);
      }
    }
    for (const loc of seen) {
      if (!expectedUrls.has(loc)) {
        routeSetFailures.push(
          `${label} contains an unexpected URL not matching any project route: ${loc}`
        );
      }
    }
    failures.push(...routeSetFailures);
  }

  const lastmods = [...xml.matchAll(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/g)].map((m) => m[1]);
  const today = new Date().toISOString().slice(0, 10);
  for (const value of lastmods) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) {
      failures.push(`${label} has an invalid <lastmod> date: ${value}`);
    }
  }
  if (lastmods.length > 0 && lastmods.every((value) => value === today)) {
    warnings.push(
      `${label}: every <lastmod> equals today's date — known defect: lastmod is regenerated per build instead of reflecting content changes.`
    );
  }

  return { failures, warnings, urls: [...seen], routeSetFailures };
}

/**
 * Minimal baseline persistence shared by .mjs release scripts.
 * Same entry contract as e2e/release/baseline.ts (id, route, reason, ticket, expires).
 * An entry id ending in `*` matches by prefix.
 */
export function loadBaseline(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return Array.isArray(parsed.entries) ? parsed.entries : [];
}

export function isBaselineEntryExpired(entry, today = new Date()) {
  const expiry = Date.parse(`${entry.expires}T23:59:59Z`);
  return Number.isNaN(expiry) || expiry < today.getTime();
}

export function findBaselineEntry(entries, id) {
  return entries.find((entry) => {
    if (entry.id.endsWith("*")) {
      return id.startsWith(entry.id.slice(0, -1));
    }
    return entry.id === id;
  });
}

/**
 * True only when a `Disallow: /` rule applies to `User-agent: *`.
 * Per-bot blocks (e.g. Cloudflare's managed AI-crawler rules with
 * `User-agent: GPTBot` + `Disallow: /`) do not block the site and must not
 * be flagged.
 */
function hasGlobalDisallowAll(text) {
  const groups = text.split(/\r?\n\s*\r?\n/);
  for (const group of groups) {
    const lines = group
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
    const agents = lines
      .filter((line) => /^user-agent:/i.test(line))
      .map((line) => line.split(":")[1].trim().toLowerCase());
    if (!agents.includes("*")) {
      continue;
    }
    for (const line of lines) {
      if (/^disallow:\s*\/\s*$/i.test(line)) {
        return true;
      }
    }
  }
  return false;
}

/** Validates robots.txt content. Returns { failures }. */
export function validateRobotsContent(text, { label, siteOrigin }) {
  const failures = [];

  if (!text.trim()) {
    failures.push(`${label} is empty.`);
    return { failures };
  }
  if (hasGlobalDisallowAll(text)) {
    failures.push(
      `${label} contains \`Disallow: /\` for User-agent * — this would block the entire production site.`
    );
  }
  if (/adealforge\.com/i.test(text)) {
    failures.push(
      `${label} must not reference adealforge.com (retired product domain; configure SITE_ORIGIN instead).`
    );
  }
  if (siteOrigin) {
    const expectedSitemap = `Sitemap: ${siteOrigin}/sitemap.xml`;
    if (
      !new RegExp(
        `^\\s*Sitemap:\\s*${siteOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap\\.xml\\s*$`,
        "im"
      ).test(text)
    ) {
      failures.push(`${label} does not reference the production sitemap URL (${expectedSitemap}).`);
    }
  } else if (/^\s*Sitemap:\s*https?:\/\//im.test(text)) {
    failures.push(
      `${label} declares an absolute Sitemap URL while SITE_ORIGIN is unset — remove it or configure an approved origin.`
    );
  }
  for (const line of text.split(/\r?\n/)) {
    const urlMatch = line.match(/https?:\/\/([^\s/]+)/i);
    if (urlMatch && isForbiddenHostname(urlMatch[1])) {
      failures.push(`${label} references a local/staging/preview host: ${line.trim()}`);
    }
  }
  return { failures };
}
