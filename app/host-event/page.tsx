import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { InquiryForm } from "@/components/host-event/inquiry-form"
import { INTERIOR_HERO_SRC } from "@/lib/interior-hero"
import { resolveHostEventVenueStats } from "@/lib/host-event-venue-stats"
import { getHostEventVenueStats } from "@/lib/sanity/queries"

export const metadata: Metadata = {
  title: "Host Your Event | The Analogue Room",
  description: "Host your private event at The Analogue Room - birthdays, listening parties, corporate gatherings, and more in our curated vinyl lounge.",
}

export const revalidate = 60

const features = [
  {
    title: "Vinyl Library",
    description: "Full access to our curated record collection. Bring your own or pick from ours — we'll spin what you choose.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="3"/>
        <circle cx="12" cy="12" r="0.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: "Bar Service",
    description: "A rotating selection of wines, beers, and zero-proof options served by our team. Custom drink menus available on request.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M8 2 L16 2 L16 6 C16 8 14.5 9 14 11 L14 21 L10 21 L10 11 C9.5 9 8 8 8 6 Z"/>
        <line x1="10" y1="13" x2="14" y2="13"/>
      </svg>
    ),
  },
  {
    title: "Sound System",
    description: "High-end turntables, amplifiers, and speakers. Music played the way it was meant to be heard.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M3 12 C3 6 8 4 12 4 C16 4 21 6 21 12 C21 18 16 20 12 20 C8 20 3 18 3 12 Z"/>
        <path d="M9 9 L15 9 M9 13 L15 13"/>
      </svg>
    ),
  },
  {
    title: "Lighting",
    description: "Warm, dimmable pendant lighting throughout the venue. Mood comes standard.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <circle cx="12" cy="6" r="2"/>
        <path d="M12 8 L12 22 M12 14 L8 18 M12 14 L16 18"/>
      </svg>
    ),
  },
  {
    title: "Flexible Layout",
    description: "Bar seating, lounge areas, and standing room — we configure the space to fit your event.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <rect x="4" y="6" width="16" height="14" rx="1"/>
        <path d="M8 6 V4 M16 6 V4 M4 12 H20"/>
      </svg>
    ),
  },
  {
    title: "Personal Touch",
    description: "Our team works with you to make every detail right — from playlists to drink pairings.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M12 2 L15 8 L22 9 L17 14 L18 21 L12 17 L6 21 L7 14 L2 9 L9 8 Z"/>
      </svg>
    ),
  },
]

export default async function HostEventPage() {
  const venueStatsDoc = await getHostEventVenueStats()
  const venueStats = resolveHostEventVenueStats(venueStatsDoc)

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
              Private Bookings · Solvang
            </p>
            <h1 className="font-display text-[clamp(40px,6vw,72px)] text-cream leading-[1.05] mb-3.5">
              Host Your <em className="not-italic text-orange">Event</em>
            </h1>
            <div className="w-15 h-0.5 bg-orange mt-5" />
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-[920px] px-4 py-20 text-center sm:px-6 sm:py-24 md:px-10 md:py-28 lg:px-12">
          <p className="font-label text-[10px] tracking-[0.5em] uppercase text-orange mb-4">
            A Room Like No Other
          </p>
          <h2 className="font-display text-[clamp(34px,4.5vw,52px)] text-coal leading-[1.05] mb-6">
            Your Night, <em className="not-italic text-orange">Curated</em>
          </h2>
          <div className="w-12 h-0.5 bg-orange mx-auto mb-6" />
          <p className="font-body text-base font-normal leading-relaxed text-coal/85 max-w-[640px] mx-auto">
            From intimate birthday gatherings to listening parties and corporate retreats — The Analogue Room offers a one-of-a-kind backdrop for the moments that matter. Vinyl, thoughtful drinks, and a room designed to bring people together.
          </p>
        </section>

        {/* Venue Stats */}
        <section className="bg-coal px-4 py-20 text-cream sm:px-6 sm:py-24 md:px-10 md:py-28 lg:px-12">
          <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
            <div>
              <p className="font-label text-[10px] tracking-[0.5em] uppercase text-orange mb-4">
                The Venue
              </p>
              <h2 className="font-display text-[clamp(34px,4.5vw,52px)] text-cream leading-[1.05] mb-6">
                Built for <em className="not-italic text-orange">Listening</em>
              </h2>
              <div className="w-12 h-0.5 bg-orange mb-6" />
              <p className="font-body text-[15px] font-normal leading-relaxed text-cream/85">
                A vinyl bar and lounge purpose-built for slow nights and good company. Backlit shelves of records, vintage hi-fi gear, leather seating, and warm pendant lighting — every detail tuned for atmosphere.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-0.5">
              {venueStats.map((stat, idx) => (
                <div
                  key={`venue-stat-${idx}`}
                  className="bg-cream/4 border border-cream/8 px-6 py-8 text-center"
                >
                  <p className="font-display text-[clamp(32px,4vw,48px)] text-orange leading-none mb-2">
                    {stat.value}
                  </p>
                  <p className="font-label text-[9px] tracking-[0.35em] uppercase text-cream/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-[1100px] px-4 py-20 sm:px-6 sm:py-24 md:px-10 md:py-28 lg:px-12">
          <div className="mb-12 text-center sm:mb-14 md:mb-16">
            <p className="font-label text-[10px] tracking-[0.5em] uppercase text-orange mb-4">
              {"What's Included"}
            </p>
            <h2 className="font-display text-[clamp(34px,4.5vw,52px)] text-coal leading-[1.05] mb-6">
              Everything You <em className="not-italic text-orange">Need</em>
            </h2>
            <div className="w-12 h-0.5 bg-orange mx-auto mb-6" />
            <p className="font-body text-[15px] font-normal leading-relaxed text-coal/85 max-w-[560px] mx-auto">
              Each booking comes with the full Analogue Room experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border-t-2 border-orange bg-coal/4 px-5 py-8 transition-transform duration-300 hover:-translate-y-1 sm:px-7 sm:py-9"
              >
                <div className="text-orange mb-5">{feature.icon}</div>
                <h3 className="font-display text-xl text-coal mb-2.5">{feature.title}</h3>
                <div className="w-6 h-px bg-orange mb-3.5" />
                <p className="font-body text-[13px] leading-relaxed text-coal/75">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Inquiry Form */}
        <section className="bg-earth px-4 py-20 sm:px-6 sm:py-24 md:px-10 md:py-28 lg:px-12">
          <div className="mx-auto max-w-[760px] border border-cream/10 bg-cream/4 px-4 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14 lg:px-12">
            <div className="text-center mb-8">
              <p className="font-label text-[10px] tracking-[0.5em] uppercase text-orange mb-4">
                Begin Planning
              </p>
              <h2 className="font-display text-[clamp(28px,4vw,42px)] text-cream leading-[1.05] mb-6">
                Inquire About Your <em className="not-italic text-orange">Event</em>
              </h2>
              <div className="w-12 h-0.5 bg-orange mx-auto mb-6" />
              <p className="font-body text-[15px] font-normal leading-relaxed text-cream/70 max-w-[480px] mx-auto">
                Tell us about your event and we&apos;ll be in touch within 48 hours.
              </p>
            </div>
            <InquiryForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
