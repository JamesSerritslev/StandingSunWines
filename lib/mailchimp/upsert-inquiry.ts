import {
  getMailchimpConfig,
  mailchimpFetch,
  slugTag,
  subscriberHash,
} from "@/lib/mailchimp/client"
import { formatCityState, parseCityStateFromLocation } from "@/lib/forms/location"

const SKIP_KEYS = new Set([
  "access_key",
  "botcheck",
  "from_name",
  "subject",
  "replyto",
  "city",
  "state",
])

function readMergeTag(key: string): string | undefined {
  const raw = process.env[key]
  return raw?.trim() || undefined
}

function parseName(fields: Record<string, unknown>): {
  firstName: string
  lastName: string
} {
  const first =
    (typeof fields.first_name === "string" && fields.first_name.trim()) || ""
  const last =
    (typeof fields.last_name === "string" && fields.last_name.trim()) || ""
  if (first || last) return { firstName: first, lastName: last }

  const name = typeof fields.name === "string" ? fields.name.trim() : ""
  if (!name) return { firstName: "", lastName: "" }
  const parts = name.split(/\s+/)
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  }
}

function strField(fields: Record<string, unknown>, key: string): string {
  const v = fields[key]
  return typeof v === "string" ? v.trim() : ""
}

function isLatLongString(value: string): boolean {
  return /^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(value.trim())
}

/** City, State string for Mailchimp "Location" merge field. */
function locationCityStateForMailchimp(fields: Record<string, unknown>): string {
  const location = strField(fields, "location")
  if (location && !isLatLongString(location)) return location

  const city = strField(fields, "city")
  const state = strField(fields, "state")
  const formatted = formatCityState(city, state)
  if (formatted) return formatted

  if (location) {
    const parsed = parseCityStateFromLocation(location)
    return formatCityState(parsed.city, parsed.state) ?? ""
  }

  return ""
}

function buildInquirySummary(
  page: string,
  fields: Record<string, unknown>,
): string {
  const rows = Object.entries(fields)
    .filter(([k]) => !SKIP_KEYS.has(k))
    .map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
  return [`Page: ${page}`, ...rows].join("\n").slice(0, 2000)
}

function collectTags(page: string, fields: Record<string, unknown>): string[] {
  const tags = new Set<string>(["website-inquiry", `page-${slugTag(page)}`])

  const interestKeys = [
    "interest",
    "inquiry_type",
    "event_type",
    "winemaker_type",
    "annual_production",
  ]
  for (const key of interestKeys) {
    const v = fields[key]
    if (typeof v === "string" && v.trim()) {
      tags.add(`interest-${slugTag(v)}`)
      break
    }
  }

  return [...tags]
}

function applyLocationMergeField(
  mergeFields: Record<string, string>,
  fields: Record<string, unknown>,
): void {
  const locationTag = readMergeTag("MAILCHIMP_MERGE_LOCATION")
  if (!locationTag) return

  const location = locationCityStateForMailchimp(fields)
  if (!location) return

  mergeFields[locationTag] = location.slice(0, 255)
}

export type UpsertInquiryResult =
  | { ok: true }
  | { ok: false; error: string; alreadySubscribed?: boolean }

export async function upsertInquiryToMailchimp(
  page: string,
  fields: Record<string, unknown>,
): Promise<UpsertInquiryResult> {
  const cfg = getMailchimpConfig()
  if (!cfg) {
    return { ok: false, error: "Mailchimp is not configured." }
  }

  const email =
    strField(fields, "email") ||
    (strField(fields, "replyto").includes("@") ? strField(fields, "replyto") : "")

  if (!email || !email.includes("@")) {
    return { ok: false, error: "A valid email is required for Mailchimp." }
  }

  const { firstName, lastName } = parseName(fields)
  const phone = strField(fields, "phone")

  const mergeFields: Record<string, string> = {
    FNAME: firstName,
    LNAME: lastName,
  }
  if (phone) mergeFields.PHONE = phone

  const inquiryTag = readMergeTag("MAILCHIMP_MERGE_INQUIRY")
  if (inquiryTag) {
    mergeFields[inquiryTag] = buildInquirySummary(page, fields)
  }

  applyLocationMergeField(mergeFields, fields)

  const tags = collectTags(page, fields)
  const hash = subscriberHash(email)

  const body = {
    email_address: email,
    status_if_new: "subscribed",
    status: "subscribed",
    merge_fields: mergeFields,
  }

  let res = await mailchimpFetch(`/lists/${cfg.audienceId}/members/${hash}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as {
      title?: string
      detail?: string
      errors?: Array<{ field?: string; message?: string }>
    }

    const invalidMerge = data.errors?.some((e) =>
      e.field?.includes("merge_fields"),
    )
    if (invalidMerge) {
      const fallbackMerge: Record<string, string> = {
        FNAME: firstName,
        LNAME: lastName,
      }
      if (phone) fallbackMerge.PHONE = phone
      if (inquiryTag && mergeFields[inquiryTag]) {
        fallbackMerge[inquiryTag] = mergeFields[inquiryTag]
      }
      res = await mailchimpFetch(`/lists/${cfg.audienceId}/members/${hash}`, {
        method: "PUT",
        body: JSON.stringify({
          ...body,
          merge_fields: fallbackMerge,
        }),
      })
    }

    if (!res.ok) {
      const fallbackMerge: Record<string, string> = {
        FNAME: firstName,
        LNAME: lastName,
      }
      if (phone) fallbackMerge.PHONE = phone
      res = await mailchimpFetch(`/lists/${cfg.audienceId}/members/${hash}`, {
        method: "PUT",
        body: JSON.stringify({
          ...body,
          merge_fields: fallbackMerge,
        }),
      })
    }

    if (!res.ok) {
      const retryData = (await res.json().catch(() => ({}))) as {
        title?: string
        detail?: string
      }
      return {
        ok: false,
        error: retryData.detail || retryData.title || "Mailchimp sync failed.",
      }
    }
  }

  await mailchimpFetch(`/lists/${cfg.audienceId}/members/${hash}/tags`, {
    method: "POST",
    body: JSON.stringify({
      tags: tags.map((name) => ({ name, status: "active" })),
    }),
  })

  return { ok: true }
}
