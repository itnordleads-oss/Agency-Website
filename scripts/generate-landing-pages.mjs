/**
 * F11 — agency sitemap + robots static SEO artifacts.
 *
 * Product landing HTML generation is retired (F9). This script only refreshes
 * sitemap.xml and robots.txt for indexable agency routes.
 *
 * Canonical host: SITE_ORIGIN / PUBLIC_SITE_ORIGIN / VITE_STUDIO_DOMAIN.
 * When unset, sitemap omits absolute <loc> entries (domain blocker) and robots
 * omits the Sitemap: line — never hardcodes adealforge.com.
 *
 * Run after Vite build: npm run build
 * Standalone: npm run generate:landing
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { RETIRED_PRODUCT_HOST, resolveSiteOrigin } from "./site-origin.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");
const PUBLIC_DIR = path.join(ROOT, "public");
const LANDING_ROOT = path.join(DIST_DIR, "landing");

/** Agency public routes only — no /platform, /workflow, /work (unpublished), or /landing/*. */
const AGENCY_SITEMAP_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "monthly" },
  { path: "/services", priority: "0.9", changefreq: "monthly" },
  { path: "/about", priority: "0.9", changefreq: "monthly" },
  { path: "/contact", priority: "0.9", changefreq: "monthly" },
  { path: "/terms", priority: "0.5", changefreq: "yearly" },
];

function removeRetiredLandingOutput() {
  if (fs.existsSync(LANDING_ROOT)) {
    fs.rmSync(LANDING_ROOT, { recursive: true, force: true });
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function buildSitemapXml(siteOrigin) {
  const today = new Date().toISOString().slice(0, 10);

  if (!siteOrigin) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!--
    F11: SITE_ORIGIN / PUBLIC_SITE_ORIGIN / VITE_STUDIO_DOMAIN is not configured.
    Absolute loc entries are omitted until a leadership-approved public domain
    is provided. Do not default to any retired product host.
    Indexable agency paths (for when origin is set): ${AGENCY_SITEMAP_ROUTES.map((r) => r.path).join(", ")}
  -->
</urlset>
`;
  }

  const body = AGENCY_SITEMAP_ROUTES.map((entry) => {
    const loc = entry.path === "/" ? `${siteOrigin}/` : `${siteOrigin}${entry.path}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function buildRobotsTxt(siteOrigin) {
  const lines = ["User-agent: *", "Allow: /", ""];

  if (siteOrigin) {
    lines.push(`Sitemap: ${siteOrigin}/sitemap.xml`);
    lines.push("");
  } else {
    lines.push(
      `# Sitemap absolute URL is written at build time when SITE_ORIGIN,`,
      `# PUBLIC_SITE_ORIGIN, or VITE_STUDIO_DOMAIN is configured.`,
      `# Do not reference any retired product host or unapproved domain.`,
      ""
    );
  }

  return `${lines.join("\n")}`;
}

function assertNoRetiredProductHost(content, label) {
  if (new RegExp(RETIRED_PRODUCT_HOST.replace(/\./g, "\\."), "i").test(content)) {
    throw new Error(
      `Refusing to write ${label} that references ${RETIRED_PRODUCT_HOST} (retired product domain).`
    );
  }
}

function writeArtifacts() {
  ensureDir(DIST_DIR);
  ensureDir(PUBLIC_DIR);

  const siteOrigin = resolveSiteOrigin();
  if (siteOrigin && new RegExp(RETIRED_PRODUCT_HOST.replace(/\./g, "\\."), "i").test(siteOrigin)) {
    throw new Error(`SITE_ORIGIN must not be ${RETIRED_PRODUCT_HOST} for the Agency Website.`);
  }

  const sitemap = buildSitemapXml(siteOrigin);
  const robots = buildRobotsTxt(siteOrigin);

  assertNoRetiredProductHost(sitemap, "sitemap.xml");
  assertNoRetiredProductHost(robots, "robots.txt");

  fs.writeFileSync(path.join(DIST_DIR, "sitemap.xml"), sitemap, "utf8");
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), sitemap, "utf8");
  fs.writeFileSync(path.join(DIST_DIR, "robots.txt"), robots, "utf8");
  fs.writeFileSync(path.join(PUBLIC_DIR, "robots.txt"), robots, "utf8");

  return siteOrigin;
}

function main() {
  removeRetiredLandingOutput();
  const siteOrigin = writeArtifacts();
  console.log("F11: skipped product landing page generation (retired).");
  if (siteOrigin) {
    console.log(`Updated agency sitemap.xml + robots.txt for origin ${siteOrigin}`);
  } else {
    console.log(
      "Updated agency sitemap.xml + robots.txt (SITE_ORIGIN unset — absolute URLs omitted; domain blocker)."
    );
  }
}

main();
