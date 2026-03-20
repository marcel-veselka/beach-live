import { Metadata } from "next"
import { loadTournamentData } from "@/lib/tournament/load"
import { EmptyState } from "@/components/ui/empty-state"
import { FreshnessIndicator } from "@/components/tournament/freshness-indicator"
import { AutoRefresh } from "@/components/tournament/auto-refresh"
import { GroupCardClient } from "@/components/tournament/group-favorites"
import { t } from "@/lib/i18n"
import { Trophy } from "lucide-react"
import { Group } from "@/lib/tournament/schema"

export const metadata: Metadata = { title: "Skupiny" }
export const dynamic = "force-dynamic"

export default async function GroupsPage() {
  const { snapshot } = await loadTournamentData()
  const msg = t()

  if (!snapshot || snapshot.groups.length === 0) {
    return (
      <EmptyState
        icon={<Trophy className="h-12 w-12" />}
        title="Skupiny zatím nejsou k dispozici"
        description="Data o skupinách budou dostupná po rozlosování."
      />
    )
  }

  return (
    <>
      <AutoRefresh />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {msg.groups.title}
        </h1>
        <FreshnessIndicator generatedAt={snapshot.meta.generatedAt} />
      </div>

      {/* Improvement 9: better gap and section transitions between groups */}
      <div className="grid gap-5 md:grid-cols-2">
        {snapshot.groups.map((group: Group) => (
          <GroupCardClient key={group.id} group={group} />
        ))}
      </div>
    </>
  )
}
