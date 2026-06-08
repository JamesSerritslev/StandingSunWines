export type LocationResult = {
  coords: string | null
  label: string | null
  city: string | null
  state: string | null
}

let cached: LocationResult | undefined
let pending: Promise<LocationResult> | null = null

type MapboxFeature = {
  place_name?: string
  text?: string
  place_type?: string[]
  context?: Array<{
    id?: string
    text?: string
    short_code?: string
  }>
}

export function formatCityState(
  city: string | null | undefined,
  state: string | null | undefined,
): string | null {
  const c = city?.trim()
  const s = state?.trim()
  if (c && s) return `${c}, ${s}`
  if (c) return c
  if (s) return s
  return null
}

/** Parse "City, State" (or "City, State, Country") from a location string. */
export function parseCityStateFromLocation(location: string): {
  city: string
  state: string
} {
  const parts = location
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts.length >= 2) {
    return { city: parts[0], state: parts[1] }
  }
  if (parts.length === 1) return { city: parts[0], state: "" }
  return { city: "", state: "" }
}

function isLatLongString(value: string): boolean {
  return /^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(value.trim())
}

function parseMapboxFeature(feature: MapboxFeature): {
  label: string | null
  city: string | null
  state: string | null
} {
  const label = feature.place_name ?? null
  let city: string | null = null
  let state: string | null = null

  for (const ctx of feature.context ?? []) {
    const id = ctx.id ?? ""
    if (
      id.startsWith("place.") ||
      id.startsWith("locality.") ||
      id.startsWith("district.")
    ) {
      city = ctx.text ?? city
    }
    if (id.startsWith("region.")) {
      const code = ctx.short_code?.replace(/^[A-Z]{2}-/, "") ?? ""
      state = code || ctx.text || state
    }
  }

  const types = feature.place_type ?? []
  if (
    !city &&
    types.some((t) => t === "place" || t === "locality" || t === "district")
  ) {
    city = feature.text ?? null
  }

  if ((!city || !state) && label) {
    const fromLabel = parseCityStateFromLocation(label)
    if (!city && fromLabel.city) city = fromLabel.city
    if (!state && fromLabel.state) state = fromLabel.state
  }

  return { label, city, state }
}

async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<{ label: string | null; city: string | null; state: string | null }> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim()
  if (!token || token === "pk..") return { label: null, city: null, state: null }
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${encodeURIComponent(token)}&limit=1`,
    )
    if (!res.ok) return { label: null, city: null, state: null }
    const data = (await res.json()) as { features?: MapboxFeature[] }
    const feature = data.features?.[0]
    if (!feature) return { label: null, city: null, state: null }
    return parseMapboxFeature(feature)
  } catch {
    return { label: null, city: null, state: null }
  }
}

function emptyLocation(): LocationResult {
  return { coords: null, label: null, city: null, state: null }
}

function parseCoords(coords: string): { lat: number; lng: number } | null {
  const [latRaw, lngRaw] = coords.split(",").map((s) => s.trim())
  const lat = Number(latRaw)
  const lng = Number(lngRaw)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
}

async function enrichWithGeocode(result: LocationResult): Promise<LocationResult> {
  if (!result.coords) return result
  if (result.city || result.state) return result
  const parsed = parseCoords(result.coords)
  if (!parsed) return result
  const geocoded = await reverseGeocode(parsed.lat, parsed.lng)
  return {
    ...result,
    label: geocoded.label ?? result.label,
    city: geocoded.city,
    state: geocoded.state,
  }
}

function readGeolocation(): Promise<LocationResult> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(emptyLocation())
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        const coords = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        const geocoded = await reverseGeocode(lat, lng)
        resolve({
          coords,
          label: geocoded.label,
          city: geocoded.city,
          state: geocoded.state,
        })
      },
      () => resolve(emptyLocation()),
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300_000 },
    )
  })
}

/** Ask for browser location once per session (shared across all forms). */
export function requestFormLocation(): Promise<LocationResult> {
  if (cached !== undefined) return Promise.resolve(cached)
  if (pending) return pending
  pending = readGeolocation().then((result) => {
    cached = result
    pending = null
    return result
  })
  return pending
}

export function getCachedFormLocation(): LocationResult | null {
  return cached ?? null
}

/** Single `location` field as "City, State" for forms and email (never lat/long). */
export async function resolveLocationFieldForSubmit(
  result: LocationResult | null,
): Promise<{ location: string; city: string; state: string } | null> {
  if (!result?.coords) return null

  const enriched = await enrichWithGeocode(result)
  const formatted = formatCityState(enriched.city, enriched.state)
  if (!formatted || isLatLongString(formatted)) return null

  return {
    location: formatted.slice(0, 255),
    city: (enriched.city ?? "").slice(0, 255),
    state: (enriched.state ?? "").slice(0, 255),
  }
}

/** Call when the user first focuses or types in an inquiry form. */
export function onFormEngage(): void {
  void requestFormLocation()
}

export function attachFormLocationListeners(form: HTMLFormElement): () => void {
  let engaged = false
  const engage = () => {
    if (engaged) return
    engaged = true
    onFormEngage()
  }

  form.addEventListener("focusin", engage)
  form.addEventListener("input", engage)

  return () => {
    form.removeEventListener("focusin", engage)
    form.removeEventListener("input", engage)
  }
}
