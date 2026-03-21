import { NextRequest, NextResponse } from "next/server"
import { refreshTournament } from "@/lib/refresh/pipeline"
import { getActiveTournament } from "@/lib/tournament/registry"
import { acquireRefreshLock, releaseRefreshLock } from "@/lib/refresh/lock"
import { checkCooldown, recordRefresh } from "@/lib/refresh/cooldown"
import "@/tournaments"

/** Receive Google Drive push notifications. */
export async function POST(request: NextRequest) {
  const state = request.headers.get("x-goog-resource-state") ?? "unknown"
  const channelId = request.headers.get("x-goog-channel-id") ?? ""
  const resourceId = request.headers.get("x-goog-resource-id") ?? ""
  const messageNumber = request.headers.get("x-goog-message-number") ?? ""
  const token = request.headers.get("x-goog-channel-token") ?? ""

  console.log(
    `[drive-watch] state=${state} msg=${messageNumber} channel=${channelId} resource=${resourceId}`,
  )

  // Verify token
  const expectedToken = process.env.GOOGLE_WATCH_TOKEN
  if (!expectedToken || token !== expectedToken) {
    console.warn("[drive-watch] invalid or missing channel token, rejecting")
    return new NextResponse(null, { status: 403 })
  }

  // Ignore initial sync notification
  if (state === "sync") {
    console.log("[drive-watch] sync notification, ignoring")
    return new NextResponse(null, { status: 204 })
  }

  // For update/change notifications, trigger refresh
  const config = getActiveTournament()
  if (!config) {
    console.warn("[drive-watch] no active tournament configured")
    return new NextResponse(null, { status: 204 })
  }

  // Check cooldown
  const cooldown = await checkCooldown(config.slug)
  if (!cooldown.allowed) {
    console.log(
      `[drive-watch] refresh skipped, cooldown ${cooldown.secondsRemaining}s remaining`,
    )
    return new NextResponse(null, { status: 204 })
  }

  // Acquire lock
  if (!acquireRefreshLock(config.slug)) {
    console.log("[drive-watch] refresh already in progress, skipping")
    return new NextResponse(null, { status: 204 })
  }

  try {
    console.log(`[drive-watch] triggering refresh for ${config.slug}`)
    const result = await refreshTournament(config)
    await recordRefresh(config.slug)
    console.log(
      `[drive-watch] refresh ${result.success ? "succeeded" : "failed"} in ${result.durationMs}ms`,
    )
  } catch (error) {
    console.error("[drive-watch] refresh error:", error)
  } finally {
    releaseRefreshLock(config.slug)
  }

  return new NextResponse(null, { status: 204 })
}
