import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { EventBody } from "@/components/events/event-body"
import { sanityImageUrl } from "@/lib/sanity/image-url"
import { getEventBySlug } from "@/lib/sanity/queries"
import { INTERIOR_HERO_SRC } from "@/lib/interior-hero"
import { parseCalendarDate } from "@/lib/utils"

export const revalidate = 60

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(decodeURIComponent(slug))
  if (!event) {
    return { title: "Event | The Analogue Room" }
  }
  return {
    title: `${event.title} | The Analogue Room`,
    description: event.description,
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  const event = await getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const cal = event.date ? parseCalendarDate(event.date) : null
  const dateLine = cal ? cal.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "Date TBD"
  const imageUrl = sanityImageUrl(event.image, 1400)

  return (
    <>
      <Navigation />
      <main>
        <section className="relative flex min-h-[36vh] flex-col justify-end overflow-hidden px-4 pb-10 pt-page-hero sm:min-h-[38vh] sm:px-6 sm:pb-12 md:px-10 lg:px-12">
          <div
            className="interior-hero-photo absolute inset-0 z-0"
            style={{
              backgroundImage: `url('${INTERIOR_HERO_SRC}')`,
            }}
          >
            <div className="interior-hero-scrim" aria-hidden />
          </div>
          <div className="relative z-2 max-w-[880px]">
            <Link
              href="/events"
              className="-mx-1 mb-6 inline-flex min-h-10 items-center px-1 font-label text-[10px] tracking-[0.3em] uppercase text-orange/90 transition-colors hover:text-cream sm:tracking-[0.35em]"
            >
              ← Back to events
            </Link>
            <p className="font-label text-[11px] tracking-[0.4em] uppercase text-orange mb-3">{event.eventType}</p>
            <h1 className="font-display text-[clamp(32px,5vw,52px)] text-cream leading-[1.05] mb-4">{event.title}</h1>
            <p className="font-body text-cream/85 text-[15px]">
              <span className="text-orange font-label tracking-[0.2em] uppercase text-[10px] mr-3">When</span>
              {dateLine}
              {event.time ? ` · ${event.time}` : null}
            </p>
            <div className="w-15 h-0.5 bg-orange mt-6" />
          </div>
        </section>

        <section className="mx-auto max-w-[720px] px-4 py-12 sm:px-6 sm:py-16 md:px-10 lg:px-12">
          {imageUrl ? (
            <div className="relative aspect-[21/9] w-full mb-12 border border-coal/10 overflow-hidden rounded-sm bg-coal/5">
              <Image
                src={imageUrl}
                alt={event.title ? `Image for ${event.title}` : "Event image"}
                fill
                className="object-cover"
                sizes="(max-width: 720px) 100vw, 720px"
              />
            </div>
          ) : null}

          <p className="font-body text-[16px] leading-relaxed text-coal/88 mb-8">{event.description}</p>

          {event.longDescription?.length ? <EventBody value={event.longDescription} /> : null}

          {event.ticketUrl ? (
            <div className="mt-14 pt-10 border-t border-coal/10 text-center md:text-left">
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-label text-[11px] tracking-[0.3em] uppercase bg-orange text-cream px-10 py-4 hover:bg-spanish transition-colors"
              >
                Tickets / RSVP
              </a>
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </>
  )
}
