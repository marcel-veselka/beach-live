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
      "rounded-xl border bg-card p-3.5 transition-all",
      match.status === "live" ? "border-live/30 shadow-md shadow-live/5" : "border-border shadow-sm",
    )}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {match.scheduledTime && <span className="font-medium">{match.scheduledTime}</span>}
          {match.court && <span>• Kurt {match.court}</span>}
          {match.round && !compact && <span>• {match.round}</span>}
        </div>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </div>

      <div className="space-y-1.5">
        <TeamRow
          name={match.teamA?.name ?? "TBD"}
          isWinner={match.score?.winner === "teamA"}
          sets={match.score?.sets.map(s => s.teamA)}
        />
        <div className="border-t border-border/50" />
        <TeamRow
          name={match.teamB?.name ?? "TBD"}
          isWinner={match.score?.winner === "teamB"}
          sets={match.score?.sets.map(s => s.teamB)}
        />
      </div>
    </div>
  )
}

function TeamRow({ name, isWinner, sets }: { name: string; isWinner: boolean; sets?: number[] }) {
  return (
    <div className={cn(
      "flex items-center justify-between py-0.5",
      isWinner ? "font-semibold" : "text-muted-foreground"
    )}>
      <div className="flex items-center gap-1.5 min-w-0">
        {isWinner && <span className="text-success text-xs">▸</span>}
        <span className="truncate text-sm">{name}</span>
      </div>
      {sets && (
        <div className="flex items-center gap-2 ml-3 font-score text-sm tabular-nums">
          {sets.map((s, i) => (
            <span key={i} className={cn("w-5 text-center", isWinner ? "" : "text-muted-foreground")}>{s}</span>
          ))}
        </div>
      )}
    </div>
  )
}
