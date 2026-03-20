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
          {snapshot.bracket.rounds.map((round, roundIdx) => (
            <div key={round.name} className="flex flex-col gap-4 min-w-[260px]">
              {/* Improvement 1: round header styling with background pill */}
              <div className="flex items-center justify-center">
                <h3 className="text-[11px] font-bold text-muted-foreground/80 text-center uppercase tracking-widest bg-muted/60 rounded-full px-4 py-1.5">
                  {round.name}
                </h3>
              </div>
              {/* Improvement 6: better spacing between bracket matches */}
              <div className="flex flex-col gap-4 justify-around flex-1">
                {round.matches.map((match: BracketMatch, matchIdx: number) => (
                  <div key={match.matchId}>
                    {/* Improvement 7: match number label */}
                    <p className="text-[10px] text-muted-foreground/40 text-center mb-1 font-medium">
                      Z{roundIdx * 10 + matchIdx + 1}
                    </p>
                    <BracketMatchNodeClient match={match} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile bracket - round by round cards */}
      <div className="md:hidden space-y-2">
        {snapshot.bracket.rounds.map((round, roundIdx) => (
          <div key={round.name}>
            {/* Improvement 1 & 5: round header with visual progression indicator */}
            <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm py-3 mb-2">
              <div className="flex items-center gap-2">
                {/* Improvement 5: visual round progression dots */}
                <div className="flex gap-1">
                  {snapshot.bracket!.rounds.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i <= roundIdx ? "w-4 bg-primary" : "w-1.5 bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {round.name}
                </h3>
                {/* Improvement 9: match count hint */}
                <span className="text-[10px] text-muted-foreground/50 ml-auto">
                  {round.matches.length} {round.matches.length === 1 ? "zápas" : round.matches.length < 5 ? "zápasy" : "zápasů"}
                </span>
              </div>
            </div>
            {/* Improvement 6: better spacing */}
            <div className="space-y-2.5">
              {round.matches.map((match: BracketMatch) => (
                <BracketMatchCardClient key={match.matchId} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
