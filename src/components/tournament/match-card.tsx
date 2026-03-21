import { Match, Team } from "@/lib/tournament/schema"
import { Badge } from "@/components/ui/badge"
import { t } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface MatchCardProps {
  match: Match
  compact?: boolean
  favoriteTeamIds?: Set<string>
  showMatchType?: boolean
  teams?: Team[]
}

export function MatchCard({ match, compact, favoriteTeamIds, showMatchType, teams }: MatchCardProps) {
  const msg = t().match

  const statusVariant = match.status === "live" ? "live" : match.status === "finished" ? "finished" : "scheduled"
  const statusLabel = match.status === "live" ? msg.live : match.status === "finished" ? msg.finished : msg.scheduled

  const hasFavorite = favoriteTeamIds && (
    favoriteTeamIds.has(match.teamA?.teamId ?? "") ||
    favoriteTeamIds.has(match.teamB?.teamId ?? "")
  )

  // Extract match number from ID (e.g., "hs-match-1" -> "1")
  const matchNumber = match.id.match(/-(\d+)$/)?.[1]

  // Determine seed favorite (lower seed number = stronger team)
  const teamAData = teams?.find(t => t.id === match.teamA?.teamId)
  const teamBData = teams?.find(t => t.id === match.teamB?.teamId)
  const seedA = teamAData?.seed
  const seedB = teamBData?.seed
  const isNotFinished = match.status !== "finished"
  const teamAIsSeedFavorite = isNotFinished && seedA != null && seedB != null && seedA < seedB
  const teamBIsSeedFavorite = isNotFinished && seedA != null && seedB != null && seedB < seedA

  const isTBD = !match.teamA?.name || !match.teamB?.name
    || match.teamA.name.startsWith("Vítěz") || match.teamB.name.startsWith("Vítěz")
    || match.teamA.name.startsWith("Poražen") || match.teamB.name.startsWith("Poražen")

  // Win probability from ranking points (only for non-finished, non-TBD matches)
  const pointsA = teamAData?.points
  const pointsB = teamBData?.points
  const showProbability = !isTBD && match.status !== "finished" && pointsA != null && pointsB != null && (pointsA + pointsB) > 0
  const probA = showProbability ? Math.round(pointsA! / (pointsA! + pointsB!) * 100) : 0
  const probB = showProbability ? 100 - probA : 0

  const isImportantMatch = match.round?.includes("Finále") || match.round?.includes("Semifinále") || match.round?.includes("3. místo")
  const isFinal = match.round === "Finále"

  // Determine match type for badge display
  const isQualification = match.round?.toLowerCase().includes("kvalifikac") || match.phase === "group"
  const isPlayoff = match.phase === "playoff" || match.bracketRound != null

  return (
    <div
      aria-label={`Zápas: ${match.teamA?.name ?? 'TBD'} vs ${match.teamB?.name ?? 'TBD'}${match.score?.winner ? ', dokončeno' : ''}`}
      className={cn(
      "rounded-xl border bg-card p-4 transition-all duration-200",
      match.status === "live"
        ? "border-live/30 shadow-md shadow-live/5 ring-1 ring-live/10 live-glow"
        : match.status === "finished"
          ? "border-border/40 shadow-none bg-card/80 hover:border-border/60"
          : "border-border shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5",
      hasFavorite && match.status !== "live" && "border-l-[3px] border-l-red-400/70 bg-red-50/30",
      isTBD && match.status === "scheduled" && "border-dashed border-border/50 opacity-75",
      isImportantMatch && !isTBD && "ring-1 ring-secondary/20",
      isFinal && !isTBD && "ring-1 ring-secondary/40 shadow-md",
    )}>
      {/* Time/court/round hierarchy */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          {match.scheduledTime && (
            <span className="font-bold text-foreground/80 text-[13px] tracking-tight whitespace-nowrap">{match.scheduledTime}</span>
          )}
          {match.round && !compact && (
            <span className="text-[11px] text-muted-foreground/70 font-medium">{match.round}</span>
          )}
          {matchNumber && !compact && (
            <span className="text-[11px] text-muted-foreground/50 font-medium">#{matchNumber}</span>
          )}
          {match.court && (
            <span className="bg-muted/80 rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground/70 font-score">K{match.court}</span>
          )}
          {/* Match type indicator */}
          {showMatchType && isQualification && (
            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-secondary/15 text-secondary-foreground/70 border border-secondary/20">Kvalifikace</span>
          )}
          {showMatchType && isPlayoff && (
            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-primary/10 text-primary/80 border border-primary/15">Playoff</span>
          )}
        </div>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </div>

      {(match.status === "finished" || match.status === "live") && match.score?.sets && match.score.sets.length > 0 && (() => {
        const setsA = match.score!.sets.reduce((count, s) => count + (s.teamA > s.teamB ? 1 : 0), 0)
        const setsB = match.score!.sets.reduce((count, s) => count + (s.teamB > s.teamA ? 1 : 0), 0)
        return (
          <div className="flex justify-center mb-2">
            <span className={cn("font-bold font-score tracking-wider", match.status === "live" ? "text-xl text-live" : "text-lg text-foreground/80")}>
              {setsA}:{setsB}
            </span>
          </div>
        )
      })()}

      {showProbability && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className={cn(
            "text-[10px] font-score font-semibold tabular-nums min-w-[32px] text-right",
            probA >= probB ? "text-foreground/70" : "text-muted-foreground/50"
          )}>{probA}%</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted/40 flex">
            <div
              className={cn(
                "h-full rounded-l-full transition-all",
                probA >= probB ? "bg-primary/40" : "bg-muted-foreground/20"
              )}
              style={{ width: `${probA}%` }}
            />
            <div
              className={cn(
                "h-full rounded-r-full transition-all",
                probB > probA ? "bg-primary/40" : "bg-muted-foreground/20"
              )}
              style={{ width: `${probB}%` }}
            />
          </div>
          <span className={cn(
            "text-[10px] font-score font-semibold tabular-nums min-w-[32px]",
            probB > probA ? "text-foreground/70" : "text-muted-foreground/50"
          )}>{probB}%</span>
        </div>
      )}

      <div className="space-y-0">
        <TeamRow
          name={match.teamA?.name ?? "TBD"}
          teamName={match.teamA?.name}
          isWinner={match.score?.winner === "teamA"}
          sets={match.score?.sets.map(s => s.teamA)}
          opponentSets={match.score?.sets.map(s => s.teamB)}
          isLive={match.status === "live"}
          isFinished={match.status === "finished"}
          isFavorite={favoriteTeamIds?.has(match.teamA?.teamId ?? "") ?? false}
          isSeedFavorite={teamAIsSeedFavorite}
          seed={seedA}
          players={teamAData?.players}
        />
        <div className="score-separator my-1" />
        <TeamRow
          name={match.teamB?.name ?? "TBD"}
          teamName={match.teamB?.name}
          isWinner={match.score?.winner === "teamB"}
          sets={match.score?.sets.map(s => s.teamB)}
          opponentSets={match.score?.sets.map(s => s.teamA)}
          isLive={match.status === "live"}
          isFinished={match.status === "finished"}
          isFavorite={favoriteTeamIds?.has(match.teamB?.teamId ?? "") ?? false}
          isSeedFavorite={teamBIsSeedFavorite}
          seed={seedB}
          players={teamBData?.players}
        />
      </div>
    </div>
  )
}

function TeamRow({ name, isWinner, sets, opponentSets, isLive, isFinished, isFavorite, isSeedFavorite, seed, players, teamName }: {
  name: string; isWinner: boolean; sets?: number[]; opponentSets?: number[]; isLive?: boolean; isFinished?: boolean; isFavorite?: boolean; isSeedFavorite?: boolean; seed?: number; players?: { name: string }[]; teamName?: string
}) {
  const isTBDName = name === "TBD" || name.startsWith("Vítěz") || name.startsWith("Poražen")
  /* Distinguish between "Vítěz #X" and "Poražený #X" with different styling */
  const isLoserRef = name.startsWith("Poražen")

  return (
    <div className={cn(
      "flex items-center justify-between py-1.5",
      isWinner ? "font-semibold" : "text-muted-foreground",
      isFinished && !isWinner && sets && sets.length > 0 && "opacity-60",
    )}>
      <div className="flex items-center gap-2 min-w-0">
        {isWinner && <span className="text-success text-xs">▸</span>}
        {!isWinner && sets && sets.length > 0 && <span className="w-[12px]" />}
        {seed && <span className="text-[10px] text-muted-foreground/40 font-score font-bold min-w-[20px] text-right shrink-0">{seed}</span>}
        {!isTBDName && teamName ? (
          <Link
            href={`/matches?team=${encodeURIComponent(teamName)}`}
            className={cn(
              "truncate hover:text-primary hover:underline underline-offset-2 transition-colors",
              isWinner ? "text-[15px] tracking-tight" : "text-sm",
            )}
          >
            {name}
          </Link>
        ) : (
          <span className={cn(
            "truncate",
            isWinner ? "text-[15px] tracking-tight" : "text-sm",
            isTBDName && "italic text-muted-foreground/50 text-[13px]",
            isLoserRef && "text-muted-foreground/35",
          )}>
            {name}
          </span>
        )}
        {players && players.length > 0 && !isTBDName && (
          <span className="text-[10px] text-muted-foreground/40 hidden sm:inline truncate">
            {players.map(p => p.name.split(/\s+/)[0]).join(" & ")}
          </span>
        )}
        {isFavorite && <span className="text-red-400 text-xs">&#9829;</span>}
        {isSeedFavorite && <span className="text-primary/30 text-[8px] leading-none" title="Vyšší nasazení">▲</span>}
      </div>
      {/* #2: Volleyball-style scoreboard look */}
      {sets && (
        <div className="flex items-center gap-px ml-3 font-score shrink-0 bg-muted/30 rounded-lg p-0.5">
          {sets.map((s, i) => {
            const wonThisSet = opponentSets && opponentSets[i] !== undefined && s > opponentSets[i]
            return (
            <span
              key={i}
              className={cn(
                "w-8 h-8 flex items-center justify-center text-[15px] first:rounded-l-md last:rounded-r-md",
                wonThisSet
                  ? "font-bold text-success bg-success/8"
                  : "text-muted-foreground bg-transparent",
                isLive && i === sets.length - 1 && "bg-live/10 text-live font-bold ring-1 ring-live/20"
              )}
            >
              {s}
            </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
