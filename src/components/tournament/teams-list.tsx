"use client"

import { useState, useMemo } from "react"
import { Team, Match } from "@/lib/tournament/schema"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Clock } from "lucide-react"
import { t, pluralize } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useFavorites } from "@/lib/favorites/context"
import { FavoriteButton } from "@/components/tournament/favorite-button"
import { normalizeSearch } from "@/lib/utils"

interface TeamsListProps {
  teams: Team[]
  matches: Match[]
}

/** Extract surnames from team players, e.g. "Lea Mífková / Ema Šebová" -> "Mífková / Šebová" */
function getSurnames(team: Team): string {
  if (team.players.length === 0) return team.name
  return team.players.map(p => {
    const parts = p.name.split(/\s+/)
    return parts[parts.length - 1]
  }).join(" / ")
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

  /** Get the next upcoming match for a team */
  const getNextMatch = (teamId: string): Match | undefined => {
    return matches.find(
      (m) =>
        m.status === "scheduled" &&
        (m.teamA?.teamId === teamId || m.teamB?.teamId === teamId)
    )
  }

  /** Check if team qualified (came through qualification rounds) */
  const isQualified = (teamId: string): boolean => {
    return matches.some(
      (m) =>
        m.status === "finished" &&
        (m.round?.toLowerCase().includes("kvalifikac") || m.phase === "group") &&
        ((m.score?.winner === "teamA" && m.teamA?.teamId === teamId) ||
         (m.score?.winner === "teamB" && m.teamB?.teamId === teamId))
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/60" />
        <input
          type="text"
          placeholder={msg.teams.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-input bg-card pl-11 pr-10 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-shadow"
        />
      </div>

      {/* #10: Better results count styling */}
      <p className="text-[11px] text-muted-foreground/50 px-1 font-medium tracking-wide">
        <span className="text-foreground/60 font-bold">{filtered.length}</span> {filtered.length === 1 ? "tým" : filtered.length < 5 ? "týmy" : "týmů"}
        {search && <span className="text-muted-foreground/40"> z {teams.length}</span>}
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
            const nextMatch = getNextMatch(team.id)
            const qualified = isQualified(team.id)
            const seed = team.seed ?? index + 1
            const isTopSeed = seed <= 4

            return (
              <Link
                key={team.id}
                href={`/matches?team=${encodeURIComponent(team.name)}`}
                className="block"
              >
                {/* #7: Better press state + #3: visual separation for favorites + #9: entrance animation */}
                <Card
                  className={`hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer press-scale animate-card-in ${
                    fav
                      ? "ring-2 ring-red-200/80 border-red-200/60 bg-red-50/20"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* #1: Seed circle with gradient for top seeds + #5: seed strength indicator */}
                    <span className={cn(
                      "shrink-0 w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center",
                      isTopSeed
                        ? "bg-gradient-to-br from-primary to-primary/70 text-white shadow-sm shadow-primary/20"
                        : "bg-primary/10 text-primary ring-1 ring-primary/15"
                    )}>
                      {seed}
                    </span>

                    <div className="flex-1 min-w-0">
                      {/* Surnames as main title */}
                      <CardTitle className="text-[15px] leading-snug">
                        {getSurnames(team)}
                      </CardTitle>

                      {/* #2: Full names with club as tag/chip style */}
                      <div className="mt-1.5 space-y-1">
                        {team.players.map((player, i) => (
                          <p key={i} className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                            <span>{player.name}</span>
                            {player.club && <span className="text-[10px] text-muted-foreground/50 bg-muted/60 rounded-full px-1.5 py-0.5">{player.club}</span>}
                          </p>
                        ))}
                      </div>
                    </div>

                    <FavoriteButton teamId={team.id} />
                  </div>

                  {/* #6: Badges row with more distinctive Kvalifikace badge */}
                  <div className="mt-3 pt-3 border-t border-border/40 flex items-center gap-1.5 text-xs flex-wrap">
                    {qualified && (
                      <Badge variant="default" className="text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary-foreground/80 border border-secondary/25">Kvalifikace</Badge>
                    )}
                    {stats.played > 0 && (
                      <Badge variant="default">{stats.played} {pluralize(stats.played, "zápas", "zápasy", "zápasů")}</Badge>
                    )}
                    {stats.won > 0 && (
                      <Badge variant="success">{stats.won}V</Badge>
                    )}
                    {stats.lost > 0 && (
                      <Badge variant="warning">{stats.lost}P</Badge>
                    )}
                  </div>

                  {/* #4: Next match preview - more visually distinct with left accent */}
                  {nextMatch && (
                    <div className="mt-2.5 flex items-center gap-2 text-[11px] text-muted-foreground/70 bg-primary/[0.03] border border-primary/10 rounded-lg px-3 py-2">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-primary/50" />
                      <span className="font-semibold text-foreground/70">
                        {nextMatch.scheduledTime}
                      </span>
                      <span className="truncate">
                        vs {nextMatch.teamA?.teamId === team.id ? nextMatch.teamB?.name : nextMatch.teamA?.name}
                      </span>
                    </div>
                  )}

                  {/* #8: "Zobrazit zápasy" as more button-like */}
                  <span className="mt-3 inline-flex items-center gap-1 text-xs text-primary font-semibold group-hover:underline bg-primary/5 rounded-full px-3 py-1.5 transition-colors group-hover:bg-primary/10">
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
