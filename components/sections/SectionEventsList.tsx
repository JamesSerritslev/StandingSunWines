import type { SectionEventsList } from "@/lib/sanity/types"
import type { Event } from "@/lib/sanity/types"
import { EventsList } from "@/components/events/events-list"

interface Props {
  section: SectionEventsList
  events?: Event[]
}

export function SectionEventsList({ section, events = [] }: Props) {
  const { eyebrow, titleMain, titleEm, body } = section

  return (
    <>
      {(eyebrow || titleMain || titleEm || body) ? (
        <section
          style={{
            maxWidth: 920,
            margin: "0 auto",
            padding: "80px 48px",
            textAlign: "center",
          }}
        >
          {eyebrow ? <p className="eyebrow" style={{ textAlign: "center" }}>{eyebrow}</p> : null}
          {(titleMain || titleEm) ? (
            <h2 className="section-title" style={{ textAlign: "center", marginBottom: 18 }}>
              {titleMain}
              {titleEm ? <> <em>{titleEm}</em></> : null}
            </h2>
          ) : null}
          <div className="hr" style={{ margin: "18px auto" }} />
          {body ? (
            <p
              className="body-text"
              style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}
            >
              {body}
            </p>
          ) : null}
        </section>
      ) : null}

      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 80px" }}
      >
        <EventsList events={events} />
      </section>
    </>
  )
}
