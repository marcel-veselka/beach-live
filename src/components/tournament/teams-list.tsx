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
    // Sort: favorites first, then by seed ascending (unseeded last)
    return [...result].sort((a, b) => {
      const aFav = isFavorite(a.id) ? 0 : 1
      const bFav = isFavorite(b.id) ? 0 : 1
      if (aFav !== bFav) return aFav - bFav
      const aSeed = a.seed ?? 999
      const bSeed = b.seed ?? 999
      return aSeed - bSeed
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

  /** Get the last finished match for a team */
  const getLastMatch = (teamId: string): Match | undefined => {
    const finished = matches.filter(
      (m) => m.status === "finished" &&
        (m.teamA?.teamId === teamId || m.teamB?.teamId === teamId)
    )
    return finished[finished.length - 1]
  }

  const getTeamPhase = (teamId: string): string | null => {
    const teamMatches = matches.filter(
      (m) => m.teamA?.teamId === teamId || m.teamB?.teamId === teamId
    )
    // Find if team has active (scheduled) matches
    const scheduled = teamMatches.find(m => m.status === "scheduled")
    if (scheduled?.round) return scheduled.round
    // If all finished, find the last round
    const lastFinished = teamMatches.filter(m => m.status === "finished")
    if (lastFinished.length > 0) {
      const last = lastFinished[lastFinished.length - 1]
      if (last.round) return last.round
    }
    return null
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
    const lastMatch = getLastMatch(team.id)
    const qualified = isQualified(team.id)
    const seed = team.seed

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
            {/* Seed circle — consistent style, secondary color for Q-only teams */}
            <span className={cn(
              "shrink-0 w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center",
              isQSection
                ? "bg-secondary/15 text-secondary-foreground/80 ring-1 ring-secondary/25"
                : "bg-primary/10 text-primary ring-1 ring-primary/20"
            )}>
              {seed}
            </span>

            <div className="flex-1 min-w-0">
              <CardTitle className="text-[15px] leading-snug">
                {getSurnames(team)}
              </CardTitle>
              {(() => {
                const phase = getTeamPhase(team.id)
                if (!phase) return null
                return <p className="text-[10px] text-muted-foreground/50 mt-0.5 truncate">{phase}</p>
              })()}

              <div className="mt-1.5 space-y-1">
                {team.players.map((player, i) => (
                  <p key={i} className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                    <span>{player.name}</span>
                    {player.club && <span className="text-[10px] text-muted-foreground/60 bg-muted/80 rounded-full px-1.5 py-0.5">{player.club}</span>}
                  </p>
                ))}
              </div>
            </div>

            <FavoriteButton teamId={team.id} />
          </div>

          {/* Badges row */}
          <div className="mt-2.5 pt-2.5 border-t border-border/40">
            {(stats.won2 + stats.won3 + stats.lost2 + stats.lost3) > 0 && (
              <div className="flex gap-0.5 mb-2 h-1.5 rounded-full overflow-hidden">
                {stats.won2 > 0 && <div className="bg-success/70 rounded-full" style={{ flex: stats.won2 }} />}
                {stats.won3 > 0 && <div className="bg-success/40 rounded-full" style={{ flex: stats.won3 }} />}
                {stats.lost3 > 0 && <div className="bg-warning/40 rounded-full" style={{ flex: stats.lost3 }} />}
                {stats.lost2 > 0 && <div className="bg-warning/70 rounded-full" style={{ flex: stats.lost2 }} />}
              </div>
            )}
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            {qualified && !isQSection && (
              <Badge variant="default" className="text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary-foreground/80 border border-secondary/25">Kvalifikace</Badge>
            )}
            {stats.played > 0 && (
              <Badge variant="default">{stats.played} {pluralize(stats.played, "zápas", "zápasy", "zápasů")}</Badge>
            )}
            {stats.won2 > 0 && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold bg-success/12 text-success border border-success/20">{stats.won2}V</span>
            )}
            {stats.won3 > 0 && (
              <span title="Výhra ve 3 setech" className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold bg-success/6 text-success/80 border border-dashed border-success/20">{stats.won3}V<sup className="text-[8px] ml-px">3</sup></span>
            )}
            {stats.lost3 > 0 && (
              <span title="Prohra ve 3 setech" className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold bg-warning/6 text-warning/80 border border-dashed border-warning/20">{stats.lost3}P<sup className="text-[8px] ml-px">3</sup></span>
            )}
            {stats.lost2 > 0 && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold bg-warning/12 text-warning border border-warning/20">{stats.lost2}P</span>
            )}
          </div>
          </div>

          {/* Last match result (shown when no next match) */}
          {lastMatch && !nextMatch && (() => {
            const isTeamA = lastMatch.teamA?.teamId === team.id
            const won = (lastMatch.score?.winner === "teamA" && isTeamA) || (lastMatch.score?.winner === "teamB" && !isTeamA)
            const opponent = isTeamA ? lastMatch.teamB?.name : lastMatch.teamA?.name
            const setsA = lastMatch.score?.sets.reduce((c, s) => c + (s.teamA > s.teamB ? 1 : 0), 0) ?? 0
            const setsB = lastMatch.score?.sets.reduce((c, s) => c + (s.teamB > s.teamA ? 1 : 0), 0) ?? 0
            const setScore = isTeamA ? `${setsA}:${setsB}` : `${setsB}:${setsA}`
            return (
              <div className={cn(
                "mt-2.5 flex items-center gap-2 text-[11px] rounded-lg px-3 py-2 border",
                won ? "text-success/80 bg-success/[0.03] border-success/15" : "text-warning/80 bg-warning/[0.03] border-warning/15"
              )}>
                <span className="font-bold font-score">{setScore}</span>
                <span className="truncate">vs {opponent}</span>
                <span className={cn("text-[10px] font-bold ml-auto shrink-0", won ? "text-success" : "text-warning")}>{won ? "V" : "P"}</span>
              </div>
            )
          })()}

          {/* Next match preview */}
          {nextMatch && (() => {
            const opponentName = nextMatch.teamA?.teamId === team.id ? nextMatch.teamB?.name : nextMatch.teamA?.name
            const opponentId = nextMatch.teamA?.teamId === team.id ? nextMatch.teamB?.teamId : nextMatch.teamA?.teamId
            const opponentTeam = teams.find(t => t.id === opponentId)
            const opponentSeed = opponentTeam?.seed
            return (
              <div className="mt-2.5 flex items-center gap-2 text-[11px] text-muted-foreground/70 bg-primary/[0.03] border border-primary/10 rounded-lg px-3 py-2">
                <Clock className="h-3.5 w-3.5 shrink-0 text-primary/50" />
                <span className="font-semibold text-foreground/70">
                  {nextMatch.scheduledTime}
                </span>
                <span className="truncate">
                  vs {opponentSeed && <span className="text-[10px] text-muted-foreground/40 font-score mr-0.5">({opponentSeed})</span>}{opponentName}
                </span>
              </div>
            )
          })()}

          <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary font-semibold group-hover:underline bg-primary/5 rounded-full px-3 py-1.5 transition-colors group-hover:bg-primary/10">
            {stats.played > 0 ? `${stats.played} ${pluralize(stats.played, "zápas", "zápasy", "zápasů")}` : "Zobrazit zápasy"} &rarr;
          </span>
        </Card>
      </Link>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="sticky top-14 z-20 bg-background/95 backdrop-blur-sm pb-2 -mx-4 px-4 pt-2 md:static md:bg-transparent md:backdrop-blur-none md:p-0 md:m-0">
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
      </div>

      {/* Results count */}
      <p className="text-[11px] text-muted-foreground/50 px-1 font-medium tracking-wide">
        <span className="text-foreground/60 font-bold">{filtered.length}</span> {filtered.length === 1 ? "tým" : filtered.length < 5 ? "týmy" : "týmů"}
        {search && <span className="text-muted-foreground/40"> z {teams.length}</span>}
      </p>

      {/* Team grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mb-4">
            <Search className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-semibold text-foreground/70">Žádné výsledky</p>
          <p className="text-xs text-muted-foreground/60 mt-1.5 max-w-[220px]">
            Pro &ldquo;{search}&rdquo; nebyly nalezeny žádné výsledky
          </p>
          <button onClick={() => setSearch("")} className="mt-4 text-xs text-primary font-medium hover:underline">
            Zobrazit vše
          </button>
        </div>
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
