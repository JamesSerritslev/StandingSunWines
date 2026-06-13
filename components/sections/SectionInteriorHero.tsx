import { sanityImageUrl } from "@/lib/sanity/image-url"
import type { SectionInteriorHero } from "@/lib/sanity/types"

interface Props {
  section: SectionInteriorHero
  /** From site settings when section has no background image */
  interiorHeroFallback: string
}

export function SectionInteriorHero({ section, interiorHeroFallback }: Props) {
  const fromSection = sanityImageUrl(section.backgroundImage, 2400)
  const bgUrl = fromSection ?? interiorHeroFallback

  const { eyebrow, titleMain, titleEm } = section

  return (
    <section className="relative flex min-h-[50vh] items-end overflow-hidden px-4 pb-14 pt-page-hero sm:min-h-[55vh] sm:px-6 sm:pb-16 md:px-10 md:pb-[4.5rem] lg:px-12">
      <div
        className="interior-hero-photo absolute inset-0 z-0"
        style={{ backgroundImage: `url('${bgUrl}')` }}
      >
        <div className="interior-hero-scrim" aria-hidden />
      </div>
      <div className="relative z-2">
        {eyebrow ? (
          <p className="font-label mb-4 uppercase text-orange-accent">
            {eyebrow}
          </p>
        ) : null}
        {(titleMain || titleEm) ? (
          <h1 className="font-display mb-3.5 text-[clamp(40px,6vw,72px)] leading-[1.05] text-cream">
            {titleMain}
            {titleEm ? <em className="not-italic text-orange-accent">{" "}{titleEm}</em> : null}
          </h1>
        ) : null}
        <div className="mt-5 h-0.5 w-15 bg-orange" />
      </div>
    </section>
  )
}
