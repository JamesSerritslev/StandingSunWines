import type { Metadata } from "next"
import { buildOpenGraph } from "@/lib/site-metadata"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SswChrome } from "@/components/ssw/SswChrome"
import { EventBody } from "@/components/events/event-body"
import { sanityImageUrl } from "@/lib/sanity/image-url"
import { getEventBySlug, getResolvedSiteSettings } from "@/lib/sanity/queries"
import { parseCalendarDate } from "@/lib/utils"

export const revalidate = 60

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(decodeURIComponent(slug))
  if (!event) {
    return { title: "Event | Standing Sun Wines" }
  }
  return {
    title: `${event.title} | Standing Sun Live`,
    description: event.description,
    openGraph: buildOpenGraph({
      title: `${event.title} · Standing Sun Live`,
      description: event.description,
      url: `/events/${slug}`,
    }),
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  const [eventData, settings] = await Promise.all([
    getEventBySlug(slug),
    getResolvedSiteSettings(),
  ])
  const event = eventData

  if (!event) {
    notFound()
  }

  const heroBg = settings.interiorHeroUrl

  const cal = event.date ? parseCalendarDate(event.date) : null
  const dateLine = cal
    ? cal.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Date TBD"
  const imageUrl = sanityImageUrl(event.image, 1400)

  return (
    <SswChrome>
      <main>
        <section className="relative flex min-h-[36vh] flex-col justify-end overflow-hidden px-4 pb-10 pt-page-hero sm:min-h-[38vh] sm:px-6 sm:pb-12 md:px-10 lg:px-12">
          <div
            className="interior-hero-photo absolute inset-0 z-0"
            style={{
              backgroundImage: `url('${heroBg}')`,
            }}
          >
            <div className="interior-hero-scrim" aria-hidden />
          </div>
          <div className="relative z-2 max-w-[880px]">
            <Link
              href="/events"
              className="-mx-1 mb-6 inline-flex min-h-10 items-center px-1 font-label text-[10px] uppercase tracking-[0.3em] text-orange-accent/90 transition-colors hover:text-cream sm:tracking-[0.35em]"
            >
              {settings.eventDetailBackLabel}
            </Link>
            <p className="font-label mb-3 text-[11px] uppercase tracking-[0.4em] text-orange-accent">
              {event.eventType}
            </p>
            <h1 className="font-display mb-4 text-[clamp(32px,5vw,52px)] leading-[1.05] text-cream">
              {event.title}
            </h1>
            <p className="font-body text-[15px] text-cream/85">
              <span className="font-label mr-3 text-[10px] uppercase tracking-[0.2em] text-orange-accent">
                {settings.eventDetailWhenLabel}
              </span>
              {dateLine}
              {event.time ? ` · ${event.time}` : null}
            </p>
            <div className="mt-6 h-0.5 w-15 bg-orange" />
          </div>
        </section>

        <section className="mx-auto max-w-[720px] px-4 py-12 sm:px-6 sm:py-16 md:px-10 lg:px-12">
          {imageUrl ? (
            <div className="relative mb-12 aspect-[21/9] w-full overflow-hidden rounded-sm border border-coal/10 bg-coal/5">
              <Image
                src={imageUrl}
                alt={event.title ? `Image for ${event.title}` : "Event image"}
                fill
                className="object-cover"
                sizes="(max-width: 720px) 100vw, 720px"
              />
            </div>
          ) : null}

          <p className="font-body mb-8 text-[16px] leading-relaxed text-coal/88">
            {event.description}
          </p>

          {event.longDescription?.length ? (
            <EventBody value={event.longDescription} />
          ) : null}

          {event.ticketUrl ? (
            <div className="mt-14 border-t border-coal/10 pt-10 text-center md:text-left">
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange px-10 py-4 font-label text-[11px] uppercase tracking-[0.3em] text-cream transition-colors hover:bg-spanish"
              >
                Tickets / RSVP
              </a>
            </div>
          ) : null}
        </section>
      </main>
    </SswChrome>
  )
}
