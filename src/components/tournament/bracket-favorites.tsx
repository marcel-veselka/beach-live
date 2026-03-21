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
      isTBD && !match.winner && "border-dashed opacity-70 tbd-pattern",
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
      {match.score && (
        <div className="flex justify-center gap-1 pt-1.5">
          {match.score.split(", ").map((s, i) => (
            <span key={i} className="text-[10px] font-score font-medium text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
              {s}
            </span>
          ))}
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
      "p-3.5 press-scale",
      hasFav && "ring-1 ring-red-200 border-red-200/60",
      isTBD && !match.winner && "border-dashed opacity-70 tbd-pattern",
      match.winner && "bg-muted/20",
      match.winner && "border-l-2 border-l-secondary/50",
    )}>
      <div className="flex items-center justify-between">
        {/* #7: Match number integrated as left accent */}
        {matchNumber && (
          <span className="text-[10px] text-muted-foreground/40 font-score font-bold mr-2.5 self-stretch flex items-center justify-center shrink-0 border-r border-border/30 pr-2.5 min-w-[24px]">
            {matchNumber}
          </span>
        )}
        <div className="flex-1 space-y-0.5 min-w-0">
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
        {match.score && (
          <div className="ml-3 font-score font-medium text-muted-foreground shrink-0 flex flex-col items-end gap-0.5">
            {match.score.split(", ").map((s, i) => (
              <span key={i} className="text-xs bg-muted/50 px-2 py-0.5 rounded-md whitespace-nowrap">{s}</span>
            ))}
          </div>
        )}
        {match.winner && (
          <Badge variant="finished" className="ml-2 text-[10px]">
            &#10003;
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
  const isTBDName = name === "TBD" || name.startsWith("Vítěz") || name.startsWith("Poražen")
  const isLoserRef = name.startsWith("Poražen")

  // Generate tooltip text for TBD entries explaining where the team comes from
  const tbdTooltip = isTBDName && name !== "TBD"
    ? `Bude doplněno po dohrání předchozího zápasu`
    : isTBDName
      ? "Tým bude určen"
      : undefined

  return (
    <div
      className={cn(
        "text-sm py-0.5 flex items-center gap-1.5",
        isWinner ? "font-bold text-foreground text-[15px]" : "text-muted-foreground",
        isLoser && "opacity-50",
        isTBDName && "italic text-muted-foreground/40 text-[13px]",
        isLoserRef && "text-muted-foreground/30",
      )}
      title={tbdTooltip}
    >
      {isWinner && <span className="text-secondary text-xs">&#9733;</span>}
      <span className="truncate">{name}</span>
      {isFavorite && <span className="text-red-400 text-xs">&#9829;</span>}
    </div>
  )
}
