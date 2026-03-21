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
  const [phaseFilter, setPhaseFilter] = useState<string>("all")
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

    if (phaseFilter !== "all") {
      result = result.filter((m) => m.phase === phaseFilter)
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
  }, [matches, teams, search, statusFilter, phaseFilter, favorites])

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

  const hasQualification = matches.some(m => m.phase === "group")
  const hasPlayoff = matches.some(m => m.phase === "playoff")
  const hasPlacement = matches.some(m => m.phase === "placement")
  const hasPhaseFilters = hasQualification || hasPlayoff || hasPlacement

  const liveCount = searchFiltered.filter((m) => m.status === "live").length
  const scheduledCount = searchFiltered.filter((m) => m.status === "scheduled").length
  const finishedCount = searchFiltered.filter((m) => m.status === "finished").length

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
        {/* #6: More visible clear button */}
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

      {/* #1: Status filters with animated transitions */}
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
            variant="scheduled"
          >
            {msg.match.scheduled} ({scheduledCount})
          </FilterChip>
          <FilterChip
            active={statusFilter === "finished"}
            onClick={() => setStatusFilter("finished")}
            variant="finished"
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

      {/* Phase filters */}
      {hasPhaseFilters && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <FilterChip active={phaseFilter === "all"} onClick={() => setPhaseFilter("all")}>
            Vše
          </FilterChip>
          {hasQualification && (
            <FilterChip active={phaseFilter === "group"} onClick={() => setPhaseFilter("group")}>
              Kvalifikace
            </FilterChip>
          )}
          {hasPlayoff && (
            <FilterChip active={phaseFilter === "playoff"} onClick={() => setPhaseFilter("playoff")}>
              Playoff
            </FilterChip>
          )}
          {hasPlacement && (
            <FilterChip active={phaseFilter === "placement"} onClick={() => setPhaseFilter("placement")}>
              O umístění
            </FilterChip>
          )}
        </div>
      )}

      {/* #8: Better counter styling */}
      {(search || statusFilter !== "all" || phaseFilter !== "all") && filtered.length > 0 && (
        <p className="text-[11px] text-muted-foreground/50 text-center font-medium tracking-wide">
          <span className="text-foreground/60 font-bold">{filtered.length}</span> z {matches.length} {pluralize(matches.length, "zápas", "zápasy", "zápasů")}
        </p>
      )}

      {/* Match list grouped by date */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          /* Better empty state with icon, message and reset action */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mb-4 animate-fade-in-up">
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
            {(search || statusFilter !== "all" || phaseFilter !== "all") && (
              <button
                onClick={() => { setSearch(""); setStatusFilter("all"); setPhaseFilter("all") }}
                className="mt-4 text-xs text-primary font-medium hover:underline"
              >
                Zobrazit všechny zápasy
              </button>
            )}
          </div>
        ) : (
          groupedMatches.map((group) => (
            <div key={group.date}>
              {/* #4: Date headers as timeline markers */}
              {group.date && (
                <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm py-2.5 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary/40 shrink-0 ring-2 ring-primary/10" />
                    <p className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-widest">
                      {group.dateLabel}
                      <span className="text-[10px] text-muted-foreground/40 font-medium ml-1">({group.matches.length})</span>
                    </p>
                    <div className="h-px flex-1 bg-border/30" />
                  </div>
                </div>
              )}
              {/* #3: Card entrance animation + #7: subtle spacing between cards */}
              <div className="space-y-2.5">
                {group.matches.map((match, idx) => (
                  <div key={match.id} className="animate-card-in" style={{ animationDelay: `${idx * 40}ms` }}>
                    <MatchCard match={match} favoriteTeamIds={favorites} showMatchType teams={teams} />
                  </div>
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
  variant?: "live" | "scheduled" | "finished"
}) {
  const activeStyles = {
    live: "bg-live text-white shadow-md shadow-live/25",
    scheduled: "bg-secondary/90 text-secondary-foreground shadow-md shadow-secondary/20",
    finished: "bg-muted-foreground/80 text-white shadow-md shadow-muted-foreground/15",
    default: "bg-primary text-primary-foreground shadow-md shadow-primary/20",
  }

  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold filter-chip-transition press-scale ${
        active
          ? `${activeStyles[variant ?? "default"]} scale-[1.02]`
          : "bg-muted text-muted-foreground hover:bg-accent border border-transparent hover:border-border/50"
      }`}
    >
      {children}
    </button>
  )
}
