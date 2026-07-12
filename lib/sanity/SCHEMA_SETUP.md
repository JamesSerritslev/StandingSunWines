# Sanity Studio Schema for Standing Sun Wines (Events)

This file documents the Sanity schema that the client should create in their Sanity Studio project.

## Event Schema

Create a new schema file in your Sanity Studio: `schemas/event.ts`

```typescript
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Listening Party', value: 'Listening Party' },
          { title: 'Album Release', value: 'Album Release' },
          { title: 'Special Pour', value: 'Special Pour' },
          { title: 'Live Music', value: 'Live Music' },
          { title: 'Guest DJ', value: 'Guest DJ' },
          { title: 'Tasting Event', value: 'Tasting Event' },
          { title: 'Pop-Up', value: 'Pop-Up' },
          { title: 'Private Event', value: 'Private Event' },
          { title: 'Other', value: 'Other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Event Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'time',
      title: 'Event Time',
      type: 'string',
      description: 'e.g., "7pm – 10pm" or "Doors at 6pm"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Brief description shown in event listings',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'longDescription',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Detailed description for the event detail page',
    }),
    defineField({
      name: 'image',
      title: 'Event Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Ticket URL',
      type: 'url',
      description: 'Link to ticket purchase or RSVP page (optional)',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Event',
      type: 'boolean',
      description: 'Show this event prominently on the homepage',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Event Date, Ascending',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
    {
      title: 'Event Date, Descending',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      eventType: 'eventType',
      media: 'image',
    },
    prepare(selection) {
      const { title, date, eventType, media } = selection
      return {
        title: title,
        subtitle: `${eventType} — ${date}`,
        media: media,
      }
    },
  },
})
```

## Embedded Studio (this repo)

Sanity Studio is mounted at **`/studio`** (see `sanity.config.ts` and `app/studio/`). Run the Next app locally or deploy it, open `/studio`, and sign in with your Sanity account. You still need **`NEXT_PUBLIC_SANITY_PROJECT_ID`** and **`NEXT_PUBLIC_SANITY_DATASET`** in `.env.local` (or your host’s env) so the studio can talk to your project.

## Events & ticketing

Public event listings and ticket sales are **not** managed in Sanity.

- **Current:** Eventbrite organizer URL in **Site settings** (`eventbriteOrgUrl`), linked from `/events` and the homepage.
- **Planned:** Ticket Tailor box office embed on `/events` via `NEXT_PUBLIC_TICKET_TAILOR_BOX_OFFICE_URL`.

The `event` document type in this studio is optional/legacy and is not published to the website. You can ignore it or remove it from the studio structure when cleaning up.

## Setup Instructions

1. **Create a Sanity project** at [sanity.io](https://www.sanity.io/)
2. **Optional legacy `event` schema** exists in `sanity/schemaTypes/event.ts` but public `/events` uses Ticket Tailor (and Eventbrite until configured), not Sanity documents.
3. **Get your credentials** from the Sanity dashboard:
   - Project ID
   - Dataset name (usually "production")
4. **Add environment variables** where you deploy the site:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
   - `NEXT_PUBLIC_SANITY_DATASET` - Your dataset name (e.g., "production")

## Adding Events (legacy — not used on site)

Sanity `event` documents are **not** displayed on `/events`. Use Eventbrite today and Ticket Tailor (`NEXT_PUBLIC_TICKET_TAILOR_BOX_OFFICE_URL`) for the public calendar.

If you still maintain `event` docs in Studio for internal reference:

1. Log into Sanity Studio
2. Create new "Event" documents
3. Fill in fields and publish

They will **not** appear on the public website unless you re-wire the events page to Sanity.
