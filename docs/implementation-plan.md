# Implementation Plan — Beach Live

## Phase 0 — Project Scaffold
- Initialize Next.js 15 with App Router, TypeScript strict, Tailwind CSS 4, pnpm
- Configure shadcn/ui, ESLint, Prettier
- Set up Vercel project, environment variables
- Add vitest + Playwright config stubs
- Create tournament config for HMCR U18z Praha-Ladvi

## Phase 1 — Data Pipeline
- Implement `GoogleSheetAdapter` (public CSV fetch)
- Build CSV parser for the HMCR sheet layout
- Define Zod schemas for `TournamentSnapshot` and sub-types
- Implement normalizer (raw CSV → snapshot)
- Implement Vercel Blob read/write helpers
- Build `/api/refresh` endpoint with cron + manual trigger
- Write unit tests for parser, normalizer, validator
- Verify end-to-end: cron → fetch → parse → validate → blob

## Phase 2 — Core Pages (Read-Only)
- Tournament overview page (`/t/[slug]`)
- Match list with status filtering (`/t/[slug]/matches`)
- Group standings (`/t/[slug]/groups`)
- Team list and team detail (`/t/[slug]/teams`, `/t/[slug]/teams/[teamId]`)
- Shared layout with tournament header and tab navigation
- Mobile-first responsive design

## Phase 3 — Bracket & Polish
- Bracket view — round-based cards for mobile, tree for desktop
- Live match highlighting and auto-refresh on client (revalidate tag or polling)
- Stale-data banner when snapshot is older than 10 min
- Loading skeletons and error states
- SEO: metadata, OG tags per tournament

## Phase 4 — PWA & i18n
- Web app manifest + service worker
- Offline fallback with cached snapshot
- Czech message file complete
- English message file
- Locale detection and switcher

## Phase 5 — Diagnostics & Hardening
- `/api/diagnostics` protected endpoint
- Snapshot history (last 24h) in blob
- Error logging and alerting (Vercel logs or simple webhook)
- Performance audit (Core Web Vitals)
- E2E tests for critical flows
