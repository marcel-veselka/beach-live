"use client"

import { useFavorites } from "@/lib/favorites/context"
import { Group, GroupStanding } from "@/lib/tournament/schema"
import { Card } from "@/components/ui/card"
import { t } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function GroupCardClient({ group }: { group: Group }) {
  const msg = t().groups
  const { isFavorite } = useFavorites()

  /* Improvement 1: extract group letter from name like "Skupina A" */
  const groupLetter = group.name.replace(/^Skupina\s*/i, "").charAt(0).toUpperCase()

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-muted/50 to-muted/20 border-b border-border/50">
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
          {groupLetter}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight">{group.name}</h3>
          <p className="text-[11px] text-muted-foreground">{group.standings.length} týmů</p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto px-4 pb-3 pt-1">
        <table className="w-full text-sm">
          <thead>
            {/* Improvement 10: bold stats header row */}
            <tr className="border-b border-border text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
              <th className="text-left py-2 pr-2 w-8">{msg.rank}</th>
              <th className="text-left py-2">{msg.team}</th>
              <th className="text-center py-2 w-8">{msg.played}</th>
              <th className="text-center py-2 w-8">{msg.won}</th>
              <th className="text-center py-2 w-8">{msg.lost}</th>
              <th className="text-center py-2 w-12">
                {msg.setsWon}:{msg.setsLost}
              </th>
              <th className="text-center py-2 w-14">
                {msg.pointsWon}:{msg.pointsLost}
              </th>
            </tr>
          </thead>
          <tbody>
            {group.standings.map((standing: GroupStanding, idx: number) => {
              const fav = isFavorite(standing.teamId)
              const isFirst = standing.rank === 1
              return (
                <tr
                  key={standing.teamId}
                  className={cn(
                    "border-b border-border/40 last:border-0 transition-colors",
                    /* Improvement 2: alternating row colors */
                    idx % 2 === 1 && "bg-muted/20",
                    /* Improvement 3: group winner highlight */
                    isFirst && "bg-success/5",
                    fav && "bg-red-50/50"
                  )}
                >
                  {/* Improvement 5: rank number styling */}
                  <td className="py-2.5 pr-2">
                    <span className={cn(
                      "w-6 h-6 inline-flex items-center justify-center rounded-full text-xs font-bold",
                      isFirst
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground"
                    )}>
                      {standing.rank}
                    </span>
                  </td>
                  <td className={cn("py-2.5 font-medium", isFirst && "text-foreground")}>
                    {standing.teamName}
                    {fav && <span className="text-red-400 text-[10px] ml-1">♥</span>}
                  </td>
                  <td className="py-2.5 text-center text-muted-foreground">{standing.played}</td>
                  <td className="py-2.5 text-center text-success font-semibold">
                    {standing.won}
                  </td>
                  <td className="py-2.5 text-center text-destructive font-medium">
                    {standing.lost}
                  </td>
                  {/* Improvement 6: set ratio with colored indicator */}
                  <td className="py-2.5 text-center">
                    <span className={cn(
                      "font-medium",
                      standing.setsWon > standing.setsLost ? "text-success/80" : standing.setsWon < standing.setsLost ? "text-destructive/80" : "text-muted-foreground"
                    )}>
                      {standing.setsWon}:{standing.setsLost}
                    </span>
                  </td>
                  <td className="py-2.5 text-center text-muted-foreground">
                    {standing.pointsWon}:{standing.pointsLost}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards - improvement 7: better spacing */}
      <div className="sm:hidden px-4 pb-3 pt-1">
        <div className="space-y-0">
          {group.standings.map((standing: GroupStanding, idx: number) => {
            const fav = isFavorite(standing.teamId)
            const isFirst = standing.rank === 1
            return (
              <div
                key={standing.teamId}
                className={cn(
                  "flex items-center justify-between py-2.5 border-b border-border/40 last:border-0",
                  /* Improvement 2: alternating row colors on mobile */
                  idx % 2 === 1 && "bg-muted/20 -mx-4 px-4",
                  /* Improvement 3: group winner highlight on mobile */
                  isFirst && "bg-success/5 -mx-4 px-4",
                  fav && "bg-red-50/50 -mx-4 px-4"
                )}
              >
                <div className="flex items-center gap-2.5">
                  {/* Improvement 5: rank circle badge */}
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    isFirst
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {standing.rank}
                  </span>
                  <span className={cn("font-medium text-sm", isFirst && "font-semibold")}>
                    {standing.teamName}
                    {fav && <span className="text-red-400 text-[10px] ml-1">♥</span>}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs shrink-0 ml-2">
                  <span className="text-success font-semibold">
                    {standing.won}V
                  </span>
                  <span className="text-destructive font-medium">{standing.lost}P</span>
                  {/* Improvement 6: set ratio colored */}
                  <span className={cn(
                    "font-medium min-w-[24px] text-center",
                    standing.setsWon > standing.setsLost ? "text-success/70" : standing.setsWon < standing.setsLost ? "text-destructive/70" : "text-muted-foreground"
                  )}>
                    {standing.setsWon}:{standing.setsLost}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
