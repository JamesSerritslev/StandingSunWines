import crypto from "crypto"

function readEnv(key: string): string | undefined {
  const raw = process.env[key]
  if (raw == null) return undefined
  let v = raw.trim()
  if (!v) return undefined
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim()
  }
  return v || undefined
}

export function getMailchimpConfig():
  | { apiKey: string; audienceId: string; server: string }
  | null {
  const apiKey = readEnv("MAILCHIMP_API_KEY")
  const audienceId = readEnv("MAILCHIMP_AUDIENCE_ID")
  const server = readEnv("MAILCHIMP_SERVER")
  if (!apiKey || !audienceId || !server) return null
  return { apiKey, audienceId, server }
}

export function subscriberHash(email: string): string {
  return crypto.createHash("md5").update(email.toLowerCase()).digest("hex")
}

export function slugTag(value: string, max = 96): string {
  const s = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return s.slice(0, max) || "unknown"
}

export async function mailchimpFetch(
  path: string,
  init: RequestInit,
): Promise<Response> {
  const cfg = getMailchimpConfig()
  if (!cfg) throw new Error("Mailchimp is not configured")
  const url = `https://${cfg.server}.api.mailchimp.com/3.0${path}`
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `apikey ${cfg.apiKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  })
}
