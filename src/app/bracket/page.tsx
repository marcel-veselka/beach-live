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

  // Determine current round (first round with incomplete matches)
  const currentRoundIdx = snapshot.bracket.rounds.findIndex(
    (round) => round.matches.some((m: BracketMatch) => !m.winner)
  )
  const activeRoundIdx = currentRoundIdx === -1 ? snapshot.bracket.rounds.length - 1 : currentRoundIdx

  // Separate main draw rounds from placement rounds
  const mainDrawRounds = snapshot.bracket.rounds.filter(
    (r) => !r.name.toLowerCase().includes("místo") && !r.name.toLowerCase().includes("placement")
  )
  const placementRounds = snapshot.bracket.rounds.filter(
    (r) => r.name.toLowerCase().includes("místo") || r.name.toLowerCase().includes("placement")
  )

  return (
    <>
      <AutoRefresh />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-heading text-2xl font-extrabold tracking-tight">
          {msg.bracket.title}
        </h1>
        <FreshnessIndicator generatedAt={snapshot.meta.generatedAt} />
      </div>

      {/* Desktop bracket - horizontal flow with connectors */}
      <div className="hidden md:block overflow-x-auto">
        {mainDrawRounds.length > 0 && (
          <div className="flex gap-0 min-w-max pb-4">
            {mainDrawRounds.map((round, roundIdx) => {
              const globalIdx = snapshot.bracket!.rounds.indexOf(round)
              const isCurrentRound = globalIdx === activeRoundIdx
              const isLastRound = roundIdx === mainDrawRounds.length - 1
              return (
                <div key={round.name} className="flex items-stretch">
                  <div className="flex flex-col gap-4 min-w-[280px]">
                    {/* Round header with current indicator */}
                    <div className="flex items-center justify-center gap-2">
                      {isCurrentRound && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                      <h3 className={`text-[11px] font-bold text-center uppercase tracking-widest rounded-full px-4 py-1.5 ${
                        isCurrentRound
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted/60 text-muted-foreground/80"
                      }`}>
                        {round.name}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-4 justify-around flex-1">
                      {round.matches.map((match: BracketMatch) => {
                        const matchNum = match.matchId.replace(/\D/g, "")
                        return (
                          <div key={match.matchId}>
                            <p className="text-[10px] text-muted-foreground/40 text-center mb-1 font-bold font-score bg-muted/30 rounded-full w-7 h-5 flex items-center justify-center mx-auto">
                              {matchNum}
                            </p>
                            <BracketMatchNodeClient match={match} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {/* Connector between rounds */}
                  {!isLastRound && (
                    <div className="flex items-center justify-center w-8 self-stretch">
                      <div className="w-px flex-1 bg-gradient-to-b from-transparent via-border to-transparent" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Placement matches section (desktop) */}
        {placementRounds.length > 0 && (
          <>
            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/40 to-transparent" />
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest bg-muted/50 px-3 py-1 rounded-full">O umístění</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/40 to-transparent" />
            </div>
            <div className="flex gap-6 min-w-max pb-4">
              {placementRounds.map((round) => (
                <div key={round.name} className="flex flex-col gap-4 min-w-[280px]">
                  <div className="flex items-center justify-center">
                    <h3 className="text-[11px] font-bold text-muted-foreground/60 text-center uppercase tracking-widest bg-muted/40 rounded-full px-4 py-1.5 border border-border/30">
                      {round.name}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-4 justify-around flex-1">
                    {round.matches.map((match: BracketMatch) => {
                      const matchNum = match.matchId.replace(/\D/g, "")
                      return (
                        <div key={match.matchId}>
                          <p className="text-[10px] text-muted-foreground/40 text-center mb-1 font-bold font-score bg-muted/30 rounded-full w-7 h-5 flex items-center justify-center mx-auto">
                            {matchNum}
                          </p>
                          <BracketMatchNodeClient match={match} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Mobile bracket - round by round cards */}
      <div className="md:hidden space-y-2">
        {/* Main draw rounds */}
        {mainDrawRounds.map((round, roundIdx) => {
          const globalIdx = snapshot.bracket!.rounds.indexOf(round)
          const isCurrentRound = globalIdx === activeRoundIdx
          const isLastRound = roundIdx === mainDrawRounds.length - 1
          {/* #5: Round number badges (R1, QF, SF, F) */}
          const roundLabel = isLastRound ? "F" : roundIdx === mainDrawRounds.length - 2 ? "SF" : roundIdx === mainDrawRounds.length - 3 ? "QF" : `R${roundIdx + 1}`
          return (
            <div key={round.name}>
              {/* #1: Round headers with colored bar + #3 larger progression dots + #8 scroll indicator */}
              <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm py-3 mb-2">
                <div className="flex items-center gap-2.5">
                  {/* #3: Larger progression dots */}
                  <div className="flex gap-1">
                    {mainDrawRounds.map((_, i) => (
                      <span
                        key={i}
                        className={`h-2 rounded-full transition-all ${
                          i < mainDrawRounds.indexOf(round)
                            ? "w-5 bg-primary/60"
                            : i === mainDrawRounds.indexOf(round)
                              ? isCurrentRound
                                ? "w-6 bg-primary ring-2 ring-primary/20"
                                : "w-5 bg-primary"
                              : "w-2 bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  {/* #5: Round badge */}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isCurrentRound ? "bg-primary text-white" : isLastRound ? "bg-secondary/20 text-secondary-foreground" : "bg-muted text-muted-foreground/70"
                  }`}>{roundLabel}</span>
                  <h3 className={`text-xs font-bold uppercase tracking-widest ${
                    isCurrentRound ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {round.name}
                  </h3>
                  {isCurrentRound && (
                    <span className="text-[9px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5 uppercase tracking-wider">Aktuální</span>
                  )}
                  <span className="text-[10px] text-muted-foreground/50 ml-auto font-medium">
                    {round.matches.length} {round.matches.length === 1 ? "zápas" : round.matches.length < 5 ? "zápasy" : "zápasů"}
                  </span>
                </div>
                {/* #1: Colored bar under round header */}
                <div className={`mt-2 h-0.5 rounded-full ${isCurrentRound ? "bg-primary/30" : isLastRound ? "bg-gradient-to-r from-secondary/40 to-primary/30" : "bg-border/30"}`} />
              </div>
              {/* #10: Cards with increasing shadow toward final */}
              <div className="space-y-2.5">
                {round.matches.map((match: BracketMatch, idx: number) => {
                  const matchNum = match.matchId.replace(/\D/g, "")
                  return (
                    <div key={match.matchId} className={`animate-card-in ${isLastRound ? "final-match-shadow rounded-xl" : ""}`} style={{ animationDelay: `${idx * 50}ms` }}>
                      <BracketMatchCardClient match={match} matchNumber={matchNum} />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* #6: Placement matches section - visually distinct */}
        {placementRounds.length > 0 && (
          <>
            <div className="flex items-center gap-3 my-5 pt-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/40 to-transparent" />
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest bg-muted/50 px-3 py-1 rounded-full">O umístění</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/40 to-transparent" />
            </div>
            {placementRounds.map((round) => (
              <div key={round.name}>
                <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm py-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/60" />
                    <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                      {round.name}
                    </h3>
                    <span className="text-[10px] text-muted-foreground/50 ml-auto font-medium">
                      {round.matches.length} {round.matches.length === 1 ? "zápas" : round.matches.length < 5 ? "zápasy" : "zápasů"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {round.matches.map((match: BracketMatch, idx: number) => {
                    const matchNum = match.matchId.replace(/\D/g, "")
                    return (
                      <div key={match.matchId} className="animate-card-in" style={{ animationDelay: `${idx * 50}ms` }}>
                        <BracketMatchCardClient match={match} matchNumber={matchNum} />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  )
}
