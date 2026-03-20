"use client"

import { useState, useMemo } from "react"
import { Team, Match } from "@/lib/tournament/schema"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Users } from "lucide-react"
import { t } from "@/lib/i18n"
import Link from "next/link"
import { useFavorites } from "@/lib/favorites/context"
import { FavoriteButton } from "@/components/tournament/favorite-button"
import { normalizeSearch } from "@/lib/utils"

interface TeamsListProps {
  teams: Team[]
  matches: Match[]
}

export function TeamsList({ teams, matches }: TeamsListProps) {
  const [search, setSearch] = useState("")
  const msg = t()
  const { isFavorite } = useFavorites()

  const filtered = useMemo(() => {
    let result = teams
    if (search) {
      const q = normalizeSearch(search)
      result = result.filter(
        (team) =>
          normalizeSearch(team.name).includes(q) ||
          team.players.some((p) => normalizeSearch(p.name).includes(q))
      )
    }
    // Sort favorites to top
    return [...result].sort((a, b) => {
      const aFav = isFavorite(a.id) ? 0 : 1
      const bFav = isFavorite(b.id) ? 0 : 1
      return aFav - bFav
    })
  }, [teams, search, isFavorite])

  const getTeamStats = (teamId: string) => {
    const teamMatches = matches.filter(
      (m) => m.teamA?.teamId === teamId || m.teamB?.teamId === teamId
    )
    const won = teamMatches.filter((m) => {
      if (m.score?.winner === "teamA" && m.teamA?.teamId === teamId)
        return true
      if (m.score?.winner === "teamB" && m.teamB?.teamId === teamId)
        return true
      return false
    }).length
    const lost = teamMatches.filter((m) => {
      if (m.score?.winner === "teamA" && m.teamB?.teamId === teamId)
        return true
      if (m.score?.winner === "teamB" && m.teamA?.teamId === teamId)
        return true
      return false
    }).length
    return { played: teamMatches.length, won, lost }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={msg.teams.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-input bg-card px-10 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
        />
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground px-1">
        {filtered.length} {filtered.length === 1 ? "tým" : filtered.length < 5 ? "týmy" : "týmů"}
      </p>

      {/* Team grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="col-span-full text-center text-sm text-muted-foreground py-8">
            Žádné týmy neodpovídají hledání.
          </p>
        ) : (
          filtered.map((team, index) => {
            const stats = getTeamStats(team.id)
            const fav = isFavorite(team.id)
            return (
              <Link
                key={team.id}
                href={`/matches?team=${encodeURIComponent(team.name)}`}
                className="block"
              >
                <Card
                  className={`hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer ${fav ? "ring-1 ring-red-200 border-red-200/60" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-primary/8 text-primary text-[11px] font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <CardTitle className="text-[15px] leading-snug truncate">{team.name}</CardTitle>
                      </div>
                      {team.players.length > 0 && (
                        <div className="ml-[34px] flex flex-col gap-0.5">
                          {team.players.map((player, i) => (
                            <p
                              key={i}
                              className="text-[13px] text-muted-foreground leading-snug"
                            >
                              {player.name}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <FavoriteButton teamId={team.id} />
                  </div>

                  {stats.played > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-xs">
                      <Badge variant="default">{stats.played} zápasů</Badge>
                      {stats.won > 0 && (
                        <Badge variant="success">{stats.won}V</Badge>
                      )}
                      {stats.lost > 0 && (
                        <Badge variant="warning">{stats.lost}P</Badge>
                      )}
                    </div>
                  )}

                  <span className="mt-3 block text-xs text-primary font-medium group-hover:underline">
                    Zobrazit zápasy &rarr;
                  </span>
                </Card>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
