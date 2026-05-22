import { sanityImageUrl } from "@/lib/sanity/image-url"
import type { SectionHero } from "@/lib/sanity/types"

const DEFAULT_LOGO_SRC = "/images/ssw/ssw-d553bb7215e2dee2.png"

export function SectionHero({ section }: { section: SectionHero }) {
  const { tagline, ctas, logo } = section
  const logoSrc = logo ? (sanityImageUrl(logo, 680) ?? DEFAULT_LOGO_SRC) : DEFAULT_LOGO_SRC

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-content">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero-logo"
          src={logoSrc}
          alt="Standing Sun Wines"
        />
        {tagline ? <p className="hero-tagline">{tagline}</p> : null}
        {ctas && ctas.length > 0 ? (
          <div className="hero-ctas">
            {ctas.map((cta) => (
              <a
                key={cta._key}
                href={cta.href ?? "#"}
                className={`btn ${cta.variant === "outline" ? "btn-outline" : "btn-primary"}`}
              >
                {cta.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <div className="hero-scroll">
        <div className="scroll-line" />
        <span>Discover</span>
      </div>
    </section>
  )
}
