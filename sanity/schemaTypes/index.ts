import { type SchemaTypeDefinition } from "sanity"
import { eventType } from "./event"
import { hostEventVenueStatsType } from "./hostEventVenueStats"
import { pageImageType, pageParagraphType } from "./pageContent"
import { pageImagesType } from "./pageImages"
import { pageTextType } from "./pageText"
import { navLinkType, siteSettingsType } from "./siteSettings"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Client-editable (shown in Studio)
    pageImagesType,
    pageTextType,
    pageImageType,
    pageParagraphType,
    // Used by the site API / defaults — hidden from Studio sidebar
    siteSettingsType,
    navLinkType,
    eventType,
    hostEventVenueStatsType,
  ],
}
