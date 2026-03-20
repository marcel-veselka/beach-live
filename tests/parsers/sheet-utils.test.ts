import { describe, it, expect } from "vitest"
import { getColumnIndex, getCellByHeader, findRows, makeId } from "@/lib/parsers/sheet-utils"
import { SheetData } from "@/lib/adapters/google-sheet"

describe("sheet-utils", () => {
  const sheet: SheetData = {
    headers: ["Tým", "Hráč 1", "Hráč 2", "Skupina"],
    rows: [
      ["Team A", "Alice", "Bob", "A"],
      ["Team B", "Charlie", "Diana", "A"],
      ["Team C", "Eve", "Frank", "B"],
    ],
  }

  describe("getColumnIndex", () => {
    it("finds column by exact name", () => {
      expect(getColumnIndex(sheet, "Tým")).toBe(0)
    })

    it("is case-insensitive", () => {
      expect(getColumnIndex(sheet, "tým")).toBe(0)
      expect(getColumnIndex(sheet, "SKUPINA")).toBe(3)
    })

    it("returns -1 for missing columns", () => {
      expect(getColumnIndex(sheet, "nonexistent")).toBe(-1)
    })
  })

  describe("getCellByHeader", () => {
    it("gets cell value by header name", () => {
      expect(getCellByHeader(sheet, sheet.rows[0], "Tým")).toBe("Team A")
      expect(getCellByHeader(sheet, sheet.rows[1], "Hráč 1")).toBe("Charlie")
    })

    it("returns empty string for missing header", () => {
      expect(getCellByHeader(sheet, sheet.rows[0], "nonexistent")).toBe("")
    })
  })

  describe("findRows", () => {
    it("finds rows matching a column value", () => {
      const result = findRows(sheet, "Skupina", "A")
      expect(result).toHaveLength(2)
      expect(result[0][0]).toBe("Team A")
      expect(result[1][0]).toBe("Team B")
    })

    it("returns empty for no matches", () => {
      expect(findRows(sheet, "Skupina", "C")).toHaveLength(0)
    })
  })

  describe("makeId", () => {
    it("creates a kebab-case ID", () => {
      expect(makeId("Team A")).toBe("team-a")
      expect(makeId("match", "1")).toBe("match-1")
    })

    it("normalizes diacritics and removes special characters", () => {
      expect(makeId("Štefan & Eva")).toBe("stefan-eva")
      expect(makeId("Příbram")).toBe("pribram")
      expect(makeId("Žďár")).toBe("zdar")
    })

    it("handles multiple parts", () => {
      expect(makeId("group", "A")).toBe("group-a")
    })
  })
})
