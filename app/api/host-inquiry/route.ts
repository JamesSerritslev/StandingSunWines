/**
 * Host event inquiry → email via Resend.
 *
 * Add to `.env.local` (and hosting):
 *   RESEND_API_KEY=re_...
 *   RESEND_FROM="The Analogue Room <onboarding@resend.dev>"   // or verified domain sender
 *   HOST_INQUIRY_TO_EMAIL=jamesserritslev@gmail.com
 */

import { NextResponse } from "next/server"
import { Resend } from "resend"

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : ""
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** Brand palette — matches site globals (email-safe hex only). */
const BRAND = {
  coal: "#282b2e",
  cream: "#f8e9d0",
  parched: "#f9f5e5",
  orange: "#f58220",
  orangeDk: "#a05c26",
  earth: "#302725",
  border: "rgba(40,43,46,0.14)",
  muted: "rgba(40,43,46,0.72)",
} as const

function buildInquiryEmailHtml(fields: {
  firstName: string
  lastName: string
  email: string
  phone: string
  eventType: string
  guestCount: string
  preferredDate: string
  preferredTime: string
  message: string
}): string {
  const {
    firstName,
    lastName,
    email,
    phone,
    eventType,
    guestCount,
    preferredDate,
    preferredTime,
    message,
  } = fields
  const dash = "—"
  const phoneDisp = phone || dash
  const dateDisp = preferredDate || dash
  const timeDisp = preferredTime || dash
  const msgDisp = message || dash

  const row = (label: string, value: string) => `
<tr>
  <td style="padding:14px 28px 2px;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:0.32em;text-transform:uppercase;color:${BRAND.orangeDk};">${escapeHtml(label)}</td>
</tr>
<tr>
  <td style="padding:0 28px 14px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.45;color:${BRAND.coal};border-bottom:1px solid ${BRAND.border};">${escapeHtml(value)}</td>
</tr>`

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background-color:${BRAND.earth};">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${BRAND.earth};">
<tr>
<td style="padding:28px 16px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:580px;margin:0 auto;background-color:${BRAND.cream};border:1px solid rgba(40,43,46,0.12);">
    <tr>
      <td style="background-color:${BRAND.coal};padding:22px 28px 20px;border-bottom:3px solid ${BRAND.orange};">
        <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.42em;text-transform:uppercase;color:${BRAND.orange};font-weight:600;">The Analogue Room</p>
        <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:400;color:${BRAND.cream};line-height:1.15;">New host event inquiry</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 0 0;background-color:${BRAND.parched};">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          ${row("Guest name", `${firstName} ${lastName}`)}
          ${row("Email", email)}
          ${row("Phone", phoneDisp)}
          ${row("Event type", eventType)}
          ${row("Guest count", guestCount)}
          ${row("Preferred date", dateDisp)}
          ${row("Preferred time", timeDisp)}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 28px 28px;background-color:${BRAND.parched};">
        <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:0.32em;text-transform:uppercase;color:${BRAND.orangeDk};">Message</p>
        <div style="background-color:${BRAND.cream};border-left:3px solid ${BRAND.orange};padding:16px 18px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.55;color:${BRAND.coal};border-top:1px solid ${BRAND.border};border-right:1px solid ${BRAND.border};border-bottom:1px solid ${BRAND.border};">${escapeHtml(msgDisp).replace(/\n/g, "<br/>")}</div>
      </td>
    </tr>
  </table>
</td>
</tr>
</table>
</body>
</html>
`.trim()
}

/** Trim and strip one layer of matching quotes (common .env typo). */
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
  const firstName = str(o.firstName)
  const lastName = str(o.lastName)
  const email = str(o.email)
  const phone = str(o.phone)
  const eventType = str(o.eventType)
  const guestCount = str(o.guestCount)
  const preferredDate = str(o.preferredDate)
  const preferredTime = str(o.preferredTime)
  const message = str(o.message)

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "First and last name are required." },
      { status: 400 },
    )
  }
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 })
  }
  if (!eventType || !guestCount) {
    return NextResponse.json(
      { error: "Event type and guest count are required." },
      { status: 400 },
    )
  }

  const apiKey = readEnv("RESEND_API_KEY")
  const from = readEnv("RESEND_FROM")
  const to = readEnv("HOST_INQUIRY_TO_EMAIL")

  if (!apiKey || !from || !to) {
    const missing = [
      !apiKey && "RESEND_API_KEY",
      !from && "RESEND_FROM",
      !to && "HOST_INQUIRY_TO_EMAIL",
    ].filter(Boolean) as string[]
    const dev = process.env.NODE_ENV === "development"
    return NextResponse.json(
      {
        error: "Inquiry delivery is temporarily unavailable.",
        ...(dev
          ? {
              missingEnv: missing,
              hint: "Set these in .env.local at the project root, then restart `next dev`.",
            }
          : {}),
      },
      { status: 503 },
    )
  }

  const text = [
    "THE ANALOGUE ROOM — Host event inquiry",
    "═".repeat(42),
    "",
    `Name:        ${firstName} ${lastName}`,
    `Email:       ${email}`,
    `Phone:       ${phone || "—"}`,
    `Event type:  ${eventType}`,
    `Guests:      ${guestCount}`,
    `Date:        ${preferredDate || "—"}`,
    `Time:        ${preferredTime || "—"}`,
    "",
    "Message:",
    message || "—",
    "",
    "—",
    "Reply to this email to reach the guest directly.",
  ].join("\n")

  const html = buildInquiryEmailHtml({
    firstName,
    lastName,
    email,
    phone,
    eventType,
    guestCount,
    preferredDate,
    preferredTime,
    message,
  })

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `Host event inquiry — ${eventType} (${lastName})`,
    text,
    html,
  })

  if (error) {
    return NextResponse.json(
      { error: "Could not send your inquiry. Please try again later." },
      { status: 502 },
    )
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
