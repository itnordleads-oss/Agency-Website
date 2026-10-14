import fs from "node:fs";

import { AxeBuilder } from "@axe-core/playwright";
import type { AxeResults } from "axe-core";
import { expect, test, type Page } from "@playwright/test";

import { acceptCookiesIfPresent } from "../helpers/cookies";
import { findEntry, isExpired, loadBaseline } from "./baseline";

/**
 * Automated accessibility release check (axe-core via Playwright).
 *
 * Triage mode: confirmed pre-existing violations listed in
 * e2e/release/baselines/a11y-baseline.json stay warnings (each with reason,
 * remediation reference and expiry). NEW critical/serious violations fail.
 * Moderate/minor findings are always report-only.
 *
 * Passing axe does NOT mean full WCAG compliance. Manual QA remains required
 * for keyboard navigation, tab order, focus management/restoration, screen
 * reader flow, visible focus quality, 200% zoom, text scaling, motion
 * preferences, and real-device behavior.
 */

const SPA_ROUTES = [
  "/",
  "/services",
  "/services/software-development",
  "/services/website-development",
  "/services/mobile-app-development",
  "/services/shopify-stores",
  "/services/wordpress-websites",
  "/services/custom-wordpress-theme-development",
  "/about",
  "/contact",
  "/terms",
] as const;
const GATE_IMPACTS = new Set(["critical", "serious"]);

interface ViolationRecord {
  stateKey: string;
  ruleId: string;
  impact: string;
  target: string;
  summary: string;
}

async function scan(page: Page, stateKey: string): Promise<ViolationRecord[]> {
  const results: AxeResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const records: ViolationRecord[] = [];
  for (const violation of results.violations) {
    for (const node of violation.nodes) {
      records.push({
        stateKey,
        ruleId: violation.id,
        impact: violation.impact ?? "minor",
        target: node.target.join(" "),
        summary: node.failureSummary?.split("\n")[0] ?? violation.help,
      });
    }
  }
  return records;
}

test.describe("accessibility", () => {
  test("public routes and key interactive states", async ({ page }) => {
    test.setTimeout(300_000);

    const records: ViolationRecord[] = [];

    for (const route of SPA_ROUTES) {
      await page.goto(route);
      // Default state includes the cookie banner for first-time visitors.
      // Wait for the app shell — not every route currently renders an h1.
      await page.locator("main").first().waitFor({ state: "attached", timeout: 15_000 });
      records.push(...(await scan(page, `${route} :: banner visible`)));

      await acceptCookiesIfPresent(page);
      records.push(...(await scan(page, `${route} :: banner dismissed`)));
    }

    await page.goto("/");
    await acceptCookiesIfPresent(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await page.getByRole("dialog", { name: "Main menu" }).waitFor({ state: "visible" });
    records.push(...(await scan(page, "/ :: mobile menu open")));

    const baseline = loadBaseline("a11y-baseline.json");
    const newFailures: string[] = [];
    const knownDebt: string[] = [];
    const reportOnly: string[] = [];
    const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };

    for (const record of records) {
      counts[record.impact as keyof typeof counts] =
        (counts[record.impact as keyof typeof counts] ?? 0) + 1;
      const id = `${record.ruleId}::${record.target}`;
      const line = `[${record.stateKey}] ${record.impact} ${record.ruleId} at ${record.target} — ${record.summary}`;

      if (!GATE_IMPACTS.has(record.impact)) {
        reportOnly.push(line);
        continue;
      }
      const entry = findEntry(baseline, id, record.stateKey);
      if (entry && !isExpired(entry)) {
        knownDebt.push(`${line} (known debt: ${entry.ticket}, expires ${entry.expires})`);
      } else if (entry) {
        newFailures.push(`${line} (baseline entry ${entry.ticket} EXPIRED ${entry.expires})`);
      } else {
        newFailures.push(line);
      }
    }

    for (const line of knownDebt) {
      console.warn(`WARNING known a11y debt: ${line}`);
    }
    for (const line of reportOnly) {
      console.warn(`REPORT moderate/minor: ${line}`);
    }
    console.log(
      `A11y: ${records.length} violation node(s) — critical ${counts.critical}, serious ${counts.serious}, moderate ${counts.moderate}, minor ${counts.minor}. ` +
        `${knownDebt.length} known-debt, ${newFailures.length} new gate failure(s).`
    );

    const summaryPath = process.env.GITHUB_STEP_SUMMARY;
    if (summaryPath) {
      fs.appendFileSync(
        summaryPath,
        [
          "## Accessibility (axe-core)",
          "",
          `- Violation nodes: ${records.length} (critical ${counts.critical}, serious ${counts.serious}, moderate ${counts.moderate}, minor ${counts.minor})`,
          `- Known debt (baselined): ${knownDebt.length}`,
          `- New gate failures: ${newFailures.length}`,
          "- Note: axe automation does not replace manual keyboard/focus/screen-reader/zoom/motion QA.",
          "",
        ].join("\n")
      );
    }

    await test.info().attach("axe-violations", {
      body: JSON.stringify(records, null, 2),
      contentType: "application/json",
    });

    expect(newFailures, `New accessibility failures:\n${newFailures.join("\n")}`).toEqual([]);
  });
});
