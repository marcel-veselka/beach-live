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
  const isTBD = !match.teamA?.name || !match.teamB?.name
    || match.teamA.name.startsWith("Vítěz") || match.teamB.name.startsWith("Vítěz")
    || match.teamA.name.startsWith("Poražen") || match.teamB.name.startsWith("Poražen")
    || match.teamA.name === "TBD" || match.teamB.name === "TBD"

  return (
    <Card className={cn(
      "p-3 space-y-1",
      hasFav && "ring-1 ring-red-200 border-red-200/60",
      /* Improvement 2: TBD match placeholder with dashed border */
      isTBD && !match.winner && "border-dashed opacity-70",
      /* Improvement 10: completed match subtle background */
      match.winner && "bg-muted/20",
    )}>
      <BracketTeamRow
        name={match.teamA?.name ?? "TBD"}
        isWinner={match.winner === "teamA"}
        isFavorite={isFavorite(match.teamA?.teamId ?? "")}
      />
      <div className="score-separator" />
      <BracketTeamRow
        name={match.teamB?.name ?? "TBD"}
        isWinner={match.winner === "teamB"}
        isFavorite={isFavorite(match.teamB?.teamId ?? "")}
      />
      {/* Improvement 4: better score display */}
      {match.score && (
        <div className="text-[11px] text-muted-foreground text-center pt-1 font-score font-medium tracking-wide">
          {match.score}
        </div>
      )}
    </Card>
  )
}

export function BracketMatchCardClient({ match, matchNumber }: { match: BracketMatch; matchNumber?: string }) {
  const { isFavorite } = useFavorites()
  const hasFav = isFavorite(match.teamA?.teamId ?? "") || isFavorite(match.teamB?.teamId ?? "")
  const isTBD = !match.teamA?.name || !match.teamB?.name
    || match.teamA.name.startsWith("Vítěz") || match.teamB.name.startsWith("Vítěz")
    || match.teamA.name.startsWith("Poražen") || match.teamB.name.startsWith("Poražen")
    || match.teamA.name === "TBD" || match.teamB.name === "TBD"

  return (
    <Card className={cn(
      "p-3",
      hasFav && "ring-1 ring-red-200 border-red-200/60",
      /* Improvement 2: TBD match placeholder */
      isTBD && !match.winner && "border-dashed opacity-70",
      /* Improvement 10: completed match subtle background */
      match.winner && "bg-muted/20",
    )}>
      <div className="flex items-center justify-between">
        {matchNumber && (
          <span className="text-[10px] text-muted-foreground/50 font-score font-medium mr-2 self-start mt-1">#{matchNumber}</span>
        )}
        <div className="flex-1 space-y-0.5">
          <BracketTeamRow
            name={match.teamA?.name ?? "TBD"}
            isWinner={match.winner === "teamA"}
            isLoser={match.winner === "teamB"}
            isFavorite={isFavorite(match.teamA?.teamId ?? "")}
          />
          <div className="score-separator my-0.5" />
          <BracketTeamRow
            name={match.teamB?.name ?? "TBD"}
            isWinner={match.winner === "teamB"}
            isLoser={match.winner === "teamA"}
            isFavorite={isFavorite(match.teamB?.teamId ?? "")}
          />
        </div>
        {/* Improvement 4: better score display in bracket */}
        {match.score && (
          <div className="ml-3 text-xs font-score font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
            {match.score}
          </div>
        )}
        {match.winner && (
          <Badge variant="finished" className="ml-2 text-[10px]">
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
  isLoser,
  isFavorite,
}: {
  name: string
  isWinner: boolean
  isLoser?: boolean
  isFavorite: boolean
}) {
  /* Improvement 2: TBD name styling */
  const isTBDName = name === "TBD" || name.startsWith("Vítěz") || name.startsWith("Poražen")

  return (
    <div
      className={cn(
        "text-sm py-0.5 flex items-center gap-1.5",
        isWinner ? "font-semibold text-foreground" : "text-muted-foreground",
        /* Improvement 3: winner/loser distinction */
        isLoser && "opacity-50",
        /* Improvement 2: TBD italic and lighter */
        isTBDName && "italic text-muted-foreground/40 text-[13px]",
      )}
    >
      {/* Improvement 3: better winner indicator */}
      {isWinner && <span className="text-success text-[10px]">●</span>}
      <span className="truncate">{name}</span>
      {isFavorite && <span className="text-red-400 text-xs">♥</span>}
    </div>
  )
}
