import { PortableText } from "@portabletext/react"
import type { SectionRichText } from "@/lib/sanity/types"

const BG_STYLES: Record<string, React.CSSProperties> = {
  dark: { background: "#0e0d0c", padding: "96px 48px", textAlign: "center" },
  medium: { background: "#1a1612", padding: "96px 48px", textAlign: "center" },
  light: {
    background: "var(--cream, #f9f5e5)",
    padding: "96px 48px",
    textAlign: "center",
    color: "var(--coal, #282b2e)",
  },
}

export function SectionRichText({ section }: { section: SectionRichText }) {
  const { eyebrow, titleMain, titleEm, body, backgroundColor = "dark" } = section
  const style = BG_STYLES[backgroundColor] ?? BG_STYLES.dark

  return (
    <section style={style}>
      {eyebrow ? <p className="eyebrow" style={{ textAlign: "center" }}>{eyebrow}</p> : null}
      {(titleMain || titleEm) ? (
        <h2 className="section-title" style={{ textAlign: "center", marginBottom: 18 }}>
          {titleMain}
          {titleEm ? <> <em>{titleEm}</em></> : null}
        </h2>
      ) : null}
      <div className="hr" style={{ margin: "20px auto" }} />
      {body ? (
        <div
          className="body-text"
          style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}
        >
          <PortableText value={body} />
        </div>
      ) : null}
    </section>
  )
}
