import { GoogleSheetPublicAdapter } from "@/lib/adapters/google-sheet"
import { DefaultTournamentParser } from "@/lib/parsers/default-parser"
import { TournamentConfig } from "@/lib/tournament/config"
import { TournamentSnapshot, TournamentSnapshotSchema } from "@/lib/tournament/schema"
import { saveSnapshot, saveRefreshMeta, loadRefreshMeta, RefreshMeta } from "@/lib/blob/storage"

export interface RefreshResult {
  success: boolean
  snapshot?: TournamentSnapshot
  error?: string
  durationMs: number
}

export async function refreshTournament(config: TournamentConfig): Promise<RefreshResult> {
  const startTime = Date.now()

  try {
    // 1. Fetch data from Google Sheet
    const adapter = new GoogleSheetPublicAdapter()
    const { data: sheetData, warnings: adapterWarnings } = await adapter.fetch(config)

    // 2. Parse into normalized snapshot
    const parser = new DefaultTournamentParser()
    const { snapshot, warnings: parserWarnings } = parser.parse(sheetData, config)

    // 3. Update meta
    const durationMs = Date.now() - startTime
    snapshot.meta.refreshDurationMs = durationMs
    snapshot.meta.parserWarnings = [...adapterWarnings, ...parserWarnings]

    // 4. Validate
    const validated = TournamentSnapshotSchema.parse(snapshot)

    // 5. Save to blob
    await saveSnapshot(config.slug, validated)

    // 6. Update refresh meta
    const meta: RefreshMeta = {
      lastSuccessAt: new Date().toISOString(),
      lastErrorAt: (await loadRefreshMeta(config.slug))?.lastErrorAt ?? null,
      lastErrorMessage: null,
      consecutiveErrors: 0,
    }
    await saveRefreshMeta(config.slug, meta)

    return { success: true, snapshot: validated, durationMs }
  } catch (error) {
    const durationMs = Date.now() - startTime
    const errorMessage = error instanceof Error ? `${error.message}\n${error.stack}` : String(error)

    // Try to update refresh meta with error, but don't let this fail the whole response
    try {
      const existingMeta = await loadRefreshMeta(config.slug)
      const meta: RefreshMeta = {
        lastSuccessAt: existingMeta?.lastSuccessAt ?? null,
        lastErrorAt: new Date().toISOString(),
        lastErrorMessage: errorMessage,
        consecutiveErrors: (existingMeta?.consecutiveErrors ?? 0) + 1,
      }
      await saveRefreshMeta(config.slug, meta)
    } catch {
      // Ignore meta save errors
    }

    return { success: false, error: errorMessage, durationMs }
  }
}
