import { PortableText } from "@portabletext/react"
import { sanityImageUrl } from "@/lib/sanity/image-url"
import type { SectionSplit } from "@/lib/sanity/types"

export function SectionSplit({ section }: { section: SectionSplit }) {
  const {
    variant = "about",
    image,
    eyebrow,
    titleMain,
    titleEm,
    body,
    ctaLabel,
    ctaHref,
  } = section

  const isWinemaker = variant === "winemaker"

  const imgStyle: React.CSSProperties = image
    ? {
        backgroundImage: `url('${sanityImageUrl(image, 1200) ?? ""}')`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }
    : {}

  if (isWinemaker) {
    return (
      <section className="winemaker">
        <div className="winemaker-text">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          {(titleMain || titleEm) ? (
            <h2 className="section-title">
              {titleMain}
              {titleEm ? <><br /><em>{titleEm}</em></> : null}
            </h2>
          ) : null}
          <div className="hr" />
          {body ? (
            <div className="body-text">
              <PortableText value={body} />
            </div>
          ) : null}
          {ctaLabel && ctaHref ? (
            <>
              <div className="hr" />
              <a href={ctaHref} className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                {ctaLabel}
              </a>
            </>
          ) : null}
        </div>
        <div className="winemaker-img" style={imgStyle} />
      </section>
    )
  }

  // Default: "about" variant — photo left, text right
  return (
    <section className="about">
      <div className="about-img" style={imgStyle} />
      <div className="about-text">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        {(titleMain || titleEm) ? (
          <h2 className="section-title">
            {titleMain}
            {titleEm ? (
              <>
                <br />
                <em>{titleEm}</em>
              </>
            ) : null}
          </h2>
        ) : null}
        <div className="hr" />
        {body ? (
          <div className="body-text">
            <PortableText value={body} />
          </div>
        ) : null}
        {ctaLabel && ctaHref ? (
          <>
            <div className="hr" />
            <a href={ctaHref} className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
              {ctaLabel}
            </a>
          </>
        ) : null}
      </div>
    </section>
  )
}
