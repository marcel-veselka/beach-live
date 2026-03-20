# Product Spec — Beach Live

## Goal

Provide a beautiful, mobile-first live view of beach volleyball tournaments. Spectators, parents, and coaches can follow matches, brackets, and standings in real time from their phones.

## Audience

- **Spectators** at the venue — quick glance at what's playing now and next
- **Parents & friends** following remotely — live updates without needing to be there
- **Coaches** — overview of bracket progression and upcoming opponents

## Data Source

- Tournament organizer maintains a Google Sheet with matches, scores, teams, groups, and bracket
- App reads the sheet via public CSV export (no auth needed)
- 5-minute cron refresh with last-good-snapshot resilience

## Features

### Overview (`/t/[slug]`)
- Tournament name, date, venue
- Current and next matches (highlighted)
- Recently completed matches
- Quick links to bracket, groups, matches, teams

### Bracket (`/t/[slug]/bracket`)
- Desktop: visual bracket tree (SVG or CSS grid)
- Mobile: round-based cards with swipe navigation

### Groups (`/t/[slug]/groups`)
- Group standings tables with W/L, sets, points
- Tap group to see group matches

### Matches (`/t/[slug]/matches`)
- Full match list, filterable by round/group/status
- Live match indicator

### Teams (`/t/[slug]/teams`)
- Searchable team list
- Team card with players, group, match history

### Diagnostics (`/api/diagnostics`)
- Protected endpoint showing last refresh time, data freshness, errors
- Manual refresh trigger

## i18n

- Czech-first UI (all labels, status text)
- Message file structure ready for English translation
- URL structure language-neutral

## PWA

- Manifest + service worker for add-to-homescreen
- Offline: show last cached snapshot with "data may be stale" banner

## First Tournament

- HMCR U18 zeny, Praha-Ladvi, 2026-03-21
- Google Sheet ID: `1rOtwIEPpUXzsZpagn3WPb-B1xaETdLy0_kZpk6mydw0`
- PDF: https://www.cvf.cz/beach_priloha.php?nazev=20260321_Propozice_HMCR_U18z_Praha-Ladvi.pdf&id=4520
- CVF: https://www.cvf.cz/beach/turnaje/?vysledky=4520
