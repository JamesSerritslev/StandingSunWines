import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { EventsList } from "@/components/events/events-list"
import { INTERIOR_HERO_SRC } from "@/lib/interior-hero"
import { getEvents } from "@/lib/sanity/queries"

export const metadata: Metadata = {
  title: "Events | The Analogue Room",
  description: "Upcoming events at The Analogue Room - listening parties, album releases, special pours, and curated nights in Solvang, CA.",
}

export const revalidate = 60 // Revalidate every 60 seconds

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[50vh] items-end overflow-hidden px-4 pb-14 pt-page-hero sm:min-h-[55vh] sm:px-6 sm:pb-16 md:px-10 md:pb-[4.5rem] lg:px-12">
          <div
            className="interior-hero-photo absolute inset-0 z-0"
            style={{ backgroundImage: `url('${INTERIOR_HERO_SRC}')` }}
          >
            <div className="interior-hero-scrim" aria-hidden />
          </div>
          <div className="relative z-2">
            <p className="font-label text-[11px] tracking-[0.5em] uppercase text-orange mb-4">
              {"What's On"} · Solvang
            </p>
            <h1 className="font-display text-[clamp(40px,6vw,72px)] text-cream leading-[1.05] mb-3.5">
              Events <em className="not-italic text-orange">Calendar</em>
            </h1>
            <div className="w-15 h-0.5 bg-orange mt-5" />
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-[920px] px-4 py-16 text-center sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-12">
          <p className="font-label text-[10px] tracking-[0.5em] uppercase text-orange mb-4">
            {"What's Spinning"}
          </p>
          <h2 className="font-display text-[clamp(34px,4.5vw,52px)] text-coal leading-[1.05] mb-6">
            Upcoming <em className="not-italic text-orange">Nights</em>
          </h2>
          <div className="w-12 h-0.5 bg-orange mx-auto mb-6" />
          <p className="font-body text-[15px] font-normal leading-relaxed text-coal/85 max-w-[560px] mx-auto">
            From listening parties and album releases to special pours and pop-ups — here&apos;s what&apos;s on at The Analogue Room.
          </p>
        </section>

        {/* Events List */}
        <section className="mx-auto max-w-[1100px] px-4 pb-20 sm:px-6 sm:pb-24 md:px-10 md:pb-28 lg:px-12">
          <EventsList events={events} />
        </section>

        {/* CTA Section */}
        <section className="bg-coal px-4 py-16 text-center text-cream sm:px-6 sm:py-20 md:px-10 md:py-22 lg:px-12">
          <p className="font-label text-[10px] tracking-[0.5em] uppercase text-orange mb-4">
            Stay in the Loop
          </p>
          <h2 className="font-display text-[clamp(34px,4.5vw,52px)] text-cream leading-[1.05] mb-6">
            Follow For <em className="not-italic text-orange">Updates</em>
          </h2>
          <div className="w-12 h-0.5 bg-orange mx-auto mb-6" />
          <p className="font-body text-[15px] font-normal leading-relaxed text-cream/70 max-w-[520px] mx-auto mb-8">
            New events drop on Instagram first. Follow @analogueroomsyv for the latest.
          </p>
          <a
            href="https://www.instagram.com/analogueroomsyv"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center border border-cream px-6 py-3 font-label text-[11px] tracking-[0.28em] uppercase text-cream transition-colors hover:bg-cream hover:text-coal sm:min-h-0 sm:px-8 sm:py-3.5 sm:tracking-[0.3em]"
          >
            Follow on Instagram
          </a>
        </section>
      </main>
      <Footer />
    </>
  )
}
