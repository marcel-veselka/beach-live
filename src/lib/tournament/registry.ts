import { TournamentConfig } from "./config"

const tournaments: TournamentConfig[] = []

export function registerTournament(config: TournamentConfig) {
  tournaments.push(config)
}

export function getTournament(slug: string): TournamentConfig | undefined {
  return tournaments.find((t) => t.slug === slug)
}

export function getActiveTournament(): TournamentConfig | undefined {
  return tournaments.find((t) => t.active) ?? tournaments[0]
}

export function getAllTournaments(): TournamentConfig[] {
  return [...tournaments]
}
