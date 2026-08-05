import { ShowStickyCta } from "@/components/events/ShowStickyCta"
import { TicketTailorEmbed } from "@/components/events/TicketTailorEmbed"
import { SswMapboxMap } from "@/components/ssw/SswMapboxMap"
import type { Show, ShowImage } from "@/lib/shows"
import { STANDING_SUN_LOCATION } from "@/lib/site-location"

type Props = {
  show: Show
}

function GalleryBand({ images }: { images: ShowImage[] }) {
  if (images.length === 0) return null

  return (
    <section className="show-gallery" aria-label="Inside the venue">
      {images.map((image) => (
        <div key={image.src} className="show-gallery-item">
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            style={image.focus ? { objectPosition: image.focus } : undefined}
          />
        </div>
      ))}
    </section>
  )
}

/** Reusable Standing Sun Live show page. Venue photography is scattered between
 *  the story and details sections, all of it ahead of the ticket widget. */
export function ShowLandingContent({ show }: Props) {
  const hasSchedule = Boolean(show.dateLine || show.timeLine)
  const galleryTop = show.gallery.slice(0, 2)
  const galleryBottom = show.gallery.slice(2)

  return (
    <div className="ssw-page-body ssw-page-body--show ssw-page-body--ready">
      <section className="show-hero">
        <div
          className="show-hero-bg"
          style={{
            backgroundImage: `url('${show.heroImage}')`,
            backgroundPosition: show.heroFocus ?? "center",
          }}
          aria-hidden
        />
        <div className="show-hero-inner">
          <div className="show-hero-content">
            <p className="eyebrow">{show.eyebrow}</p>
            <h1 className="show-hero-title">
              {show.title}
              {show.titleAccent ? (
                <>
                  {" "}
                  <em>{show.titleAccent}</em>
                </>
              ) : null}
            </h1>
            {hasSchedule ? (
              <p className="show-hero-schedule">
                {show.dateLine}
                {show.dateLine && show.timeLine ? <span aria-hidden> · </span> : null}
                {show.timeLine}
              </p>
            ) : null}
            <p className="show-hero-subhead">{show.heroSubhead}</p>
            <a href="#tickets" className="btn btn-primary show-hero-cta">
              Get Tickets
            </a>
            {show.bio ? <p className="show-bio">{show.bio}</p> : null}
          </div>
          <div className="show-hero-portrait">
            <img src={show.artistImage.src} alt={show.artistImage.alt} />
          </div>
        </div>
      </section>

      <section className="show-story">
        <div className="show-story-copy">
          <h2 className="section-title">
            Live at the <em>Winery</em>
          </h2>
          <div className="hr show-hr-left" />
          {show.story.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="body-text show-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="show-story-image">
          <img src={show.storyImage.src} alt={show.storyImage.alt} loading="lazy" />
        </div>
      </section>

      <section className="show-gallery-intro" aria-label="The venue">
        <h2 className="section-title">
          Inside the <em>Venue</em>
        </h2>
      </section>

      <GalleryBand images={galleryTop} />

      <section className="show-details">
        <div className="show-details-grid">
          {show.details.map((detail) => (
            <div key={detail.label} className="show-detail">
              <p className="show-detail-label">{detail.label}</p>
              <p className="show-detail-value">{detail.value}</p>
            </div>
          ))}
        </div>
      </section>

      <GalleryBand images={galleryBottom} />

      <section className="show-tickets" id="tickets">
        <p className="eyebrow">Tickets</p>
        <h2 className="section-title">
          {show.ticketsHeading} <em>{show.ticketsAccent}</em>
        </h2>
        <div className="hr" />
        <p className="body-text show-tickets-intro">{show.ticketsIntro}</p>
        <div className="show-tickets-widget">
          <TicketTailorEmbed boxOfficeUrl={show.ticketUrl} />
        </div>
      </section>

      <section className="show-venue" id="venue" aria-label="Venue">
        <p className="eyebrow">Getting Here</p>
        <h2 className="section-title">
          Standing Sun <em>Wines</em>
        </h2>
        <div className="hr" />
        <p className="body-text show-venue-address">
          {STANDING_SUN_LOCATION.street}
          <br />
          {STANDING_SUN_LOCATION.cityStateZip}
        </p>
        <div className="show-venue-map">
          <SswMapboxMap />
        </div>
      </section>

      <ShowStickyCta label="Get Tickets" targetId="tickets" />
    </div>
  )
}
