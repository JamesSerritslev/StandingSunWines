import { type SchemaTypeDefinition } from "sanity"
import { eventType } from "./event"
import { hostEventVenueStatsType } from "./hostEventVenueStats"
import { pageType } from "./page"
import {
  sectionHeroType,
  sectionRichTextType,
  sectionSplitType,
  sectionEventsFeatureType,
  sectionPrivateEventsType,
  sectionContactFormType,
  sectionCtaType,
  sectionEventsListType,
} from "./sections"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    pageType,
    eventType,
    hostEventVenueStatsType,
    // Section object types (used inside page.sections)
    sectionHeroType,
    sectionRichTextType,
    sectionSplitType,
    sectionEventsFeatureType,
    sectionPrivateEventsType,
    sectionContactFormType,
    sectionCtaType,
    sectionEventsListType,
  ],
}
