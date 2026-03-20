import { loadTournamentData } from "@/lib/tournament/load"
import { Section } from "@/components/ui/section"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MatchCard } from "@/components/tournament/match-card"
import { FreshnessIndicator } from "@/components/tournament/freshness-indicator"
import { SourceLinks } from "@/components/tournament/source-links"
import { AutoRefresh } from "@/components/tournament/auto-refresh"
import { FavoriteMatches } from "@/components/tournament/favorite-matches"
import { EmptyState } from "@/components/ui/empty-state"
import { t, pluralize } from "@/lib/i18n"
import { Trophy, GitBranch, Users, Swords, LayoutGrid, Info } from "lucide-react"
import Link from "next/link"
import { Match } from "@/lib/tournament/schema"

export const dynamic = "force-dynamic"
export const revalidate = 60

export default async function HomePage() {
  const { snapshot, config } = await loadTournamentData()
  const msg = t()

  if (!snapshot || !config) {
    return (
      <EmptyState
        icon={<LayoutGrid className="h-12 w-12" />}
        title={msg.common.noData}
        description="Turnajová data zatím nejsou k dispozici."
      />
    )
  }

  // Only show matches with real team names (not "vítěz #X" / "poražený #X" / TBD)
  const hasRealTeams = (m: Match) =>
    m.teamA?.name && m.teamB?.name &&
    !m.teamA.name.startsWith("vítěz") && !m.teamA.name.startsWith("poražený") &&
    !m.teamB.name.startsWith("vítěz") && !m.teamB.name.startsWith("poražený") &&
    m.teamA.name !== "TBD" && m.teamB.name !== "TBD"

  const liveMatches = snapshot.matches.filter((m: Match) => m.status === "live" && hasRealTeams(m))
  const scheduledMatches = snapshot.matches.filter((m: Match) => m.status === "scheduled" && hasRealTeams(m)).slice(0, 4)
  const recentFinished = snapshot.matches.filter((m: Match) => m.status === "finished" && hasRealTeams(m)).slice(-4).reverse()

  const statusBadge = snapshot.status === "live" ? "live" : snapshot.status === "finished" ? "finished" : "scheduled"

  // Determine if scheduled matches are for tomorrow
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDay = tomorrow.getDate()
  const tomorrowMonth = tomorrow.getMonth() + 1
  const tomorrowLabel = `${tomorrowDay}. ${tomorrowMonth}.`

  const scheduledAreTomorrow = scheduledMatches.length > 0 && scheduledMatches.every((m: Match) => {
    const dateMatch = m.scheduledTime?.match(/^(\d+)\.\s*(\d+)\./)
    if (!dateMatch) return false
    return parseInt(dateMatch[1]) === tomorrowDay && parseInt(dateMatch[2]) === tomorrowMonth
  })

  // Determine if recently finished matches are qualification
  const recentAreQualification = recentFinished.length > 0 && recentFinished.every((m: Match) =>
    m.round?.toLowerCase().includes("kvalifikac") || m.phase === "group"
  )

  return (
    <>
      <AutoRefresh />

      {/* Hero - compact with volleyball decorative element */}
      <div className="relative -mx-4 mb-6 px-4 pt-4 pb-4 bg-hero-gradient md:rounded-2xl md:mx-0">
        {/* Decorative volleyball SVG */}
        <div className="absolute top-2 right-4 opacity-[0.06] pointer-events-none" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20" />
            <path d="M2 12c2.5-3.5 5.5-5 10-5s7.5 1.5 10 5" />
            <path d="M2 12c2.5 3.5 5.5 5 10 5s7.5-1.5 10-5" />
          </svg>
        </div>

        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            {snapshot.metadata.name}
          </h1>
          {/* #1: Shimmer on status badge */}
          <Badge variant={statusBadge as "live" | "finished" | "scheduled"} className="text-[10px] px-2.5 py-0.5 whitespace-nowrap uppercase tracking-wider font-semibold">
            {snapshot.status === "live" ? "Živě" : snapshot.status === "finished" ? "Hotovo" : "Brzy"}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {snapshot.metadata.subtitle && <span>{snapshot.metadata.subtitle}</span>}
          {snapshot.metadata.subtitle && <span className="text-muted-foreground/30">•</span>}
          {snapshot.metadata.venue && <span>📍 {snapshot.metadata.venue}</span>}
          {snapshot.metadata.dates && <span>📅 {snapshot.metadata.dates}</span>}
          {snapshot.metadata.category && <span>🏐 {snapshot.metadata.category}</span>}
        </div>

        {/* #7: Freshness more visually integrated - inline pill style */}
        {/* #8: Source links smaller and less prominent */}
        <div className="mt-2.5 flex items-center gap-2 text-[11px]">
          <FreshnessIndicator generatedAt={snapshot.meta.generatedAt} />
          <span className="text-muted-foreground/20">|</span>
          <span className="opacity-60"><SourceLinks sources={snapshot.sources} /></span>
        </div>
      </div>

      {/* Favorite teams matches */}
      <FavoriteMatches matches={snapshot.matches.filter(hasRealTeams)} />

      {/* Live / Now */}
      {liveMatches.length > 0 && (
        <Section title={msg.overview.now}>
          <div className="grid gap-3 md:grid-cols-2">
            {liveMatches.map((match: Match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </Section>
      )}

      {/* #10: Next matches with visually distinct section title + #2: "Zítra" countdown */}
      {scheduledMatches.length > 0 && (
        <Section title={scheduledAreTomorrow ? `${msg.overview.next} — Zítra` : msg.overview.next}>
          {scheduledAreTomorrow && (
            <p className="text-xs text-primary/70 font-medium -mt-3 mb-3 ml-3">Zápasy začínají zítra ráno</p>
          )}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {scheduledMatches.map((match: Match, i: number) => (
              <div key={match.id} className="animate-card-in" style={{ animationDelay: `${i * 60}ms` }}>
                <MatchCard match={match} compact />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* #10: Recently finished - visually distinct from "Nadcházející" */}
      {recentFinished.length > 0 && (
        <Section title={msg.overview.recentlyFinished}>
          {recentAreQualification && (
            <div className="flex items-center gap-1.5 mb-3 -mt-3">
              <Badge variant="default" className="text-[10px] font-semibold uppercase tracking-wider">Kvalifikace</Badge>
            </div>
          )}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {recentFinished.map((match: Match, i: number) => (
              <div key={match.id} className="animate-card-in" style={{ animationDelay: `${i * 60}ms` }}>
                <MatchCard match={match} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Quick links with subtle icon backgrounds */}
      <Section title={msg.overview.quickLinks}>
        <div className="grid grid-cols-3 gap-3">
          <QuickLinkCard href="/bracket" icon={<GitBranch className="h-5 w-5" />} label={msg.nav.bracket} count={snapshot.bracket?.rounds.length ?? 0} suffix={pluralize(snapshot.bracket?.rounds.length ?? 0, "kolo", "kola", "kol")} />
          <QuickLinkCard href="/matches" icon={<Swords className="h-5 w-5" />} label={msg.nav.matches} count={snapshot.matches.length} suffix={pluralize(snapshot.matches.length, "zápas", "zápasy", "zápasů")} />
          <QuickLinkCard href="/teams" icon={<Users className="h-5 w-5" />} label={msg.nav.teams} count={snapshot.teams.length} suffix={pluralize(snapshot.teams.length, "tým", "týmy", "týmů")} />
        </div>
      </Section>

      {/* #5: Transparency note - single compact line */}
      <p className="text-[11px] text-muted-foreground/50 text-center mt-8 mb-2">
        <Info className="inline h-3 w-3 mr-1 -mt-0.5" />
        Data se aktualizují každých 5 min z veřejných zdrojů.
      </p>

      {/* #9: Gradient fade before bottom nav (rendered via CSS class in globals) */}
      <div className="nav-fade-gradient md:hidden" />
    </>
  )
}

function QuickLinkCard({ href, icon, label, count, suffix }: { href: string; icon: React.ReactNode; label: string; count: number; suffix: string }) {
  return (
    <Link href={href}>
      {/* #3: More tappable with inner shadow, scale on press */}
      <Card hoverable className="flex flex-col items-center py-6 cursor-pointer hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden press-scale shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_1px_3px_0_rgba(0,0,0,0.04)]">
        {/* Subtle background icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none scale-[2.5]" aria-hidden="true">
          {icon}
        </div>
        <div className="text-primary mb-2.5 p-2.5 rounded-xl bg-primary/8 ring-1 ring-primary/10">{icon}</div>
        <CardTitle className="text-sm font-semibold">{label}</CardTitle>
        <p className="text-[11px] text-muted-foreground/70 mt-1 font-medium">{count} {suffix}</p>
      </Card>
    </Link>
  )
}
