import { describe, it, expect } from "vitest"
import { DefaultTournamentParser } from "@/lib/parsers/default-parser"
import { GoogleSheetResult } from "@/lib/adapters/google-sheet"
import { TournamentConfig } from "@/lib/tournament/config"

const mockConfig: TournamentConfig = {
  slug: "test-tournament",
  name: "Test Tournament",
  sources: {
    googleSheet: { spreadsheetId: "test" },
  },
  sourceReferences: [
    { name: "Test", url: "https://example.com", type: "google-sheet" },
  ],
}

describe("DefaultTournamentParser", () => {
  const parser = new DefaultTournamentParser()

  it("returns empty snapshot for empty data", () => {
    const sheetData: GoogleSheetResult = { sheets: {} }
    const result = parser.parse(sheetData, mockConfig)

    expect(result.snapshot.teams).toHaveLength(0)
    expect(result.snapshot.matches).toHaveLength(0)
    expect(result.snapshot.status).toBe("upcoming")
    expect(result.warnings.length).toBeGreaterThan(0)
  })

  it("parses teams from sheet with team headers", () => {
    const sheetData: GoogleSheetResult = {
      sheets: {
        default: {
          headers: ["Tým", "Hráč 1", "Hráč 2"],
          rows: [
            ["Novák/Svoboda", "Jan Novák", "Petr Svoboda"],
            ["Dvořák/Černý", "Karel Dvořák", "Tomáš Černý"],
          ],
        },
      },
    }

    const result = parser.parse(sheetData, mockConfig)
    expect(result.snapshot.teams).toHaveLength(2)
    expect(result.snapshot.teams[0].name).toBe("Novák/Svoboda")
    expect(result.snapshot.teams[0].players).toHaveLength(2)
    expect(result.snapshot.teams[0].players[0].name).toBe("Jan Novák")
  })

  it("parses matches with scores", () => {
    const sheetData: GoogleSheetResult = {
      sheets: {
        default: {
          headers: ["Tým A", "Tým B", "Výsledek"],
          rows: [
            ["Team 1", "Team 2", "21:15 21:18"],
            ["Team 3", "Team 4", ""],
          ],
        },
      },
    }

    const result = parser.parse(sheetData, mockConfig)
    expect(result.snapshot.matches).toHaveLength(2)

    const finished = result.snapshot.matches[0]
    expect(finished.status).toBe("finished")
    expect(finished.score?.sets).toHaveLength(2)
    expect(finished.score?.sets[0].teamA).toBe(21)

    const scheduled = result.snapshot.matches[1]
    expect(scheduled.status).toBe("scheduled")
  })

  it("determines tournament status correctly", () => {
    const allFinished: GoogleSheetResult = {
      sheets: {
        default: {
          headers: ["Tým A", "Tým B", "Výsledek"],
          rows: [["A", "B", "21:10 21:10"]],
        },
      },
    }

    const result = parser.parse(allFinished, mockConfig)
    expect(result.snapshot.status).toBe("finished")
  })

  it("validates snapshot against Zod schema", () => {
    const sheetData: GoogleSheetResult = { sheets: {} }
    const result = parser.parse(sheetData, mockConfig)

    // If parse doesn't throw, the snapshot is valid
    expect(result.snapshot.meta.tournamentSlug).toBe("test-tournament")
    expect(result.snapshot.metadata.name).toBe("Test Tournament")
  })
})
