# Agency Website — Production Deployment Checklist

Use before any production deploy. Do **not** deploy until every required item is checked or explicitly waived by leadership.

## Gate

- [ ] 1. Approved branch / release commit on `main` (not a feature branch)
- [ ] 2. CI green on the release PR (`typecheck`, `lint`, `format`, `build`, Playwright)
- [ ] 3. Pre-Release Gate green (build hygiene, SEO checks, a11y, critical smoke)
- [ ] 4. `npm run build` succeeds independently (no ADealForge clone)
- [ ] 5. `node scripts/verify-deploy-config.mjs` passes (single Wrangler config)

## Domain & SEO

- [ ] 6. Leadership-approved production domain confirmed
- [ ] 7. `SITE_ORIGIN` / `VITE_STUDIO_DOMAIN` set for the release build (not `adealforge.com`)
- [ ] 8. Sitemap `<loc>` and robots `Sitemap:` match the approved origin
- [ ] 9. Canonical / OG absolute URLs use the approved origin (or path-only only while still TBC — do not ship TBC to public SEO)
- [ ] 10. Favicon + OG image assets approved and present

## Environment & secrets

- [ ] 11. Client `VITE_*` vars configured for Agency Website (not ADealForge IDs)
- [ ] 12. `TURNSTILE_SECRET_KEY` set as a Cloudflare Worker secret
- [ ] 13. Agency Turnstile widget hostnames allow the production domain
- [ ] 14. `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` GitHub secrets present
- [ ] 15. `LEADS_KV` namespace confirmed for the Agency Cloudflare account
- [ ] 16. No secrets committed (`.env`, `.dev.vars` absent from git)

## Product surface

- [ ] 17. Contact form tested on Workers preview / staging with real Turnstile
- [ ] 18. Contact failure paths visible (missing secret → 500, bad captcha → 400) — never fake success
- [ ] 19. Analytics decision verified (GA4 off unless approved Agency measurement ID)
- [ ] 20. F9 product-route redirects merged and verified (`/platform`, `/workflow`, landings)
- [ ] 21. Direct refresh works for `/`, `/services`, `/about`, `/contact`, `/terms`
- [ ] 22. `/work` unpublished (no nav/sitemap) unless F7 approved

## Content readiness

- [ ] 23. F4–F8 / F10–F12 content approved enough for a public demo (no placeholder-only launch unless leadership accepts)
- [ ] 24. Mobile sanity check on core routes
- [ ] 25. Leadership review complete
- [ ] 26. Explicit production deploy approval recorded

## After deploy

- [ ] 27. Post-deploy smoke with `PRODUCTION_BASE_URL=<approved origin>`
- [ ] 28. Record Wrangler version / deployment ID in release notes
- [ ] 29. Rollback plan known (prior Worker version)

## Explicit non-actions (F14 prep)

- Do not change live DNS from this repo
- Do not merge to `main` without review
- Do not deploy from feature branches
- Do not reuse ADealForge Turnstile secrets or analytics IDs
