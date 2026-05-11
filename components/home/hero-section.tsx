import Image from "next/image"
import { INTERIOR_HERO_SRC } from "@/lib/interior-hero"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 pt-[120px] pb-20 text-center">
      <div
        className="hero-bg-photo"
        style={{ backgroundImage: `url(${INTERIOR_HERO_SRC})` }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-2 mx-auto w-full max-w-[880px]">
        <p className="font-label mb-6 text-[10px] tracking-[0.35em] text-orange drop-shadow-lg sm:mb-8 sm:text-[11px] sm:tracking-[0.45em] md:tracking-[0.5em] uppercase">
          Solvang · California · Est. 2025
        </p>

        <Image
          src="/images/ar-logo.png"
          alt="The Analogue Room"
          width={260}
          height={260}
          className="mx-auto mb-10 w-[min(260px,55vw)] aspect-square object-contain drop-shadow-xl"
          priority
          quality={90}
        />

        <h1 className="font-display mb-6 text-[clamp(32px,6vw,58px)] leading-[1.1] text-cream drop-shadow-lg sm:mb-7">
          <span className="block">
            Curation. <em className="not-italic text-orange">Intention.</em>
          </span>
          <span className="block">Analogue.</span>
        </h1>

        {/* Divider */}
        <div className="my-8 flex items-center justify-center gap-3.5">
          <div className="w-15 h-px bg-cream/40" />
          <span className="text-orange text-sm">★</span>
          <div className="w-15 h-px bg-cream/40" />
        </div>

        <p className="font-body mx-auto mb-10 max-w-[540px] text-sm font-normal leading-relaxed text-cream/85 drop-shadow-md">
          A vinyl bar &amp; record lounge in the heart of Solvang. A rotating selection of local and imported wines, beers, and non-alcoholic options — all paired with the warmth of music played the way it was meant to be heard.
        </p>

        {/* Meta info */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-6 border-t border-cream/20 pt-8 sm:gap-x-10 sm:gap-y-7 md:gap-x-12">
          <div className="text-center">
            <p className="font-label mb-1.5 text-[9px] tracking-[0.4em] uppercase text-orange">
              Hours
            </p>
            <p className="font-display text-sm text-cream">Thu-Sun · 4-10pm</p>
          </div>
          <div className="text-center">
            <p className="font-label mb-1.5 text-[9px] tracking-[0.4em] uppercase text-orange">
              Location
            </p>
            <p className="font-display text-sm text-cream">1693 Mission Dr, Solvang</p>
          </div>
          <div className="text-center">
            <p className="font-label mb-1.5 text-[9px] tracking-[0.4em] uppercase text-orange">
              Follow
            </p>
            <p className="font-display text-sm text-cream">@analogueroomsyv</p>
          </div>
        </div>
      </div>
    </section>
  )
}
