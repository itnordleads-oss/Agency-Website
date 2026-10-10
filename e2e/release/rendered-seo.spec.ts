import fs from "node:fs";

import { expect, test, type Page } from "@playwright/test";

import { acceptCookiesIfPresent } from "../helpers/cookies";
import { findEntry, isExpired, loadBaseline } from "./baseline";

/**
 * Rendered SPA SEO release check.
 * Validates metadata of the JavaScript-rendered app for every public SPA route.
 * Static/generated HTML is covered separately by scripts/check-release-seo.mjs.
 *
 * Triage mode: confirmed pre-existing defects listed in
 * e2e/release/baselines/rendered-seo-baseline.json stay warnings (with expiry);
 * any NEW failure fails the test.
 */

const ROUTES = ["/", "/contact", "/platform", "/workflow", "/terms"] as const;
const PROD_HOST = "adealforge.com";

interface RouteSnapshot {
  route: string;
  title: string;
  description: string | null;
  canonicals: (string | null)[];
  ogTitle: string | null;
  ogDescription: string | null;
  ogUrl: string | null;
  ogImage: string | null;
  robotsMeta: string | null;
  h1Count: number;
  pageErrors: string[];
}

interface Finding {
  route: string;
  check: string;
  detail: string;
}

async function snapshotRoute(page: Page, route: string): Promise<RouteSnapshot> {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(route);
  await acceptCookiesIfPresent(page);
  // Wait for the app shell, not for an h1 — h1 presence is itself a check
  // (at least one public route currently ships without one).
  await page.locator("main").first().waitFor({ state: "attached", timeout: 15_000 });

  const head = await page.evaluate(() => {
    const meta = (selector: string) =>
      document.querySelector(selector)?.getAttribute("content") ?? null;
    return {
      title: document.title,
      description: meta('meta[name="description"]'),
      canonicals: [...document.querySelectorAll('link[rel="canonical"]')].map((link) =>
        link.getAttribute("href")
      ),
      ogTitle: meta('meta[property="og:title"]'),
      ogDescription: meta('meta[property="og:description"]'),
      ogUrl: meta('meta[property="og:url"]'),
      ogImage: meta('meta[property="og:image"]'),
      robotsMeta: meta('meta[name="robots"]'),
      h1Count: document.querySelectorAll("h1").length,
    };
  });

  return { route, pageErrors, ...head };
}

function collectRouteFindings(snapshot: RouteSnapshot, homepage: RouteSnapshot): Finding[] {
  const findings: Finding[] = [];
  const { route } = snapshot;
  const add = (check: string, detail: string) => findings.push({ route, check, detail });

  if (!snapshot.title.trim()) {
    add("title-missing", "rendered document.title is empty");
  }
  if (!snapshot.description?.trim()) {
    add("description-missing", "rendered meta description is missing or empty");
  }
  if (route !== "/" && snapshot.description && snapshot.description === homepage.description) {
    add(
      "description-inherited",
      "route inherits the homepage meta description instead of a route-specific one"
    );
  }
  if (route !== "/" && snapshot.title === homepage.title) {
    add("title-inherited", "route inherits the homepage title");
  }

  if (snapshot.canonicals.length !== 1) {
    add("canonical-count", `expected exactly 1 canonical, found ${snapshot.canonicals.length}`);
  } else {
    const href = snapshot.canonicals[0];
    if (!href) {
      add("canonical-empty", "canonical tag has no href");
    } else {
      try {
        const url = new URL(href);
        if (url.protocol !== "https:") {
          add("canonical-scheme", `canonical is not HTTPS: ${href}`);
        }
        if (url.hostname !== PROD_HOST) {
          add("canonical-host", `canonical points off the production host: ${href}`);
        }
        const expectedPath = route;
        if (url.pathname !== expectedPath) {
          add(
            "canonical-self",
            `canonical path "${url.pathname}" is not self-referencing for route "${route}"`
          );
        }
      } catch {
        add("canonical-malformed", `canonical href is malformed: ${href}`);
      }
    }
  }

  if (!snapshot.ogTitle?.trim()) {
    add("og-title-missing", "og:title is missing or empty");
  }
  if (!snapshot.ogDescription?.trim()) {
    add("og-description-missing", "og:description is missing or empty");
  }
  if (route !== "/" && snapshot.ogTitle && snapshot.ogTitle === homepage.ogTitle) {
    add("og-title-inherited", "route inherits the homepage og:title");
  }
  if (
    route !== "/" &&
    snapshot.ogDescription &&
    snapshot.ogDescription === homepage.ogDescription
  ) {
    add("og-description-inherited", "route inherits the homepage og:description");
  }
  if (!snapshot.ogUrl?.trim()) {
    add("og-url-missing", "og:url is missing or empty");
  } else {
    try {
      const url = new URL(snapshot.ogUrl);
      if (url.protocol !== "https:" || url.hostname !== PROD_HOST) {
        add("og-url-host", `og:url is not on the production HTTPS host: ${snapshot.ogUrl}`);
      }
      if (url.pathname !== route) {
        add(
          "og-url-self",
          `og:url path "${url.pathname}" is not self-referencing for route "${route}"`
        );
      }
    } catch {
      add("og-url-malformed", `og:url is malformed: ${snapshot.ogUrl}`);
    }
  }
  if (!snapshot.ogImage?.trim()) {
    add("og-image-missing", "og:image is missing or empty");
  } else if (!snapshot.ogImage.startsWith("https://")) {
    add("og-image-scheme", `og:image is not HTTPS: ${snapshot.ogImage}`);
  }

  if (snapshot.robotsMeta && /noindex/i.test(snapshot.robotsMeta)) {
    add("noindex", `rendered meta robots contains noindex: ${snapshot.robotsMeta}`);
  }

  if (snapshot.h1Count !== 1) {
    add("h1-count", `expected exactly 1 rendered <h1>, found ${snapshot.h1Count}`);
  }

  if (snapshot.pageErrors.length > 0) {
    add(
      "pageerror",
      `uncaught page error(s) during render: ${snapshot.pageErrors.join(" | ").slice(0, 300)}`
    );
  }

  return findings;
}

function collectDuplicateFindings(snapshots: RouteSnapshot[]): Finding[] {
  const findings: Finding[] = [];
  const byTitle = new Map<string, string[]>();
  for (const snapshot of snapshots) {
    if (!snapshot.title.trim()) {
      continue;
    }
    const routes = byTitle.get(snapshot.title) ?? [];
    routes.push(snapshot.route);
    byTitle.set(snapshot.title, routes);
  }
  for (const [title, routes] of byTitle) {
    if (routes.length > 1) {
      for (const route of routes) {
        findings.push({
          route,
          check: "title-duplicate",
          detail: `title "${title}" is shared by routes: ${routes.join(", ")}`,
        });
      }
    }
  }
  return findings;
}

test.describe("rendered SEO", () => {
  test("SPA routes render production-ready metadata", async ({ page }) => {
    test.setTimeout(180_000);

    const snapshots: RouteSnapshot[] = [];
    for (const route of ROUTES) {
      snapshots.push(await snapshotRoute(page, route));
    }
    const homepage = snapshots[0];

    const findings = [
      ...snapshots.flatMap((snapshot) => collectRouteFindings(snapshot, homepage)),
      ...collectDuplicateFindings(snapshots),
    ];

    const baseline = loadBaseline("rendered-seo-baseline.json");
    const newFailures: string[] = [];
    const knownDebt: string[] = [];

    for (const finding of findings) {
      const entry = findEntry(baseline, finding.check, finding.route);
      const line = `[${finding.route}] ${finding.check}: ${finding.detail}`;
      if (entry && !isExpired(entry)) {
        knownDebt.push(`${line} (known debt: ${entry.ticket}, expires ${entry.expires})`);
      } else if (entry) {
        newFailures.push(`${line} (baseline entry ${entry.ticket} EXPIRED ${entry.expires})`);
      } else {
        newFailures.push(line);
      }
    }

    for (const line of knownDebt) {
      console.warn(`WARNING known SEO debt: ${line}`);
    }
    console.log(
      `Rendered SEO: ${snapshots.length} routes, ${knownDebt.length} known-debt finding(s), ${newFailures.length} new failure(s).`
    );

    const summaryPath = process.env.GITHUB_STEP_SUMMARY;
    if (summaryPath) {
      const lines = [
        "## Rendered SPA SEO",
        "",
        ...ROUTES.map((route) => {
          const routeFailures = newFailures.filter((line) => line.startsWith(`[${route}]`));
          const routeWarnings = knownDebt.filter((line) => line.startsWith(`[${route}]`));
          const status =
            routeFailures.length > 0 ? "FAIL" : routeWarnings.length > 0 ? "WARN" : "PASS";
          return `- ${route}: ${status}`;
        }),
        "",
      ];
      fs.appendFileSync(summaryPath, lines.join("\n"));
    }

    expect(newFailures, `New rendered-SEO failures:\n${newFailures.join("\n")}`).toEqual([]);
  });
});
