/**
 * Mock production server — local fixture for negative-testing the production
 * smoke check WITHOUT touching real production.
 * Usage: MOCK_PROFILE=<profile> MOCK_PORT=4577 node scripts/mock-production-server.mjs
 * Profiles: healthy, homepage-500, route-500, sitemap-404, sitemap-malformed,
 * robots-404, robots-disallow, redirect-mismatch, asset-404, probe-a-fail,
 * turnstile-not-configured, turnstile-ok-broken, soft-404
 *
 * Requires MOCK_SITE_ORIGIN (or SITE_ORIGIN) so fixtures never default to adealforge.com.
 */

import http from "http";
import { INDEXABLE_LANDING_PAGES } from "./landing-pages-data.mjs";
import { resolveSiteOrigin } from "./site-origin.mjs";

const PROFILE = process.env.MOCK_PROFILE || "healthy";
const PORT = Number(process.env.MOCK_PORT || 4577);
const SITE_ORIGIN =
  process.env.MOCK_SITE_ORIGIN?.replace(/\/+$/, "") || resolveSiteOrigin() || "https://mock.local";

const SPA_ROUTES = ["/services", "/about", "/contact", "/terms"];

function healthySitemap() {
  const urls = [
    "/",
    ...SPA_ROUTES,
    ...INDEXABLE_LANDING_PAGES.map((page) => `/landing/${page.slug}/`),
  ];
  const body = urls
    .map(
      (route) =>
        `  <url>\n    <loc>${SITE_ORIGIN}${route === "/" ? "/" : route}</loc>\n    <lastmod>2026-08-01</lastmod>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

const HEALTHY_ROBOTS = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`;

function homepageHtml() {
  return `<!doctype html><html><head>
<title>Agency Website mock</title>
<meta property="og:image" content="${SITE_ORIGIN}/og-image.png" />
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="preload" as="image" href="/brand/logo.png" />
<link rel="stylesheet" href="/assets/index.css" />
<script type="module" src="/assets/index.js"></script>
</head><body><main><h1>Mock</h1></main></body></html>`;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
  const path = url.pathname;

  if (path === "/sitemap.xml") {
    if (PROFILE === "sitemap-404") {
      res.writeHead(404).end("missing");
      return;
    }
    if (PROFILE === "sitemap-malformed") {
      res.writeHead(200, { "content-type": "application/xml" }).end("<not-a-sitemap");
      return;
    }
    res.writeHead(200, { "content-type": "application/xml" }).end(healthySitemap());
    return;
  }

  if (path === "/robots.txt") {
    if (PROFILE === "robots-404") {
      res.writeHead(404).end("missing");
      return;
    }
    if (PROFILE === "robots-disallow") {
      res.writeHead(200, { "content-type": "text/plain" }).end("User-agent: *\nDisallow: /\n");
      return;
    }
    res.writeHead(200, { "content-type": "text/plain" }).end(HEALTHY_ROBOTS);
    return;
  }

  if (path === "/og-image.png" && PROFILE === "asset-404") {
    res.writeHead(404).end("missing");
    return;
  }

  if (
    path === "/og-image.png" ||
    path === "/favicon.png" ||
    path === "/brand/logo.png" ||
    path.startsWith("/assets/")
  ) {
    res.writeHead(200, { "content-type": "application/octet-stream" }).end("ok");
    return;
  }

  if (path === "/api/contact" && req.method === "POST") {
    if (PROFILE === "probe-a-fail") {
      res.writeHead(500, { "content-type": "application/json" }).end('{"error":"fail"}');
      return;
    }
    if (PROFILE === "turnstile-not-configured") {
      res
        .writeHead(500, { "content-type": "application/json" })
        .end('{"error":"The contact form is not configured yet."}');
      return;
    }
    if (PROFILE === "turnstile-ok-broken") {
      res.writeHead(200, { "content-type": "application/json" }).end('{"ok":true}');
      return;
    }
    res.writeHead(400, { "content-type": "application/json" }).end('{"error":"Captcha failed"}');
    return;
  }

  for (const route of ["/homepage-v1", "/homepage-v2", "/homepage-v3"]) {
    if (path === route) {
      if (PROFILE === "redirect-mismatch") {
        res.writeHead(302, { location: "/contact" }).end();
        return;
      }
      res.writeHead(301, { location: "/" }).end();
      return;
    }
  }

  if (path === "/" && PROFILE === "homepage-500") {
    res.writeHead(500).end("fail");
    return;
  }

  if (SPA_ROUTES.includes(path) && PROFILE === "route-500") {
    res.writeHead(500).end("fail");
    return;
  }

  if (PROFILE === "soft-404" && !SPA_ROUTES.includes(path) && path !== "/") {
    res.writeHead(200, { "content-type": "text/html" }).end(homepageHtml());
    return;
  }

  if (path === "/" || SPA_ROUTES.includes(path)) {
    res.writeHead(200, { "content-type": "text/html" }).end(homepageHtml());
    return;
  }

  res.writeHead(404).end("not found");
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(
    `Mock production server (${PROFILE}) on http://127.0.0.1:${PORT} origin=${SITE_ORIGIN}`
  );
});
