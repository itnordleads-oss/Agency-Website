/**
 * Deploy configuration gate — proves the effective Wrangler configuration is
 * complete and unambiguous BEFORE any production deployment is attempted.
 * While both wrangler.toml and wrangler.jsonc exist (the known conflict), this
 * check fails and the deploy workflow cannot proceed.
 * Run: node scripts/verify-deploy-config.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const TOML_PATH = path.join(ROOT, "wrangler.toml");
const JSONC_PATH = path.join(ROOT, "wrangler.jsonc");

// The KV namespace id currently bound in production (from wrangler.toml).
const EXPECTED_KV_ID = "1e160c5d95074707adb2946f60aaad9e";

const failures = [];

function parseToml(text) {
  return {
    main: text.match(/^main\s*=\s*"([^"]+)"/m)?.[1] ?? null,
    assetsDirectory: text.match(/\[assets\][\s\S]*?directory\s*=\s*"([^"]+)"/)?.[1] ?? null,
    assetsBinding: text.match(/\[assets\][\s\S]*?binding\s*=\s*"([^"]+)"/)?.[1] ?? null,
    runWorkerFirst: /run_worker_first\s*=\s*\[[^\]]*"\/api\/\*"/.test(text),
    notFoundHandling: text.match(/not_found_handling\s*=\s*"([^"]+)"/)?.[1] ?? null,
    kvBinding: /\[\[kv_namespaces\]\][\s\S]*?binding\s*=\s*"LEADS_KV"/.test(text),
    kvId: text.match(/\[\[kv_namespaces\]\][\s\S]*?id\s*=\s*"([^"]+)"/)?.[1] ?? null,
    compatibilityFlags: /nodejs_compat/.test(text),
    observability: /\[observability\][\s\S]*?enabled\s*=\s*true/.test(text),
  };
}

function parseJsonc(text) {
  const withoutComments = text.replace(/^\s*\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  const withoutTrailingCommas = withoutComments.replace(/,(\s*[}\]])/g, "$1");
  const config = JSON.parse(withoutTrailingCommas);
  return {
    main: config.main ?? null,
    assetsDirectory: config.assets?.directory ?? null,
    assetsBinding: config.assets?.binding ?? null,
    runWorkerFirst: Array.isArray(config.assets?.run_worker_first)
      ? config.assets.run_worker_first.includes("/api/*")
      : false,
    notFoundHandling: config.assets?.not_found_handling ?? null,
    kvBinding: Array.isArray(config.kv_namespaces)
      ? config.kv_namespaces.some((kv) => kv.binding === "LEADS_KV")
      : false,
    kvId: Array.isArray(config.kv_namespaces)
      ? (config.kv_namespaces.find((kv) => kv.binding === "LEADS_KV")?.id ?? null)
      : null,
    compatibilityFlags: Array.isArray(config.compatibility_flags)
      ? config.compatibility_flags.includes("nodejs_compat")
      : false,
    observability: config.observability?.enabled === true,
  };
}

const tomlExists = fs.existsSync(TOML_PATH);
const jsoncExists = fs.existsSync(JSONC_PATH);

if (tomlExists && jsoncExists) {
  console.error(
    "DEPLOY BLOCKED: both wrangler.toml and wrangler.jsonc exist.\n" +
      "Wrangler resolves wrangler.jsonc, which currently lacks the Worker entry point,\n" +
      "the ASSETS binding/run_worker_first routing, and the LEADS_KV binding — deploying\n" +
      "now would ship an assets-only site and break /api/contact.\n" +
      "Consolidate to a single configuration first (see the approved remediation proposal)."
  );
  process.exit(1);
}
if (!tomlExists && !jsoncExists) {
  console.error("DEPLOY BLOCKED: no Wrangler configuration file found.");
  process.exit(1);
}

const config = tomlExists
  ? parseToml(fs.readFileSync(TOML_PATH, "utf8"))
  : parseJsonc(fs.readFileSync(JSONC_PATH, "utf8"));
const source = tomlExists ? "wrangler.toml" : "wrangler.jsonc";

if (!config.main) {
  failures.push("missing Worker entry point (main)");
}
if (!config.assetsDirectory) {
  failures.push("missing assets directory");
}
if (!config.assetsBinding) {
  failures.push("missing ASSETS binding");
}
if (!config.runWorkerFirst) {
  failures.push('missing run_worker_first for "/api/*"');
}
if (config.notFoundHandling !== "single-page-application") {
  failures.push('missing assets not_found_handling = "single-page-application"');
}
if (!config.kvBinding) {
  failures.push("missing LEADS_KV binding");
}
if (config.kvId !== EXPECTED_KV_ID) {
  failures.push(
    `LEADS_KV id mismatch — expected the production namespace id ending ...${EXPECTED_KV_ID.slice(-6)}, got ${config.kvId ? `...${config.kvId.slice(-6)}` : "none"}`
  );
}
if (!config.compatibilityFlags) {
  failures.push("missing nodejs_compat compatibility flag");
}
if (!config.observability) {
  failures.push("missing observability.enabled = true");
}

if (failures.length > 0) {
  console.error(
    `DEPLOY BLOCKED: ${source} is not a complete production configuration:\n` +
      failures.map((f) => `  - ${f}`).join("\n")
  );
  process.exit(1);
}

console.log(
  `Deploy configuration OK (${source}): worker, assets routing, LEADS_KV, SPA fallback, observability.`
);
