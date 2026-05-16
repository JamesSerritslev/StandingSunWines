import { sanityImageUrl } from "@/lib/sanity/image-url"
import type { SectionEventsFeature } from "@/lib/sanity/types"

export function SectionEventsFeature({ section }: { section: SectionEventsFeature }) {
  const {
    eyebrow,
    titleMain,
    titleEm,
    body,
    eventbriteUrl,
    eventbriteLabel,
    featureImage,
  } = section

  const imgSrc = featureImage
    ? sanityImageUrl(featureImage, 1800)
    : "/images/ssw/ssw-a797a261eb289a92.jpg"

  return (
    <section className="events" id="events">
      <div id="gallery" className="events-header">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        {(titleMain || titleEm) ? (
          <h2 className="section-title" style={{ textAlign: "center" }}>
            {titleMain}
            {titleEm ? <><br /><em>{titleEm}</em></> : null}
          </h2>
        ) : null}
        <div className="hr" style={{ margin: "18px auto" }} />
        {body ? <p className="body-text">{body}</p> : null}
      </div>

      <div className="events-layout">
        <div
          className="event-card"
          onClick={() => (window.location.href = "/events")}
          style={{ cursor: "pointer" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgSrc ?? undefined} alt="Concert at Standing Sun" />
          <div className="event-overlay">
            <div className="event-tag">Standing Sun Live</div>
            <div className="event-title">Music at the Winery</div>
          </div>
        </div>
      </div>

      {eventbriteUrl ? (
        <div className="events-cta">
          <a href={eventbriteUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            {eventbriteLabel ?? "See Upcoming Events on Eventbrite"}
          </a>
        </div>
      ) : null}
    </section>
  )
}
