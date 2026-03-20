import { TournamentSnapshot, ParserWarning } from "@/lib/tournament/schema"
import { GoogleSheetResult } from "@/lib/adapters/google-sheet"
import { TournamentConfig } from "@/lib/tournament/config"

export interface ParseResult {
  snapshot: TournamentSnapshot
  warnings: ParserWarning[]
}

export interface TournamentParser {
  parse(sheetData: GoogleSheetResult, config: TournamentConfig): ParseResult
}
