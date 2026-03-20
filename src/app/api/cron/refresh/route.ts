import { NextRequest, NextResponse } from "next/server"
import { refreshTournament } from "@/lib/refresh/pipeline"
import { getActiveTournament } from "@/lib/tournament/registry"
import { acquireRefreshLock, releaseRefreshLock } from "@/lib/refresh/lock"
import "@/tournaments"

export async function GET(request: NextRequest) {
  // Verify secret via Bearer header or query param
  const authHeader = request.headers.get("authorization")
  const querySecret = request.nextUrl.searchParams.get("secret")
  const isAuthorized =
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    querySecret === process.env.REFRESH_SECRET
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const config = getActiveTournament()
  if (!config) {
    return NextResponse.json({ error: "No active tournament" }, { status: 404 })
  }

  if (!acquireRefreshLock(config.slug)) {
    return NextResponse.json(
      { error: "Refresh already in progress", slug: config.slug },
      { status: 429 }
    )
  }

  try {
    const result = await refreshTournament(config)
    return NextResponse.json(result)
  } finally {
    releaseRefreshLock(config.slug)
  }
}
