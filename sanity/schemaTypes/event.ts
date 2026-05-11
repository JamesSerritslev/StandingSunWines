import { defineField, defineType } from "sanity"

export const eventType = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Event Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eventType",
      title: "Event Type",
      type: "string",
      options: {
        list: [
          { title: "Listening Party", value: "Listening Party" },
          { title: "Album Release", value: "Album Release" },
          { title: "Special Pour", value: "Special Pour" },
          { title: "Live Music", value: "Live Music" },
          { title: "Guest DJ", value: "Guest DJ" },
          { title: "Tasting Event", value: "Tasting Event" },
          { title: "Pop-Up", value: "Pop-Up" },
          { title: "Private Event", value: "Private Event" },
          { title: "Other", value: "Other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Event Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "time",
      title: "Event Time",
      type: "string",
      description: 'e.g., "7pm – 10pm" or "Doors at 6pm"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
      description: "Brief description shown in event listings",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "longDescription",
      title: "Full Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Detailed description for the event detail page",
    }),
    defineField({
      name: "image",
      title: "Event Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "ticketUrl",
      title: "Ticket URL",
      type: "url",
      description: "Link to ticket purchase or RSVP page (optional)",
    }),
    defineField({
      name: "featured",
      title: "Featured Event",
      type: "boolean",
      description: "Show this event prominently on the homepage",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Event Date, Ascending",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
    {
      title: "Event Date, Descending",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      eventType: "eventType",
      media: "image",
    },
    prepare(selection) {
      const { title, date, eventType, media } = selection
      return {
        title: title ?? "",
        subtitle: `${eventType ?? ""} — ${date ?? ""}`,
        media,
      }
    },
  },
})
