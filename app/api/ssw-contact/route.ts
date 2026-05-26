import { NextResponse } from "next/server"
import { Resend } from "resend"
import { upsertInquiryToMailchimp } from "@/lib/mailchimp/upsert-inquiry"
import {
  buildSswInquiryEmailHtml,
  buildSswInquiryEmailText,
  prepareEmailFields,
} from "@/lib/email/inquiry-template"
import { isNewsletterSignup } from "@/lib/forms/newsletter-signup"

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

const RESEND_ENV_KEYS = [
  "RESEND_API_KEY",
  "RESEND_FROM",
  "HOST_INQUIRY_TO_EMAIL",
] as const

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
    const missing = RESEND_ENV_KEYS.filter((key) => !readEnv(key))
    if (missing.length > 0) {
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
    const to = readEnv("HOST_INQUIRY_TO_EMAIL")!

    const emailFields = prepareEmailFields(fields)

    const text = buildSswInquiryEmailText(page, emailFields)
    const html = buildSswInquiryEmailHtml(page, emailFields)

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to: [to],
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
