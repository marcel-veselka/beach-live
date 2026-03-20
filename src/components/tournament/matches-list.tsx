"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Match, Team } from "@/lib/tournament/schema"
import { MatchCard } from "@/components/tournament/match-card"
import { Search, X, SearchX, ChevronRight } from "lucide-react"
import { t, pluralize } from "@/lib/i18n"
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
  const chipsRef = useRef<HTMLDivElement>(null)
  const [showScrollHint, setShowScrollHint] = useState(false)

  // Check if filter chips overflow
  useEffect(() => {
    const el = chipsRef.current
    if (!el) return
    const check = () => setShowScrollHint(el.scrollWidth > el.clientWidth + 4)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

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
  const groupedMatches = useMemo(() => {
    const groups: { date: string; dateLabel: string; matches: Match[] }[] = []
    let currentDate = ""

    // Determine today/tomorrow for labels
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const todayStr = `${today.getDate()}. ${today.getMonth() + 1}.`
    const tomorrowStr = `${tomorrow.getDate()}. ${tomorrow.getMonth() + 1}.`

    for (const match of filtered) {
      const dateMatch = match.scheduledTime?.match(/^(\d+\.\s*\d+\.)/)
      const date = dateMatch ? dateMatch[1] : (match.scheduledTime ?? "")
      if (date !== currentDate) {
        currentDate = date
        const normalized = date.replace(/\s+/g, " ").trim()
        let dateLabel = date
        if (normalized === todayStr) dateLabel = `${date} — Dnes`
        else if (normalized === tomorrowStr) dateLabel = `${date} — Zítra`

        groups.push({ date, dateLabel, matches: [match] })
      } else {
        groups[groups.length - 1].matches.push(match)
      }
    }
    return groups
  }, [filtered])

  // Compute counts from search-filtered set (before status filter)
  const searchFiltered = useMemo(() => {
    if (!search) return matches
    const q = normalizeSearch(search)
    return matches.filter(
      (m) =>
        normalizeSearch(m.teamA?.name ?? "").includes(q) ||
        normalizeSearch(m.teamB?.name ?? "").includes(q) ||
        teams.some(
          (team) =>
            (m.teamA?.teamId === team.id || m.teamB?.teamId === team.id) &&
            team.players.some((p) => normalizeSearch(p.name).includes(q))
        )
    )
  }, [matches, teams, search])

  const liveCount = searchFiltered.filter((m) => m.status === "live").length
  const scheduledCount = searchFiltered.filter((m) => m.status === "scheduled").length
  const finishedCount = searchFiltered.filter((m) => m.status === "finished").length

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
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Status filters with scroll indicator */}
      <div className="relative">
        <div ref={chipsRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <FilterChip
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            Vše ({searchFiltered.length})
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
        {/* Scroll affordance gradient + chevron */}
        {showScrollHint && (
          <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none flex items-center justify-end">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Scroll affordance hint when filtered */}
      {(search || statusFilter !== "all") && filtered.length > 0 && (
        <p className="text-xs text-muted-foreground/60 text-center">
          {filtered.length} z {matches.length} {pluralize(matches.length, "zápas", "zápasy", "zápasů")}
        </p>
      )}

      {/* Match list grouped by date */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          /* Better empty state with icon, message and reset action */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mb-4">
              <SearchX className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-semibold text-foreground/70">
              Žádné zápasy nenalezeny
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1.5 max-w-[220px]">
              {search
                ? `Pro "${search}" nebyly nalezeny žádné výsledky`
                : "Pro zvolený filtr nejsou žádné zápasy"}
            </p>
            {(search || statusFilter !== "all") && (
              <button
                onClick={() => { setSearch(""); setStatusFilter("all") }}
                className="mt-4 text-xs text-primary font-medium hover:underline"
              >
                Zobrazit všechny zápasy
              </button>
            )}
          </div>
        ) : (
          groupedMatches.map((group) => (
            <div key={group.date}>
              {/* Date section header with centered line design */}
              {group.date && (
                <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm py-2.5 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border/40" />
                    <p className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest px-2">
                      {group.dateLabel}
                    </p>
                    <div className="h-px flex-1 bg-border/40" />
                  </div>
                </div>
              )}
              <div className="space-y-2.5">
                {group.matches.map((match) => (
                  <MatchCard key={match.id} match={match} favoriteTeamIds={favorites} showMatchType />
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
