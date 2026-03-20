"use client"

import { useFavorites } from "@/lib/favorites/context"
import { BracketMatch } from "@/lib/tournament/schema"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/ui/section"
import { cn } from "@/lib/utils"

export function BracketMatchNodeClient({ match }: { match: BracketMatch }) {
  const { isFavorite } = useFavorites()
  const hasFav = isFavorite(match.teamA?.teamId ?? "") || isFavorite(match.teamB?.teamId ?? "")

  return (
    <Card className={cn("p-3 space-y-1", hasFav && "ring-1 ring-red-200 border-red-200/60")}>
      <BracketTeamRow
        name={match.teamA?.name ?? "TBD"}
        isWinner={match.winner === "teamA"}
        isFavorite={isFavorite(match.teamA?.teamId ?? "")}
      />
      <div className="border-t border-border" />
      <BracketTeamRow
        name={match.teamB?.name ?? "TBD"}
        isWinner={match.winner === "teamB"}
        isFavorite={isFavorite(match.teamB?.teamId ?? "")}
      />
      {match.score && (
        <div className="text-xs text-muted-foreground text-center pt-1">
          {match.score}
        </div>
      )}
    </Card>
  )
}

export function BracketMatchCardClient({ match }: { match: BracketMatch }) {
  const { isFavorite } = useFavorites()
  const hasFav = isFavorite(match.teamA?.teamId ?? "") || isFavorite(match.teamB?.teamId ?? "")

  return (
    <Card className={cn("p-3", hasFav && "ring-1 ring-red-200 border-red-200/60")}>
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-1">
          <BracketTeamRow
            name={match.teamA?.name ?? "TBD"}
            isWinner={match.winner === "teamA"}
            isFavorite={isFavorite(match.teamA?.teamId ?? "")}
          />
          <BracketTeamRow
            name={match.teamB?.name ?? "TBD"}
            isWinner={match.winner === "teamB"}
            isFavorite={isFavorite(match.teamB?.teamId ?? "")}
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
  isFavorite,
}: {
  name: string
  isWinner: boolean
  isFavorite: boolean
}) {
  return (
    <div
      className={`text-sm py-0.5 flex items-center gap-1 ${isWinner ? "font-semibold text-foreground" : "text-muted-foreground"}`}
    >
      {isWinner && <span className="text-success mr-1">▸</span>}
      {name}
      {isFavorite && <span className="text-red-400 text-[10px]">♥</span>}
    </div>
  )
}
