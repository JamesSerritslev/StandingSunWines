import type { SectionHero } from "@/lib/sanity/types"

export function SectionHero({ section }: { section: SectionHero }) {
  const { tagline, ctas } = section

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-content">
        {/* Logo is always the brand asset */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero-logo"
          src="/images/ssw/ssw-d553bb7215e2dee2.png"
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
