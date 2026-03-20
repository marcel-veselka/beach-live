import { TournamentSnapshot, TournamentSnapshotSchema } from "@/lib/tournament/schema"

const BLOB_BASE = "tournament-snapshots"

function getBlobKey(slug: string): string {
  return `${BLOB_BASE}/${slug}/latest.json`
}

function getMetaKey(slug: string): string {
  return `${BLOB_BASE}/${slug}/refresh-meta.json`
}

export interface RefreshMeta {
  lastSuccessAt: string | null
  lastErrorAt: string | null
  lastErrorMessage: string | null
  consecutiveErrors: number
}

export async function saveSnapshot(slug: string, snapshot: TournamentSnapshot): Promise<void> {
  // In production, use @vercel/blob. For now, use in-memory / filesystem fallback.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob")
    await put(getBlobKey(slug), JSON.stringify(snapshot), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    })
  } else {
    // Fallback: write to filesystem in dev
    const fs = await import("fs/promises")
    const path = await import("path")
    const dir = path.join(process.cwd(), ".data", slug)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, "latest.json"), JSON.stringify(snapshot, null, 2))
  }
}

export async function loadSnapshot(slug: string): Promise<TournamentSnapshot | null> {
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { head } = await import("@vercel/blob")
      try {
        const blob = await head(getBlobKey(slug))
        const response = await fetch(blob.url)
        const data = await response.json()
        return TournamentSnapshotSchema.parse(data)
      } catch {
        // Blob not found
        return null
      }
    } else {
      const fs = await import("fs/promises")
      const path = await import("path")
      const filePath = path.join(process.cwd(), ".data", slug, "latest.json")
      const content = await fs.readFile(filePath, "utf-8")
      return TournamentSnapshotSchema.parse(JSON.parse(content))
    }
  } catch {
    return null
  }
}

export async function saveRefreshMeta(slug: string, meta: RefreshMeta): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob")
    await put(getMetaKey(slug), JSON.stringify(meta), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    })
  } else {
    const fs = await import("fs/promises")
    const path = await import("path")
    const dir = path.join(process.cwd(), ".data", slug)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, "refresh-meta.json"), JSON.stringify(meta, null, 2))
  }
}

export async function loadRefreshMeta(slug: string): Promise<RefreshMeta | null> {
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { head } = await import("@vercel/blob")
      try {
        const blob = await head(getMetaKey(slug))
        const response = await fetch(blob.url)
        return await response.json()
      } catch {
        return null
      }
    } else {
      const fs = await import("fs/promises")
      const path = await import("path")
      const filePath = path.join(process.cwd(), ".data", slug, "refresh-meta.json")
      const content = await fs.readFile(filePath, "utf-8")
      return JSON.parse(content)
    }
  } catch {
    return null
  }
}
