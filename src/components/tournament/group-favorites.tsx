"use client"

import { useFavorites } from "@/lib/favorites/context"
import { Group, GroupStanding } from "@/lib/tournament/schema"
import { Card, CardTitle } from "@/components/ui/card"
import { t } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function GroupCardClient({ group }: { group: Group }) {
  const msg = t().groups
  const { isFavorite } = useFavorites()

  return (
    <Card>
      <CardTitle className="mb-3">{group.name}</CardTitle>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
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
            {group.standings.map((standing: GroupStanding) => {
              const fav = isFavorite(standing.teamId)
              return (
                <tr
                  key={standing.teamId}
                  className={cn(
                    "border-b border-border/50 last:border-0",
                    fav && "bg-red-50/50"
                  )}
                >
                  <td className="py-2 pr-2 font-medium text-muted-foreground">
                    {standing.rank}
                  </td>
                  <td className="py-2 font-medium">
                    {standing.teamName}
                    {fav && <span className="text-red-400 text-[10px] ml-1">♥</span>}
                  </td>
                  <td className="py-2 text-center">{standing.played}</td>
                  <td className="py-2 text-center text-success font-medium">
                    {standing.won}
                  </td>
                  <td className="py-2 text-center text-destructive">
                    {standing.lost}
                  </td>
                  <td className="py-2 text-center">
                    {standing.setsWon}:{standing.setsLost}
                  </td>
                  <td className="py-2 text-center">
                    {standing.pointsWon}:{standing.pointsLost}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {group.standings.map((standing: GroupStanding) => {
          const fav = isFavorite(standing.teamId)
          return (
            <div
              key={standing.teamId}
              className={cn(
                "flex items-center justify-between py-2 border-b border-border/50 last:border-0",
                fav && "bg-red-50/50 -mx-2 px-2 rounded"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground w-5">
                  {standing.rank}.
                </span>
                <span className="font-medium text-sm">
                  {standing.teamName}
                  {fav && <span className="text-red-400 text-[10px] ml-1">♥</span>}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="text-success font-medium">
                  {standing.won}V
                </span>
                <span className="text-destructive">{standing.lost}P</span>
                <span>
                  {standing.setsWon}:{standing.setsLost}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
