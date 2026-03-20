# Beach Live UI Design System

## Design Principles

- **Mobile-first**: Every component is designed for touch and small screens first, then enhanced for desktop.
- **Warm & natural**: The color palette draws from sand, ocean, and sun -- evoking a beach atmosphere.
- **Clarity over decoration**: Information density is high (live scores, standings); visuals must aid scanning, not distract.
- **Progressive disclosure**: Show the most urgent info (live matches) first; let users drill into details.
- **Performance-aware**: Minimal JS, no heavy animations. The site must feel instant on spotty outdoor connections.

## Color Tokens

All colors are defined as CSS custom properties in `globals.css` under `@theme`.

| Token                  | Value     | Usage                              |
| ---------------------- | --------- | ---------------------------------- |
| `--color-background`   | `#faf8f5` | Page background (warm off-white)   |
| `--color-foreground`   | `#1c1917` | Primary text                       |
| `--color-muted`        | `#f5f0eb` | Secondary surfaces                 |
| `--color-card`         | `#ffffff` | Card backgrounds                   |
| `--color-primary`      | `#0c7792` | Ocean teal -- CTAs, active states  |
| `--color-secondary`    | `#d4a853` | Sand gold -- accents, highlights   |
| `--color-accent`       | `#e8e0d4` | Warm neutral -- subtle backgrounds |
| `--color-border`       | `#e7e0d8` | Card/divider borders               |
| `--color-success/live` | `#16a34a` | Live match indicator, wins         |
| `--color-warning`      | `#d97706` | Stale data warning                 |
| `--color-destructive`  | `#dc2626` | Errors, losses                     |

## Typography

- **Font family**: Inter via `--font-sans`. OpenType features `cv02 cv03 cv04 cv11` enabled for cleaner glyphs.
- **Headings**: `font-bold tracking-tight`. Page titles `text-2xl md:text-3xl`; section titles `text-xl`.
- **Body text**: `text-sm` (14px) for most content. `text-xs` (12px) for metadata and captions.
- **Scores**: Use `.font-score` utility for tabular-nums alignment.

## Spacing Rhythm

Base unit: 4px (Tailwind default). Preferred scale:

- Inline gaps: `gap-1.5` to `gap-2.5`
- Card padding: `p-3.5` to `p-4`
- Section margins: `mb-6` to `mb-8`
- Grid gaps: `gap-3`

## Component Styling Rules

- **Cards**: `rounded-xl border border-border bg-card shadow-sm`. Use `hoverable` prop for interactive cards.
- **Badges**: Pill-shaped (`rounded-full`), color-coded by variant. Live badge pulses.
- **Match cards**: Live matches get `border-live/30 shadow-md shadow-live/5` highlight.
- **Dividers**: Use `border-border/50` for subtle in-card separators.
- **Winner indicator**: Green `▸` arrow + `font-semibold`.

## Motion

- **Duration**: `transition-all duration-200` for interactive elements.
- **Hover lift**: `hover:-translate-y-0.5` on quick-link cards only.
- **Hover borders**: `hover:border-primary/20 hover:shadow-md` on hoverable cards.
- **No motion on mobile**: Keep animations minimal; avoid anything that fights scroll.
- **Live pulse**: `animate-pulse` on live badge only.

## Mobile UX Priorities

1. Bottom navigation bar with safe-area padding for notched devices.
2. Touch targets minimum 44x44px (nav icons use `h-5 w-5` inside generous padding).
3. Sticky header with backdrop blur for context while scrolling.
4. Content loads server-side; auto-refresh via revalidation, not client polling.
5. Hero section uses full-bleed gradient on mobile, rounded on desktop.
