import type { HostEventVenueStats } from "@/lib/sanity/types"

export type VenueStatDisplay = { value: string; label: string }

export const DEFAULT_HOST_EVENT_VENUE_STATS: VenueStatDisplay[] = [
  { value: "TBD", label: "Standing Capacity" },
  { value: "TBD", label: "Seated Capacity" },
  { value: "TBD", label: "Square Footage" },
  { value: "4hr+", label: "Min Booking" },
]

/** Merge Sanity singleton with defaults when fields are empty or doc missing. */
export function resolveHostEventVenueStats(
  doc: HostEventVenueStats | null | undefined,
): VenueStatDisplay[] {
  const defs = DEFAULT_HOST_EVENT_VENUE_STATS
  const pick = (
    pair:
      | {
          value?: string
          label?: string
        }
      | undefined,
    i: number,
  ): VenueStatDisplay => {
    const v = pair?.value?.trim()
    const L = pair?.label?.trim()
    return {
      value: v || defs[i]!.value,
      label: L || defs[i]!.label,
    }
  }

  if (!doc) {
    return [...defs]
  }

  return [
    pick(doc.standing, 0),
    pick(doc.seated, 1),
    pick(doc.squareFootage, 2),
    pick(doc.minBooking, 3),
  ]
}
