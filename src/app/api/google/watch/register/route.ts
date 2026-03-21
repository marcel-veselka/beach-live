import { NextRequest, NextResponse } from "next/server"
import { registerFileWatch, stopWatch } from "@/lib/google/drive-watch"
import { loadCooldownState, saveCooldownState } from "@/lib/refresh/cooldown"
import { getActiveTournament } from "@/lib/tournament/registry"
import "@/tournaments"

/** Register a Google Drive watch for the tournament's Google Sheet. */
export async function POST(request: NextRequest) {
  // Auth: use REFRESH_SECRET
  const secret =
    request.headers.get("x-refresh-secret") ??
    request.nextUrl.searchParams.get("secret")
  if (secret !== process.env.REFRESH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Validate required env vars
  const fileId = process.env.GOOGLE_SHEET_FILE_ID
  const watchToken = process.env.GOOGLE_WATCH_TOKEN
  const appUrl = process.env.APP_URL

  const missing = [
    !fileId && "GOOGLE_SHEET_FILE_ID",
    !watchToken && "GOOGLE_WATCH_TOKEN",
    !appUrl && "APP_URL",
    !process.env.GOOGLE_SERVICE_ACCOUNT_JSON && "GOOGLE_SERVICE_ACCOUNT_JSON",
  ].filter(Boolean)

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing env vars: ${missing.join(", ")}` },
      { status: 500 },
    )
  }

  const config = getActiveTournament()
  if (!config) {
    return NextResponse.json(
      { error: "No active tournament configured" },
      { status: 404 },
    )
  }

  // Try to stop any existing watch (best-effort)
  const existingState = await loadCooldownState(config.slug)
  if (existingState.watchChannelId && existingState.watchResourceId) {
    console.log(
      `[watch-register] stopping existing channel ${existingState.watchChannelId}`,
    )
    await stopWatch(existingState.watchChannelId, existingState.watchResourceId)
  }

  const webhookUrl = `${appUrl}/api/google/watch`
  console.log(
    `[watch-register] registering watch for file=${fileId} webhook=${webhookUrl}`,
  )

  try {
    const channel = await registerFileWatch(fileId!, webhookUrl, watchToken!)

    // Persist watch metadata
    const state = await loadCooldownState(config.slug)
    state.watchChannelId = channel.channelId
    state.watchResourceId = channel.resourceId
    state.watchExpiration = channel.expiration
    await saveCooldownState(config.slug, state)

    console.log(
      `[watch-register] success: channel=${channel.channelId} expires=${channel.expiration}`,
    )

    return NextResponse.json({
      ok: true,
      channelId: channel.channelId,
      resourceId: channel.resourceId,
      resourceUri: channel.resourceUri,
      expiration: channel.expiration,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error)
    console.error(`[watch-register] failed: ${message}`)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
