import { Match, Team } from "@/lib/tournament/schema"
import { Badge } from "@/components/ui/badge"
import { t } from "@/lib/i18n"
import { cn } from "@/lib/utils"

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

  // Determine match type for badge display
  const isQualification = match.round?.toLowerCase().includes("kvalifikac") || match.phase === "group"
  const isPlayoff = match.phase === "playoff" || match.bracketRound != null

  return (
    <div className={cn(
      "rounded-xl border bg-card p-4 transition-all duration-200",
      match.status === "live"
        ? "border-live/30 shadow-md shadow-live/5 ring-1 ring-live/10 live-glow"
        : match.status === "finished"
          ? "border-border/40 shadow-none bg-card/80 hover:border-border/60"
          : "border-border shadow-sm hover:shadow-md hover:border-primary/20",
      hasFavorite && match.status !== "live" && "border-l-[3px] border-l-red-400/70 bg-red-50/30",
      isTBD && match.status === "scheduled" && "border-dashed border-border/50 opacity-75",
    )}>
      {/* Time/court/round hierarchy */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          {match.scheduledTime && (
            <span className="font-bold text-foreground/80 text-[13px] tracking-tight">{match.scheduledTime}</span>
          )}
          {match.round && !compact && (
            <span className="text-[11px] text-muted-foreground/70 font-medium">{match.round}</span>
          )}
          {matchNumber && (
            <span className="text-[11px] text-muted-foreground/50 font-medium">#{matchNumber}</span>
          )}
          {match.court && (
            <span className="bg-muted/80 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">Kurt {match.court}</span>
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
        {(match.status === "finished" || match.status === "live") && match.score?.sets && match.score.sets.length > 0 && (() => {
          const setsA = match.score!.sets.reduce((count, s) => count + (s.teamA > s.teamB ? 1 : 0), 0)
          const setsB = match.score!.sets.reduce((count, s) => count + (s.teamB > s.teamA ? 1 : 0), 0)
          return <span className={cn("text-base font-bold font-score", match.status === "finished" && "text-foreground")}>{setsA}:{setsB}</span>
        })()}
      </div>

      <div className="space-y-0">
        <TeamRow
          name={match.teamA?.name ?? "TBD"}
          isWinner={match.score?.winner === "teamA"}
          sets={match.score?.sets.map(s => s.teamA)}
          isLive={match.status === "live"}
          isFinished={match.status === "finished"}
          isFavorite={favoriteTeamIds?.has(match.teamA?.teamId ?? "") ?? false}
          isSeedFavorite={teamAIsSeedFavorite}
        />
        <div className="score-separator my-1" />
        <TeamRow
          name={match.teamB?.name ?? "TBD"}
          isWinner={match.score?.winner === "teamB"}
          sets={match.score?.sets.map(s => s.teamB)}
          isLive={match.status === "live"}
          isFinished={match.status === "finished"}
          isFavorite={favoriteTeamIds?.has(match.teamB?.teamId ?? "") ?? false}
          isSeedFavorite={teamBIsSeedFavorite}
        />
      </div>
    </div>
  )
}

function TeamRow({ name, isWinner, sets, isLive, isFinished, isFavorite, isSeedFavorite }: {
  name: string; isWinner: boolean; sets?: number[]; isLive?: boolean; isFinished?: boolean; isFavorite?: boolean; isSeedFavorite?: boolean
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
        <span className={cn(
          "truncate",
          isWinner ? "text-[15px]" : "text-sm",
          /* TBD styled italic and muted; "Poražený" entries even more muted */
          isTBDName && "italic text-muted-foreground/50 text-[13px]",
          isLoserRef && "text-muted-foreground/35",
        )}>
          {name}
        </span>
        {isFavorite && <span className="text-red-400 text-xs">&#9829;</span>}
        {isSeedFavorite && <span className="text-primary/30 text-[8px] leading-none" title="Vyšší nasazení">▲</span>}
      </div>
      {/* #2: Volleyball-style scoreboard look */}
      {sets && (
        <div className="flex items-center gap-px ml-3 font-score shrink-0 bg-muted/30 rounded-lg p-0.5">
          {sets.map((s, i) => (
            <span
              key={i}
              className={cn(
                "w-8 h-8 flex items-center justify-center text-[15px] first:rounded-l-md last:rounded-r-md",
                isWinner
                  ? "font-bold text-foreground bg-card"
                  : "text-muted-foreground bg-transparent",
                isLive && i === sets.length - 1 && "bg-live/10 text-live font-bold ring-1 ring-live/20"
              )}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
