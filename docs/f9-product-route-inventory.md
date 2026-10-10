# F9 — Product route inventory and retirement decisions

Branch: `feature/agency-f9-retire-product-surfaces`

Client redirects: `src/lib/productRouteRetirement.ts` + `resolvePublicPath` in `App.tsx`  
Production HTTP 301: `worker/index.ts`

## Full route inventory

| Path           | Component / owner       | Purpose                    | Agency relevance      | Nav     | Footer | Sitemap (before) | Decision                        | Destination |
| -------------- | ----------------------- | -------------------------- | --------------------- | ------- | ------ | ---------------- | ------------------------------- | ----------- |
| `/`            | HomepageV3Page          | Production homepage        | Keep                  | Yes     | Yes    | Yes              | KEEP                            | —           |
| `/services`    | ServicesPage (F5 shell) | Agency services            | Keep                  | Yes     | Yes    | No → Yes         | KEEP                            | —           |
| `/about`       | AboutPage               | Agency about               | Keep                  | Yes     | Yes    | No → Yes         | KEEP                            | —           |
| `/contact`     | ContactPage             | Contact                    | Keep                  | Yes     | Yes    | Yes              | KEEP                            | —           |
| `/terms`       | TermsPage               | Legal                      | Keep                  | Footer  | Yes    | Yes              | KEEP                            | —           |
| `/work`        | Unpublished (F7)        | Case studies               | Hidden until approved | No      | No     | No               | HIDE                            | —           |
| `/platform`    | PlatformPage            | Product platform           | Product-only          | No (F3) | No     | Yes              | REDIRECT                        | `/services` |
| `/workflow`    | WorkflowPage            | Product workflow dashboard | Product-only          | No (F3) | No     | Yes              | REDIRECT                        | `/services` |
| `/homepage-v1` | legacy                  | Preview                    | Obsolete              | No      | No     | No               | REDIRECT                        | `/`         |
| `/homepage-v2` | legacy                  | Preview                    | Obsolete              | No      | No     | No               | REDIRECT                        | `/`         |
| `/homepage-v3` | legacy                  | Preview                    | Obsolete              | No      | No     | No               | REDIRECT                        | `/`         |
| `/landing/*`   | generate-landing-pages  | Product SEO landings       | Product-only          | No      | No     | Yes              | REDIRECT + REMOVE generation    | `/services` |
| `/#pricing`    | HomeV2PricingPreview    | Product pricing            | Product-only          | No (F3) | No     | N/A              | REMOVE from V3 + hash → Contact | `/contact`  |
| `/blog`        | worker rewrite          | Legacy                     | Obsolete              | No      | No     | No               | HIDE (existing rewrite)         | SPA `/`     |

## Shared components preserved

`PlatformPage`, `WorkflowPage`, `HomeV2PricingPreview`, landing data modules, and related CSS remain in the repository for non-public reuse / history. They are not publicly routed.

## HTTP status

- Worker: **301** for `/platform`, `/workflow`, `/landing/*`, legacy homepage paths.
- SPA (Vite preview): `history.replaceState` / `resolvePublicPath` soft redirect (no HTTP status available client-side).
