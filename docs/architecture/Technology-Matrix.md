# Technology Matrix — ADealForge

| Concern          | Current repo (verified)      | MVP SaaS (recommended)                       | Later                     |
| ---------------- | ---------------------------- | -------------------------------------------- | ------------------------- |
| Public website   | Vite React SPA               | Keep                                         | Optionally Next marketing |
| Product UI       | Mockups only                 | Next.js + TanStack Query + Tailwind + shadcn | —                         |
| API              | CF Worker contact only       | NestJS Main API                              | Gateway + more services   |
| Jobs             | None                         | BullMQ + Redis                               | Dedicated clusters        |
| DB               | Cloudflare KV (leads)        | PostgreSQL + Prisma                          | Replicas / partitioning   |
| Cache/queue      | None                         | Redis                                        | Split cache vs queue      |
| Files            | Static assets                | Cloudflare R2                                | Same                      |
| Auth             | None                         | Cookie sessions + RBAC                       | SSO/SAML                  |
| AI               | Unused `@google/genai` dep   | Tool-calling agent + generation              | Fine-tunes                |
| Realtime         | None                         | SSE                                          | Socket gateway            |
| Deploy marketing | Wrangler / CF Workers        | Same                                         | Same                      |
| Deploy SaaS      | N/A                          | Docker Compose on VPS + CF Tunnel            | Orchestrator              |
| CI               | GitHub Actions quality suite | Extend for API/web/worker                    | Affected builds           |
