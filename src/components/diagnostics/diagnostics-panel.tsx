"use client"

import { useState } from "react"
import { TournamentSnapshot, SourceReference } from "@/lib/tournament/schema"
import { RefreshMeta } from "@/lib/blob/storage"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DiagnosticsPanelProps {
  snapshot: TournamentSnapshot | null
  refreshMeta: RefreshMeta | null
  tournamentSlug: string
  secret: string
  sourceReferences: SourceReference[]
}

export function DiagnosticsPanel({
  snapshot,
  refreshMeta,
  tournamentSlug,
  secret,
  sourceReferences,
}: DiagnosticsPanelProps) {
  const [refreshing, setRefreshing] = useState(false)
  const [lastResult, setLastResult] = useState<string | null>(null)

  const handleRefresh = async () => {
    setRefreshing(true)
    setLastResult(null)
    try {
      const res = await fetch(`/api/refresh?slug=${tournamentSlug}&secret=${secret}`, {
        method: "POST",
      })
      const data = await res.json()
      setLastResult(data.success ? `Úspěch (${data.durationMs}ms)` : `Chyba: ${data.error}`)
    } catch (err) {
      setLastResult(`Chyba: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setRefreshing(false)
    }
  }

  const snapshotAge = snapshot
    ? Math.floor((Date.now() - new Date(snapshot.meta.generatedAt).getTime()) / 60000)
    : null

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Refresh Status */}
      <Card>
        <CardTitle className="text-base mb-3">Stav aktualizace</CardTitle>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Poslední úspěch:</span>
            <span>{refreshMeta?.lastSuccessAt ? new Date(refreshMeta.lastSuccessAt).toLocaleString("cs") : "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Poslední chyba:</span>
            <span className={refreshMeta?.lastErrorAt ? "text-destructive" : ""}>
              {refreshMeta?.lastErrorAt ? new Date(refreshMeta.lastErrorAt).toLocaleString("cs") : "—"}
            </span>
          </div>
          {refreshMeta?.lastErrorMessage && (
            <div className="text-xs text-destructive bg-destructive/10 rounded p-2 mt-1">
              {refreshMeta.lastErrorMessage}
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chyby v řadě:</span>
            <span>{refreshMeta?.consecutiveErrors ?? 0}</span>
          </div>
        </CardContent>
      </Card>

      {/* Snapshot Info */}
      <Card>
        <CardTitle className="text-base mb-3">Snapshot</CardTitle>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Stáří:</span>
            <span>
              {snapshotAge !== null ? (
                <>
                  {snapshotAge} min
                  {snapshotAge > 15 && <Badge variant="warning" className="ml-2">Zastaralé</Badge>}
                </>
              ) : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vygenerováno:</span>
            <span>{snapshot ? new Date(snapshot.meta.generatedAt).toLocaleString("cs") : "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Doba zpracování:</span>
            <span>{snapshot ? `${snapshot.meta.refreshDurationMs}ms` : "—"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card>
        <CardTitle className="text-base mb-3">Data</CardTitle>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Týmy:</span>
            <span>{snapshot?.teams.length ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Zápasy:</span>
            <span>{snapshot?.matches.length ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Skupiny:</span>
            <span>{snapshot?.groups.length ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pavouk kol:</span>
            <span>{snapshot?.bracket?.rounds.length ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Stav turnaje:</span>
            <Badge variant={snapshot?.status === "live" ? "live" : "default"}>{snapshot?.status ?? "—"}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Sources */}
      <Card>
        <CardTitle className="text-base mb-3">Zdroje</CardTitle>
        <CardContent className="space-y-2 text-sm">
          {sourceReferences.map((src, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-muted-foreground">{src.name}</span>
              <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline truncate max-w-[200px]">
                {src.type}
              </a>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Parser Warnings */}
      {snapshot && snapshot.meta.parserWarnings.length > 0 && (
        <Card className="md:col-span-2">
          <CardTitle className="text-base mb-3">
            Varování parseru ({snapshot.meta.parserWarnings.length})
          </CardTitle>
          <CardContent className="space-y-1">
            {snapshot.meta.parserWarnings.map((w, i) => (
              <div key={i} className="text-xs bg-warning/10 text-warning rounded p-2">
                <span className="font-medium">[{w.source}]</span> {w.message}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Manual Refresh */}
      <Card className="md:col-span-2">
        <CardTitle className="text-base mb-3">Ruční aktualizace</CardTitle>
        <CardContent>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {refreshing ? "Aktualizuji..." : "Spustit aktualizaci"}
          </button>
          {lastResult && (
            <p className="mt-2 text-sm">{lastResult}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
