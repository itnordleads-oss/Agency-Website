# Agency Website — Deployment Preparation (F14)

Standalone deployment guide for `itnordleads-oss/Agency-Website`.  
ADealForge is reference-only. Do not deploy this site with ADealForge domains, secrets, or Cloudflare project bindings by accident.

## Architecture (actual)

| Item           | Value                                                   |
| -------------- | ------------------------------------------------------- |
| Provider       | **Cloudflare Workers** + static assets                  |
| App name       | `agency-website` (`wrangler.toml`)                      |
| Build          | `npm run build` → Vite `dist/` + agency sitemap/robots  |
| Worker entry   | `worker/index.ts`                                       |
| Contact API    | `POST /api/contact` (Turnstile + `LEADS_KV`)            |
| SPA fallback   | `assets.not_found_handling = "single-page-application"` |
| Deploy command | `npm run deploy` / CI `wrangler deploy` (manual, gated) |

There is **no** auto-deploy on push. Production deploy is `workflow_dispatch` on `.github/workflows/deploy.yml`, main-only, confirm `DEPLOY`.

## Independent build rule

This repository must install and build without cloning ADealForge:

```bash
npm ci
npm run build
```

No submodule, symlink, or `../adealforge` import is required.

## Environment variables

### Client / build-time (`VITE_*` — public in the bundle)

| Variable                             | Class               | Required for prod?      | Notes                                                             |
| ------------------------------------ | ------------------- | ----------------------- | ----------------------------------------------------------------- |
| `VITE_STUDIO_DOMAIN`                 | BUILD-TIME / PUBLIC | Yes before SEO go-live  | Hostname only or full HTTPS origin; drives branding absolute URLs |
| `SITE_ORIGIN` / `PUBLIC_SITE_ORIGIN` | BUILD-TIME          | Yes before SEO go-live  | Absolute origin for sitemap/robots; **never** `adealforge.com`    |
| `VITE_TURNSTILE_SITE_KEY`            | PUBLIC              | Yes for Contact         | Agency Turnstile **site** key (not secret)                        |
| `VITE_CONTACT_ENDPOINT`              | PUBLIC              | Optional                | Default `/api/contact`                                            |
| `VITE_GA_MEASUREMENT_ID`             | PUBLIC / OPTIONAL   | No                      | Only if leadership approved GA4; Agency-specific ID               |
| `VITE_SEO_*` / branding `VITE_*`     | PUBLIC / OPTIONAL   | As approved             | See `.env.example`                                                |
| `VITE_CONTACT_EMAIL`                 | PUBLIC / OPTIONAL   | When publishing contact |                                                                   |
| Scheduler / social / WhatsApp        | PUBLIC / OPTIONAL   | When publishing         |                                                                   |

### Server-side secrets (Cloudflare Worker / `.dev.vars` — never commit)

| Variable                | Class         | Required for Contact | Notes                                   |
| ----------------------- | ------------- | -------------------- | --------------------------------------- |
| `TURNSTILE_SECRET_KEY`  | SERVER SECRET | Yes                  | Cloudflare secret / `.dev.vars` locally |
| `CLOUDFLARE_API_TOKEN`  | CI SECRET     | For deploy workflow  | GitHub Actions secret                   |
| `CLOUDFLARE_ACCOUNT_ID` | CI SECRET     | For deploy workflow  | GitHub Actions secret                   |

### Local files

- `.env` / `.env.*` — gitignored (except `.env.example`)
- `.dev.vars` — gitignored (see `.dev.vars.example`)
- Never put `TURNSTILE_SECRET_KEY` in `VITE_*` or client code

## Wrangler

Single config: **`wrangler.toml`** (F14 removed the dual `wrangler.jsonc` conflict).

Before production deploy:

```bash
node scripts/verify-deploy-config.mjs
```

Confirm `LEADS_KV` namespace ID belongs to the **Agency-Website** Cloudflare account.

## Staging

No dedicated staging project is defined in-repo. Recommendation (do not invent DNS):

- Use a Workers preview / separate Worker name only after leadership approval
- Keep staging `robots` non-indexable if a public staging hostname is used
- Use separate Turnstile hostnames and secrets from production

## Production deploy (do not run without explicit approval)

1. Feature work merged to `develop`, then release PR to `main`
2. Pre-Release Gate green on the `main` PR
3. Domain + env + secrets configured (checklist below)
4. Manual `Deploy Production` workflow on `main` with confirm `DEPLOY` and pre-release run ID
5. Post-deploy smoke with `PRODUCTION_BASE_URL` set to the **approved** agency origin

### Commands (local)

```bash
npm ci
npm run typecheck
npm run lint
npm run build
node scripts/verify-deploy-config.mjs
node scripts/check-release-build.mjs
# Preview static assets only:
npm run preview
# Preview with Worker (/api/contact) when workerd is available:
npm run preview:workers
# Production deploy (requires Cloudflare auth + approval — do not run casually):
# npm run deploy
```

## DNS

Do not modify DNS from this repository. When a domain is approved, document required Cloudflare DNS records with leadership/ops outside this prep task.

## Redirects

- Legacy homepage paths (`/homepage-v1|v2|v3`) → `301` to `/` (Worker)
- Product `/platform`, `/workflow`, `/landing/*` retirement redirects are owned by **F9** (not merged on `develop` at F14 prep time). Until F9 lands, those paths remain SPA-served and must stay **out of sitemap**.

## Deployment checklist

See [deployment-checklist.md](./deployment-checklist.md).
