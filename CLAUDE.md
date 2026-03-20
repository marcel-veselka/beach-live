# Beach Live

Beach volleyball live tournament visualization app.

## Stack
- Next.js 15 App Router, TypeScript strict, Tailwind CSS 4, shadcn/ui
- pnpm, Node LTS
- Vercel deployment, Vercel Blob for data storage
- Google Sheets (public CSV export) as primary data source

## Commands
- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm lint` — run ESLint
- `pnpm test` — run tests (vitest)
- `pnpm test:e2e` — run Playwright e2e tests

## Architecture
- `src/app/` — Next.js App Router pages
- `src/components/` — shared UI components
- `src/lib/` — core logic (adapters, parsers, tournament, validation, i18n, blob, refresh)
- `src/tournaments/` — per-tournament config and optional parser overrides
- `docs/` — product spec, technical design, implementation plan, decisions

## Conventions
- Czech-first UI, i18n-ready via message files
- Adapter pattern for data sources
- Normalized tournament snapshot model (Zod-validated)
- Last-good-snapshot resilience: if refresh fails, serve previous valid data
- Protected endpoints use `REFRESH_SECRET` env var

## Key Environment Variables
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob access
- `REFRESH_SECRET` — secret for manual refresh / diagnostics
- `CRON_SECRET` — Vercel cron authentication
