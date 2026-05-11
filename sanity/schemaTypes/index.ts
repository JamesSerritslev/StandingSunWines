import { type SchemaTypeDefinition } from "sanity"
import { eventType } from "./event"
import { hostEventVenueStatsType } from "./hostEventVenueStats"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [eventType, hostEventVenueStatsType],
}
