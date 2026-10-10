# Agency Website

Standalone marketing website for the agency.

## Origin of this codebase

Bootstrapped from the reusable frontend of:

- Reference: `nleads/adealforge` branch `develop` @ `97874dc`
- Target (this repo): `itnordleads-oss/Agency-Website`

ADealForge is **reference-only**. All future agency work happens in this repository.

## Local development

```bash
npm install
npm run dev
```

Contact API + Turnstile locally (when workerd is available):

```bash
cp .dev.vars.example .dev.vars
# set TURNSTILE_SECRET_KEY
npm run preview:workers
```

## Build

```bash
npm ci
npm run build
```

Output: `dist/` (Vite assets + agency `sitemap.xml` / `robots.txt`).  
Build does **not** require cloning ADealForge.

## Deployment

Target: **Cloudflare Workers** + static assets (`wrangler.toml`).

- Guide: [`docs/deployment.md`](docs/deployment.md)
- Checklist: [`docs/deployment-checklist.md`](docs/deployment-checklist.md)
- Verify config: `node scripts/verify-deploy-config.mjs`
- Production deploy is **manual** (GitHub Actions `Deploy Production`) and requires leadership approval

Do **not** set `SITE_ORIGIN` / production smoke targets to `adealforge.com`.

## Environment

See [`.env.example`](.env.example) for public/build-time variables and [`.dev.vars.example`](.dev.vars.example) for Worker secrets.

## Important

- Do not push agency work to `nleads/adealforge`
- Copy/branding conversion continues via feature branches (`feature/agency-f*`)
- Do not commit secrets (`.env`, `.dev.vars`)
- Do not invent a production domain — wait for leadership approval

## Scripts

See `package.json` for `dev`, `build`, `lint`, `typecheck`, `test`, `preview`, `preview:workers`, and `deploy`.
