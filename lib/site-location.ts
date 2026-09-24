/** Standing Sun Wines — 92 2nd Street, Buellton, CA 93427 */
export const STANDING_SUN_LOCATION = {
  street: "92 2nd Street",
  cityStateZip: "Buellton, CA 93427",
  /** [longitude, latitude] for Mapbox GL */
  coordinates: [-120.19206, 34.61339] as [number, number],
  mapsQuery: "92 2nd Street, Buellton, CA 93427",
  directionsUrl:
    "https://www.google.com/maps/search/?api=1&query=92+2nd+Street+Buellton+CA+93427",
} as const

/** Public tasting / visit hours (Pacific). Closed Tuesday & Wednesday. */
export const STANDING_SUN_HOURS = [
  { day: "Monday", hours: "11 AM – 5 PM", open: true },
  { day: "Tuesday", hours: "Closed", open: false },
  { day: "Wednesday", hours: "Closed", open: false },
  { day: "Thursday", hours: "11 AM – 5 PM", open: true },
  { day: "Friday", hours: "11 AM – 5 PM", open: true },
  { day: "Saturday", hours: "11 AM – 5 PM", open: true },
  { day: "Sunday", hours: "11 AM – 5 PM", open: true },
] as const

/** Compact line for footers / one-liners */
export const STANDING_SUN_HOURS_SUMMARY =
  "Thursday–Monday · 11 AM – 5 PM · Closed Tuesday & Wednesday"

/**
 * schema.org OpeningHoursSpecification for open days only.
 * dayOfWeek uses schema.org URLs; times are local Pacific.
 */
export const STANDING_SUN_OPENING_HOURS_SPEC = [
  "Monday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
].map((day) => ({
  "@type": "OpeningHoursSpecification" as const,
  dayOfWeek: `https://schema.org/${day}`,
  opens: "11:00",
  closes: "17:00",
}))

export function directionsUrlFromUser(lat: number, lng: number): string {
  const destination = encodeURIComponent(STANDING_SUN_LOCATION.mapsQuery)
  return `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${destination}`
}

/** Opens Apple Maps, Google Maps / geo, or web fallback for the user's platform. */
export function getNativeMapsUrl(options?: {
  fromLat?: number
  fromLng?: number
}): string {
  const [lng, lat] = STANDING_SUN_LOCATION.coordinates
  const label = encodeURIComponent("Standing Sun Wines")
  const address = encodeURIComponent(STANDING_SUN_LOCATION.mapsQuery)

  if (typeof navigator !== "undefined") {
    const ua = navigator.userAgent
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    const isAndroid = /Android/i.test(ua)

    if (isIOS) {
      const daddr = `${lat},${lng}`
      if (options?.fromLat != null && options?.fromLng != null) {
        return `https://maps.apple.com/?saddr=${options.fromLat},${options.fromLng}&daddr=${daddr}&dirflg=d`
      }
      return `https://maps.apple.com/?ll=${lat},${lng}&q=${label}&address=${address}`
    }

    if (isAndroid) {
      if (options?.fromLat != null && options?.fromLng != null) {
        return `https://www.google.com/maps/dir/?api=1&origin=${options.fromLat},${options.fromLng}&destination=${lat},${lng}`
      }
      return `geo:${lat},${lng}?q=${lat},${lng}(${label})`
    }
  }

  if (options?.fromLat != null && options?.fromLng != null) {
    return directionsUrlFromUser(options.fromLat, options.fromLng)
  }
  return STANDING_SUN_LOCATION.directionsUrl
}
