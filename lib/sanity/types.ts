import type { PortableTextBlock } from "@portabletext/types"

export interface SanityImage {
  asset: { _ref: string; _type: string }
  hotspot?: { x: number; y: number; width: number; height: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

export interface PageContentImage {
  _key: string
  key: string
  label: string
  alt?: string
  image?: SanityImage
}

export interface PageContentParagraph {
  _key: string
  key: string
  label: string
  text?: string
}

export interface SanityPage {
  _id: string
  title?: string
  slug?: { current: string }
  seoDescription?: string
  images?: PageContentImage[]
  paragraphs?: PageContentParagraph[]
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
