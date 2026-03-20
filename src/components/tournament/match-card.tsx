import { Match } from "@/lib/tournament/schema"
import { Badge } from "@/components/ui/badge"
import { t } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface MatchCardProps {
  match: Match
  compact?: boolean
}

export function MatchCard({ match, compact }: MatchCardProps) {
  const msg = t().match

  const statusVariant = match.status === "live" ? "live" : match.status === "finished" ? "finished" : "scheduled"
  const statusLabel = match.status === "live" ? msg.live : match.status === "finished" ? msg.finished : msg.scheduled

  return (
    <div className={cn(
      "rounded-xl border bg-card p-4 transition-all",
      match.status === "live" ? "border-live/30 shadow-md shadow-live/5 ring-1 ring-live/10" : "border-border shadow-sm",
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {match.scheduledTime && (
            <span className="font-semibold text-foreground/70 text-[13px]">{match.scheduledTime}</span>
          )}
          {match.court && (
            <span className="bg-muted rounded-md px-1.5 py-0.5 text-[11px]">Kurt {match.court}</span>
          )}
          {match.round && !compact && (
            <span className="bg-muted rounded-md px-1.5 py-0.5 text-[11px]">{match.round}</span>
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
        />
        <div className="score-separator my-1" />
        <TeamRow
          name={match.teamB?.name ?? "TBD"}
          isWinner={match.score?.winner === "teamB"}
          sets={match.score?.sets.map(s => s.teamB)}
          isLive={match.status === "live"}
        />
      </div>
    </div>
  )
}

function TeamRow({ name, isWinner, sets, isLive }: { name: string; isWinner: boolean; sets?: number[]; isLive?: boolean }) {
  return (
    <div className={cn(
      "flex items-center justify-between py-1",
      isWinner ? "font-semibold" : "text-muted-foreground"
    )}>
      <div className="flex items-center gap-2 min-w-0">
        {isWinner && <span className="text-success text-[10px]">●</span>}
        {!isWinner && sets && sets.length > 0 && <span className="w-[10px]" />}
        <span className={cn("truncate", isWinner ? "text-[15px]" : "text-sm")}>{name}</span>
      </div>
      {sets && (
        <div className="flex items-center gap-0 ml-3 font-score shrink-0">
          {sets.map((s, i) => (
            <span
              key={i}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded-md text-sm",
                isWinner
                  ? "font-bold text-foreground"
                  : "text-muted-foreground",
                isLive && i === sets.length - 1 && "bg-live/10 text-live font-bold"
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
