"use client"

import { useFavorites } from "@/lib/favorites/context"
import { Match, Team } from "@/lib/tournament/schema"
import { MatchCard } from "./match-card"
import { Section } from "@/components/ui/section"

interface FavoriteMatchesProps {
  matches: Match[]
  teams: Team[]
}

export function FavoriteMatches({ matches, teams }: FavoriteMatchesProps) {
  const { favorites } = useFavorites()

  if (favorites.size === 0) return null

  const favoriteMatches = matches.filter(m =>
    favorites.has(m.teamA?.teamId ?? "") || favorites.has(m.teamB?.teamId ?? "")
  )

  if (favoriteMatches.length === 0) return null

  // Split into upcoming and finished
  const upcoming = favoriteMatches.filter(m => m.status === "scheduled" || m.status === "live")
  const finished = favoriteMatches.filter(m => m.status === "finished").slice(-3).reverse()

  const display = [...upcoming.slice(0, 4), ...finished]
  if (display.length === 0) return null

  return (
    <Section title="Moje týmy" description="Zápasy oblíbených týmů">
      <div className="grid gap-3 md:grid-cols-2">
        {display.map(match => (
          <MatchCard key={match.id} match={match} favoriteTeamIds={favorites} teams={teams} />
        ))}
      </div>
    </Section>
  )
}
