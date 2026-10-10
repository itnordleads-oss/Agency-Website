/**
 * F9 — product landing pages are retired.
 *
 * Previously generated static ADealForge SEO landings under dist/landing/{slug}/.
 * Those surfaces redirect to /services (worker 301 + SPA resolvePublicPath).
 * This script now only refreshes the agency sitemap (no product landing HTML).
 *
 * Run after Vite build: npm run build
 * Standalone: npm run generate:landing
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SITE_ORIGIN } from "./landing-pages-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");
const LANDING_ROOT = path.join(DIST_DIR, "landing");

function removeRetiredLandingOutput() {
  if (fs.existsSync(LANDING_ROOT)) {
    fs.rmSync(LANDING_ROOT, { recursive: true, force: true });
  }
}

function updateSitemap() {
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  const today = new Date().toISOString().slice(0, 10);
  /** Agency public routes only — no product /platform, /workflow, or /landing/*. */
  const staticUrls = [
    { loc: `${SITE_ORIGIN}/`, priority: "1.0", changefreq: "monthly" },
    { loc: `${SITE_ORIGIN}/services`, priority: "0.9", changefreq: "monthly" },
    { loc: `${SITE_ORIGIN}/about`, priority: "0.9", changefreq: "monthly" },
    { loc: `${SITE_ORIGIN}/contact`, priority: "0.9", changefreq: "monthly" },
    { loc: `${SITE_ORIGIN}/terms`, priority: "0.5", changefreq: "yearly" },
  ];

  const body = staticUrls
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

  fs.writeFileSync(path.join(DIST_DIR, "sitemap.xml"), sitemap, "utf8");
  fs.writeFileSync(path.join(ROOT, "public", "sitemap.xml"), sitemap, "utf8");
}

function main() {
  removeRetiredLandingOutput();
  updateSitemap();
  console.log("F9: skipped product landing page generation (retired → /services).");
  console.log("Updated agency sitemap.xml (dist + public)");
}

main();
