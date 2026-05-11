import { defineField, defineType } from "sanity"

const statField = (
  name: string,
  title: string,
  defaults: { value: string; label: string },
) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({
        name: "value",
        title: "Primary text",
        type: "string",
        description: 'Large orange text (e.g. "TBD", "85", "4hr+")',
        initialValue: defaults.value,
      }),
      defineField({
        name: "label",
        title: "Caption",
        type: "string",
        description: "Small uppercase label under the value",
        initialValue: defaults.label,
      }),
    ],
  })

export const hostEventVenueStatsType = defineType({
  name: "hostEventVenueStats",
  title: "Host Event · Venue stats",
  type: "document",
  description:
    "Four tiles on the Host Your Event page (Standing, Seated, Sq ft, Min booking)",
  fields: [
    statField("standing", "Standing capacity", {
      value: "TBD",
      label: "Standing Capacity",
    }),
    statField("seated", "Seated capacity", {
      value: "TBD",
      label: "Seated Capacity",
    }),
    statField("squareFootage", "Square footage", {
      value: "TBD",
      label: "Square Footage",
    }),
    statField("minBooking", "Minimum booking", {
      value: "4hr+",
      label: "Min Booking",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Host event venue stats",
        subtitle: "Standing · Seated · Sq ft · Min booking",
      }
    },
  },
})
