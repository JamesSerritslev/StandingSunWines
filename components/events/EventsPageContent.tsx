import {
  DEFAULT_TICKET_TAILOR_URL,
  TicketTailorEmbed,
} from "@/components/events/TicketTailorEmbed"

type Props = {
  heroBg: string
  eventbriteUrl: string
  ticketTailorUrl?: string
}

export function EventsPageContent({ heroBg, eventbriteUrl, ticketTailorUrl }: Props) {
  const widgetUrl = ticketTailorUrl?.trim() || DEFAULT_TICKET_TAILOR_URL

  return (
    <div className="ssw-page-body ssw-page-body--events ssw-page-body--ready">
      <section className="hero">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url('${heroBg}')` }}
          aria-hidden
        />
        <div className="hero-content">
          <p className="hero-eyebrow">Standing Sun Live · Buellton</p>
          <h1 className="hero-title">
            Events <em>Calendar</em>
          </h1>
          <div className="hero-rule" />
        </div>
      </section>

      <section className="events-intro">
        <p className="eyebrow">What&apos;s On</p>
        <h2 className="section-title">
          Upcoming <em>Nights</em>
        </h2>
        <div className="hr" />
        <p className="body-text">
          Intimate concerts and gatherings at our working winery. Browse upcoming shows and
          grab tickets below.
        </p>
      </section>

      <section className="events-widget-wrap" aria-label="Ticket sales">
        <TicketTailorEmbed boxOfficeUrl={widgetUrl} />
      </section>

      <section className="events-fallback">
        <p className="body-text">
          Prefer Eventbrite?{" "}
          <a href={eventbriteUrl} target="_blank" rel="noopener noreferrer">
            View shows there
          </a>
          .
        </p>
      </section>
    </div>
  )
}
