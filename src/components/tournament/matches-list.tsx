"use client"

import { useState, useMemo } from "react"
import { Match, Team } from "@/lib/tournament/schema"
import { MatchCard } from "@/components/tournament/match-card"
import { Search, X, SearchX } from "lucide-react"
import { t } from "@/lib/i18n"
import { useFavorites } from "@/lib/favorites/context"
import { normalizeSearch } from "@/lib/utils"

interface MatchesListProps {
  matches: Match[]
  teams: Team[]
  initialSearch?: string
}

export function MatchesList({ matches, teams, initialSearch }: MatchesListProps) {
  const [search, setSearch] = useState(initialSearch ?? "")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const msg = t()
  const { favorites } = useFavorites()

  const filtered = useMemo(() => {
    let result = matches

    if (search) {
      const q = normalizeSearch(search)
      result = result.filter(
        (m) =>
          normalizeSearch(m.teamA?.name ?? "").includes(q) ||
          normalizeSearch(m.teamB?.name ?? "").includes(q) ||
          teams.some(
            (team) =>
              (m.teamA?.teamId === team.id || m.teamB?.teamId === team.id) &&
              team.players.some((p) => normalizeSearch(p.name).includes(q))
          )
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((m) => m.status === statusFilter)
    }

    // Sort favorite team matches to the top
    if (favorites.size > 0) {
      result = [...result].sort((a, b) => {
        const aFav = favorites.has(a.teamA?.teamId ?? "") || favorites.has(a.teamB?.teamId ?? "") ? 0 : 1
        const bFav = favorites.has(b.teamA?.teamId ?? "") || favorites.has(b.teamB?.teamId ?? "") ? 0 : 1
        return aFav - bFav
      })
    }

    return result
  }, [matches, teams, search, statusFilter, favorites])

  // Group filtered matches by date for section headers
  // scheduledTime format: "21. 3. 9:00" or "20. 3. 17:56" — extract "21. 3." as date
  const groupedMatches = useMemo(() => {
    const groups: { date: string; matches: Match[] }[] = []
    let currentDate = ""
    for (const match of filtered) {
      // Extract date part: match "DD. M." pattern (everything before the time)
      const dateMatch = match.scheduledTime?.match(/^(\d+\.\s*\d+\.)/)
      const date = dateMatch ? dateMatch[1] : (match.scheduledTime ?? "")
      if (date !== currentDate) {
        currentDate = date
        groups.push({ date, matches: [match] })
      } else {
        groups[groups.length - 1].matches.push(match)
      }
    }
    return groups
  }, [filtered])

  const liveCount = matches.filter((m) => m.status === "live").length
  const scheduledCount = matches.filter((m) => m.status === "scheduled").length
  const finishedCount = matches.filter((m) => m.status === "finished").length

  return (
    <div className="space-y-4">
      {/* Search - improvement 2: larger icon, rounded-full, clear button */}
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
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Status filters - improvement 1: larger pills, prominent active state with shadow */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <FilterChip
          active={statusFilter === "all"}
          onClick={() => setStatusFilter("all")}
        >
          Vše ({matches.length})
        </FilterChip>
        {liveCount > 0 && (
          <FilterChip
            active={statusFilter === "live"}
            onClick={() => setStatusFilter("live")}
            variant="live"
          >
            {msg.match.live} ({liveCount})
          </FilterChip>
        )}
        <FilterChip
          active={statusFilter === "scheduled"}
          onClick={() => setStatusFilter("scheduled")}
        >
          {msg.match.scheduled} ({scheduledCount})
        </FilterChip>
        <FilterChip
          active={statusFilter === "finished"}
          onClick={() => setStatusFilter("finished")}
        >
          {msg.match.finished} ({finishedCount})
        </FilterChip>
      </div>

      {/* Scroll affordance hint when filtered */}
      {(search || statusFilter !== "all") && filtered.length > 0 && (
        <p className="text-xs text-muted-foreground/60 text-center">
          {filtered.length} z {matches.length} zápasů
        </p>
      )}

      {/* Match list - improvement 3: grouped by date with section headers */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          /* Improvement 9: empty search state with icon */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <SearchX className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              Žádné zápasy neodpovídají filtru
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Zkuste upravit hledání nebo filtr
            </p>
          </div>
        ) : (
          groupedMatches.map((group) => (
            <div key={group.date}>
              {/* Improvement 3: date section header */}
              {group.date && (
                <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm py-2 mb-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {group.date}
                  </p>
                </div>
              )}
              <div className="space-y-2.5">
                {group.matches.map((match) => (
                  <MatchCard key={match.id} match={match} favoriteTeamIds={favorites} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
  variant,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  variant?: "live"
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all ${
        active
          ? variant === "live"
            ? "bg-live text-white shadow-md shadow-live/25"
            : "bg-primary text-primary-foreground shadow-md shadow-primary/20"
          : "bg-muted text-muted-foreground hover:bg-accent border border-transparent hover:border-border/50"
      }`}
    >
      {children}
    </button>
  )
}
