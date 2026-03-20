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
import { t } from "@/lib/i18n"
import { Trophy, GitBranch, Users, Swords, LayoutGrid } from "lucide-react"
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

  return (
    <>
      <AutoRefresh />

      {/* Hero - compact */}
      <div className="relative -mx-4 mb-6 px-4 pt-4 pb-4 bg-hero-gradient md:rounded-2xl md:mx-0">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            {snapshot.metadata.name}
          </h1>
          <Badge variant={statusBadge as "live" | "finished" | "scheduled"} className="text-[10px] px-2 py-0.5 whitespace-nowrap uppercase tracking-wider font-semibold">
            {snapshot.status === "live" ? "Živě" : snapshot.status === "finished" ? "Hotovo" : "Brzy"}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {snapshot.metadata.subtitle && <span>{snapshot.metadata.subtitle}</span>}
          {snapshot.metadata.subtitle && <span>•</span>}
          {snapshot.metadata.venue && <span>📍 {snapshot.metadata.venue}</span>}
          {snapshot.metadata.dates && <span>📅 {snapshot.metadata.dates}</span>}
          {snapshot.metadata.category && <span>🏐 {snapshot.metadata.category}</span>}
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs">
          <FreshnessIndicator generatedAt={snapshot.meta.generatedAt} />
          <SourceLinks sources={snapshot.sources} />
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

      {/* Next matches */}
      {scheduledMatches.length > 0 && (
        <Section title={msg.overview.next}>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {scheduledMatches.map((match: Match) => (
              <MatchCard key={match.id} match={match} compact />
            ))}
          </div>
        </Section>
      )}

      {/* Recently finished */}
      {recentFinished.length > 0 && (
        <Section title={msg.overview.recentlyFinished}>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {recentFinished.map((match: Match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </Section>
      )}

      {/* Quick links */}
      <Section title={msg.overview.quickLinks}>
        <div className="grid grid-cols-3 gap-3">
          <QuickLinkCard href="/bracket" icon={<GitBranch className="h-5 w-5" />} label={msg.nav.bracket} count={snapshot.bracket?.rounds.length ?? 0} suffix="kol" />
          <QuickLinkCard href="/matches" icon={<Swords className="h-5 w-5" />} label={msg.nav.matches} count={snapshot.matches.length} suffix="zápasů" />
          <QuickLinkCard href="/teams" icon={<Users className="h-5 w-5" />} label={msg.nav.teams} count={snapshot.teams.length} suffix="týmů" />
        </div>
      </Section>

      {/* Transparency note */}
      <div className="text-xs text-muted-foreground text-center mt-8 p-4 rounded-lg bg-muted/50">
        Data se automaticky aktualizují každých 5 minut z veřejných zdrojů. Může dojít k mírnému zpoždění.
      </div>
    </>
  )
}

function QuickLinkCard({ href, icon, label, count, suffix }: { href: string; icon: React.ReactNode; label: string; count: number; suffix: string }) {
  return (
    <Link href={href}>
      <Card hoverable className="flex flex-col items-center py-6 cursor-pointer hover:-translate-y-0.5 transition-all duration-200">
        <div className="text-primary mb-2.5 p-2 rounded-xl bg-primary/5">{icon}</div>
        <CardTitle className="text-sm font-semibold">{label}</CardTitle>
        <p className="text-xs text-muted-foreground mt-1.5">{count} {suffix}</p>
      </Card>
    </Link>
  )
}
