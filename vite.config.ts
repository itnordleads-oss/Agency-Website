import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "path";
import { defineConfig, type PluginOption } from "vite";

import { cloudflare } from "@cloudflare/vite-plugin";

const require = createRequire(import.meta.url);

/**
 * Cloudflare's Vite plugin proxies every request through workerd. When the
 * native binary cannot start (common on Windows without the VC++ 2015–2022
 * Redistributable: STATUS_DLL_NOT_FOUND / 0xC0000135), the child pipe closes
 * and Vite surfaces the generic "write EOF" Internal Server Error.
 */
function isWorkerdRunnable(): boolean {
  try {
    const workerdModule = require("workerd") as { default?: string } | string;
    const workerdBin = typeof workerdModule === "string" ? workerdModule : workerdModule.default;
    if (!workerdBin) {
      return false;
    }

    execFileSync(workerdBin, ["--version"], {
      stdio: "ignore",
      timeout: 10_000,
      windowsHide: true,
    });
    return true;
  } catch {
    return false;
  }
}

function createCloudflarePlugins(command: "build" | "serve"): PluginOption[] {
  const forceCloudflare = process.env.VITE_FORCE_CLOUDFLARE === "1";
  // Build only needs the plugin transforms/output — not a live workerd process.
  const needsLiveWorkerd = command === "serve";
  const workerdOk = !needsLiveWorkerd || forceCloudflare || isWorkerdRunnable();

  if (needsLiveWorkerd && !workerdOk) {
    console.warn(
      "[vite] Cloudflare workerd failed to start (often missing Microsoft Visual C++ 2015–2022 Redistributable on Windows).\n" +
        "[vite] Serving the SPA without the Workers runtime to avoid broken stdout pipes on request handling.\n" +
        "[vite] Install the VC++ Redistributable (x64), or use `npm run preview:workers` for /api/*.\n" +
        "[vite] Set VITE_FORCE_CLOUDFLARE=1 to force-enable the plugin and surface the underlying error."
    );
    return [];
  }

  return [
    cloudflare({
      // Prefer the Vite-oriented SPA config. wrangler.toml remains the deploy
      // Worker source (see scripts/verify-deploy-config.mjs).
      configPath: "./wrangler.jsonc",
      // Avoid an extra inspector pipe that can also EOF when workerd dies early.
      inspectorPort: false,
    }),
  ];
}

export default defineConfig(({ command }) => {
  return {
    plugins: [react(), tailwindcss(), ...createCloudflarePlugins(command)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    build: {
      target: "es2020",
      cssCodeSplit: true,
      modulePreload: {
        polyfill: false,
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) {
              return;
            }
            if (id.includes("react-dom") || id.includes("/react/")) {
              return "react-vendor";
            }
            if (id.includes("i18next") || id.includes("react-i18next")) {
              return "i18n-vendor";
            }
            // Do not force all lucide icons into one chunk — that pulls Footer/FAQ
            // icons onto the critical path when Navbar/Hero import lucide.
            if (id.includes("vanilla-cookieconsent")) {
              return "cookie-vendor";
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== "true",
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
