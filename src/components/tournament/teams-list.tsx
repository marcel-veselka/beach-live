"use client"

import { useState, useMemo } from "react"
import { Team, Match } from "@/lib/tournament/schema"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, X } from "lucide-react"
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

  // Split into main event and qualification-only teams
  const { hsTeams, qTeams } = useMemo(() => {
    const hs: Team[] = []
    const q: Team[] = []
    for (const team of filtered) {
      if (team.groupId?.startsWith("q-group")) {
        q.push(team)
      } else {
        hs.push(team)
      }
    }
    return { hsTeams: hs, qTeams: q }
  }, [filtered])

  const hasQTeams = qTeams.length > 0

  const getTeamStats = (teamId: string) => {
    const teamMatches = matches.filter(
      (m) => m.teamA?.teamId === teamId || m.teamB?.teamId === teamId
    )
    let won2 = 0, won3 = 0, lost2 = 0, lost3 = 0
    for (const m of teamMatches) {
      if (!m.score?.winner) continue
      const isWinner =
        (m.score.winner === "teamA" && m.teamA?.teamId === teamId) ||
        (m.score.winner === "teamB" && m.teamB?.teamId === teamId)
      const setsCount = m.score.sets?.length ?? 0
      if (isWinner) {
        if (setsCount === 3) won3++
        else won2++
      } else {
        if (setsCount === 3) lost3++
        else lost2++
      }
    }
    return { played: teamMatches.length, won2, won3, lost2, lost3 }
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

  const renderTeamCard = (team: Team, index: number, isQSection: boolean) => {
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
        <Card
          className={`hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer press-scale animate-card-in ${
            fav
              ? "ring-2 ring-red-200/80 border-red-200/60 bg-red-50/20"
              : ""
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Seed circle — secondary color for Q-only teams */}
            <span className={cn(
              "shrink-0 w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center",
              isQSection
                ? (isTopSeed
                    ? "bg-gradient-to-br from-secondary to-secondary/70 text-secondary-foreground shadow-sm shadow-secondary/20"
                    : "bg-secondary/10 text-secondary-foreground ring-1 ring-secondary/15")
                : (isTopSeed
                    ? "bg-gradient-to-br from-primary to-primary/70 text-white shadow-sm shadow-primary/20"
                    : "bg-primary/10 text-primary ring-1 ring-primary/15")
            )}>
              {seed}
            </span>

            <div className="flex-1 min-w-0">
              <CardTitle className="text-[15px] leading-snug">
                {getSurnames(team)}
              </CardTitle>

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

          {/* Badges row */}
          <div className="mt-3 pt-3 border-t border-border/40 flex items-center gap-1.5 text-xs flex-wrap">
            {qualified && (
              <Badge variant="default" className="text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary-foreground/80 border border-secondary/25">Kvalifikace</Badge>
            )}
            {stats.played > 0 && (
              <Badge variant="default">{stats.played} {pluralize(stats.played, "zápas", "zápasy", "zápasů")}</Badge>
            )}
            {stats.won2 > 0 && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold bg-success/12 text-success border border-success/20">{stats.won2}V</span>
            )}
            {stats.won3 > 0 && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold bg-success/6 text-success/80 border border-dashed border-success/20">{stats.won3}V<sup className="text-[8px] ml-px">3</sup></span>
            )}
            {stats.lost3 > 0 && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold bg-warning/6 text-warning/80 border border-dashed border-warning/20">{stats.lost3}P<sup className="text-[8px] ml-px">3</sup></span>
            )}
            {stats.lost2 > 0 && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold bg-warning/12 text-warning border border-warning/20">{stats.lost2}P</span>
            )}
          </div>

          {/* Next match preview */}
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

          <span className="mt-3 inline-flex items-center gap-1 text-xs text-primary font-semibold group-hover:underline bg-primary/5 rounded-full px-3 py-1.5 transition-colors group-hover:bg-primary/10">
            Zobrazit zápasy &rarr;
          </span>
        </Card>
      </Link>
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
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors press-scale"
          >
            <X className="h-3.5 w-3.5 text-primary/70" />
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-[11px] text-muted-foreground/50 px-1 font-medium tracking-wide">
        <span className="text-foreground/60 font-bold">{filtered.length}</span> {filtered.length === 1 ? "tým" : filtered.length < 5 ? "týmy" : "týmů"}
        {search && <span className="text-muted-foreground/40"> z {teams.length}</span>}
      </p>

      {/* Team grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">
          Žádné týmy neodpovídají hledání.
        </p>
      ) : hasQTeams ? (
        <div className="space-y-4">
          {/* Main event section */}
          {hsTeams.length > 0 && (
            <div>
              <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm py-2.5 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary/40 shrink-0 ring-2 ring-primary/10" />
                  <p className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-widest">
                    Hlavní soutěž
                  </p>
                  <div className="h-px flex-1 bg-border/30" />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {hsTeams.map((team, index) => renderTeamCard(team, index, false))}
              </div>
            </div>
          )}

          {/* Qualification section */}
          {qTeams.length > 0 && (
            <div>
              <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm py-2.5 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary/40 shrink-0 ring-2 ring-secondary/10" />
                  <p className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-widest">
                    Kvalifikace
                  </p>
                  <div className="h-px flex-1 bg-border/30" />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {qTeams.map((team, index) => renderTeamCard(team, index, true))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* No Q teams — single flat grid, no section headers */
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {hsTeams.map((team, index) => renderTeamCard(team, index, false))}
        </div>
      )}
    </div>
  )
}
