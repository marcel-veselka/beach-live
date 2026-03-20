import { Metadata } from "next"
import { loadTournamentData } from "@/lib/tournament/load"
import { EmptyState } from "@/components/ui/empty-state"
import { FreshnessIndicator } from "@/components/tournament/freshness-indicator"
import { AutoRefresh } from "@/components/tournament/auto-refresh"
import { t } from "@/lib/i18n"
import { Users } from "lucide-react"
import { TeamsList } from "@/components/tournament/teams-list"

export const metadata: Metadata = { title: "Týmy" }
export const dynamic = "force-dynamic"

export default async function TeamsPage() {
  const { snapshot } = await loadTournamentData()
  const msg = t()

  if (!snapshot || snapshot.teams.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-12 w-12" />}
        title="Žádné týmy"
        description="Týmy zatím nejsou k dispozici."
      />
    )
  }

  return (
    <>
      <AutoRefresh />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-heading text-2xl font-extrabold tracking-tight">
          {msg.teams.title}
        </h1>
        <FreshnessIndicator generatedAt={snapshot.meta.generatedAt} />
      </div>

      <TeamsList teams={snapshot.teams} matches={snapshot.matches} />
    </>
  )
}
