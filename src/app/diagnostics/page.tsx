import { Metadata } from "next"
import { loadSnapshot } from "@/lib/blob/storage"
import { loadRefreshMeta } from "@/lib/blob/storage"
import { getActiveTournament } from "@/lib/tournament/registry"
import "@/tournaments"
import { redirect } from "next/navigation"
import { DiagnosticsPanel } from "@/components/diagnostics/diagnostics-panel"

export const metadata: Metadata = { title: "Diagnostika" }
export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{ secret?: string }>
}

export default async function DiagnosticsPage({ searchParams }: PageProps) {
  const { secret } = await searchParams

  if (!process.env.REFRESH_SECRET || secret !== process.env.REFRESH_SECRET) {
    redirect("/")
  }

  const config = getActiveTournament()
  if (!config) {
    return <div className="p-4">No active tournament configured.</div>
  }

  const snapshot = await loadSnapshot(config.slug)
  const refreshMeta = await loadRefreshMeta(config.slug)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Diagnostika</h1>
      <DiagnosticsPanel
        snapshot={snapshot}
        refreshMeta={refreshMeta}
        tournamentSlug={config.slug}
        secret={secret!}
        sourceReferences={config.sourceReferences}
      />
    </div>
  )
}
