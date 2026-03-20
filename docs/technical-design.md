# Technical Design — Beach Live

## Architecture Overview

```
Google Sheet (CSV) → Adapter → Normalize → Validate (Zod) → Vercel Blob → SSR → Client
                                                                ↑
                                                        Vercel Cron (5 min)
```

Server components read the latest snapshot from Vercel Blob. A cron job refreshes the snapshot every 5 minutes. If a refresh fails, the previous valid snapshot is preserved (last-good-snapshot pattern).

## Data Flow

1. **Cron trigger** — Vercel Cron hits `/api/refresh` every 5 min (authenticated via `CRON_SECRET`)
2. **Adapter** — `GoogleSheetAdapter` fetches public CSV export of the tournament sheet
3. **Parser** — Per-tournament parser transforms raw CSV rows into intermediate structures
4. **Normalizer** — Converts parsed data into the normalized `TournamentSnapshot` model
5. **Validator** — Zod schema validates the snapshot; rejects malformed data
6. **Blob storage** — Valid snapshot is written to Vercel Blob as JSON (`snapshots/{slug}/latest.json`)
7. **Serve** — Server components fetch the latest blob on each request (edge-cached)

## Normalized Data Model

```typescript
TournamentSnapshot {
  meta: TournamentMeta        // name, slug, date, venue, status, updatedAt
  teams: Team[]               // id, name, players[], seed, groupId
  players: Player[]           // id, name, teamId
  groups: Group[]             // id, name, teamIds[], standings[]
  matches: Match[]            // id, round, court, time, teams, score, status, groupId
  bracket: BracketRound[]     // round name, matchIds[]
}
```

All IDs are string. Enums for `MatchStatus` (scheduled, live, finished) and `TournamentStatus` (upcoming, live, finished).

## Adapter Contract

```typescript
interface DataAdapter {
  id: string
  fetch(config: TournamentConfig): Promise<RawSheetData>
}
```

Tournament config specifies sheet ID, tab names, and optional parser override. The adapter pattern allows future sources (API, scraper) without changing downstream code.

## Per-Tournament Config

```typescript
// src/tournaments/hmcr-u18z-praha-ladvi-2026/config.ts
TournamentConfig {
  slug: string
  name: string
  date: string
  venue: string
  adapter: 'google-sheet'
  sheetId: string
  tabs: { matches: string, teams: string, groups: string, bracket: string }
  parser?: CustomParser  // optional override for non-standard sheet layouts
}
```

## Vercel Blob Strategy

- Path: `snapshots/{slug}/latest.json`
- History: `snapshots/{slug}/{timestamp}.json` (last 24h retained)
- Max snapshot size: ~100KB per tournament
- Read: `get()` with edge caching headers
- Write: `put()` with `{ access: 'public', addRandomSuffix: false }`

## Routing

```
/                           → landing / tournament list
/t/[slug]                   → tournament overview
/t/[slug]/bracket           → bracket view
/t/[slug]/groups            → group standings
/t/[slug]/groups/[groupId]  → single group detail
/t/[slug]/matches           → match list
/t/[slug]/teams             → team list
/t/[slug]/teams/[teamId]    → team detail
/api/refresh                → cron + manual refresh endpoint
/api/diagnostics            → protected status page
```

## i18n Approach

- Message files at `src/lib/i18n/messages/{cs,en}.ts`
- `useMessages(locale)` hook returns typed message object
- Locale detected from cookie / Accept-Language, default `cs`
- No URL prefix for default locale; `/en/t/...` for English

## Error Handling

- **Adapter failure** — log error, keep last-good snapshot, set `stale` flag
- **Parse/validation failure** — log with details, do not overwrite blob
- **Blob read failure** — return 503 with retry-after header
- **Client** — stale-data banner when snapshot age > 10 min

## Security

- `/api/refresh` requires `Authorization: Bearer {CRON_SECRET}` or Vercel cron header
- `/api/diagnostics` requires `REFRESH_SECRET` query param
- No user auth in v1; all tournament data is public
