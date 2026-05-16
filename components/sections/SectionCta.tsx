import type { SectionCtaBanner } from "@/lib/sanity/types"

const BG: Record<string, React.CSSProperties> = {
  coal: { background: "#282b2e" },
  void: { background: "#231f20" },
  cream: { background: "#f9f5e5", color: "#282b2e" },
}

export function SectionCta({ section }: { section: SectionCtaBanner }) {
  const {
    eyebrow,
    titleMain,
    titleEm,
    body,
    ctaLabel,
    ctaHref,
    backgroundColor = "coal",
  } = section

  const bgStyle = BG[backgroundColor] ?? BG.coal
  const isLight = backgroundColor === "cream"

  return (
    <section
      style={{
        ...bgStyle,
        padding: "96px 48px",
        textAlign: "center",
      }}
    >
      {eyebrow ? (
        <p
          className="eyebrow"
          style={{
            textAlign: "center",
            color: isLight ? "var(--spanish, #b65627)" : undefined,
          }}
        >
          {eyebrow}
        </p>
      ) : null}
      {(titleMain || titleEm) ? (
        <h2
          className="section-title"
          style={{
            textAlign: "center",
            marginBottom: 18,
            color: isLight ? "var(--coal, #282b2e)" : undefined,
          }}
        >
          {titleMain}
          {titleEm ? <> <em>{titleEm}</em></> : null}
        </h2>
      ) : null}
      <div className="hr" style={{ margin: "18px auto" }} />
      {body ? (
        <p
          className="body-text"
          style={{ maxWidth: 560, margin: "0 auto 32px", textAlign: "center" }}
        >
          {body}
        </p>
      ) : null}
      {ctaLabel && ctaHref ? (
        <a href={ctaHref} className="btn btn-primary" style={{ display: "inline-block" }}>
          {ctaLabel}
        </a>
      ) : null}
    </section>
  )
}
