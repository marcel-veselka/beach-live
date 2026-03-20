# ADR 0001: Google Sheet + Vercel Blob Architecture

## Status

Accepted

## Date

2026-03-20

## Context

We need to build a live tournament visualization app for beach volleyball. Tournament data is maintained by organizers in a Google Sheet that is updated manually during the event. We need a way to:

- Read live data from the sheet without requiring organizer cooperation on APIs
- Serve the data quickly to many concurrent mobile users at the venue
- Handle failures gracefully (sheet temporarily unavailable, malformed data)
- Keep the architecture simple for a solo developer

## Decision

Use **public CSV export** from Google Sheets as the primary data source, **normalize and validate** the data server-side, and store validated snapshots in **Vercel Blob** for fast reads.

The pipeline:
1. Vercel Cron triggers `/api/refresh` every 5 minutes
2. `GoogleSheetAdapter` fetches the sheet as CSV (public, no auth)
3. Per-tournament parser + normalizer converts CSV to `TournamentSnapshot`
4. Zod validates the snapshot
5. Valid snapshot is written to Vercel Blob
6. Server components read the latest snapshot from Blob on each request

If any step fails, the previous valid snapshot remains in Blob (last-good-snapshot pattern).

## Consequences

### Positive
- **No auth complexity** — public CSV export requires no API keys or OAuth for v1
- **Resilient** — last-good-snapshot means users always see data, even during transient failures
- **Fast reads** — Vercel Blob with edge caching serves snapshots in <50ms
- **Simple deployment** — single Vercel project, no external infrastructure
- **Flexible** — adapter pattern allows switching to Google Sheets API or other sources later

### Negative
- **5-min delay** — data is not truly real-time; acceptable for tournament pace
- **CSV parsing fragility** — depends on sheet structure; per-tournament parser overrides mitigate this
- **Public sheet requirement** — organizer must publish the sheet; fallback is manual CSV upload

### Risks
- Google may rate-limit or change CSV export behavior; mitigated by snapshot caching
- Large tournaments with many tabs may need multiple fetches; acceptable at current scale
