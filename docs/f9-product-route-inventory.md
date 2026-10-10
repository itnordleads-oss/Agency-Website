# F9 debt — product route inventory

F3 switches the public navbar/footer to Development Studio routes. The following
product-era routes remain reachable in the SPA for now and should be retired or
redirected in F9 (not in F3).

## Still routable (keep until F9)

| Path                       | Current owner component | Notes                                         |
| -------------------------- | ----------------------- | --------------------------------------------- |
| `/platform`                | `PlatformPage`          | Removed from public studio nav in F3          |
| `/workflow`                | `WorkflowPage`          | Removed from public studio nav in F3          |
| `/homepage-v1`             | redirects to `/`        | Legacy preview URL                            |
| `/homepage-v2`             | redirects to `/`        | Legacy preview URL                            |
| `/homepage-v3`             | redirects to `/`        | Legacy preview URL                            |
| `/#pricing` (`v2-pricing`) | Homepage V3 section     | Removed from public nav in F3                 |
| `/landing/*`               | generated landing pages | Built by `scripts/generate-landing-pages.mjs` |

## Studio routes introduced in F3

| Path        | Status                                                  |
| ----------- | ------------------------------------------------------- |
| `/`         | Homepage V3 (kept)                                      |
| `/services` | Temporary placeholder until F5                          |
| `/about`    | Temporary placeholder until F6                          |
| `/contact`  | Existing Contact page                                   |
| `/terms`    | Existing Terms page                                     |
| `/work`     | Unpublished until F7 approval (`IS_WORK_NAV_PUBLISHED`) |

## Suggested F9 redirects (not implemented in F3)

- `/platform` → `/services` (or `/`)
- `/workflow` → `/services` (or `/`)
- `/#pricing` / product pricing nav → studio pricing decision (or remove)
- Product `/landing/*` URLs → studio landing strategy or 410/redirect
