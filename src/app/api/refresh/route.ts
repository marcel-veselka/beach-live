import { NextRequest, NextResponse } from "next/server"
import { refreshTournament } from "@/lib/refresh/pipeline"
import { getActiveTournament, getTournament } from "@/lib/tournament/registry"
import { acquireRefreshLock, releaseRefreshLock } from "@/lib/refresh/lock"
import "@/tournaments"

export async function POST(request: NextRequest) {
  // Check auth
  const secret = request.headers.get("x-refresh-secret") ?? request.nextUrl.searchParams.get("secret")
  if (secret !== process.env.REFRESH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const slug = request.nextUrl.searchParams.get("slug")
  const config = slug ? getTournament(slug) : getActiveTournament()

  if (!config) {
    return NextResponse.json({ error: "Tournament not found" }, { status: 404 })
  }

  if (!acquireRefreshLock(config.slug)) {
    return NextResponse.json(
      { error: "Refresh already in progress", slug: config.slug },
      { status: 429 }
    )
  }

  try {
    const result = await refreshTournament(config)
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } finally {
    releaseRefreshLock(config.slug)
  }
}
