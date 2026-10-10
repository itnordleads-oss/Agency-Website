/**
 * Release SEO & link validation — validates the built dist/ artifact.
 * Covers sitemap, robots.txt, static/generated-page SEO tags, and static links.
 * Rendered SPA metadata is intentionally out of scope (covered by Playwright in a later phase).
 * Run after npm run build: node scripts/check-release-seo.mjs
 * Exits non-zero on deterministic failures; external-link and known-debt findings are warnings.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { INDEXABLE_LANDING_PAGES, SITE_ORIGIN } from "./landing-pages-data.mjs";
import {
  getExpectedSitemapUrls,
  getIndexableSpaRoutes,
  isForbiddenHostname,
  validateRobotsContent,
  validateSitemapContent,
} from "./lib/release-validation.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");

const PRODUCTION_HOST = SITE_ORIGIN ? new URL(SITE_ORIGIN).hostname : null;

const failures = [];
const warnings = [];
const stats = { pagesChecked: 0, internalLinks: 0, externalLinks: 0 };

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function getAttr(tag, name) {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i"));
  return match ? match[1].trim() : null;
}

function readExpectedSpaRoutes() {
  try {
    return getIndexableSpaRoutes(ROOT);
  } catch (error) {
    fail(error.message);
    return new Set(["/"]);
  }
}

function validateSitemap(spaRoutes) {
  const sitemapPath = path.join(DIST_DIR, "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    fail("dist/sitemap.xml is missing.");
    return;
  }
  const result = validateSitemapContent(fs.readFileSync(sitemapPath, "utf8"), {
    label: "dist/sitemap.xml",
    productionHost: PRODUCTION_HOST,
    expectedUrls: getExpectedSitemapUrls(spaRoutes, SITE_ORIGIN, INDEXABLE_LANDING_PAGES),
  });
  result.failures.forEach(fail);
  result.warnings.forEach(warn);
}

function validateRobots() {
  const robotsPath = path.join(DIST_DIR, "robots.txt");
  if (!fs.existsSync(robotsPath)) {
    fail("dist/robots.txt is missing.");
    return;
  }
  const result = validateRobotsContent(fs.readFileSync(robotsPath, "utf8"), {
    label: "dist/robots.txt",
    siteOrigin: SITE_ORIGIN,
  });
  result.failures.forEach(fail);
}

function getStaticHtmlPages() {
  const pages = [];
  const indexPath = path.join(DIST_DIR, "index.html");
  if (fs.existsSync(indexPath)) {
    pages.push({ file: indexPath, label: "index.html", isSpaShell: true });
  }
  // Product landing HTML is retired (F9/F11). Presence of dist/landing is a failure.
  const landingRoot = path.join(DIST_DIR, "landing");
  if (fs.existsSync(landingRoot)) {
    fail("dist/landing/ must not ship — product landing pages are retired from the agency site.");
  }
  for (const page of INDEXABLE_LANDING_PAGES) {
    const file = path.join(DIST_DIR, "landing", page.slug, "index.html");
    if (fs.existsSync(file)) {
      pages.push({ file, label: `landing/${page.slug}/index.html`, isSpaShell: false });
    } else {
      fail(`Generated landing page is missing from dist/: landing/${page.slug}/index.html`);
    }
  }
  return pages;
}

function validatePageSeo(page) {
  const html = fs.readFileSync(page.file, "utf8");
  const label = page.label;

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleMatch) {
    fail(`${label}: missing <title>.`);
  } else if (!titleMatch[1].trim()) {
    fail(`${label}: <title> is empty.`);
  }

  const metaTags = html.match(/<meta\s[^>]*>/gi) ?? [];
  const metaBy = (attr, value) =>
    metaTags.filter((tag) => getAttr(tag, attr)?.toLowerCase() === value);

  const descriptions = metaBy("name", "description");
  if (descriptions.length === 0) {
    fail(`${label}: missing meta description.`);
  } else if (!getAttr(descriptions[0], "content")) {
    fail(`${label}: meta description is empty.`);
  }

  const robotsMeta = metaBy("name", "robots");
  for (const tag of robotsMeta) {
    if (/noindex/i.test(getAttr(tag, "content") ?? "")) {
      fail(`${label}: accidental noindex in meta robots.`);
    }
  }

  const canonicalTags = (html.match(/<link\s[^>]*rel="canonical"[^>]*>/gi) ?? []).concat(
    html.match(/<link\s[^>]*canonical[^>]*>/gi) ?? []
  );
  const uniqueCanonicals = [...new Set(canonicalTags)];
  if (uniqueCanonicals.length === 0) {
    fail(`${label}: missing canonical link.`);
  } else {
    if (uniqueCanonicals.length > 1) {
      fail(`${label}: duplicate canonical tags (${uniqueCanonicals.length}).`);
    }
    const href = getAttr(uniqueCanonicals[0], "href");
    if (!href) {
      fail(`${label}: canonical tag has no href.`);
    } else if (href.startsWith("/") && page.isSpaShell && !PRODUCTION_HOST) {
      // F11: path-only canonical while public domain remains TBC.
    } else {
      try {
        const url = new URL(href, SITE_ORIGIN || undefined);
        if (href.startsWith("http") && url.protocol !== "https:") {
          fail(`${label}: canonical is not HTTPS: ${href}`);
        }
        if (PRODUCTION_HOST && href.startsWith("http") && url.hostname !== PRODUCTION_HOST) {
          fail(`${label}: canonical points off the production host: ${href}`);
        } else if (href.startsWith("http") && isForbiddenHostname(url.hostname)) {
          fail(`${label}: canonical uses a local/staging/preview host: ${href}`);
        }
        if (/adealforge\.com/i.test(href)) {
          fail(`${label}: canonical must not use retired product host adealforge.com.`);
        }
      } catch {
        fail(`${label}: canonical href is malformed: ${href}`);
      }
    }
  }

  const requiredOg = page.isSpaShell
    ? ["og:title", "og:description"]
    : ["og:title", "og:description", "og:url", "og:image"];
  for (const property of requiredOg) {
    const tags = metaBy("property", property);
    if (tags.length === 0) {
      fail(`${label}: missing ${property}.`);
      continue;
    }
    const content = getAttr(tags[0], "content");
    if (!content) {
      fail(`${label}: ${property} is empty.`);
      continue;
    }
    if (/adealforge/i.test(content)) {
      fail(`${label}: ${property} still references ADealForge product branding.`);
    }
    if (property === "og:url" || property === "og:image") {
      try {
        const url = new URL(content);
        if (url.protocol !== "https:") {
          fail(`${label}: ${property} is not HTTPS: ${content}`);
        }
        if (isForbiddenHostname(url.hostname)) {
          fail(`${label}: ${property} uses a local/staging/preview host: ${content}`);
        }
      } catch {
        fail(`${label}: ${property} is malformed: ${content}`);
      }
    }
  }

  const ogImage = getAttr(metaBy("property", "og:image")[0] ?? "", "content");
  if (ogImage) {
    try {
      const url = new URL(ogImage);
      if (url.hostname === PRODUCTION_HOST) {
        const imagePath = path.join(DIST_DIR, decodeURIComponent(url.pathname));
        if (!fs.existsSync(imagePath)) {
          warn(
            `${label}: referenced OG image ${url.pathname} is missing from dist/ — known existing website defect.`
          );
        }
      }
    } catch {
      // malformed og:image already reported above
    }
  }

  const jsonLdBlocks = [
    ...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi),
  ];
  // F11: Organization/WebSite JSON-LD is omitted from the SPA shell until
  // legal name, domain, logo, and contact are leadership-approved (F2 TBC).
  if (jsonLdBlocks.length === 0 && !page.isSpaShell) {
    fail(`${label}: missing JSON-LD structured data.`);
  }
  for (const block of jsonLdBlocks) {
    try {
      const data = JSON.parse(block[1]);
      if (!data["@context"]) {
        fail(`${label}: JSON-LD block is missing @context.`);
      }
      const serialized = JSON.stringify(data);
      if (/aggregateRating|reviewRating|"@type"\s*:\s*"Review"/i.test(serialized)) {
        fail(`${label}: JSON-LD must not include review/rating schema without approved reviews.`);
      }
    } catch {
      fail(`${label}: JSON-LD block is not valid JSON.`);
    }
  }

  // The SPA shell renders its heading client-side; the H1 check only applies to
  // fully static generated pages.
  if (!page.isSpaShell) {
    const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
    if (h1Count === 0) {
      fail(`${label}: missing primary <h1>.`);
    } else if (h1Count > 1) {
      fail(`${label}: multiple <h1> elements (${h1Count}).`);
    }
  }

  stats.pagesChecked += 1;
}

function resolveInternalTarget(urlPath) {
  if (urlPath === "/") {
    return fs.existsSync(path.join(DIST_DIR, "index.html"));
  }
  return fs.existsSync(path.join(DIST_DIR, urlPath));
}

async function validateLinks(pages, spaRoutes) {
  const landingPathSet = new Set(INDEXABLE_LANDING_PAGES.map((page) => `/landing/${page.slug}/`));
  const external = new Map();

  for (const page of pages) {
    const html = fs.readFileSync(page.file, "utf8");
    const references = [...html.matchAll(/(?:href|src)\s*=\s*"([^"]+)"/g)].map((m) => m[1]);

    for (const reference of references) {
      const value = reference.trim();
      if (!value || value.startsWith("#")) {
        continue;
      }
      if (/^(mailto|tel|data|javascript):/i.test(value)) {
        continue;
      }

      let url = null;
      if (/^https?:\/\//i.test(value)) {
        try {
          url = new URL(value);
        } catch {
          fail(`${page.label}: malformed URL reference: ${value}`);
          continue;
        }
        if (isForbiddenHostname(url.hostname)) {
          fail(`${page.label}: local/staging/preview link target: ${value}`);
          continue;
        }
        if (url.hostname !== PRODUCTION_HOST) {
          if (!external.has(value)) {
            external.set(value, page.label);
          }
          continue;
        }
      } else if (value.startsWith("//")) {
        fail(`${page.label}: protocol-relative URL is not allowed: ${value}`);
        continue;
      } else if (!value.startsWith("/")) {
        fail(`${page.label}: unexpected relative link (static pages use absolute paths): ${value}`);
        continue;
      }

      const pathPart = (url ? url.pathname : value.split(/[?#]/)[0]) || "/";
      if (/\s/.test(pathPart)) {
        fail(`${page.label}: malformed internal URL (whitespace): ${value}`);
        continue;
      }
      stats.internalLinks += 1;

      const isSpaRoute = spaRoutes.has(pathPart);
      const isLandingPage = landingPathSet.has(pathPart);
      const isDistFile = resolveInternalTarget(pathPart);
      if (!isSpaRoute && !isLandingPage && !isDistFile) {
        fail(`${page.label}: broken internal link: ${value}`);
      }
    }
  }

  for (const [url, source] of external) {
    stats.externalLinks += 1;
    const ok = await probeExternalUrl(url);
    if (!ok) {
      warn(`External link unreachable from CI (non-blocking): ${url} (referenced in ${source})`);
    }
  }
}

async function probeExternalUrl(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(url, {
        method,
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "adealforge-release-link-check" },
      });
      clearTimeout(timer);
      if (response.status < 400) {
        return true;
      }
    } catch {
      // try next method, then report as warning
    }
  }
  return false;
}

function writeStepSummary() {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    return;
  }
  const lines = [
    "## Pre-release SEO & links",
    "",
    `- Static pages checked: ${stats.pagesChecked}`,
    `- Internal links checked: ${stats.internalLinks}`,
    `- External links checked: ${stats.externalLinks}`,
    `- Warnings: ${warnings.length}`,
    `- Failures: ${failures.length}`,
    "",
  ];
  if (failures.length > 0) {
    lines.push("### Failures", ...failures.map((f) => `- ${f}`), "");
  }
  if (warnings.length > 0) {
    lines.push("### Warnings", ...warnings.map((w) => `- ${w}`), "");
  }
  fs.appendFileSync(summaryPath, lines.join("\n"));
}

async function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error("FAIL: dist/ does not exist — run `npm run build` first.");
    process.exit(1);
  }

  const spaRoutes = readExpectedSpaRoutes();
  validateSitemap(spaRoutes);
  validateRobots();
  const pages = getStaticHtmlPages();
  for (const page of pages) {
    validatePageSeo(page);
  }
  await validateLinks(pages, spaRoutes);

  for (const message of warnings) {
    console.warn(`WARNING: ${message}`);
  }
  for (const message of failures) {
    console.error(`FAIL: ${message}`);
  }

  console.log(
    `\nChecked ${stats.pagesChecked} static pages, ${stats.internalLinks} internal links, ${stats.externalLinks} external links.`
  );
  writeStepSummary();

  if (failures.length > 0) {
    console.error(`Release SEO validation: ${failures.length} blocking problem(s) found.`);
    process.exit(1);
  }
  console.log("Release SEO validation: all checks passed.");
}

await main();
