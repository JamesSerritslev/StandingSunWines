import type { SectionPrivateEvents } from "@/lib/sanity/types"

export function SectionPrivateEvents({ section }: { section: SectionPrivateEvents }) {
  const { eyebrow, titleMain, titleEm, body, quote, ctaLabel, ctaHref } = section

  return (
    <section id="private">
      <div className="private">
        <div className="private-bg" />
        <div className="private-content">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          {(titleMain || titleEm) ? (
            <h2 className="section-title">
              {titleMain}
              {titleEm ? <><br /><em>{titleEm}</em></> : null}
            </h2>
          ) : null}
          <div className="hr" />
          {body ? <p className="body-text">{body}</p> : null}
          {quote ? <p className="private-quote">{quote}</p> : null}
          {ctaLabel && ctaHref ? (
            <a href={ctaHref} className="btn btn-primary">
              {ctaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}
