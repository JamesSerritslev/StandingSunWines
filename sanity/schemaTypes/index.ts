import { type SchemaTypeDefinition } from "sanity"
import { eventType } from "./event"
import { hostEventVenueStatsType } from "./hostEventVenueStats"
import { pageType } from "./page"
import { navLinkType, siteSettingsType } from "./siteSettings"
import {
  sectionHeroType,
  sectionInteriorHeroType,
  sectionStandingSunBandType,
  sectionRichTextType,
  sectionSplitType,
  sectionEventsFeatureType,
  sectionPrivateEventsType,
  sectionVenueStatsType,
  sectionContactFormType,
  sectionCtaType,
  sectionEventsListType,
} from "./sections"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    siteSettingsType,
    navLinkType,
    pageType,
    eventType,
    hostEventVenueStatsType,
    // Section object types (used inside page.sections)
    sectionHeroType,
    sectionInteriorHeroType,
    sectionStandingSunBandType,
    sectionRichTextType,
    sectionSplitType,
    sectionEventsFeatureType,
    sectionPrivateEventsType,
    sectionVenueStatsType,
    sectionContactFormType,
    sectionCtaType,
    sectionEventsListType,
  ],
}
