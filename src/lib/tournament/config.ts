import { SourceReference } from "./schema"
import { TournamentParser } from "@/lib/parsers/types"

export interface TournamentSourceConfig {
  googleSheet?: {
    spreadsheetId: string
    /** Tab names or gids to fetch */
    sheets?: { name: string; gid?: number; sheetName?: string }[]
  }
  pdf?: {
    url: string
  }
  cvf?: {
    url: string
  }
}

export interface TournamentConfig {
  slug: string
  name: string
  subtitle?: string
  venue?: string
  dates?: string
  category?: string
  organizer?: string
  sources: TournamentSourceConfig
  sourceReferences: SourceReference[]
  /** If true, this is the active/default tournament shown at / */
  active?: boolean
  /** Custom parser for this tournament's data format */
  parser?: TournamentParser
}
