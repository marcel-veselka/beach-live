import crypto from "crypto"

interface ServiceAccountKey {
  client_email: string
  private_key: string
  token_uri?: string
}

interface AccessToken {
  token: string
  expiresAt: number
}

let cachedToken: AccessToken | null = null

function parseServiceAccountKey(): ServiceAccountKey {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!json) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON env var is not set")
  }
  try {
    return JSON.parse(json)
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON")
  }
}

function createJwt(sa: ServiceAccountKey): string {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: "RS256", typ: "JWT" }
  const payload = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/drive.readonly",
    aud: sa.token_uri ?? "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }

  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url")

  const unsigned = `${encode(header)}.${encode(payload)}`
  const sign = crypto.createSign("RSA-SHA256")
  sign.update(unsigned)
  const signature = sign.sign(sa.private_key, "base64url")

  return `${unsigned}.${signature}`
}

/** Get a valid Google access token, caching until near expiry. */
export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token
  }

  const sa = parseServiceAccountKey()
  const jwt = createJwt(sa)
  const tokenUri = sa.token_uri ?? "https://oauth2.googleapis.com/token"

  const response = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Google token exchange failed (${response.status}): ${text}`)
  }

  const data = await response.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  }

  return cachedToken.token
}
