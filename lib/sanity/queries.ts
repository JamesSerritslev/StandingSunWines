import { cache } from "react"

import type { ResolvedSiteSettings, SiteSettingsDocument } from "@/lib/site-settings-resolve"
import { SITE_SETTINGS_DOC_ID, resolveSiteSettings } from "@/lib/site-settings-resolve"
import { sanityFetch } from "@/sanity/lib/live"
import { sanityImageUrl } from "./image-url"
import type { Event, HostEventVenueStats, SanityPage } from "./types"

export const HOST_EVENT_VENUE_STATS_DOC_ID = "hostEventVenueStats"

/** Same-day events expire at 11:59 PM America/Los_Angeles. */
const LA_TEST_EXPIRY_TIME = "23:59"

function getLosAngelesNowParts(): { todayInLA: string; currentTimeInLA: string } {
  const now = new Date()
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)
  const year = dateParts.find((p) => p.type === "year")?.value ?? "0000"
  const month = dateParts.find((p) => p.type === "month")?.value ?? "00"
  const day = dateParts.find((p) => p.type === "day")?.value ?? "00"
  const todayInLA = `${year}-${month}-${day}`

  const timeParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now)
  const hour = timeParts.find((p) => p.type === "hour")?.value ?? "00"
  const minute = timeParts.find((p) => p.type === "minute")?.value ?? "00"
  const currentTimeInLA = `${hour}:${minute}`
  return { todayInLA, currentTimeInLA }
}

// ─── SITE SETTINGS ───────────────────────────────────────────────────────────

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings" && _id == $id][0] {
  ...,
  navigation[]{...},
}`

/** Cached per-request — reused by layouts and events routes. */
export const getResolvedSiteSettings = cache(async (): Promise<ResolvedSiteSettings> => {
  try {
    const { data } = await sanityFetch({
      query: SITE_SETTINGS_QUERY,
      params: { id: SITE_SETTINGS_DOC_ID },
    })
    return resolveSiteSettings(data as SiteSettingsDocument | null, (img, w) =>
      sanityImageUrl(img === null ? undefined : img, w),
    )
  } catch (error) {
    console.error("Error fetching site settings from Sanity:", error)
    return resolveSiteSettings(null, (img, w) => sanityImageUrl(img === null ? undefined : img, w))
  }
})

// ─── PAGE ────────────────────────────────────────────────────────────────────

const PAGE_QUERY = `*[_type == "page" && _id == $id][0] {
  _id,
  title,
  slug,
  seoDescription,
  sections[] {
    ...,
    body[] { ... }
  }
}`

/**
 * Fetch a marketing page document by its fixed _id.
 * Returns null if the document doesn't exist yet — callers fall back to the
 * static HTML blob in that case.
 */
export async function getPage(id: string): Promise<SanityPage | null> {
  try {
    const { data } = await sanityFetch({ query: PAGE_QUERY, params: { id } })
    return (data as SanityPage) ?? null
  } catch (error) {
    console.error(`Error fetching page "${id}" from Sanity:`, error)
    return null
  }
}

// ─── EVENTS ──────────────────────────────────────────────────────────────────

const EVENTS_QUERY = `*[
  _type == "event" &&
  (
    date > $todayInLA ||
    (date == $todayInLA && $currentTimeInLA <= $sameDayCutoff)
  )
] | order(date asc) {
  _id,
  title,
  slug,
  eventType,
  date,
  time,
  description,
  longDescription,
  image,
  ticketUrl,
  featured
}`

export async function getEvents(): Promise<Event[]> {
  try {
    const { todayInLA, currentTimeInLA } = getLosAngelesNowParts()
    const { data } = await sanityFetch({
      query: EVENTS_QUERY,
      params: { todayInLA, currentTimeInLA, sameDayCutoff: LA_TEST_EXPIRY_TIME },
    })
    return (data as Event[]) ?? []
  } catch (error) {
    console.error("Error fetching events from Sanity:", error)
    return []
  }
}

const EVENT_BY_SLUG_QUERY = `*[_type == "event" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  eventType,
  date,
  time,
  description,
  longDescription,
  image,
  ticketUrl,
  featured
}`

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const { data } = await sanityFetch({
      query: EVENT_BY_SLUG_QUERY,
      params: { slug },
    })
    return (data as Event) ?? null
  } catch (error) {
    console.error("Error fetching event from Sanity:", error)
    return null
  }
}

/** Singleton: Host / event venue stat tiles */
export const getHostEventVenueStats = cache(async (): Promise<HostEventVenueStats | null> => {
  try {
    const { data } = await sanityFetch({
      query: `*[_type == "hostEventVenueStats" && _id == $docId][0] {
        _id,
        standing { value, label },
        seated { value, label },
        squareFootage { value, label },
        minBooking { value, label }
      }`,
      params: { docId: HOST_EVENT_VENUE_STATS_DOC_ID },
    })
    return (data as HostEventVenueStats) ?? null
  } catch (error) {
    console.error("Error fetching host event venue stats from Sanity:", error)
    return null
  }
})

const FEATURED_EVENTS_QUERY = `*[
  _type == "event" &&
  featured == true &&
  (
    date > $todayInLA ||
    (date == $todayInLA && $currentTimeInLA <= $sameDayCutoff)
  )
] | order(date asc)[0...3] {
  _id,
  title,
  slug,
  eventType,
  date,
  time,
  description,
  image,
  ticketUrl,
  featured
}`

export async function getFeaturedEvents(): Promise<Event[]> {
  try {
    const { todayInLA, currentTimeInLA } = getLosAngelesNowParts()
    const { data } = await sanityFetch({
      query: FEATURED_EVENTS_QUERY,
      params: { todayInLA, currentTimeInLA, sameDayCutoff: LA_TEST_EXPIRY_TIME },
    })
    return (data as Event[]) ?? []
  } catch (error) {
    console.error("Error fetching featured events from Sanity:", error)
    return []
  }
}
