import { Metadata } from "next"
import { loadTournamentData } from "@/lib/tournament/load"
import { Section } from "@/components/ui/section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { FreshnessIndicator } from "@/components/tournament/freshness-indicator"
import { AutoRefresh } from "@/components/tournament/auto-refresh"
import { t } from "@/lib/i18n"
import { GitBranch } from "lucide-react"
import { BracketMatch } from "@/lib/tournament/schema"

export const metadata: Metadata = { title: "Pavouk" }
export const dynamic = "force-dynamic"

export default async function BracketPage() {
  const { snapshot } = await loadTournamentData()
  const msg = t()

  if (!snapshot?.bracket || snapshot.bracket.rounds.length === 0) {
    return (
      <EmptyState
        icon={<GitBranch className="h-12 w-12" />}
        title="Pavouk zatím není k dispozici"
        description="Data o vyřazovací části budou dostupná po zahájení playoff."
      />
    )
  }

  return (
    <>
      <AutoRefresh />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {msg.bracket.title}
        </h1>
        <FreshnessIndicator generatedAt={snapshot.meta.generatedAt} />
      </div>

      {/* Desktop bracket - horizontal flow */}
      <div className="hidden md:block overflow-x-auto">
        <div className="flex gap-6 min-w-max pb-4">
          {snapshot.bracket.rounds.map((round) => (
            <div key={round.name} className="flex flex-col gap-4 min-w-[240px]">
              <h3 className="text-sm font-semibold text-muted-foreground text-center uppercase tracking-wide">
                {round.name}
              </h3>
              <div className="flex flex-col gap-3 justify-around flex-1">
                {round.matches.map((match: BracketMatch) => (
                  <BracketMatchNode key={match.matchId} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile bracket - round by round cards */}
      <div className="md:hidden space-y-6">
        {snapshot.bracket.rounds.map((round) => (
          <Section key={round.name} title={round.name}>
            <div className="space-y-3">
              {round.matches.map((match: BracketMatch) => (
                <BracketMatchCard key={match.matchId} match={match} />
              ))}
            </div>
          </Section>
        ))}
      </div>
    </>
  )
}

function BracketMatchNode({ match }: { match: BracketMatch }) {
  return (
    <Card className="p-3 space-y-1">
      <BracketTeamRow
        name={match.teamA?.name ?? "TBD"}
        isWinner={match.winner === "teamA"}
      />
      <div className="border-t border-border" />
      <BracketTeamRow
        name={match.teamB?.name ?? "TBD"}
        isWinner={match.winner === "teamB"}
      />
      {match.score && (
        <div className="text-xs text-muted-foreground text-center pt-1">
          {match.score}
        </div>
      )}
    </Card>
  )
}

function BracketMatchCard({ match }: { match: BracketMatch }) {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-1">
          <BracketTeamRow
            name={match.teamA?.name ?? "TBD"}
            isWinner={match.winner === "teamA"}
          />
          <BracketTeamRow
            name={match.teamB?.name ?? "TBD"}
            isWinner={match.winner === "teamB"}
          />
        </div>
        {match.score && (
          <div className="ml-3 text-sm font-mono text-muted-foreground">
            {match.score}
          </div>
        )}
        {match.winner && (
          <Badge variant="finished" className="ml-2">
            ✓
          </Badge>
        )}
      </div>
    </Card>
  )
}

function BracketTeamRow({
  name,
  isWinner,
}: {
  name: string
  isWinner: boolean
}) {
  return (
    <div
      className={`text-sm py-0.5 ${isWinner ? "font-semibold text-foreground" : "text-muted-foreground"}`}
    >
      {isWinner && <span className="text-success mr-1">▸</span>}
      {name}
    </div>
  )
}
