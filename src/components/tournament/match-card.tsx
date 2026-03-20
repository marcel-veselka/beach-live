import { Match } from "@/lib/tournament/schema"
import { Badge } from "@/components/ui/badge"
import { t } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface MatchCardProps {
  match: Match
  compact?: boolean
  favoriteTeamIds?: Set<string>
}

export function MatchCard({ match, compact, favoriteTeamIds }: MatchCardProps) {
  const msg = t().match

  const statusVariant = match.status === "live" ? "live" : match.status === "finished" ? "finished" : "scheduled"
  const statusLabel = match.status === "live" ? msg.live : match.status === "finished" ? msg.finished : msg.scheduled

  const hasFavorite = favoriteTeamIds && (
    favoriteTeamIds.has(match.teamA?.teamId ?? "") ||
    favoriteTeamIds.has(match.teamB?.teamId ?? "")
  )

  const isTBD = !match.teamA?.name || !match.teamB?.name
    || match.teamA.name.startsWith("Vítěz") || match.teamB.name.startsWith("Vítěz")
    || match.teamA.name.startsWith("Poražen") || match.teamB.name.startsWith("Poražen")

  return (
    <div className={cn(
      "rounded-xl border bg-card p-4 transition-all",
      match.status === "live"
        ? "border-live/30 shadow-md shadow-live/5 ring-1 ring-live/10"
        : match.status === "finished"
          ? "border-border/60 shadow-none"  /* Improvement 5: finished matches more muted */
          : "border-border shadow-sm",
      /* Improvement 10: favorite team highlight with subtle background */
      hasFavorite && match.status !== "live" && "border-l-[3px] border-l-red-400/70 bg-red-50/30",
      /* Improvement 8: TBD matches styled with dashed border */
      isTBD && match.status === "scheduled" && "border-dashed border-border/50 opacity-75",
    )}>
      {/* Improvement 4: better time/court/round hierarchy */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {match.scheduledTime && (
            <span className="font-bold text-foreground/80 text-[13px] tracking-tight">{match.scheduledTime}</span>
          )}
          {match.round && !compact && (
            <span className="text-[11px] text-muted-foreground/70 font-medium">{match.round}</span>
          )}
          {match.court && (
            <span className="bg-muted/80 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">Kurt {match.court}</span>
          )}
        </div>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </div>

      <div className="space-y-0">
        <TeamRow
          name={match.teamA?.name ?? "TBD"}
          isWinner={match.score?.winner === "teamA"}
          sets={match.score?.sets.map(s => s.teamA)}
          isLive={match.status === "live"}
          isFinished={match.status === "finished"}
          isFavorite={favoriteTeamIds?.has(match.teamA?.teamId ?? "") ?? false}
        />
        <div className="score-separator my-1" />
        <TeamRow
          name={match.teamB?.name ?? "TBD"}
          isWinner={match.score?.winner === "teamB"}
          sets={match.score?.sets.map(s => s.teamB)}
          isLive={match.status === "live"}
          isFinished={match.status === "finished"}
          isFavorite={favoriteTeamIds?.has(match.teamB?.teamId ?? "") ?? false}
        />
      </div>
    </div>
  )
}

function TeamRow({ name, isWinner, sets, isLive, isFinished, isFavorite }: {
  name: string; isWinner: boolean; sets?: number[]; isLive?: boolean; isFinished?: boolean; isFavorite?: boolean
}) {
  /* Improvement 6: TBD entries styled differently */
  const isTBDName = name === "TBD" || name.startsWith("Vítěz") || name.startsWith("Poražen")

  return (
    <div className={cn(
      "flex items-center justify-between py-1.5",
      isWinner ? "font-semibold" : "text-muted-foreground",
      /* Improvement 5: finished losers more muted */
      isFinished && !isWinner && sets && sets.length > 0 && "opacity-60",
    )}>
      <div className="flex items-center gap-2 min-w-0">
        {isWinner && <span className="text-success text-[10px]">●</span>}
        {!isWinner && sets && sets.length > 0 && <span className="w-[10px]" />}
        <span className={cn(
          "truncate",
          isWinner ? "text-[15px]" : "text-sm",
          /* Improvement 6: TBD styled italic and muted */
          isTBDName && "italic text-muted-foreground/50 text-[13px]",
        )}>
          {name}
        </span>
        {isFavorite && <span className="text-red-400 text-xs">♥</span>}
      </div>
      {sets && (
        <div className="flex items-center gap-0.5 ml-3 font-score shrink-0">
          {sets.map((s, i) => (
            <span
              key={i}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded-md text-sm",
                isWinner
                  ? "font-bold text-foreground"
                  : "text-muted-foreground",
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
