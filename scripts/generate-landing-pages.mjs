/**
 * Programmatic SEO — generates static landing pages into dist/landing/{slug}/index.html
 * Run after Vite build: npm run build
 * Standalone: npm run generate:landing
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  CONTACT_PATH,
  HOME_PATH,
  SITE_ORIGIN,
  TERMS_PATH,
  landingPages,
} from "./landing-pages-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");
const LANDING_ROOT = path.join(DIST_DIR, "landing");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderSection(section) {
  const heading = `<h2>${escapeHtml(section.heading)}</h2>`;
  const body = section.body ? `<p>${escapeHtml(section.body)}</p>` : "";
  const bullets =
    section.bullets && section.bullets.length > 0
      ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      : "";

  return `<section class="lp-section">${heading}${body}${bullets}</section>`;
}

function renderRelatedLinks(page, pagesBySlug) {
  const slugs = page.relatedSlugs ?? [];
  if (slugs.length === 0) {
    return "";
  }

  const links = slugs
    .map((slug) => pagesBySlug.get(slug))
    .filter(Boolean)
    .map(
      (related) =>
        `<li><a href="${SITE_ORIGIN}/landing/${related.slug}/">${escapeHtml(related.h1)}</a></li>`
    )
    .join("");

  return `<aside class="lp-related" aria-label="Related pages"><h2>Related</h2><ul>${links}</ul></aside>`;
}

function buildPageHtml(page, pagesBySlug) {
  const canonical = `${SITE_ORIGIN}/landing/${page.slug}/`;
  const sectionsHtml = page.sections.map(renderSection).join("\n");
  const relatedHtml = renderRelatedLinks(page, pagesBySlug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: page.title,
        description: page.metaDescription,
        isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
        about: { "@id": `${SITE_ORIGIN}/#organization` },
        inLanguage: "en",
      },
      {
        "@type": "Service",
        name: page.h1,
        description: page.intro,
        provider: { "@id": `${SITE_ORIGIN}/#organization` },
        areaServed: "Worldwide",
        serviceType: "B2B outbound lead generation",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_ORIGIN}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.h1,
            item: canonical,
          },
        ],
      },
    ],
  };

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="theme-color" content="#080B12" />
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.metaDescription)}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="ADealForge" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.metaDescription)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE_ORIGIN}/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.metaDescription)}" />
    <meta name="twitter:image" content="${SITE_ORIGIN}/og-image.png" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body {
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #080b12;
        color: rgba(255, 255, 255, 0.78);
        line-height: 1.65;
        -webkit-font-smoothing: antialiased;
      }
      a { color: #a4f4fd; text-decoration: none; transition: color 200ms ease; }
      a:hover { color: #ffffff; }
      .lp-shell { min-height: 100dvh; display: flex; flex-direction: column; }
      .lp-header {
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding: 1rem 1.25rem;
      }
      .lp-header-inner {
        max-width: 48rem;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      .lp-logo {
        display: inline-flex;
        align-items: center;
        gap: 0.625rem;
        color: #ffffff;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      .lp-logo img { width: 1.75rem; height: 1.75rem; }
      .lp-nav { display: flex; gap: 1rem; font-size: 0.875rem; }
      .lp-nav a { color: rgba(255, 255, 255, 0.62); }
      .lp-nav a:hover { color: #ffffff; }
      .lp-main {
        flex: 1;
        width: 100%;
        max-width: 48rem;
        margin: 0 auto;
        padding: 2.5rem 1.25rem 3rem;
      }
      .lp-eyebrow {
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.42);
        margin: 0 0 0.75rem;
      }
      .lp-main h1 {
        margin: 0 0 1rem;
        font-size: clamp(1.75rem, 4vw, 2.25rem);
        line-height: 1.2;
        letter-spacing: -0.02em;
        color: #ffffff;
      }
      .lp-intro {
        margin: 0 0 2rem;
        font-size: 1.0625rem;
        color: rgba(255, 255, 255, 0.72);
      }
      .lp-section {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .lp-section:last-of-type { border-bottom: none; }
      .lp-section h2 {
        margin: 0 0 0.75rem;
        font-size: 1.125rem;
        color: #ffffff;
      }
      .lp-section p { margin: 0 0 0.75rem; }
      .lp-section ul {
        margin: 0;
        padding-left: 1.25rem;
      }
      .lp-section li { margin-bottom: 0.5rem; }
      .lp-cta {
        margin-top: 2.5rem;
        padding: 1.5rem;
        border-radius: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.04);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      .lp-cta p {
        margin: 0;
        font-size: 0.9375rem;
        color: rgba(255, 255, 255, 0.72);
        max-width: 28rem;
      }
      .lp-cta-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2.75rem;
        padding: 0.625rem 1.25rem;
        border-radius: 0.625rem;
        border: 1px solid rgba(164, 244, 253, 0.9);
        background: linear-gradient(135deg, #ffffff 0%, #dffbff 40%, #8beeff 100%);
        color: #03111e;
        font-weight: 600;
        font-size: 0.9375rem;
        box-shadow: 0 10px 28px rgba(0, 210, 255, 0.2);
        transition: transform 200ms ease, box-shadow 200ms ease;
      }
      .lp-cta-btn:hover {
        color: #020b14;
        transform: translateY(-1px);
        box-shadow: 0 14px 34px rgba(0, 210, 255, 0.28);
      }
      .lp-related {
        margin-top: 2.5rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .lp-related h2 {
        margin: 0 0 0.75rem;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: rgba(255, 255, 255, 0.45);
      }
      .lp-related ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 0.5rem;
      }
      .lp-footer {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding: 1.25rem;
        font-size: 0.8125rem;
        color: rgba(255, 255, 255, 0.45);
      }
      .lp-footer-inner {
        max-width: 48rem;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem 1.25rem;
        justify-content: space-between;
      }
      @media (max-width: 640px) {
        .lp-nav { display: none; }
        .lp-main { padding-top: 2rem; }
      }
    </style>
  </head>
  <body>
    <div class="lp-shell">
      <header class="lp-header">
        <div class="lp-header-inner">
          <a class="lp-logo" href="${HOME_PATH}">
            <img src="/brand/adealforge-mark.png" alt="" width="28" height="28" />
            <span>ADealForge</span>
          </a>
          <nav class="lp-nav" aria-label="Primary">
            <a href="${HOME_PATH}">Home</a>
            <a href="${CONTACT_PATH}">Contact</a>
          </nav>
        </div>
      </header>

      <main class="lp-main">
        <p class="lp-eyebrow">B2B Outbound</p>
        <h1>${escapeHtml(page.h1)}</h1>
        <p class="lp-intro">${escapeHtml(page.intro)}</p>
        ${sectionsHtml}
        <div class="lp-cta">
          <p>Ready to grow qualified pipeline with managed outbound?</p>
          <a class="lp-cta-btn" href="${CONTACT_PATH}">${escapeHtml(page.cta)}</a>
        </div>
        ${relatedHtml}
      </main>

      <footer class="lp-footer">
        <div class="lp-footer-inner">
          <span>&copy; ${new Date().getFullYear()} ADealForge</span>
          <span>
            <a href="${HOME_PATH}">Home</a>
            &nbsp;&middot;&nbsp;
            <a href="${CONTACT_PATH}">Contact</a>
            &nbsp;&middot;&nbsp;
            <a href="${TERMS_PATH}">Terms</a>
          </span>
        </div>
      </footer>
    </div>
    <script src="/landing-cookie-banner.js" defer></script>
  </body>
</html>`;
}

function writeLandingPages() {
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  const pagesBySlug = new Map(landingPages.map((page) => [page.slug, page]));
  const written = [];

  for (const page of landingPages) {
    const outDir = path.join(LANDING_ROOT, page.slug);
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, "index.html");
    fs.writeFileSync(outFile, buildPageHtml(page, pagesBySlug), "utf8");
    written.push(page.slug);
  }

  return written;
}

function updateSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const staticUrls = [
    { loc: `${SITE_ORIGIN}/`, priority: "1.0", changefreq: "monthly" },
    { loc: `${SITE_ORIGIN}/contact`, priority: "0.9", changefreq: "monthly" },
    { loc: `${SITE_ORIGIN}/platform`, priority: "0.8", changefreq: "monthly" },
    { loc: `${SITE_ORIGIN}/workflow`, priority: "0.8", changefreq: "monthly" },
    { loc: `${SITE_ORIGIN}/terms`, priority: "0.5", changefreq: "yearly" },
  ];

  const landingUrls = landingPages.map((page) => ({
    loc: `${SITE_ORIGIN}/landing/${page.slug}/`,
    priority: "0.7",
    changefreq: "monthly",
  }));

  const urls = [...staticUrls, ...landingUrls];
  const body = urls
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

  const distSitemap = path.join(DIST_DIR, "sitemap.xml");
  const publicSitemap = path.join(ROOT, "public", "sitemap.xml");
  fs.writeFileSync(distSitemap, sitemap, "utf8");
  fs.writeFileSync(publicSitemap, sitemap, "utf8");
}

function main() {
  const slugs = writeLandingPages();
  updateSitemap();
  console.log(`Generated ${slugs.length} landing pages:`);
  for (const slug of slugs) {
    console.log(`  /landing/${slug}/`);
  }
  console.log("Updated sitemap.xml (dist + public)");
}

main();
