import { SourceReference } from "./schema"

export interface TournamentSourceConfig {
  googleSheet?: {
    spreadsheetId: string
    /** Tab names or gids to fetch */
    sheets?: { name: string; gid: number }[]
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
}
