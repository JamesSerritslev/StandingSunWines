/** Brand palette — matches site globals (email-safe hex only). */
export const BRAND = {
  void: "#231f20",
  coal: "#282b2e",
  cream: "#f8e9d0",
  parched: "#f9f5e5",
  hammock: "#c3b398",
  orange: "#f58220",
  orangeDk: "#a05c26",
  earth: "#302725",
  border: "rgba(195,179,152,0.14)",
  text: "#f9f5e5",
  textMuted: "#c3b398",
  panel: "#2e2a2b",
} as const

const PAGE_SOURCE_LABELS: Record<string, string> = {
  contact: "Contact Form",
  home: "Homepage Form",
  winery: "Winery Form",
  "private-events": "Private Events Form",
}

export function formatPageSourceLabel(page: string): string {
  const key = page.trim().toLowerCase()
  if (PAGE_SOURCE_LABELS[key]) return PAGE_SOURCE_LABELS[key]
  const titled = key
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
  return titled ? `${titled} Form` : "Website Form"
}

export function formatSubmissionSubtitle(page: string): string {
  return `Submitted From ${formatPageSourceLabel(page)}`
}

export const HIDDEN_EMAIL_FIELD_KEYS = new Set([
  "access_key",
  "botcheck",
  "from_name",
  "subject",
  "replyto",
  "city",
  "state",
])

const MESSAGE_FIELD_KEYS = new Set(["message", "event_details"])

const EMAIL_FIELD_LABELS: Record<string, string> = {
  first_name: "First Name",
  last_name: "Last Name",
  name: "Name",
  email: "Email",
  phone: "Phone",
  inquiry_type: "Inquiry Type",
  message: "Message",
  location: "Location",
  interest: "Interest",
  event_type: "Event Type",
  guest_count: "Guest Count",
  estimated_date: "Estimated Date",
  event_details: "Event Details",
  winemaker_type: "Winemaker Type",
  annual_production: "Annual Production",
}

const FIELD_DISPLAY_ORDER = [
  "first_name",
  "last_name",
  "name",
  "email",
  "phone",
  "inquiry_type",
  "interest",
  "event_type",
  "winemaker_type",
  "annual_production",
  "estimated_date",
  "guest_count",
  "location",
  "message",
  "event_details",
]

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function isLatLongString(value: string): boolean {
  return /^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(value.trim())
}

export function formatEmailFieldLabel(key: string): string {
  if (EMAIL_FIELD_LABELS[key]) return EMAIL_FIELD_LABELS[key]
  return key
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export function prepareEmailFields(
  fields: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(fields)) {
    if (HIDDEN_EMAIL_FIELD_KEYS.has(k)) continue
    if (k === "location" && typeof v === "string" && isLatLongString(v)) continue
    out[k] = v
  }
  return out
}

function fieldValueString(value: unknown): string {
  if (value == null) return ""
  if (typeof value === "string") return value.trim()
  return JSON.stringify(value)
}

function orderedFieldEntries(
  fields: Record<string, unknown>,
): [string, unknown][] {
  const orderIndex = (k: string) => {
    const i = FIELD_DISPLAY_ORDER.indexOf(k)
    return i === -1 ? 1000 : i
  }
  return Object.entries(fields).sort(([a], [b]) => {
    const diff = orderIndex(a) - orderIndex(b)
    return diff !== 0 ? diff : a.localeCompare(b)
  })
}

function emailFieldRow(label: string, value: string): string {
  const display = value || "—"
  return `
<tr>
  <td style="padding:14px 28px 2px;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:0.32em;text-transform:uppercase;color:${BRAND.orange};">${escapeHtml(label)}</td>
</tr>
<tr>
  <td style="padding:0 28px 14px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.45;color:${BRAND.text};border-bottom:1px solid ${BRAND.border};">${escapeHtml(display)}</td>
</tr>`
}

function messageBlock(label: string, value: string): string {
  const display = value || "—"
  return `
<tr>
  <td style="padding:8px 28px 28px;background-color:${BRAND.void};">
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:0.32em;text-transform:uppercase;color:${BRAND.orange};">${escapeHtml(label)}</p>
    <div style="background-color:${BRAND.panel};border-left:3px solid ${BRAND.orange};padding:16px 18px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.55;color:${BRAND.text};border-top:1px solid ${BRAND.border};border-right:1px solid ${BRAND.border};border-bottom:1px solid ${BRAND.border};">${escapeHtml(display).replace(/\n/g, "<br/>")}</div>
  </td>
</tr>`
}

function emailShell(title: string, subtitle: string, bodyRows: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background-color:${BRAND.void};">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${BRAND.void};">
<tr>
<td style="padding:28px 16px;background-color:${BRAND.void};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:580px;margin:0 auto;background-color:${BRAND.void};border:1px solid ${BRAND.border};">
    <tr>
      <td style="background-color:${BRAND.void};padding:22px 28px 20px;border-bottom:3px solid ${BRAND.orange};">
        <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.42em;text-transform:uppercase;color:${BRAND.orange};font-weight:600;">Standing Sun Wines</p>
        <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:400;color:${BRAND.cream};line-height:1.15;">${escapeHtml(title)}</h1>
        <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${BRAND.textMuted};">${escapeHtml(subtitle)}</p>
      </td>
    </tr>
    ${bodyRows}
  </table>
  <p style="max-width:580px;margin:16px auto 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:${BRAND.textMuted};text-align:center;">Reply to this email to reach the guest directly.</p>
</td>
</tr>
</table>
</body>
</html>`.trim()
}

export function buildSswInquiryEmailHtml(
  page: string,
  fields: Record<string, unknown>,
): string {
  const entries = orderedFieldEntries(fields)
  const rowFields: [string, string][] = []
  const messageFields: [string, string][] = []

  for (const [key, value] of entries) {
    const str = fieldValueString(value)
    if (MESSAGE_FIELD_KEYS.has(key)) {
      messageFields.push([formatEmailFieldLabel(key), str])
    } else {
      rowFields.push([formatEmailFieldLabel(key), str])
    }
  }

  const rowsHtml = rowFields
    .map(([label, value]) => emailFieldRow(label, value))
    .join("")

  const messagesHtml = messageFields
    .map(([label, value]) => messageBlock(label, value))
    .join("")

  const bodyRows = `
    <tr>
      <td style="padding:8px 0 0;background-color:${BRAND.void};">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          ${rowsHtml || `<tr><td style="padding:14px 28px;font-family:Georgia,serif;font-size:15px;color:${BRAND.textMuted};">No details submitted.</td></tr>`}
        </table>
      </td>
    </tr>
    ${messagesHtml}`

  return emailShell("New inquiry", formatSubmissionSubtitle(page), bodyRows)
}

export function buildSswInquiryEmailText(
  page: string,
  fields: Record<string, unknown>,
): string {
  const lines = orderedFieldEntries(fields).map(([key, value]) => {
    const label = formatEmailFieldLabel(key)
    const str = fieldValueString(value) || "—"
    return `${label}: ${str}`
  })

  return [
    "STANDING SUN WINES — Form submission",
    "═".repeat(42),
    "",
    formatSubmissionSubtitle(page),
    "",
    ...(lines.length ? lines : ["(no fields)"]),
    "",
    "—",
    "Reply to this email to reach the guest directly.",
  ].join("\n")
}

export function buildHostInquiryEmailHtml(fields: {
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

  const bodyRows = `
    <tr>
      <td style="padding:8px 0 0;background-color:${BRAND.void};">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          ${emailFieldRow("Guest name", `${firstName} ${lastName}`.trim())}
          ${emailFieldRow("Email", email)}
          ${emailFieldRow("Phone", phone)}
          ${emailFieldRow("Event type", eventType)}
          ${emailFieldRow("Guest count", guestCount)}
          ${emailFieldRow("Preferred date", preferredDate)}
          ${emailFieldRow("Preferred time", preferredTime)}
        </table>
      </td>
    </tr>
    ${messageBlock("Message", message)}`

  return emailShell(
    "New inquiry",
    `Host event inquiry · ${eventType}`,
    bodyRows,
  )
}
