/**
 * Post-deploy production smoke — read-only HTTP verification of the live site.
 * Safe by design: GET/HEAD checks plus two NON-mutating contact Worker probes
 * (honeypot short-circuit and intentionally-invalid Turnstile token). No probe
 * can create a production lead.
 *
 * Usage: node scripts/check-production-smoke.mjs
 * Target: PRODUCTION_BASE_URL (or SITE_ORIGIN / VITE_STUDIO_DOMAIN when configured).
 * Non-production targets are refused unless ALLOW_NON_PRODUCTION_TARGET=1
 * (used only by local mock-server negative tests).
 *
 * Exit code: 1 on any IMMEDIATE ALERT or ALERT finding; 0 when only warnings
 * (including baselined current-production debt) remain.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { INDEXABLE_LANDING_PAGES, SITE_ORIGIN } from "./landing-pages-data.mjs";
import {
  findBaselineEntry,
  getExpectedSitemapUrls,
  getIndexableSpaRoutes,
  isBaselineEntryExpired,
  isForbiddenHostname,
  loadBaseline,
  validateRobotsContent,
  validateSitemapContent,
} from "./lib/release-validation.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const configuredOrigin = process.env.PRODUCTION_BASE_URL || SITE_ORIGIN;
if (!configuredOrigin) {
  console.error(
    "PRODUCTION_BASE_URL or SITE_ORIGIN / VITE_STUDIO_DOMAIN is required — refusing to default to adealforge.com."
  );
  process.exit(1);
}
const BASE_URL = configuredOrigin.replace(/\/+$/, "");
const ALLOW_NON_PROD = process.env.ALLOW_NON_PRODUCTION_TARGET === "1";
const PRODUCTION_HOST = new URL(BASE_URL).hostname;
const REQUEST_TIMEOUT_MS = 10_000;

const CORE_ROUTES = ["/services", "/about", "/contact", "/terms"];
const LEGACY_REDIRECTS = ["/homepage-v1", "/homepage-v2", "/homepage-v3"];
const SECURITY_HEADERS = [
  "strict-transport-security",
  "content-security-policy",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
  "x-frame-options",
  "frame-ancestors",
];

const immediate = [];
const alerts = [];
const warnings = [];
const notes = [];

const baseline = loadBaseline(
  process.env.PRODUCTION_SMOKE_BASELINE
    ? path.resolve(process.env.PRODUCTION_SMOKE_BASELINE)
    : path.join(ROOT, "scripts", "production-smoke-baseline.json")
);

/** Baselined findings are downgraded to warnings until their entry expires. */
function classify(id, severity, message) {
  const entry = findBaselineEntry(baseline, id);
  if (entry && !isBaselineEntryExpired(entry)) {
    warnings.push(
      `${message} (current production debt: ${entry.ticket}, expires ${entry.expires})`
    );
    return;
  }
  if (entry) {
    alerts.push(`${message} (baseline entry ${entry.ticket} EXPIRED ${entry.expires})`);
    return;
  }
  if (severity === "immediate") {
    immediate.push(message);
  } else if (severity === "alert") {
    alerts.push(message);
  } else {
    warnings.push(message);
  }
}

async function request(
  url,
  { method = "GET", body, headers, redirect = "manual", retries = 1 } = {}
) {
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      const response = await fetch(url, {
        method,
        body,
        headers,
        redirect,
        signal: controller.signal,
      });
      clearTimeout(timer);
      return response;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function checkHomepage() {
  let response;
  try {
    response = await request(`${BASE_URL}/`);
  } catch (error) {
    immediate.push(`IMMEDIATE ALERT: homepage unreachable — ${error.message}`);
    return null;
  }
  if (response.status !== 200) {
    immediate.push(`IMMEDIATE ALERT: homepage returned HTTP ${response.status}.`);
    return null;
  }
  return response;
}

async function checkRoutes() {
  for (const route of CORE_ROUTES) {
    try {
      const response = await request(`${BASE_URL}${route}`);
      if (response.status >= 500) {
        immediate.push(`IMMEDIATE ALERT: ${route} returned HTTP ${response.status}.`);
      } else if (response.status !== 200) {
        classify(
          `route-status::${route}`,
          "alert",
          `ALERT: ${route} returned HTTP ${response.status}.`
        );
      }
    } catch (error) {
      immediate.push(`IMMEDIATE ALERT: ${route} request failed — ${error.message}`);
    }
  }

  for (const page of INDEXABLE_LANDING_PAGES) {
    const route = `/landing/${page.slug}/`;
    try {
      const response = await request(`${BASE_URL}${route}`);
      if (response.status >= 500) {
        alerts.push(`ALERT: ${route} returned HTTP ${response.status}.`);
      } else if (response.status !== 200) {
        classify(
          `landing-status::${route}`,
          "alert",
          `ALERT: ${route} returned HTTP ${response.status}.`
        );
      }
    } catch (error) {
      alerts.push(`ALERT: ${route} request failed — ${error.message}`);
    }
  }
}

async function checkSitemap() {
  let response;
  try {
    response = await request(`${BASE_URL}/sitemap.xml`);
  } catch (error) {
    alerts.push(`ALERT: /sitemap.xml request failed — ${error.message}`);
    return;
  }
  if (response.status !== 200) {
    alerts.push(`ALERT: /sitemap.xml returned HTTP ${response.status}.`);
    return;
  }
  const xml = await response.text();
  const spaRoutes = getIndexableSpaRoutes(ROOT);
  const result = validateSitemapContent(xml, {
    label: "production /sitemap.xml",
    productionHost: PRODUCTION_HOST,
    expectedUrls: getExpectedSitemapUrls(spaRoutes, BASE_URL, INDEXABLE_LANDING_PAGES),
  });

  const structural = result.failures.filter((f) => !result.routeSetFailures.includes(f));
  for (const message of structural) {
    alerts.push(`ALERT: ${message}`);
  }
  if (result.routeSetFailures.length > 0) {
    classify(
      "sitemap-route-set",
      "alert",
      `ALERT: production sitemap route set diverges from project routes (${result.routeSetFailures.length} finding(s)).`
    );
  }
  result.warnings.forEach((message) => warnings.push(`WARNING: ${message}`));
}

async function checkRobots() {
  let response;
  try {
    response = await request(`${BASE_URL}/robots.txt`);
  } catch (error) {
    alerts.push(`ALERT: /robots.txt request failed — ${error.message}`);
    return;
  }
  if (response.status !== 200) {
    alerts.push(`ALERT: /robots.txt returned HTTP ${response.status}.`);
    return;
  }
  const result = validateRobotsContent(await response.text(), {
    label: "production /robots.txt",
    siteOrigin: BASE_URL,
  });
  for (const message of result.failures) {
    alerts.push(`ALERT: ${message}`);
  }
}

async function checkRedirects() {
  for (const route of LEGACY_REDIRECTS) {
    try {
      const response = await request(`${BASE_URL}${route}`, { redirect: "manual" });
      const location = response.headers.get("location") ?? "";
      const isExpected = response.status === 301 && new URL(location, BASE_URL).pathname === "/";
      if (!isExpected) {
        classify(
          `redirect::${route}`,
          "alert",
          `ALERT: ${route} expected 301 → / but got HTTP ${response.status}${location ? ` → ${location}` : ""}.`
        );
      }
    } catch (error) {
      alerts.push(`ALERT: ${route} redirect check failed — ${error.message}`);
    }
  }
}

async function checkNotFoundBehavior() {
  const probe = `/definitely-not-a-real-route-${Date.now()}`;
  try {
    const response = await request(`${BASE_URL}${probe}`);
    if (response.status === 404) {
      notes.push(`Unknown URLs return a proper 404 (${probe}).`);
    } else if (response.status === 200) {
      warnings.push(
        `WARNING: unknown URL ${probe} returned HTTP 200 — soft-404 (known SPA-fallback debt until remediated).`
      );
    } else {
      warnings.push(`WARNING: unknown URL ${probe} returned unexpected HTTP ${response.status}.`);
    }
  } catch (error) {
    warnings.push(`WARNING: 404 probe request failed — ${error.message}`);
  }
}

async function checkCriticalAssets(homepageHtml) {
  const assetPaths = new Set();
  const ogImage = homepageHtml.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i);
  if (ogImage) {
    assetPaths.add(new URL(ogImage[1], BASE_URL).pathname);
  } else {
    warnings.push("WARNING: homepage has no og:image reference.");
  }
  for (const match of homepageHtml.matchAll(/<link[^>]*rel="icon"[^>]*href="([^"]+)"/gi)) {
    assetPaths.add(match[1]);
  }
  for (const match of homepageHtml.matchAll(/<script[^>]*type="module"[^>]*src="([^"]+)"/gi)) {
    assetPaths.add(match[1]);
  }
  for (const match of homepageHtml.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/gi)) {
    assetPaths.add(match[1]);
  }
  for (const match of homepageHtml.matchAll(/<link[^>]*rel="preload"[^>]*href="([^"]+)"/gi)) {
    assetPaths.add(match[1]);
  }

  for (const assetPath of assetPaths) {
    if (!assetPath.startsWith("/")) {
      continue;
    }
    try {
      const response = await request(`${BASE_URL}${assetPath}`, { method: "HEAD" });
      if (response.status !== 200) {
        immediate.push(
          `IMMEDIATE ALERT: critical asset ${assetPath} returned HTTP ${response.status}.`
        );
      }
    } catch (error) {
      immediate.push(
        `IMMEDIATE ALERT: critical asset ${assetPath} request failed — ${error.message}`
      );
    }
  }
  notes.push(`Checked ${assetPaths.size} critical same-origin asset(s).`);
}

async function probeHoneypot() {
  // Probe A: honeypot field populated. The Worker returns { ok: true } BEFORE any
  // Turnstile/KV work, so this is non-mutating. Proves DNS/TLS, /api/contact
  // routing, Worker execution, JSON parsing, honeypot handling. Does NOT prove
  // Turnstile configuration or KV writes.
  try {
    const response = await request(
      `${BASE_URL}/api/contact`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Release Smoke Probe",
          email: "release-smoke@example.com",
          message: "Automated non-mutating production probe (honeypot).",
          website: "https://probe.invalid",
          turnstileToken: "probe",
        }),
      },
      { retries: 0 }
    );
    const body = await response.json().catch(() => ({}));
    if (response.status === 200 && body.ok === true) {
      notes.push("Contact Worker probe A (honeypot): routing/execution OK.");
    } else {
      alerts.push(
        `ALERT: contact Worker honeypot probe returned HTTP ${response.status} — ${JSON.stringify(body)}`
      );
    }
  } catch (error) {
    alerts.push(`ALERT: contact Worker honeypot probe failed — ${error.message}`);
  }
}

async function probeInvalidTurnstile() {
  // Probe B: valid-looking submission with an intentionally INVALID Turnstile
  // token. Healthy = 400 captcha rejection, which proves the Turnstile
  // verification path (and its secret) is configured. Execution stops before
  // saveLead, so no lead is written. 500 "not configured" = missing secret.
  try {
    const response = await request(
      `${BASE_URL}/api/contact`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Release Smoke Probe",
          email: "release-smoke@example.com",
          message: "Automated non-mutating production probe (invalid Turnstile token).",
          website: "",
          turnstileToken: "intentionally-invalid-token-release-probe",
        }),
      },
      { retries: 0 }
    );
    const body = await response.json().catch(() => ({}));
    const errorText = typeof body.error === "string" ? body.error : "";
    if (response.status === 400 && /captcha/i.test(errorText)) {
      notes.push("Contact Worker probe B (invalid Turnstile): verification path active.");
    } else if (response.status === 500 && /not configured/i.test(errorText)) {
      alerts.push(
        "ALERT: contact Worker reports Turnstile is NOT configured (TURNSTILE_SECRET_KEY missing)."
      );
    } else if (response.status === 200 && body.ok === true) {
      immediate.push(
        "IMMEDIATE ALERT: invalid-Turnstile probe returned ok:true — captcha enforcement may be broken."
      );
    } else {
      alerts.push(
        `ALERT: invalid-Turnstile probe returned unexpected HTTP ${response.status} — ${JSON.stringify(body)}`
      );
    }
  } catch (error) {
    alerts.push(`ALERT: invalid-Turnstile probe failed — ${error.message}`);
  }
}

async function checkSecurityHeaders(homepageResponse) {
  const missing = SECURITY_HEADERS.filter((header) => !homepageResponse.headers.get(header));
  if (missing.length > 0) {
    classify(
      "security-headers::missing",
      "warning",
      `WARNING: production response is missing security header(s): ${missing.join(", ")}.`
    );
  } else {
    notes.push("Security headers present.");
  }
}

function writeStepSummary() {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    return;
  }
  const lines = [
    "## Production smoke",
    "",
    `- Target: ${BASE_URL}`,
    `- IMMEDIATE ALERTS: ${immediate.length}`,
    `- Alerts: ${alerts.length}`,
    `- Warnings: ${warnings.length}`,
    "",
  ];
  if (immediate.length > 0) {
    lines.push("### IMMEDIATE ALERT — evaluate rollback", ...immediate.map((m) => `- ${m}`), "");
  }
  if (alerts.length > 0) {
    lines.push("### Alert", ...alerts.map((m) => `- ${m}`), "");
  }
  fs.appendFileSync(summaryPath, lines.join("\n"));
}

async function main() {
  const targetHost = new URL(BASE_URL).hostname;
  if (/adealforge\.com$/i.test(targetHost) && !ALLOW_NON_PROD) {
    console.error(
      `Refusing to run Agency Website production smoke against retired product host "${targetHost}".`
    );
    process.exit(2);
  }
  if (isForbiddenHostname(targetHost) && !ALLOW_NON_PROD) {
    console.error(
      `Refusing to run production smoke against non-production host "${targetHost}". ` +
        "Set ALLOW_NON_PRODUCTION_TARGET=1 only for local mock-server tests."
    );
    process.exit(2);
  }

  console.log(`Production smoke target: ${BASE_URL}`);

  const homepageResponse = await checkHomepage();
  const homepageHtml = homepageResponse ? await homepageResponse.text() : null;

  await checkRoutes();
  await checkSitemap();
  await checkRobots();
  await checkRedirects();
  await checkNotFoundBehavior();
  if (homepageHtml) {
    await checkCriticalAssets(homepageHtml);
  }
  await probeHoneypot();
  await probeInvalidTurnstile();
  if (homepageResponse) {
    await checkSecurityHeaders(homepageResponse);
  }

  console.log("");
  for (const message of notes) {
    console.log(`OK: ${message}`);
  }
  for (const message of warnings) {
    console.warn(message.startsWith("WARNING") ? message : `WARNING: ${message}`);
  }
  for (const message of alerts) {
    console.error(message.startsWith("ALERT") ? message : `ALERT: ${message}`);
  }
  for (const message of immediate) {
    console.error(message.startsWith("IMMEDIATE") ? message : `IMMEDIATE ALERT: ${message}`);
  }

  console.log(
    `\nProduction smoke: ${immediate.length} immediate, ${alerts.length} alert, ${warnings.length} warning.`
  );
  writeStepSummary();

  if (immediate.length > 0) {
    console.error(
      "RESULT: IMMEDIATE ALERT — evaluate the deployment and consider the documented manual rollback process."
    );
    process.exit(1);
  }
  if (alerts.length > 0) {
    console.error("RESULT: ALERT — production verification found actionable problems.");
    process.exit(1);
  }
  console.log("RESULT: PASS (warnings only).");
}

await main();
