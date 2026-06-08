import type {
  PageSection,
  SanityPage,
  SectionEventsList as SectionEventsListType,
} from "@/lib/sanity/types"
import type { Event } from "@/lib/sanity/types"
import type { ResolvedSiteSettings } from "@/lib/site-settings-resolve"
import { SectionHero } from "@/components/sections/SectionHero"
import { SectionInteriorHero } from "@/components/sections/SectionInteriorHero"
import { SectionStandingSunBand } from "@/components/sections/SectionStandingSunBand"
import { SectionRichText } from "@/components/sections/SectionRichText"
import { SectionSplit } from "@/components/sections/SectionSplit"
import { SectionEventsFeature } from "@/components/sections/SectionEventsFeature"
import { SectionPrivateEvents } from "@/components/sections/SectionPrivateEvents"
import { SectionVenueStats } from "@/components/sections/SectionVenueStats"
import { SectionContactForm } from "@/components/sections/SectionContactForm"
import { SectionCta } from "@/components/sections/SectionCta"
import { SectionEventsList } from "@/components/sections/SectionEventsList"
import { resolveHostEventVenueStats } from "@/lib/host-event-venue-stats"
import { getHostEventVenueStats } from "@/lib/sanity/queries"

interface Props {
  page: SanityPage
  events?: Event[]
  site: ResolvedSiteSettings
}

export async function PageBuilder({ page, events = [], site }: Props) {
  const sections = page.sections ?? []
  const needsVenue = sections.some((s) => s._type === "sectionVenueStats")
  const venueDoc = needsVenue ? await getHostEventVenueStats() : null
  const venueRows = resolveHostEventVenueStats(venueDoc)

  return (
    <main>
      {sections.map((section) => (
        <Piece
          key={section._key}
          section={section}
          events={events}
          site={site}
          venueRows={venueRows}
        />
      ))}
    </main>
  )
}

function Piece({
  section,
  events,
  site,
  venueRows,
}: {
  section: PageSection
  events: Event[]
  site: ResolvedSiteSettings
  venueRows: ReturnType<typeof resolveHostEventVenueStats>
}) {
  switch (section._type) {
    case "sectionHero":
      return <SectionHero section={section} />
    case "sectionInteriorHero":
      return (
        <SectionInteriorHero
          section={section}
          interiorHeroFallback={site.interiorHeroUrl}
        />
      )
    case "sectionStandingSunBand":
      return (
        <SectionStandingSunBand
          section={section}
          defaultEventbriteUrl={site.eventbriteOrgUrl}
        />
      )
    case "sectionRichText":
      return <SectionRichText section={section} />
    case "sectionSplit":
      return <SectionSplit section={section} />
    case "sectionEventsFeature":
      return (
        <SectionEventsFeature
          section={section}
          defaultEventbriteUrl={site.eventbriteOrgUrl}
        />
      )
    case "sectionPrivateEvents":
      return <SectionPrivateEvents section={section} />
    case "sectionVenueStats":
      return <SectionVenueStats section={section} stats={venueRows} />
    case "sectionContactForm":
      return <SectionContactForm section={section} />
    case "sectionCta":
      return <SectionCta section={section} />
    case "sectionEventsList":
      return (
        <SectionEventsList
          section={section as SectionEventsListType}
          events={events}
          emptyMessage={site.eventsListEmptyMessage}
          detailsLabel={site.eventsListDetailsLabel}
        />
      )
    default:
      return null
  }
}
