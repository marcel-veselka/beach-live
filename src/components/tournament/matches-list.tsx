"use client"

import { useState, useMemo } from "react"
import { Match, Team } from "@/lib/tournament/schema"
import { MatchCard } from "@/components/tournament/match-card"
import { Search } from "lucide-react"
import { t } from "@/lib/i18n"

interface MatchesListProps {
  matches: Match[]
  teams: Team[]
  initialSearch?: string
}

export function MatchesList({ matches, teams, initialSearch }: MatchesListProps) {
  const [search, setSearch] = useState(initialSearch ?? "")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const msg = t()

  const filtered = useMemo(() => {
    let result = matches

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (m) =>
          m.teamA?.name.toLowerCase().includes(q) ||
          m.teamB?.name.toLowerCase().includes(q) ||
          // Search by player name too
          teams.some(
            (team) =>
              (m.teamA?.teamId === team.id || m.teamB?.teamId === team.id) &&
              team.players.some((p) => p.name.toLowerCase().includes(q))
          )
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((m) => m.status === statusFilter)
    }

    return result
  }, [matches, teams, search, statusFilter])

  const liveCount = matches.filter((m) => m.status === "live").length
  const scheduledCount = matches.filter((m) => m.status === "scheduled").length
  const finishedCount = matches.filter((m) => m.status === "finished").length

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

      {/* Status filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
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

      {/* Match list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Žádné zápasy neodpovídají filtru.
          </p>
        ) : (
          filtered.map((match) => <MatchCard key={match.id} match={match} />)
        )}
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {children}
    </button>
  )
}
