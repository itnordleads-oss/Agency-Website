/**
 * Mock production server — local fixture for negative-testing the production
 * smoke check WITHOUT touching real production.
 * Usage: MOCK_PROFILE=<profile> MOCK_PORT=4577 node scripts/mock-production-server.mjs
 * Profiles: healthy, homepage-500, route-500, sitemap-404, sitemap-malformed,
 * robots-404, robots-disallow, redirect-mismatch, asset-404, probe-a-fail,
 * turnstile-not-configured, turnstile-ok-broken, soft-404
 */

import http from "http";
import { SITE_ORIGIN, landingPages } from "./landing-pages-data.mjs";

const PROFILE = process.env.MOCK_PROFILE || "healthy";
const PORT = Number(process.env.MOCK_PORT || 4577);

const SPA_ROUTES = ["/services", "/about", "/contact", "/terms"];

function healthySitemap() {
  const urls = ["/", ...SPA_ROUTES, ...landingPages.map((page) => `/landing/${page.slug}/`)];
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
<title>ADealForge mock</title>
<meta property="og:image" content="${SITE_ORIGIN}/og-image.png" />
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="preload" as="image" href="/brand/logo.png" />
<link rel="stylesheet" href="/assets/index.css" />
<script type="module" src="/assets/index.js"></script>
</head><body><main><h1>Mock</h1></main></body></html>`;
}

function send(res, status, body = "", headers = {}) {
  const finalHeaders = { "content-type": "text/plain; charset=utf-8", ...headers };
  if (PROFILE === "healthy") {
    finalHeaders["strict-transport-security"] = "max-age=63072000";
    finalHeaders["content-security-policy"] = "default-src 'self'";
    finalHeaders["x-content-type-options"] = "nosniff";
    finalHeaders["referrer-policy"] = "strict-origin-when-cross-origin";
    finalHeaders["permissions-policy"] = "camera=()";
    finalHeaders["x-frame-options"] = "DENY";
  }
  res.writeHead(status, finalHeaders);
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const path = url.pathname;

  if (path === "/api/contact" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const payload = JSON.parse(body || "{}");
      const json = (obj, status = 200) =>
        send(res, status, JSON.stringify(obj), { "content-type": "application/json" });
      if (PROFILE === "probe-a-fail") {
        return json({ error: "worker exploded" }, 500);
      }
      if (payload.website) {
        return json({ ok: true });
      }
      if (PROFILE === "turnstile-not-configured") {
        return json({ error: "The contact form is not configured yet." }, 500);
      }
      if (PROFILE === "turnstile-ok-broken") {
        return json({ ok: true });
      }
      return json({ error: "Captcha verification failed. Please try again." }, 400);
    });
    return;
  }

  if (path === "/") {
    if (PROFILE === "homepage-500") {
      return send(res, 500, "boom");
    }
    return send(res, 200, homepageHtml(), { "content-type": "text/html; charset=utf-8" });
  }
  if (path === "/sitemap.xml") {
    if (PROFILE === "sitemap-404") {
      return send(res, 404, "not found");
    }
    if (PROFILE === "sitemap-malformed") {
      return send(res, 200, "<urlset><url><loc>broken", { "content-type": "application/xml" });
    }
    return send(res, 200, healthySitemap(), { "content-type": "application/xml" });
  }
  if (path === "/robots.txt") {
    if (PROFILE === "robots-404") {
      return send(res, 404, "not found");
    }
    if (PROFILE === "robots-disallow") {
      return send(res, 200, "User-agent: *\nDisallow: /\n");
    }
    return send(res, 200, HEALTHY_ROBOTS);
  }
  if (path.startsWith("/homepage-v")) {
    if (PROFILE === "redirect-mismatch") {
      return send(res, 200, "no redirect here");
    }
    return send(res, 301, "", { location: "/" });
  }
  if (path === "/og-image.png" && PROFILE === "asset-404") {
    return send(res, 404, "missing");
  }
  if (
    path === "/og-image.png" ||
    path === "/favicon.png" ||
    path === "/brand/logo.png" ||
    path === "/assets/index.css" ||
    path === "/assets/index.js"
  ) {
    return send(res, 200, "asset");
  }
  if (SPA_ROUTES.includes(path)) {
    if (PROFILE === "route-500" && path === "/contact") {
      return send(res, 500, "boom");
    }
    return send(res, 200, `<html><body><main>${path}</main></body></html>`, {
      "content-type": "text/html; charset=utf-8",
    });
  }
  if (path.startsWith("/landing/")) {
    return send(res, 200, "<html><body><main>landing</main></body></html>", {
      "content-type": "text/html; charset=utf-8",
    });
  }
  if (PROFILE === "soft-404") {
    return send(res, 200, "<html><body><main>spa shell</main></body></html>", {
      "content-type": "text/html; charset=utf-8",
    });
  }
  return send(res, 404, "not found");
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`mock-production (${PROFILE}) listening on 127.0.0.1:${PORT}`);
});
