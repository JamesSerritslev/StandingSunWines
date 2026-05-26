/**
 * Host event inquiry → email via Resend.
 *
 * Add to `.env.local` (and hosting):
 *   RESEND_API_KEY=re_...
 *   RESEND_FROM="Standing Sun Wines <onboarding@resend.dev>"   // or verified domain sender
 *   HOST_INQUIRY_TO_EMAIL=jamesserritslev@gmail.com
 */

import { NextResponse } from "next/server"
import { Resend } from "resend"
import { buildHostInquiryEmailHtml } from "@/lib/email/inquiry-template"

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : ""
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
    "STANDING SUN WINES — Host event inquiry",
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

  const html = buildHostInquiryEmailHtml({
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
    subject: `Standing Sun Wines — inquiry (${eventType}, ${lastName})`,
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
