"use client"

import { useState, useMemo } from "react"
import { Team, Match } from "@/lib/tournament/schema"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Users } from "lucide-react"
import { t } from "@/lib/i18n"
import Link from "next/link"

interface TeamsListProps {
  teams: Team[]
  matches: Match[]
}

export function TeamsList({ teams, matches }: TeamsListProps) {
  const [search, setSearch] = useState("")
  const msg = t()

  const filtered = useMemo(() => {
    if (!search) return teams
    const q = search.toLowerCase()
    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(q) ||
        team.players.some((p) => p.name.toLowerCase().includes(q))
    )
  }, [teams, search])

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
          className="w-full rounded-lg border border-input bg-card px-10 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Team grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="col-span-full text-center text-sm text-muted-foreground py-8">
            Žádné týmy neodpovídají hledání.
          </p>
        ) : (
          filtered.map((team) => {
            const stats = getTeamStats(team.id)
            return (
              <Card
                key={team.id}
                className="hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{team.name}</CardTitle>
                    {team.players.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {team.players.map((player, i) => (
                          <p
                            key={i}
                            className="text-sm text-muted-foreground"
                          >
                            {player.name}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {stats.played > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <Badge variant="default">{stats.played} zápasů</Badge>
                    {stats.won > 0 && (
                      <Badge variant="success">{stats.won}V</Badge>
                    )}
                    {stats.lost > 0 && (
                      <Badge variant="warning">{stats.lost}P</Badge>
                    )}
                  </div>
                )}

                <Link
                  href={`/matches?team=${encodeURIComponent(team.name)}`}
                  className="mt-3 block text-xs text-primary hover:underline"
                >
                  Zobrazit zápasy →
                </Link>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
