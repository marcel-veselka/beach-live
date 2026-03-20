import { Metadata } from "next"
import { loadTournamentData } from "@/lib/tournament/load"
import { Section } from "@/components/ui/section"
import { EmptyState } from "@/components/ui/empty-state"
import { FreshnessIndicator } from "@/components/tournament/freshness-indicator"
import { AutoRefresh } from "@/components/tournament/auto-refresh"
import { BracketMatchNodeClient, BracketMatchCardClient } from "@/components/tournament/bracket-favorites"
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
                  <BracketMatchNodeClient key={match.matchId} match={match} />
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
                <BracketMatchCardClient key={match.matchId} match={match} />
              ))}
            </div>
          </Section>
        ))}
      </div>
    </>
  )
}
