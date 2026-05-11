import type { PortableTextBlock } from "@portabletext/types"

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
