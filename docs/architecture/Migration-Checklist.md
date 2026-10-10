# Migration Checklist — ADealForge Platform

Extracted from `Architecture.md` Appendix N. Use during execution.

## Discovery

- [ ] Confirm whether an external Python/`rust_core` codebase exists
- [ ] Inventory any production scrapers/enrichers outside this repo
- [ ] Confirm business model: SaaS vs managed hybrid

## Platform bootstrap

- [ ] Create monorepo `adealforge-platform`
- [ ] Add `api`, `worker`, `web` apps
- [ ] Add Prisma + PostgreSQL + Redis Compose
- [ ] Configure Cloudflare Tunnel to VPS
- [ ] Configure R2 buckets (`imports`, `exports`, `backups`)

## Security baseline

- [ ] Secrets management process
- [ ] RBAC matrix signed off
- [ ] Tenant isolation test suite gate in CI
- [ ] SSRF protections for collectors

## Product MVP

- [ ] Auth + orgs
- [ ] CRM CRUD + CSV
- [ ] Collection jobs v1
- [ ] AI email generate/regenerate
- [ ] Agent tools subset
- [ ] Campaign launch/pause
- [ ] Stripe skeleton

## Marketing continuity

- [ ] Keep Worker contact form live
- [ ] Optional: export KV leads weekly
- [ ] Align pricing placeholders with real billing

## Launch gate

- [ ] Load test basic APIs
- [ ] Backup restore drill
- [ ] Legal review of collection sources
- [ ] CTO sign-off on ADRs
