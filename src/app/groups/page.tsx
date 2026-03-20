import { Metadata } from "next"
import { loadTournamentData } from "@/lib/tournament/load"
import { Card, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { FreshnessIndicator } from "@/components/tournament/freshness-indicator"
import { AutoRefresh } from "@/components/tournament/auto-refresh"
import { t } from "@/lib/i18n"
import { Trophy } from "lucide-react"
import { Group, GroupStanding } from "@/lib/tournament/schema"

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

      <div className="grid gap-6 md:grid-cols-2">
        {snapshot.groups.map((group: Group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </>
  )
}

function GroupCard({ group }: { group: Group }) {
  const msg = t().groups
  return (
    <Card>
      <CardTitle className="mb-3">{group.name}</CardTitle>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="text-left py-2 pr-2 w-8">{msg.rank}</th>
              <th className="text-left py-2">{msg.team}</th>
              <th className="text-center py-2 w-8">{msg.played}</th>
              <th className="text-center py-2 w-8">{msg.won}</th>
              <th className="text-center py-2 w-8">{msg.lost}</th>
              <th className="text-center py-2 w-12">
                {msg.setsWon}:{msg.setsLost}
              </th>
              <th className="text-center py-2 w-14">
                {msg.pointsWon}:{msg.pointsLost}
              </th>
            </tr>
          </thead>
          <tbody>
            {group.standings.map((standing: GroupStanding) => (
              <tr
                key={standing.teamId}
                className="border-b border-border/50 last:border-0"
              >
                <td className="py-2 pr-2 font-medium text-muted-foreground">
                  {standing.rank}
                </td>
                <td className="py-2 font-medium">{standing.teamName}</td>
                <td className="py-2 text-center">{standing.played}</td>
                <td className="py-2 text-center text-success font-medium">
                  {standing.won}
                </td>
                <td className="py-2 text-center text-destructive">
                  {standing.lost}
                </td>
                <td className="py-2 text-center">
                  {standing.setsWon}:{standing.setsLost}
                </td>
                <td className="py-2 text-center">
                  {standing.pointsWon}:{standing.pointsLost}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {group.standings.map((standing: GroupStanding) => (
          <div
            key={standing.teamId}
            className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground w-5">
                {standing.rank}.
              </span>
              <span className="font-medium text-sm">{standing.teamName}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="text-success font-medium">
                {standing.won}V
              </span>
              <span className="text-destructive">{standing.lost}P</span>
              <span>
                {standing.setsWon}:{standing.setsLost}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
