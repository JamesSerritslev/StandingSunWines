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
    const [{ data: settingsDoc }, homeImages] = await Promise.all([
      sanityFetch({
        query: SITE_SETTINGS_QUERY,
        params: { id: SITE_SETTINGS_DOC_ID },
      }),
      getHomeChromeImages(),
    ])

    const navSlot = homeImages.find((item) => item.key === "nav-logo")
    const footerSlot = homeImages.find((item) => item.key === "footer-logo")

    const merged: SiteSettingsDocument = {
      ...(settingsDoc as SiteSettingsDocument | null),
      ...(navSlot?.image ? { navLogo: navSlot.image, navLogoAlt: navSlot.alt } : {}),
      ...(footerSlot?.image
        ? { footerLogo: footerSlot.image, footerLogoAlt: footerSlot.alt }
        : {}),
    }

    return resolveSiteSettings(merged, (img, w) =>
      sanityImageUrl(img === null ? undefined : img, w),
    )
  } catch (error) {
    console.error("Error fetching site settings from Sanity:", error)
    return resolveSiteSettings(null, (img, w) => sanityImageUrl(img === null ? undefined : img, w))
  }
})

// ─── PAGE CONTENT (images + text) ────────────────────────────────────────────

const PAGE_CONTENT_QUERY = `{
  "imagesDoc": *[_type == "pageImages" && pageKey == $id][0] {
    images[] {
      _key,
      key,
      label,
      alt,
      image
    }
  },
  "textDoc": *[_type == "pageText" && pageKey == $id][0] {
    paragraphs[] {
      _key,
      key,
      label,
      text
    }
  }
}`

const HOME_LOGOS_QUERY = `*[_type == "pageImages" && _id == "images-home"][0].images[] {
  key,
  alt,
  image
}`

/** Global nav/footer logos live on Home → Images in Studio. */
export async function getHomeChromeImages(): Promise<
  { key: string; alt?: string; image?: import("./types").SanityImage }[]
> {
  try {
    const { data } = await sanityFetch({ query: HOME_LOGOS_QUERY })
    return (data as { key: string; alt?: string; image?: import("./types").SanityImage }[]) ?? []
  } catch {
    return []
  }
}

/**
 * Fetch editable page content by route key (home, winery, contact, private-events).
 */
export async function getPage(id: string): Promise<SanityPage | null> {
  try {
    const { data } = await sanityFetch({ query: PAGE_CONTENT_QUERY, params: { id } })
    const row = data as {
      imagesDoc?: { images?: SanityPage["images"] }
      textDoc?: { paragraphs?: SanityPage["paragraphs"] }
    } | null
    if (!row?.imagesDoc && !row?.textDoc) return null
    return {
      _id: id,
      images: row.imagesDoc?.images ?? [],
      paragraphs: row.textDoc?.paragraphs ?? [],
    }
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
