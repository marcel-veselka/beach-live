/**
 * Refresh cooldown backed by Vercel Blob for cross-instance persistence.
 * Falls back to in-memory tracking in development.
 */

const BLOB_KEY_PREFIX = "tournament-snapshots"
const COOLDOWN_MS = 90_000 // 90 seconds

export interface CooldownState {
  lastRefreshAt: string | null
  watchChannelId: string | null
  watchResourceId: string | null
  watchExpiration: string | null
}

const emptyCooldownState: CooldownState = {
  lastRefreshAt: null,
  watchChannelId: null,
  watchResourceId: null,
  watchExpiration: null,
}

// In-memory fallback for dev (no BLOB_READ_WRITE_TOKEN)
let memoryState: CooldownState = { ...emptyCooldownState }

function getCooldownKey(slug: string): string {
  return `${BLOB_KEY_PREFIX}/${slug}/cooldown.json`
}

export async function loadCooldownState(slug: string): Promise<CooldownState> {
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { head } = await import("@vercel/blob")
      const blob = await head(getCooldownKey(slug))
      const response = await fetch(blob.url)
      return await response.json()
    }
    return { ...memoryState }
  } catch {
    return { ...emptyCooldownState }
  }
}

export async function saveCooldownState(
  slug: string,
  state: CooldownState,
): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob")
    await put(getCooldownKey(slug), JSON.stringify(state), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    })
  } else {
    memoryState = { ...state }
  }
}

/** Check if a refresh is allowed or should be skipped due to cooldown. */
export async function checkCooldown(
  slug: string,
): Promise<{ allowed: boolean; secondsRemaining?: number }> {
  const state = await loadCooldownState(slug)
  if (!state.lastRefreshAt) return { allowed: true }

  const elapsed = Date.now() - new Date(state.lastRefreshAt).getTime()
  if (elapsed >= COOLDOWN_MS) return { allowed: true }

  return {
    allowed: false,
    secondsRemaining: Math.ceil((COOLDOWN_MS - elapsed) / 1000),
  }
}

/** Record that a refresh just completed. */
export async function recordRefresh(slug: string): Promise<void> {
  const state = await loadCooldownState(slug)
  state.lastRefreshAt = new Date().toISOString()
  await saveCooldownState(slug, state)
}
