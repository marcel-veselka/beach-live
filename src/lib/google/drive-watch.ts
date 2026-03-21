import { getAccessToken } from "./auth"

export interface WatchChannel {
  channelId: string
  resourceId: string
  resourceUri?: string
  expiration: string
}

/** Register a Drive file watch via files.watch API. */
export async function registerFileWatch(
  fileId: string,
  webhookUrl: string,
  token: string,
): Promise<WatchChannel> {
  const accessToken = await getAccessToken()
  const channelId = `beach-live-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  // Request ~23 hours from now (Drive max is 24h, leave margin)
  const expiration = Date.now() + 23 * 60 * 60 * 1000

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}/watch`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: channelId,
        type: "web_hook",
        address: webhookUrl,
        token,
        expiration: String(expiration),
      }),
    },
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Drive files.watch failed (${response.status}): ${text}`)
  }

  const data = await response.json()
  return {
    channelId: data.id,
    resourceId: data.resourceId,
    resourceUri: data.resourceUri,
    expiration: new Date(Number(data.expiration)).toISOString(),
  }
}

/** Stop a Drive watch channel. Best-effort, does not throw. */
export async function stopWatch(
  channelId: string,
  resourceId: string,
): Promise<boolean> {
  try {
    const accessToken = await getAccessToken()
    const response = await fetch(
      "https://www.googleapis.com/drive/v3/channels/stop",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: channelId, resourceId }),
      },
    )
    return response.ok
  } catch {
    return false
  }
}
