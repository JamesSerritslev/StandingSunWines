import type { PageSection, SanityPage, SectionEventsList as SectionEventsListType } from "@/lib/sanity/types"
import type { Event } from "@/lib/sanity/types"
import { SectionHero } from "@/components/sections/SectionHero"
import { SectionRichText } from "@/components/sections/SectionRichText"
import { SectionSplit } from "@/components/sections/SectionSplit"
import { SectionEventsFeature } from "@/components/sections/SectionEventsFeature"
import { SectionPrivateEvents } from "@/components/sections/SectionPrivateEvents"
import { SectionContactForm } from "@/components/sections/SectionContactForm"
import { SectionCta } from "@/components/sections/SectionCta"
import { SectionEventsList } from "@/components/sections/SectionEventsList"

interface Props {
  page: SanityPage
  /** Pass events from the server when the page contains a sectionEventsList */
  events?: Event[]
}

function Section({ section, events }: { section: PageSection; events?: Event[] }) {
  switch (section._type) {
    case "sectionHero":
      return <SectionHero section={section} />
    case "sectionRichText":
      return <SectionRichText section={section} />
    case "sectionSplit":
      return <SectionSplit section={section} />
    case "sectionEventsFeature":
      return <SectionEventsFeature section={section} />
    case "sectionPrivateEvents":
      return <SectionPrivateEvents section={section} />
    case "sectionContactForm":
      return <SectionContactForm section={section} />
    case "sectionCta":
      return <SectionCta section={section} />
    case "sectionEventsList":
      return (
        <SectionEventsList
          section={section as SectionEventsListType}
          events={events}
        />
      )
    default:
      return null
  }
}

export function PageBuilder({ page, events }: Props) {
  const sections = page.sections ?? []

  return (
    <main>
      {sections.map((section) => (
        <Section key={section._key} section={section} events={events} />
      ))}
    </main>
  )
}
