import { NextResponse } from "next/server"
import { Resend } from "resend"
import { readEnv, readInquiryToEmails } from "@/lib/email/env"
import { upsertInquiryToMailchimp } from "@/lib/mailchimp/upsert-inquiry"
import {
  buildSswInquiryEmailHtml,
  buildSswInquiryEmailText,
  prepareEmailFields,
} from "@/lib/email/inquiry-template"
import { isNewsletterSignup } from "@/lib/forms/newsletter-signup"

const RESEND_ENV_KEYS = [
  "RESEND_API_KEY",
  "RESEND_FROM",
  "HOST_INQUIRY_TO_EMAIL",
] as const

function inquiryEmailConfigured(): boolean {
  return (
    RESEND_ENV_KEYS.every((key) => Boolean(readEnv(key))) &&
    readInquiryToEmails().length > 0
  )
}

/** True when a honeypot field was filled (bot). */
function isHoneypotTriggered(fields: Record<string, unknown>): boolean {
  const botcheck = fields.botcheck
  if (botcheck === true || botcheck === "on" || botcheck === "true" || botcheck === "1") {
    return true
  }
  if (typeof botcheck === "string" && botcheck.trim().length > 0) {
    return true
  }

  const website = fields.website
  if (typeof website === "string" && website.trim().length > 0) {
    return true
  }

  return false
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

  // Honeypot: bots fill these; humans never see them. Silent 200 so bots think it worked.
  if (isHoneypotTriggered(fields)) {
    return NextResponse.json({ success: true }, { status: 200 })
  }

  const email =
    (typeof fields.email === "string" && fields.email.trim()) ||
    (typeof fields.replyto === "string" && fields.replyto.includes("@")
      ? fields.replyto.trim()
      : "")

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 })
  }

  const newsletterOnly = isNewsletterSignup(page, fields)

  if (!newsletterOnly) {
    if (!inquiryEmailConfigured()) {
      const missing = RESEND_ENV_KEYS.filter((key) => !readEnv(key))
      if (readEnv("HOST_INQUIRY_TO_EMAIL") && readInquiryToEmails().length === 0) {
        missing.push("HOST_INQUIRY_TO_EMAIL")
      }
      return NextResponse.json(
        {
          error:
            "Email delivery is not configured. Add the missing variables to .env.local (local) or your host’s environment settings (production), then restart the dev server.",
          missing,
        },
        { status: 503 },
      )
    }

    const apiKey = readEnv("RESEND_API_KEY")!
    const from = readEnv("RESEND_FROM")!
    const to = readInquiryToEmails()

    const emailFields = prepareEmailFields(fields)

    const text = buildSswInquiryEmailText(page, emailFields)
    const html = buildSswInquiryEmailHtml(page, emailFields)

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
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
  }

  const mailchimp = await upsertInquiryToMailchimp(page, fields)
  if (!mailchimp.ok) {
    return NextResponse.json({ error: mailchimp.error }, { status: 502 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
