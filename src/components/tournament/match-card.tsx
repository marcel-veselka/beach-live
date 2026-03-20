import { Match } from "@/lib/tournament/schema"
import { Badge } from "@/components/ui/badge"
import { t } from "@/lib/i18n"

interface MatchCardProps {
  match: Match
  compact?: boolean
}

export function MatchCard({ match, compact }: MatchCardProps) {
  const msg = t().match

  const statusVariant = match.status === "live" ? "live" : match.status === "finished" ? "finished" : "scheduled"
  const statusLabel = match.status === "live" ? msg.live : match.status === "finished" ? msg.finished : msg.scheduled

  return (
    <div className="rounded-lg border border-border bg-card p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {match.scheduledTime && <span>{match.scheduledTime}</span>}
          {match.court && <span>• {msg.court} {match.court}</span>}
          {match.round && !compact && <span>• {match.round}</span>}
        </div>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </div>

      <div className="space-y-1">
        <TeamRow
          name={match.teamA?.name ?? "TBD"}
          isWinner={match.score?.winner === "teamA"}
          sets={match.score?.sets.map(s => s.teamA)}
        />
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
    <div className={`flex items-center justify-between ${isWinner ? "font-semibold" : ""}`}>
      <span className="truncate">{name}</span>
      {sets && (
        <div className="flex items-center gap-1.5 ml-2 font-mono text-sm">
          {sets.map((s, i) => (
            <span key={i} className="w-5 text-center">{s}</span>
          ))}
        </div>
      )}
    </div>
  )
}
