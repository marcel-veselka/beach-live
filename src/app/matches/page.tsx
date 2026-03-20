import { Metadata } from "next"
import { loadTournamentData } from "@/lib/tournament/load"
import { EmptyState } from "@/components/ui/empty-state"
import { FreshnessIndicator } from "@/components/tournament/freshness-indicator"
import { AutoRefresh } from "@/components/tournament/auto-refresh"
import { t } from "@/lib/i18n"
import { Swords } from "lucide-react"
import { MatchesList } from "@/components/tournament/matches-list"

export const metadata: Metadata = { title: "Zápasy" }
export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{ team?: string }>
}

export default async function MatchesPage({ searchParams }: PageProps) {
  const { team } = await searchParams
  const { snapshot } = await loadTournamentData()
  const msg = t()

  if (!snapshot || snapshot.matches.length === 0) {
    return (
      <EmptyState
        icon={<Swords className="h-12 w-12" />}
        title="Žádné zápasy"
        description="Zápasy zatím nejsou k dispozici."
      />
    )
  }

  return (
    <>
      <AutoRefresh />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {msg.nav.matches}
        </h1>
        <FreshnessIndicator generatedAt={snapshot.meta.generatedAt} />
      </div>

      <MatchesList matches={snapshot.matches} teams={snapshot.teams} initialSearch={team} />
    </>
  )
}
