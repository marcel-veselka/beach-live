import { SourceAdapter, AdapterResult } from "./types"
import { TournamentConfig } from "@/lib/tournament/config"
import { ParserWarning } from "@/lib/tournament/schema"

export interface SheetData {
  headers: string[]
  rows: string[][]
}

export interface GoogleSheetResult {
  sheets: Record<string, SheetData>
}

function parseCSV(csv: string): SheetData {
  const lines = csv.split("\n").filter((line) => line.trim() !== "")
  if (lines.length === 0) return { headers: [], rows: [] }

  const parseLine = (line: string): string[] => {
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const headers = parseLine(lines[0])
  const rows = lines.slice(1).map(parseLine)
  return { headers, rows }
}

export class GoogleSheetPublicAdapter implements SourceAdapter<GoogleSheetResult> {
  name = "google-sheet-public"

  async fetch(config: TournamentConfig): Promise<AdapterResult<GoogleSheetResult>> {
    const sheetConfig = config.sources.googleSheet
    if (!sheetConfig) {
      throw new Error("No Google Sheet config provided")
    }

    const warnings: ParserWarning[] = []
    const sheets: Record<string, SheetData> = {}

    // If specific sheets are configured, fetch each
    const sheetsToFetch = sheetConfig.sheets ?? [{ name: "default", gid: 0 }]

    for (const sheet of sheetsToFetch) {
      try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetConfig.spreadsheetId}/export?format=csv&gid=${sheet.gid}`
        const response = await fetch(url, {
          headers: { "User-Agent": "BeachLive/1.0" },
          next: { revalidate: 0 },
        })

        if (!response.ok) {
          warnings.push({
            source: this.name,
            message: `Failed to fetch sheet "${sheet.name}" (gid=${sheet.gid}): ${response.status}`,
            timestamp: new Date().toISOString(),
          })
          continue
        }

        const csv = await response.text()
        sheets[sheet.name] = parseCSV(csv)
      } catch (error) {
        warnings.push({
          source: this.name,
          message: `Error fetching sheet "${sheet.name}": ${error instanceof Error ? error.message : String(error)}`,
          timestamp: new Date().toISOString(),
        })
      }
    }

    return { data: { sheets }, warnings }
  }
}
