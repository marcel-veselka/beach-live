import { SheetData } from "@/lib/adapters/google-sheet"

/** Get a column index by header name (case-insensitive) */
export function getColumnIndex(sheet: SheetData, name: string): number {
  return sheet.headers.findIndex(
    (h) => h.toLowerCase().trim() === name.toLowerCase().trim()
  )
}

/** Get cell value from a row by column header name */
export function getCellByHeader(sheet: SheetData, row: string[], header: string): string {
  const idx = getColumnIndex(sheet, header)
  return idx >= 0 ? (row[idx] ?? "").trim() : ""
}

/** Find rows where a column matches a value */
export function findRows(sheet: SheetData, header: string, value: string): string[][] {
  const idx = getColumnIndex(sheet, header)
  if (idx < 0) return []
  return sheet.rows.filter((row) => (row[idx] ?? "").trim() === value)
}

/** Generate a stable ID from parts. Normalizes Czech diacritics for consistent IDs. */
export function makeId(...parts: string[]): string {
  return parts
    .map((p) =>
      p
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    )
    .filter(Boolean)
    .join("-")
}
