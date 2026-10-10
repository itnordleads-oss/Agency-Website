/**
 * Lighthouse collector for the pre-release gate.
 * Serves the SHARED dist/ artifact via a fresh vite preview (never a rebuild),
 * runs Lighthouse N times per route, and writes raw JSON/HTML reports to
 * lighthouse-results/<preset>/. Analysis lives in scripts/report-lighthouse.mjs.
 *
 * Uses the lighthouse engine provided by @lhci/cli (see package.json). A custom
 * collector is used instead of `lhci collect` because collect aborts on this
 * Windows sandbox's temp-cleanup EPERM before writing results; this runner
 * treats profile-cleanup failures as warnings and behaves identically on CI.
 *
 * Usage: node scripts/run-lighthouse.mjs --preset=mobile|desktop [--runs=3]
 */

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { launch as launchChrome } from "chrome-launcher";
import lighthouse, { desktopConfig } from "lighthouse";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const ROUTES = [
  { slug: "home", path: "/" },
  { slug: "landing-b2b-lead-generation", path: "/landing/b2b-lead-generation/" },
];
const PREVIEW_PORT = 4173;
const PREVIEW_URL = `http://127.0.0.1:${PREVIEW_PORT}`;

const args = process.argv.slice(2);
function argValue(name, fallback) {
  const prefix = `--${name}=`;
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) {
    return inline.slice(prefix.length);
  }
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
}
const PRESET = argValue("preset", "mobile");
const RUNS = Number(argValue("runs", "3"));
const OUTPUT_DIR = path.join(ROOT, argValue("output", "lighthouse-results"), PRESET);

if (!["mobile", "desktop"].includes(PRESET)) {
  console.error(`Invalid --preset "${PRESET}" (expected mobile|desktop).`);
  process.exit(2);
}

function startPreviewServer() {
  // Spawn vite directly (no npm/shell wrapper) so kill() cannot orphan a
  // grandchild process holding the preview port.
  const server = spawn(
    process.execPath,
    [
      path.join(ROOT, "node_modules", "vite", "bin", "vite.js"),
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      String(PREVIEW_PORT),
      "--strictPort",
    ],
    {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  return server;
}

async function waitForServer(timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(PREVIEW_URL, { signal: AbortSignal.timeout(2_000) });
      if (response.ok) {
        return;
      }
    } catch {
      // not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Preview server did not become ready within ${timeoutMs}ms.`);
}

async function stopServer(server) {
  if (!server || server.killed) {
    return;
  }
  server.kill("SIGTERM");
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (!server.killed) {
    server.kill("SIGKILL");
  }
}

async function main() {
  if (!fs.existsSync(path.join(ROOT, "dist", "index.html"))) {
    console.error("dist/ is missing — Lighthouse must run against the shared release artifact.");
    process.exit(1);
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Refuse to run against a stale preview server — every run must serve a
  // freshly spawned preview of the current artifact.
  try {
    await fetch(PREVIEW_URL, { signal: AbortSignal.timeout(1_500) });
    console.error(
      `Port ${PREVIEW_PORT} already serves a preview — stop the stale server first (fresh-server policy).`
    );
    process.exit(2);
  } catch {
    // expected: nothing listening yet
  }

  const server = startPreviewServer();
  let chrome = null;
  let infraFailed = false;

  try {
    await waitForServer();

    chrome = await launchChrome({
      chromeFlags: ["--no-sandbox", "--headless=new", "--disable-gpu"],
    });

    const config = PRESET === "desktop" ? desktopConfig : undefined;
    const options = {
      port: chrome.port,
      output: ["json", "html"],
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    };

    for (const route of ROUTES) {
      let successfulRuns = 0;
      for (let run = 1; run <= RUNS; run += 1) {
        const url = `${PREVIEW_URL}${route.path}`;
        try {
          const result = await lighthouse(url, options, config);
          if (!result?.lhr) {
            throw new Error("empty Lighthouse result");
          }
          const base = path.join(OUTPUT_DIR, `${route.slug}-run-${run}`);
          fs.writeFileSync(`${base}.json`, JSON.stringify(result.lhr));
          fs.writeFileSync(`${base}.html`, result.report[1]);
          successfulRuns += 1;
          console.log(
            `${PRESET} ${route.slug} run ${run}: performance=${Math.round(result.lhr.categories.performance.score * 100)}`
          );
        } catch (error) {
          console.warn(`WARNING: ${PRESET} ${route.slug} run ${run} failed: ${error.message}`);
        }
      }
      if (successfulRuns < Math.min(2, RUNS)) {
        console.error(
          `INFRASTRUCTURE FAILURE: only ${successfulRuns}/${RUNS} Lighthouse runs succeeded for ${route.path}.`
        );
        infraFailed = true;
      }
    }
  } catch (error) {
    console.error(`INFRASTRUCTURE FAILURE: ${error.message}`);
    infraFailed = true;
  } finally {
    if (chrome) {
      try {
        await chrome.kill();
      } catch (error) {
        // Windows sandbox temp-cleanup EPERM — harmless; the report is already written.
        console.warn(`WARNING: Chrome profile cleanup failed (harmless): ${error.message}`);
      }
    }
    await stopServer(server);
  }

  if (infraFailed) {
    process.exit(1);
  }
  console.log(`Lighthouse collect complete: preset=${PRESET}, runs=${RUNS}, output=${OUTPUT_DIR}`);
}

await main();
