import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test, type Page } from "@playwright/test";

import { isExpired } from "./baseline";

/**
 * Post-deploy production smoke — browser-side verification of the LIVE site.
 * Runs with playwright.production.config.ts (no local server).
 * Read-only: no form is ever submitted with a valid Turnstile token.
 *
 * Findings are classified with the shared production debt baseline
 * (scripts/production-smoke-baseline.json): baselined findings are warnings
 * (current production debt), everything else fails the test.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROD_BASELINE_PATH = path.join(HERE, "..", "..", "scripts", "production-smoke-baseline.json");

const SPA_ROUTES = ["/", "/contact", "/platform", "/workflow", "/terms"] as const;
const GA_HOST_PATTERN = /googletagmanager\.com|google-analytics\.com/i;
const CONSOLE_NOISE_PATTERN = /googletagmanager|google-analytics|doubleclick|facebook|linkedin/i;

interface RouteResult {
  route: string;
  status: number;
  failures: string[];
  warnings: string[];
}

function loadProductionBaseline() {
  if (!fs.existsSync(PROD_BASELINE_PATH)) {
    return [];
  }
  const parsed = JSON.parse(fs.readFileSync(PROD_BASELINE_PATH, "utf8")) as {
    entries?: { id: string; reason: string; ticket: string; expires: string }[];
  };
  return parsed.entries ?? [];
}

/** Production baseline entries carry no route field; `*` suffix = prefix match. */
function isBaselined(
  baseline: { id: string; reason: string; ticket: string; expires: string }[],
  id: string
): boolean {
  const entry = baseline.find((candidate) => {
    if (candidate.id.endsWith("*")) {
      return id.startsWith(candidate.id.slice(0, -1));
    }
    return candidate.id === id;
  });
  return Boolean(entry && !isExpired(entry));
}

async function checkRoute(
  page: Page,
  route: string,
  baseline: ReturnType<typeof loadProductionBaseline>
): Promise<RouteResult> {
  const failures: string[] = [];
  const warnings: string[] = [];
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const sameOriginFailures: string[] = [];
  const thirdPartyFailures: string[] = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !CONSOLE_NOISE_PATTERN.test(message.text())) {
      consoleErrors.push(message.text());
    }
  });
  page.on("requestfailed", (request) => {
    const host = new URL(request.url()).hostname;
    if (host === "adealforge.com" || host.endsWith(".adealforge.com")) {
      sameOriginFailures.push(`${request.url()} — ${request.failure()?.errorText ?? "failed"}`);
    } else {
      thirdPartyFailures.push(request.url());
    }
  });
  page.on("response", (response) => {
    const host = new URL(response.url()).hostname;
    if (
      (host === "adealforge.com" || host.endsWith(".adealforge.com")) &&
      response.status() >= 400
    ) {
      sameOriginFailures.push(`${response.url()} — HTTP ${response.status()}`);
    }
  });

  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  const status = response?.status() ?? 0;

  if (status >= 400) {
    if (isBaselined(baseline, `route-status::${route}`)) {
      warnings.push(`${route} returned HTTP ${status} (current production debt).`);
    } else {
      failures.push(`${route} returned HTTP ${status}.`);
    }
    return { route, status, failures, warnings };
  }

  await page.locator("main").first().waitFor({ state: "attached", timeout: 15_000 });

  const head = await page.evaluate(() => {
    const meta = (selector: string) =>
      document.querySelector(selector)?.getAttribute("content") ?? null;
    return {
      title: document.title,
      description: meta('meta[name="description"]'),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
      ogUrl: meta('meta[property="og:url"]'),
      robots: meta('meta[name="robots"]'),
    };
  });

  if (!head.title.trim()) {
    failures.push(`${route}: rendered title is empty.`);
  }
  if (!head.description?.trim()) {
    failures.push(`${route}: rendered meta description is missing.`);
  }
  if (!head.canonical) {
    failures.push(`${route}: canonical missing.`);
  } else {
    try {
      const canonical = new URL(head.canonical);
      if (canonical.protocol !== "https:" || canonical.hostname !== "adealforge.com") {
        failures.push(`${route}: canonical is not production HTTPS: ${head.canonical}`);
      }
    } catch {
      failures.push(`${route}: canonical malformed: ${head.canonical}`);
    }
  }
  if (head.robots && /noindex/i.test(head.robots)) {
    failures.push(`${route}: rendered meta robots contains noindex.`);
  }

  for (const message of pageErrors) {
    failures.push(`${route}: uncaught page error — ${message.slice(0, 200)}`);
  }
  for (const message of consoleErrors) {
    failures.push(`${route}: console.error — ${message.slice(0, 200)}`);
  }
  for (const message of sameOriginFailures) {
    failures.push(`${route}: same-origin network failure — ${message.slice(0, 200)}`);
  }
  for (const url of thirdPartyFailures) {
    warnings.push(`${route}: third-party request failed (non-blocking) — ${url.slice(0, 120)}`);
  }

  return { route, status, failures, warnings };
}

test.describe("production smoke (browser)", () => {
  test("SPA routes render without runtime or metadata regressions", async ({ page }) => {
    test.setTimeout(180_000);
    const baseline = loadProductionBaseline();
    const failures: string[] = [];
    const warnings: string[] = [];

    for (const route of SPA_ROUTES) {
      const result = await checkRoute(page, route, baseline);
      failures.push(...result.failures);
      warnings.push(...result.warnings);
    }

    for (const line of warnings) {
      console.warn(`WARNING: ${line}`);
    }
    expect(failures, `Production route failures:\n${failures.join("\n")}`).toEqual([]);
  });

  test("cookie consent appears, accepts, and persists", async ({ page, context }) => {
    const baseline = loadProductionBaseline();
    await context.clearCookies();
    await page.goto("/");
    const acceptAll = page.getByRole("button", { name: "Accept All" });
    const bannerShown = await acceptAll
      .waitFor({ state: "visible", timeout: 15_000 })
      .then(() => true)
      .catch(() => false);
    if (!bannerShown && isBaselined(baseline, "consent-ui-current-production")) {
      console.warn(
        "WARNING: current production serves the pre-release consent UI (REM-PROD-1) — consent flow checks deferred until the first release."
      );
      return;
    }
    await expect(acceptAll).toBeVisible();
    await acceptAll.click();
    await expect(acceptAll).toBeHidden({ timeout: 10_000 });

    await page.reload();
    await expect(acceptAll).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 15_000 });
  });

  test("analytics stays silent before consent and initializes after consent", async ({
    page,
    context,
  }) => {
    const baseline = loadProductionBaseline();
    await context.clearCookies();
    const gaRequests: string[] = [];
    page.on("request", (request) => {
      if (GA_HOST_PATTERN.test(request.url())) {
        gaRequests.push(request.url());
      }
    });

    await page.goto("/");
    const acceptAll = page.getByRole("button", { name: "Accept All" });
    const bannerShown = await acceptAll
      .waitFor({ state: "visible", timeout: 15_000 })
      .then(() => true)
      .catch(() => false);
    if (!bannerShown && isBaselined(baseline, "consent-ui-current-production")) {
      console.warn(
        "WARNING: current production serves the pre-release consent UI (REM-PROD-1) — analytics consent checks deferred until the first release."
      );
      return;
    }
    expect(gaRequests, `GA requests fired before consent: ${gaRequests.join(", ")}`).toEqual([]);

    await acceptAll.click();
    const initialized = await page.evaluate(() => {
      const win = window as Window & { dataLayer?: unknown[]; gtag?: unknown };
      return Array.isArray(win.dataLayer) && typeof win.gtag === "function";
    });
    // Note: the app intentionally skips the remote gtag download under
    // navigator.webdriver, so automation verifies local initialization only;
    // real GA4 reception stays a manual sign-off.
    expect(initialized, "GA dataLayer/gtag not initialized after analytics consent").toBe(true);
  });

  test("production bundle contains analytics measurement configuration", async ({ page }) => {
    const baseline = loadProductionBaseline();
    await page.goto("/");
    const scriptUrl = await page.evaluate(() => {
      const script = document.querySelector('script[type="module"][src]');
      return script?.getAttribute("src") ?? null;
    });
    expect(scriptUrl, "no module script found on homepage").toBeTruthy();

    const response = await page.request.get(scriptUrl!);
    const bundle = await response.text();
    const hasMeasurementId = /G-[A-Z0-9]{8,12}/.test(bundle);
    if (!hasMeasurementId && isBaselined(baseline, "ga-config-missing")) {
      console.warn(
        "WARNING: no GA measurement ID in the live bundle (current production debt: REM-PROD-4)."
      );
      return;
    }
    expect(
      hasMeasurementId,
      "No GA measurement ID compiled into the production bundle — analytics would be disabled."
    ).toBe(true);
  });
});
