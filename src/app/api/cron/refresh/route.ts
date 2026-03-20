import { NextRequest, NextResponse } from "next/server"
import { refreshTournament } from "@/lib/refresh/pipeline"
import { getActiveTournament } from "@/lib/tournament/registry"
import "@/tournaments"

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const config = getActiveTournament()
  if (!config) {
    return NextResponse.json({ error: "No active tournament" }, { status: 404 })
  }

  const result = await refreshTournament(config)
  return NextResponse.json(result)
}
