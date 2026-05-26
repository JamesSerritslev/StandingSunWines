import type { StructureResolver } from "sanity/structure"

const HOST_EVENT_VENUE_STATS_ID = "hostEventVenueStats"
const SITE_SETTINGS_ID = "siteSettings"

const PAGE_IDS = [
  { id: "home", title: "Home", route: "/" },
  { id: "winery", title: "Winery", route: "/winery" },
  { id: "contact", title: "Contact", route: "/contact" },
  { id: "private-events", title: "Private Events", route: "/private-events" },
  { id: "events", title: "Standing Sun Live", route: "/events" },
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id(SITE_SETTINGS_ID)
        .icon(() => "⚙️")
        .schemaType("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId(SITE_SETTINGS_ID)),

      S.divider(),

      S.listItem()
        .title("Pages")
        .icon(() => "📄")
        .child(
          S.list()
            .title("Pages")
            .items(
              PAGE_IDS.map(({ id, title, route }) =>
                S.listItem()
                  .title(`${title} (${route})`)
                  .id(id)
                  .schemaType("page")
                  .child(S.document().schemaType("page").documentId(id).title(title)),
              ),
            ),
        ),

      S.divider(),

      ...S.documentTypeListItems().filter((item) => {
        const id =
          item.getId?.() ?? (item as unknown as { spec?: { id?: string } }).spec?.id
        return (
          id !== "hostEventVenueStats" &&
          id !== "page" &&
          id !== "siteSettings"
        )
      }),

      S.divider(),

      S.listItem()
        .title("Host Event · Venue stats")
        .id(HOST_EVENT_VENUE_STATS_ID)
        .schemaType("hostEventVenueStats")
        .child(
          S.document()
            .schemaType("hostEventVenueStats")
            .documentId(HOST_EVENT_VENUE_STATS_ID),
        ),
    ])
