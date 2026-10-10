import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const baseURL = `http://127.0.0.1:${PORT}`;
const isCI = !!process.env.CI;
// Release mode is opt-in: the pre-release workflow sets PLAYWRIGHT_RELEASE_MODE=1.
// Without it, behavior is identical to the original development setup — Chromium
// only, and the release-only specs under e2e/release/ are ignored.
const isReleaseMode = !!process.env.PLAYWRIGHT_RELEASE_MODE;
const RELEASE_SPEC_DIR = /e2e[\\/]release[\\/]/;

/**
 * Playwright E2E config for the Vite app.
 * CI expects a prior `npm run build`; local `npm test` builds first.
 * Serves production assets via `vite preview` (same pattern as common Vite + Playwright setups).
 *
 * WebKit here is the Playwright Linux engine — useful engine-coverage signal, but
 * NOT equivalent to real Safari on macOS/iOS. Real Safari/iOS stays manual QA.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      ...(isReleaseMode ? {} : { testIgnore: [RELEASE_SPEC_DIR] }),
    },
    ...(isReleaseMode
      ? [
          {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
            grep: /@critical/,
          },
          {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
            grep: /@critical/,
          },
        ]
      : []),
  ],
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
