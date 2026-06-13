import type { SectionStandingSunBand } from "@/lib/sanity/types"

interface Props {
  section: SectionStandingSunBand
  /** When footer CTA, uses site-wide Eventbrite URL if empty */
  defaultEventbriteUrl?: string
}

export function SectionStandingSunBand({ section, defaultEventbriteUrl }: Props) {
  const { eyebrow, titleMain, titleEm, body, bandStyle = "intro", ctaHref, ctaLabel } = section

  const isFooter = bandStyle === "footerCta"
  const hrefResolved = isFooter ? (ctaHref?.trim() || defaultEventbriteUrl || "").trim() : (ctaHref?.trim() ?? "")

  if (isFooter) {
    return (
      <section className="bg-coal px-4 py-16 text-center text-cream sm:px-6 sm:py-20 md:px-10 md:py-22 lg:px-12">
        {eyebrow ? (
          <p className="font-label mb-4 uppercase text-orange-accent">
            {eyebrow}
          </p>
        ) : null}
        {(titleMain || titleEm) ? (
          <h2 className="font-display mb-6 text-[clamp(34px,4.5vw,52px)] leading-[1.05] text-cream">
            {titleMain}
            {titleEm ? (
              <>
                {" "}
                <em className="not-italic text-orange-accent">{titleEm}</em>
              </>
            ) : null}
          </h2>
        ) : null}
        <div className="mx-auto mb-6 h-0.5 w-12 bg-orange" />
        {body ? (
          <p className="font-body mx-auto mb-8 max-w-[520px] text-[15px] font-normal leading-relaxed text-cream/70">
            {body}
          </p>
        ) : null}
        {hrefResolved ? (
          <a
            href={hrefResolved}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center border border-cream px-6 py-3 font-label text-[11px] uppercase tracking-[0.28em] text-cream transition-colors hover:bg-cream hover:text-coal sm:min-h-0 sm:px-8 sm:py-3.5 sm:tracking-[0.3em]"
          >
            {ctaLabel ?? "View on Eventbrite"}
          </a>
        ) : null}
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-[920px] px-4 py-16 text-center sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-12">
      {eyebrow ? (
        <p className="font-label mb-4 uppercase text-orange-accent">{eyebrow}</p>
      ) : null}
      {(titleMain || titleEm) ? (
        <h2 className="font-display mb-6 text-[clamp(34px,4.5vw,52px)] leading-[1.05] text-coal">
          {titleMain}
          {titleEm ? (
            <>
              {" "}
              <em className="not-italic text-orange-accent">{titleEm}</em>
            </>
          ) : null}
        </h2>
      ) : null}
      <div className="mx-auto mb-6 h-0.5 w-12 bg-orange" />
      {body ? (
        <p className="font-body mx-auto max-w-[560px] text-[15px] font-normal leading-relaxed text-coal/85">
          {body}
        </p>
      ) : null}
      {ctaLabel && hrefResolved ? (
        <div className="mt-8">
          <a
            href={hrefResolved}
            target={/^https?:/i.test(hrefResolved) ? "_blank" : undefined}
            rel={/^https?:/i.test(hrefResolved) ? "noopener noreferrer" : undefined}
            className="inline-block border border-coal px-8 py-3 font-label text-[11px] uppercase tracking-[0.28em] text-coal hover:bg-coal hover:text-cream"
          >
            {ctaLabel}
          </a>
        </div>
      ) : null}
    </section>
  )
}
