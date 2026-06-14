/** Trim and strip one layer of matching quotes (common .env typo). */
export function readEnv(key: string): string | undefined {
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

/** One or more comma-separated addresses in HOST_INQUIRY_TO_EMAIL. */
export function readInquiryToEmails(): string[] {
  const raw = readEnv("HOST_INQUIRY_TO_EMAIL")
  if (!raw) return []
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter((email) => email.includes("@"))
}
