import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for POST-DEPLOY production smoke tests.
 * Unlike playwright.config.ts this starts NO local server — it targets the live
 * site (PRODUCTION_BASE_URL, default https://adealforge.com).
 * Non-production targets are refused unless ALLOW_NON_PRODUCTION_TARGET=1
 * (reserved for local mock-server negative tests).
 */
const baseURL = (process.env.PRODUCTION_BASE_URL || "https://adealforge.com").replace(/\/+$/, "");
const allowNonProduction = process.env.ALLOW_NON_PRODUCTION_TARGET === "1";

if (new URL(baseURL).hostname !== "adealforge.com" && !allowNonProduction) {
  throw new Error(
    `Refusing to run production smoke against non-production host "${new URL(baseURL).hostname}". ` +
      "Set ALLOW_NON_PRODUCTION_TARGET=1 only for local mock-server tests."
  );
}

export default defineConfig({
  testDir: "./e2e",
  testMatch: /release[\\/]production-smoke\.spec\.ts/,
  fullyParallel: false,
  forbidOnly: true,
  retries: 1,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
