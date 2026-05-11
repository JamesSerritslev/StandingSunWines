import { NextResponse } from "next/server"
import { Resend } from "resend"

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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const o = body as Record<string, unknown>
  const page = typeof o.page === "string" ? o.page.trim() : "unknown"
  const fields =
    typeof o.fields === "object" && o.fields !== null && !Array.isArray(o.fields)
      ? (o.fields as Record<string, unknown>)
      : {}

  const rows = Object.entries(fields)
    .filter(([k]) => !["access_key", "botcheck", "from_name", "subject"].includes(k))
    .map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
    .join("\n")

  const replyEmail =
    (typeof fields.email === "string" && fields.email.trim()) ||
    (typeof fields.replyto === "string" && fields.replyto.trim()) ||
    undefined

  const apiKey = readEnv("RESEND_API_KEY")
  const from = readEnv("RESEND_FROM")
  const to = readEnv("HOST_INQUIRY_TO_EMAIL")

  if (!apiKey || !from || !to) {
    return NextResponse.json(
      { error: "Email delivery is not configured." },
      { status: 503 },
    )
  }

  const text = [
    `Standing Sun Wines — form submission (${page})`,
    "—".repeat(40),
    "",
    rows || "(no fields)",
    "",
  ].join("\n")

  const htmlTable = Object.entries(fields)
    .filter(([k]) => !["access_key", "botcheck"].includes(k))
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;">${escapeHtml(k)}</td><td style="padding:6px 12px;">${escapeHtml(String(v))}</td></tr>`,
    )
    .join("")

  const html = `<!DOCTYPE html><html><body style="font-family:Georgia,serif;background:#231f20;color:#f9f5e5;padding:24px;">
  <h1 style="font-size:18px;">Standing Sun Wines</h1>
  <p style="opacity:0.85;">Page: <strong>${escapeHtml(page)}</strong></p>
  <table style="width:100%;max-width:560px;border-collapse:collapse;background:#111;">${htmlTable}</table>
  </body></html>`

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to: [to],
    ...(replyEmail && replyEmail.includes("@") ? { replyTo: replyEmail } : {}),
    subject: `Standing Sun Wines inquiry (${page})`,
    text,
    html,
  })

  if (error) {
    return NextResponse.json(
      { error: "Could not send your message. Please try again later." },
      { status: 502 },
    )
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
