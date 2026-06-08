import type { Metadata } from "next"
import { buildOpenGraph } from "@/lib/site-metadata"
import { EventsList } from "@/components/events/events-list"
import { PageBuilder } from "@/components/pages/PageBuilder"
import { SswChrome } from "@/components/ssw/SswChrome"
import {
  getEvents,
  getPage,
  getResolvedSiteSettings,
} from "@/lib/sanity/queries"

export const metadata: Metadata = {
  title: "Standing Sun Live",
  description:
    "Upcoming concerts and events at Standing Sun Wines in Buellton, California — music at the winery in Santa Ynez Valley.",
  openGraph: buildOpenGraph({
    title: "Standing Sun Live · Standing Sun Wines",
    description:
      "Upcoming concerts and events at Standing Sun Wines in Buellton, California.",
    url: "/events",
  }),
  alternates: { canonical: "/events" },
}

export const revalidate = 60

export default async function EventsPage() {
  const [events, page, site] = await Promise.all([
    getEvents(),
    getPage("events"),
    getResolvedSiteSettings(),
  ])

  const heroBg = site.interiorHeroUrl

  if (page?.sections?.length) {
    return (
      <SswChrome>
        <PageBuilder page={page} events={events} site={site} />
      </SswChrome>
    )
  }

  return (
    <SswChrome>
      <main>
        <section className="relative flex min-h-[50vh] items-end overflow-hidden px-4 pb-14 pt-page-hero sm:min-h-[55vh] sm:px-6 sm:pb-16 md:px-10 md:pb-[4.5rem] lg:px-12">
          <div
            className="interior-hero-photo absolute inset-0 z-0"
            style={{ backgroundImage: `url('${heroBg}')` }}
          >
            <div className="interior-hero-scrim" aria-hidden />
          </div>
          <div className="relative z-2">
            <p className="font-label mb-4 text-[11px] uppercase tracking-[0.5em] text-orange-accent">
              Standing Sun Live · Buellton
            </p>
            <h1 className="font-display mb-3.5 text-[clamp(40px,6vw,72px)] leading-[1.05] text-cream">
              Events <em className="not-italic text-orange-accent">Calendar</em>
            </h1>
            <div className="mt-5 h-0.5 w-15 bg-orange" />
          </div>
        </section>

        <section className="mx-auto max-w-[920px] px-4 py-16 text-center sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-12">
          <p className="font-label mb-4 text-[10px] uppercase tracking-[0.5em] text-orange-accent">
            What&apos;s On
          </p>
          <h2 className="font-display mb-6 text-[clamp(34px,4.5vw,52px)] leading-[1.05] text-coal">
            Upcoming <em className="not-italic text-orange-accent">Nights</em>
          </h2>
          <div className="mx-auto mb-6 h-0.5 w-12 bg-orange" />
          <p className="font-body mx-auto max-w-[560px] text-[15px] font-normal leading-relaxed text-coal/85">
            Intimate concerts and gatherings at our working winery — see what&apos;s scheduled below,
            or browse all upcoming shows on Eventbrite.
          </p>
        </section>

        <section className="mx-auto max-w-[1100px] px-4 pb-20 sm:px-6 sm:pb-24 md:px-10 md:pb-28 lg:px-12">
          <EventsList
            events={events}
            emptyMessage={site.eventsListEmptyMessage}
            detailsLabel={site.eventsListDetailsLabel}
          />
        </section>

        <section className="bg-coal px-4 py-16 text-center text-cream sm:px-6 sm:py-20 md:px-10 md:py-22 lg:px-12">
          <p className="font-label mb-4 text-[10px] uppercase tracking-[0.5em] text-orange-accent">
            Stay in the Loop
          </p>
          <h2 className="font-display mb-6 text-[clamp(34px,4.5vw,52px)] leading-[1.05] text-cream">
            Tickets &amp; <em className="not-italic text-orange-accent">Updates</em>
          </h2>
          <div className="mx-auto mb-6 h-0.5 w-12 bg-orange" />
          <p className="font-body mx-auto mb-8 max-w-[520px] text-[15px] font-normal leading-relaxed text-cream/70">
            New shows and ticket links are posted on Eventbrite first.
          </p>
          <a
            href={site.eventbriteOrgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center border border-cream px-6 py-3 font-label text-[11px] uppercase tracking-[0.28em] text-cream transition-colors hover:bg-cream hover:text-coal sm:min-h-0 sm:px-8 sm:py-3.5 sm:tracking-[0.3em]"
          >
            View on Eventbrite
          </a>
        </section>
      </main>
    </SswChrome>
  )
}
