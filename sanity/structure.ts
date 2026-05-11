import type { StructureResolver } from "sanity/structure"

const HOST_EVENT_VENUE_STATS_ID = "hostEventVenueStats"

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Host Event · Venue stats")
        .id(HOST_EVENT_VENUE_STATS_ID)
        .schemaType("hostEventVenueStats")
        .child(
          S.document()
            .schemaType("hostEventVenueStats")
            .documentId(HOST_EVENT_VENUE_STATS_ID),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id =
          item.getId?.() ?? (item as unknown as { spec?: { id?: string } }).spec?.id
        return id !== "hostEventVenueStats"
      }),
    ])
