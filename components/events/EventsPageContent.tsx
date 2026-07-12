import { TicketTailorEmbed } from "@/components/events/TicketTailorEmbed"

type Props = {
  heroBg: string
  eventbriteUrl: string
  ticketTailorUrl?: string
}

export function EventsPageContent({ heroBg, eventbriteUrl, ticketTailorUrl }: Props) {
  const hasTicketTailor = Boolean(ticketTailorUrl?.trim())

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
          Intimate concerts and gatherings at our working winery. Tickets for upcoming
          nights are available on Eventbrite.
        </p>
      </section>

      {hasTicketTailor ? (
        <section className="events-widget-wrap" aria-label="Ticket sales">
          <TicketTailorEmbed boxOfficeUrl={ticketTailorUrl} />
        </section>
      ) : null}

      <section className="events-fallback">
        <p className="eyebrow">Tickets</p>
        <h2 className="section-title">
          View on <em>Eventbrite</em>
        </h2>
        <div className="hr" />
        <p className="body-text">
          New shows and ticket links are posted on Eventbrite. Check upcoming nights and grab
          tickets there.
        </p>
        <a
          href={eventbriteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          View on Eventbrite
        </a>
      </section>
    </div>
  )
}
