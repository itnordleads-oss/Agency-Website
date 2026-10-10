/**
 * Lighthouse reporter for the pre-release gate.
 * Reads raw runs from lighthouse-results/<preset>/, computes medians per route,
 * prints + summarizes results, and compares them against
 * scripts/lighthouse-baseline.json.
 *
 * Quality findings are ALWAYS warnings (exit 0) — absolute scores on shared CI
 * runners are too variable to block merges. Only infrastructure problems
 * (missing/malformed results) exit non-zero.
 *
 * Usage:
 *   node scripts/report-lighthouse.mjs [--results=lighthouse-results]
 *   node scripts/report-lighthouse.mjs --update-baseline   (local baseline refresh)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BASELINE_PATH = path.join(ROOT, "scripts", "lighthouse-baseline.json");

const args = process.argv.slice(2);
const UPDATE_BASELINE = args.includes("--update-baseline");
function argValue(name, fallback) {
  const prefix = `--${name}=`;
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) {
    return inline.slice(prefix.length);
  }
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
}
const RESULTS_ROOT = path.join(ROOT, argValue("results", "lighthouse-results"));

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const METRICS = {
  "largest-contentful-paint": { label: "LCP", unit: "s", from: (v) => v / 1000, digits: 2 },
  "cumulative-layout-shift": { label: "CLS", unit: "", from: (v) => v, digits: 3 },
  "total-blocking-time": { label: "TBT", unit: "ms", from: (v) => v, digits: 0 },
  "first-contentful-paint": { label: "FCP", unit: "s", from: (v) => v / 1000, digits: 2 },
  "speed-index": { label: "SI", unit: "s", from: (v) => v / 1000, digits: 2 },
};

const REGRESSION_RULES = [
  { key: "performance", kind: "category", drop: 10, label: "Performance score" },
  { key: "accessibility", kind: "category", drop: 5, label: "Accessibility score" },
  { key: "best-practices", kind: "category", drop: 5, label: "Best Practices score" },
  { key: "seo", kind: "category", drop: 5, label: "SEO score" },
  { key: "largest-contentful-paint", kind: "metric", increaseRatio: 1.25, label: "LCP" },
  { key: "total-blocking-time", kind: "metric", increaseRatio: 1.5, label: "TBT" },
  // CLS is the most runner-stable metric — the strongest future blocking candidate.
  {
    key: "cumulative-layout-shift",
    kind: "metric",
    increaseRatio: 1.5,
    increaseAbs: 0.05,
    label: "CLS",
  },
];

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function routeSlugFromFilename(name) {
  return name.replace(/-run-\d+\.json$/, "");
}

function loadRuns(presetDir) {
  const runs = new Map();
  for (const file of fs.readdirSync(presetDir)) {
    if (!file.endsWith(".json") || file === "summary.json") {
      continue;
    }
    const slug = routeSlugFromFilename(file);
    let lhr;
    try {
      lhr = JSON.parse(fs.readFileSync(path.join(presetDir, file), "utf8"));
    } catch {
      throw new Error(`Malformed Lighthouse result JSON: ${file}`);
    }
    if (!lhr.categories || !lhr.audits) {
      throw new Error(`Lighthouse result JSON is missing categories/audits: ${file}`);
    }
    if (!runs.has(slug)) {
      runs.set(slug, []);
    }
    runs.get(slug).push(lhr);
  }
  return runs;
}

function summarizeRoute(lhrs) {
  const summary = {};
  for (const category of CATEGORIES) {
    summary[category] = Math.round(median(lhrs.map((lhr) => lhr.categories[category].score)) * 100);
  }
  for (const [auditId, metric] of Object.entries(METRICS)) {
    summary[auditId] = Number(
      median(lhrs.map((lhr) => metric.from(lhr.audits[auditId].numericValue))).toFixed(
        metric.digits
      )
    );
  }
  return summary;
}

function formatTable(presetName, routes) {
  const header = `| Route | Perf | A11y | BestPr | SEO | LCP | CLS | TBT | FCP | SI |`;
  const divider = `|---|---|---|---|---|---|---|---|---|---|`;
  const rows = Object.entries(routes).map(([slug, s]) => {
    const cells = [
      slug,
      ...CATEGORIES.map((c) => s[c]),
      s["largest-contentful-paint"] + "s",
      s["cumulative-layout-shift"],
      s["total-blocking-time"] + "ms",
      s["first-contentful-paint"] + "s",
      s["speed-index"] + "s",
    ];
    return `| ${cells.join(" | ")} |`;
  });
  return [`### ${presetName}`, "", header, divider, ...rows, ""].join("\n");
}

function compareWithBaseline(results, baseline) {
  const warnings = [];
  if (!baseline?.routes) {
    return [
      "No approved Lighthouse baseline found — recording-only mode (no regression comparison).",
    ];
  }
  for (const [preset, routes] of Object.entries(results)) {
    for (const [slug, summary] of Object.entries(routes)) {
      const base = baseline.routes?.[slug]?.[preset];
      if (!base) {
        warnings.push(`No baseline for ${slug} (${preset}) — skipped comparison.`);
        continue;
      }
      for (const rule of REGRESSION_RULES) {
        const current = summary[rule.key];
        const reference = base[rule.key];
        if (current === undefined || reference === undefined) {
          continue;
        }
        if (rule.kind === "category" && current < reference - rule.drop) {
          warnings.push(
            `${rule.label} regressed on ${slug} (${preset}): ${reference} → ${current} (allowed drop ${rule.drop}).`
          );
        }
        if (rule.kind === "metric") {
          const ratioBreached = rule.increaseRatio && current > reference * rule.increaseRatio;
          const absBreached = rule.increaseAbs && current > reference + rule.increaseAbs;
          if (ratioBreached && (rule.increaseAbs === undefined || absBreached)) {
            warnings.push(
              `${rule.label} regressed on ${slug} (${preset}): ${reference} → ${current} (baseline x${rule.increaseRatio}${rule.increaseAbs ? ` / +${rule.increaseAbs}` : ""}).`
            );
          }
        }
      }
    }
  }
  return warnings;
}

function main() {
  try {
    run();
  } catch (error) {
    console.error(`INFRASTRUCTURE FAILURE: ${error.message}`);
    process.exit(1);
  }
}

function run() {
  if (!fs.existsSync(RESULTS_ROOT)) {
    console.error(`INFRASTRUCTURE FAILURE: results directory not found: ${RESULTS_ROOT}`);
    process.exit(1);
  }

  const results = {};
  for (const preset of fs.readdirSync(RESULTS_ROOT)) {
    const presetDir = path.join(RESULTS_ROOT, preset);
    if (!fs.statSync(presetDir).isDirectory()) {
      continue;
    }
    const runs = loadRuns(presetDir);
    if (runs.size === 0) {
      continue;
    }
    results[preset] = {};
    for (const [slug, lhrs] of runs) {
      results[preset][slug] = summarizeRoute(lhrs);
    }
  }

  if (Object.keys(results).length === 0) {
    console.error(`INFRASTRUCTURE FAILURE: no Lighthouse runs found under ${RESULTS_ROOT}.`);
    process.exit(1);
  }

  if (UPDATE_BASELINE) {
    const baseline = {
      description:
        "Approved Lighthouse baseline (medians of 3 runs). Regenerated manually via `node scripts/report-lighthouse.mjs --update-baseline`; review changes before committing.",
      recordedAt: new Date().toISOString().slice(0, 10),
      sourceCommit: process.env.GITHUB_SHA ?? "local",
      routes: {},
    };
    for (const [preset, routes] of Object.entries(results)) {
      for (const [slug, summary] of Object.entries(routes)) {
        baseline.routes[slug] = { ...(baseline.routes[slug] ?? {}), [preset]: summary };
      }
    }
    fs.writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2) + "\n");
    console.log(`Baseline written to ${path.relative(ROOT, BASELINE_PATH)}.`);
  }

  const baseline = fs.existsSync(BASELINE_PATH)
    ? JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"))
    : null;
  const regressionWarnings = UPDATE_BASELINE ? [] : compareWithBaseline(results, baseline);

  const summaryParts = ["## Lighthouse Release Report", ""];
  for (const preset of ["desktop", "mobile"]) {
    if (results[preset]) {
      const table = formatTable(preset === "desktop" ? "Desktop" : "Mobile", results[preset]);
      summaryParts.push(table);
      console.log(`\n${table}`);
    }
  }

  if (regressionWarnings.length > 0) {
    summaryParts.push("### Regressions / Warnings", "");
    for (const message of regressionWarnings) {
      summaryParts.push(`- ${message}`);
      console.warn(`::warning::${message}`);
    }
    summaryParts.push("");
  } else if (!UPDATE_BASELINE) {
    summaryParts.push("No regressions vs baseline.", "");
  }

  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    fs.appendFileSync(summaryPath, summaryParts.join("\n"));
  }

  console.log(
    `\nLighthouse report: ${regressionWarnings.length} regression warning(s) (informational, non-blocking).`
  );
}

main();
