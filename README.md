# Beach Live 🏐

Live beach volleyball tournament visualization. Mobile-first, real-time data from Google Sheets, beautiful UI.

## Features
- Live tournament overview with current/next/recent matches
- Visual bracket (desktop) and round-based cards (mobile)
- Group standings
- Match list with filtering
- Team cards with search
- Auto-refresh every 5 minutes
- PWA-ready

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Vercel (hosting + Blob storage + Cron)
- Google Sheets as live data source

## Getting Started

```bash
pnpm install
pnpm dev
```

## Environment Variables

Create `.env.local`:
```
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
REFRESH_SECRET=your_secret
CRON_SECRET=your_cron_secret
```

## License
Apache-2.0
