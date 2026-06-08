import type { PortableTextBlock } from "@portabletext/types"

// ─── Page / Section types ────────────────────────────────────────────────────

export interface SanityImage {
  asset: { _ref: string; _type: string }
  hotspot?: { x: number; y: number; width: number; height: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

export interface SectionCta {
  label?: string
  href?: string
  variant?: "primary" | "outline"
}

export interface SectionHero {
  _type: "sectionHero"
  _key: string
  logo?: SanityImage
  tagline?: string
  ctas?: (SectionCta & { _key: string })[]
}

export interface SectionRichText {
  _type: "sectionRichText"
  _key: string
  eyebrow?: string
  titleMain?: string
  titleEm?: string
  body?: PortableTextBlock[]
  backgroundColor?: "dark" | "medium" | "light"
}

export interface SectionSplit {
  _type: "sectionSplit"
  _key: string
  variant?: "about" | "winemaker"
  image?: SanityImage
  eyebrow?: string
  titleMain?: string
  titleEm?: string
  body?: PortableTextBlock[]
  ctaLabel?: string
  ctaHref?: string
}

export interface SectionEventsFeature {
  _type: "sectionEventsFeature"
  _key: string
  eyebrow?: string
  titleMain?: string
  titleEm?: string
  body?: string
  eventbriteUrl?: string
  eventbriteLabel?: string
  featureImage?: SanityImage
}

export interface SectionPrivateEvents {
  _type: "sectionPrivateEvents"
  _key: string
  eyebrow?: string
  titleMain?: string
  titleEm?: string
  body?: string
  quote?: string
  ctaLabel?: string
  ctaHref?: string
}

export interface SectionContactForm {
  _type: "sectionContactForm"
  _key: string
  eyebrow?: string
  titleMain?: string
  titleEm?: string
  pageSource?: string
}

export interface SectionCtaBanner {
  _type: "sectionCta"
  _key: string
  eyebrow?: string
  titleMain?: string
  titleEm?: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  backgroundColor?: "coal" | "void" | "cream"
}

export interface SectionEventsList {
  _type: "sectionEventsList"
  _key: string
  eyebrow?: string
  titleMain?: string
  titleEm?: string
  body?: string
}

export interface SectionStandingSunBand {
  _type: "sectionStandingSunBand"
  _key: string
  eyebrow?: string
  titleMain?: string
  titleEm?: string
  body?: string
  bandStyle?: "intro" | "footerCta"
  ctaLabel?: string
  ctaHref?: string
}

export interface SectionInteriorHero {
  _type: "sectionInteriorHero"
  _key: string
  eyebrow?: string
  titleMain?: string
  titleEm?: string
  backgroundImage?: SanityImage
}

export interface SectionVenueStats {
  _type: "sectionVenueStats"
  _key: string
  eyebrow?: string
  title?: string
}

export type PageSection =
  | SectionHero
  | SectionInteriorHero
  | SectionStandingSunBand
  | SectionRichText
  | SectionSplit
  | SectionEventsFeature
  | SectionPrivateEvents
  | SectionVenueStats
  | SectionContactForm
  | SectionCtaBanner
  | SectionEventsList

export interface SanityPage {
  _id: string
  title?: string
  slug?: { current: string }
  seoDescription?: string
  sections?: PageSection[]
}

export interface VenueStatPair {
  value?: string
  label?: string
}

export interface HostEventVenueStats {
  _id: string
  standing?: VenueStatPair
  seated?: VenueStatPair
  squareFootage?: VenueStatPair
  minBooking?: VenueStatPair
}

export interface Event {
  _id: string
  title: string
  slug?: {
    current: string
  }
  eventType: string
  date: string
  time: string
  description: string
  longDescription?: PortableTextBlock[]
  image?: {
    asset: {
      _ref: string
      _type: string
    }
  }
  ticketUrl?: string
  featured?: boolean
}
