import type { Metadata } from "next"
import { buildOpenGraph } from "@/lib/site-metadata"
import "@/app/ssw/ssw-events.css"
import { EventsPageContent } from "@/components/events/EventsPageContent"
import { getResolvedSiteSettings } from "@/lib/sanity/queries"

const DEFAULT_EVENTS_HERO = "/images/ssw/ssw-a797a261eb289a92.jpg"

export const metadata: Metadata = {
  title: "Standing Sun Live",
  description:
    "Upcoming concerts and events at Standing Sun Wines in Buellton, California: music at the winery in Santa Ynez Valley.",
  openGraph: buildOpenGraph({
    title: "Standing Sun Live · Standing Sun Wines",
    description:
      "Upcoming concerts and events at Standing Sun Wines in Buellton, California.",
    url: "/shawnmullins",
  }),
  alternates: { canonical: "/shawnmullins" },
}

export default async function ShawnMullinsPage() {
  const site = await getResolvedSiteSettings()
  const heroBg = site.interiorHeroUrl.includes("interior.jpeg")
    ? DEFAULT_EVENTS_HERO
    : site.interiorHeroUrl

  return (
    <EventsPageContent
      heroBg={heroBg}
      eventbriteUrl={site.eventbriteOrgUrl}
      ticketTailorUrl={process.env.NEXT_PUBLIC_TICKET_TAILOR_BOX_OFFICE_URL}
    />
  )
}
