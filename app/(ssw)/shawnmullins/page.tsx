import type { Metadata } from "next"
import { buildOpenGraph } from "@/lib/site-metadata"
import "@/app/ssw/ssw-events.css"
import { ShowLandingContent } from "@/components/events/ShowLandingContent"
import { SHAWN_MULLINS } from "@/lib/shows"
import { STANDING_SUN_LOCATION } from "@/lib/site-location"

const show = SHAWN_MULLINS

export const metadata: Metadata = {
  title: show.metaTitle,
  description: show.metaDescription,
  openGraph: buildOpenGraph({
    title: show.metaTitle,
    description: show.metaDescription,
    url: show.canonicalPath,
    images: [show.ogImage],
  }),
  alternates: { canonical: show.canonicalPath },
}

function eventJsonLd() {
  if (!show.startDateISO) return null

  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `${show.performer} Live at Standing Sun Wines`,
    startDate: show.startDateISO,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: show.metaDescription,
    image: [show.ogImage, show.artistImage.src],
    performer: { "@type": "MusicGroup", name: show.performer },
    organizer: { "@type": "Organization", name: "Standing Sun Wines" },
    location: {
      "@type": "MusicVenue",
      name: "Standing Sun Wines",
      address: {
        "@type": "PostalAddress",
        streetAddress: STANDING_SUN_LOCATION.street,
        addressLocality: "Buellton",
        addressRegion: "CA",
        postalCode: "93427",
        addressCountry: "US",
      },
    },
    offers: {
      "@type": "Offer",
      url: show.ticketUrl,
      availability: "https://schema.org/InStock",
    },
  }
}

export default function ShawnMullinsPage() {
  const jsonLd = eventJsonLd()

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <ShowLandingContent show={show} />
    </>
  )
}
