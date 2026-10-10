import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for POST-DEPLOY production smoke tests.
 * Unlike playwright.config.ts this starts NO local server — it targets the live
 * site via PRODUCTION_BASE_URL (required). Never defaults to adealforge.com.
 * Non-production targets are refused unless ALLOW_NON_PRODUCTION_TARGET=1
 * (reserved for local mock-server negative tests).
 */
const configured = process.env.PRODUCTION_BASE_URL?.trim();
if (!configured) {
  throw new Error(
    "PRODUCTION_BASE_URL is required for production smoke. " +
      "Do not default to adealforge.com for the Agency Website."
  );
}

const baseURL = configured.replace(/\/+$/, "");
const allowNonProduction = process.env.ALLOW_NON_PRODUCTION_TARGET === "1";
const hostname = new URL(baseURL).hostname;

if (/adealforge\.com$/i.test(hostname) && !allowNonProduction) {
  throw new Error(
    `Refusing to run Agency Website production smoke against retired product host "${hostname}".`
  );
}

if (
  (hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".workers.dev") ||
    hostname.endsWith(".pages.dev") ||
    /staging/i.test(hostname)) &&
  !allowNonProduction
) {
  throw new Error(
    `Refusing to run production smoke against non-production host "${hostname}". ` +
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
