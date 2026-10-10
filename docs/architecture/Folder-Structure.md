# Target Folder Structure — Platform Monorepo

```text
adealforge-platform/
  apps/
    web/                 # Next.js product
    api/                 # NestJS Main API
    worker/              # Collection + job consumers
  packages/
    shared-types/
    eslint-config/
    tsconfig/
    design-tokens/
  prisma/
    schema.prisma
    migrations/
  docker/
    docker-compose.yml
    docker-compose.prod.yml
  .github/workflows/
  docs/
    architecture/
```

## Current marketing repo (keep)

```text
adealforge/
  src/                   # React Vite marketing SPA
  worker/                # Cloudflare Worker contact + rewrites
  scripts/               # SEO landing generator
  e2e/
  wrangler.toml
```
