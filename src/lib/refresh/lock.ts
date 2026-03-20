/**
 * Simple in-process refresh lock to prevent overlapping refreshes.
 * This works within a single serverless instance. For multi-instance
 * deployments, the worst case is two concurrent refreshes — acceptable
 * since the pipeline is idempotent.
 */

const locks = new Map<string, number>()

/** Lock timeout: if a refresh hangs, auto-release after 60 seconds. */
const LOCK_TIMEOUT_MS = 60_000

export function acquireRefreshLock(slug: string): boolean {
  const now = Date.now()
  const existing = locks.get(slug)

  // If locked and not expired, reject
  if (existing && now - existing < LOCK_TIMEOUT_MS) {
    return false
  }

  locks.set(slug, now)
  return true
}

export function releaseRefreshLock(slug: string): void {
  locks.delete(slug)
}
