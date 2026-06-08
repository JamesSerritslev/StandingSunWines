/** Shared inquiry / event type options for contact and private-events forms. */

export const INQUIRY_TYPE_OPTIONS = [
  { value: "custom-crush", label: "Custom Crush / Winemaker in Residence" },
  { value: "wedding", label: "Wedding" },
  { value: "corporate-retreat", label: "Corporate Retreat / Offsite" },
  { value: "private-party", label: "Private Party" },
  { value: "rehearsal-dinner", label: "Rehearsal Dinner" },
  { value: "event-other", label: "Other Private Event" },
  { value: "general", label: "General Inquiry" },
] as const

export const EVENT_INQUIRY_VALUES = new Set<string>([
  "wedding",
  "corporate-retreat",
  "private-party",
  "rehearsal-dinner",
  "event-other",
])

export const INQUIRY_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  INQUIRY_TYPE_OPTIONS.map((o) => [o.value, o.label]),
)

/** Private-events page dropdown (display text as submitted value). */
export const PRIVATE_EVENT_TYPE_OPTIONS = [
  "Wedding",
  "Corporate Retreat / Offsite",
  "Private Party (birthday, anniversary, etc.)",
  "Rehearsal Dinner",
  "Other",
] as const

export function inquiryTypeLabel(value: string): string {
  const key = value.trim().toLowerCase()
  return INQUIRY_TYPE_LABELS[key] ?? value
}
