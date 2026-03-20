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
  // Strip BOM (byte order mark) that some sources prepend
  const cleaned = csv.charCodeAt(0) === 0xfeff ? csv.slice(1) : csv

  // Normalize line endings: \r\n -> \n, lone \r -> \n
  const normalized = cleaned.replace(/\r\n/g, "\n").replace(/\r/g, "\n")

  const lines = normalized.split("\n")
  // Filter out completely empty rows, but keep rows that have commas (they may contain data)
  const nonEmptyLines = lines.filter((line) => line.trim() !== "")
  if (nonEmptyLines.length === 0) return { headers: [], rows: [] }

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

  const headers = parseLine(nonEmptyLines[0])
  const rows = nonEmptyLines
    .slice(1)
    .map(parseLine)
    // Skip rows where every cell is empty (common in Google Sheets exports)
    .filter((row) => row.some((cell) => cell !== ""))
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

    // If specific sheets are configured, fetch each; otherwise fetch the default sheet
    const sheetsToFetch = sheetConfig.sheets ?? [{ name: "default", gid: 0 }]

    for (const sheet of sheetsToFetch) {
      try {
        // Build URLs based on whether we have a sheetName or gid
        const sheetParam = sheet.sheetName
          ? `sheet=${encodeURIComponent(sheet.sheetName)}`
          : `gid=${sheet.gid ?? 0}`

        const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetConfig.spreadsheetId}/gviz/tq?tqx=out:csv&${sheetParam}`
        const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetConfig.spreadsheetId}/export?format=csv&${sheetParam}`

        let csv: string | null = null

        for (const url of [gvizUrl, exportUrl]) {
          try {
            const response = await fetch(url, {
              headers: { "User-Agent": "BeachLive/1.0" },
              redirect: "follow",
              signal: AbortSignal.timeout(15_000),
            })

            if (response.ok) {
              const text = await response.text()
              // Verify it's actually CSV, not HTML error page
              if (!text.trim().startsWith("<!DOCTYPE") && !text.trim().startsWith("<html")) {
                csv = text
                break
              }
            }
          } catch {
            // Try next URL
          }
        }

        if (!csv) {
          warnings.push({
            source: this.name,
            message: `Failed to fetch sheet "${sheet.name}" (${sheet.sheetName ? `sheetName=${sheet.sheetName}` : `gid=${sheet.gid}`}): all endpoints failed`,
            timestamp: new Date().toISOString(),
          })
          continue
        }

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
