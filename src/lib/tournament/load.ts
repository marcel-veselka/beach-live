import { TournamentSnapshot } from "./schema"
import { loadSnapshot } from "@/lib/blob/storage"
import { getActiveTournament, getTournament } from "./registry"
import "@/tournaments"

export async function loadTournamentData(slug?: string): Promise<{
  snapshot: TournamentSnapshot | null
  config: ReturnType<typeof getActiveTournament>
}> {
  const config = slug ? getTournament(slug) : getActiveTournament()
  if (!config) return { snapshot: null, config: undefined }

  const snapshot = await loadSnapshot(config.slug)
  return { snapshot, config }
}
