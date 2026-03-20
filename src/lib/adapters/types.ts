import { TournamentConfig } from "@/lib/tournament/config"
import { ParserWarning } from "@/lib/tournament/schema"

export interface AdapterResult<T> {
  data: T
  warnings: ParserWarning[]
}

export interface SourceAdapter<T = unknown> {
  name: string
  fetch(config: TournamentConfig): Promise<AdapterResult<T>>
}
