# Implementation Roadmap — ADealForge SaaS

## Phase 1 — Foundations (weeks 1–4)

- Monorepo scaffold; Nest API; Prisma; auth; orgs; RBAC
- Next.js app shell; prospects CRUD; CSV import
- Compose + Tunnel + CI
- KV lead export design

## Phase 2 — Collection + AI (weeks 5–8)

- BullMQ workers; website/CSV adapters; SSE progress
- Email generation + regenerate; usage metering
- R2 import/export

## Phase 3 — Campaigns + Agent (weeks 9–12)

- Campaigns/sequences state machine
- Agent tools; launch/pause
- Stripe entitlements
- Idempotency, DLQ, audit hardening

## Phase 4 — Scale & automation hooks (weeks 13–20)

- Split worker pools; indexes
- Webhooks + event outbox
- RLS evaluation; read replicas if needed
- Automation builder spike (extension points only until then)
