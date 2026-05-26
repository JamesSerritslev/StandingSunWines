import { defineField, defineType } from "sanity"

const footerLinksColumnFields = [
  defineField({
    name: "links",
    title: "Links",
    type: "array",
    of: [
      {
        type: "object",
        name: "footerLink",
        fields: [
          defineField({ name: "label", type: "string", validation: (R) => R.required() }),
          defineField({ name: "href", type: "string", validation: (R) => R.required() }),
        ],
        preview: { select: { title: "label", subtitle: "href" } },
      },
    ],
  }),
]

/** Nav row — exported as reusable object type `navLink`. */
export const navLinkType = defineType({
  name: "navLink",
  title: "Nav link",
  type: "object",
  fields: [
    defineField({ name: "key", title: "Stable key", type: "string", validation: (R) => R.required() }),
    defineField({ name: "label", title: "Label", type: "string", validation: (R) => R.required() }),
    defineField({ name: "href", title: "URL or path / hash", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: [
          { title: "Internal Next.js route", value: "internal" },
          { title: "External (new tab)", value: "external" },
          { title: "Anchor / hash on home", value: "anchor" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
    }),
    defineField({
      name: "styleVariant",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "CTA pill (Spanish)", value: "cta" },
          { title: "Sister-site accent", value: "analogue" },
        ],
        layout: "radio",
      },
      initialValue: "default",
    }),
    defineField({
      name: "activePathPrefixes",
      title: "Highlight active when path equals (optional)",
      type: "array",
      of: [{ type: "string" }],
      description: 'Matches pathname exactly — e.g. "/", "/winery", "/private-events", "/contact".',
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
})

/** Singleton `_id`: siteSettings */
export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "brandName",
      title: "Organization / brand name",
      type: "string",
      initialValue: "Standing Sun Wines",
    }),
    defineField({
      name: "navLogo",
      title: "Nav logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "navLogoAlt",
      title: "Nav logo alt text",
      type: "string",
      initialValue: "Standing Sun Wines",
    }),
    defineField({
      name: "footerLogo",
      title: "Footer logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "footerLogoAlt",
      title: "Footer logo alt text",
      type: "string",
      initialValue: "Standing Sun Wines",
    }),
    defineField({
      name: "navigation",
      title: "Navigation",
      type: "array",
      of: [{ type: "navLink" }],
    }),
    defineField({
      name: "footerColumnLeft",
      title: "Footer — left column links",
      type: "object",
      fields: footerLinksColumnFields,
    }),
    defineField({
      name: "footerColumnRight",
      title: "Footer — right column links",
      type: "object",
      fields: footerLinksColumnFields,
    }),
    defineField({
      name: "footerAddressTitle",
      title: "Footer address heading",
      type: "string",
      initialValue: "Standing Sun Wines",
    }),
    defineField({
      name: "footerAddressLines",
      title: "Footer address lines",
      type: "array",
      of: [{ type: "string" }],
      description: "Each string is one line (e.g. street, city/state/ZIP)",
    }),
    defineField({
      name: "copyrightSuffix",
      title: "Copyright line (shown after © year)",
      type: "string",
      initialValue: "Standing Sun Wines · All Rights Reserved · Buellton, California",
    }),

    defineField({
      name: "eventbriteOrgUrl",
      title: "Eventbrite organizer URL",
      type: "url",
      initialValue: "https://www.eventbrite.com/o/standing-sun-wines-121252721971",
    }),
    defineField({
      name: "sisterSiteUrl",
      title: "Sister site URL (Analogue Room)",
      type: "url",
      initialValue: "https://www.analogueroom.com",
    }),

    defineField({
      name: "interiorHeroImageFallback",
      title: "Interior hero image URL fallback",
      type: "string",
      description: "Used when no image asset uploaded below.",
      initialValue: "/images/interior.jpeg",
    }),
    defineField({
      name: "interiorHeroImage",
      title: "Interior hero image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "eventDetailBackLabel",
      title: "[Event detail] Back link label",
      type: "string",
      initialValue: "← Back to events",
    }),
    defineField({
      name: "eventDetailWhenLabel",
      title: '[Event detail] "When" label',
      type: "string",
      initialValue: "When",
    }),

    defineField({
      name: "eventsListEmptyMessage",
      title: "[Events list] Empty state helper text",
      type: "text",
      rows: 3,
      initialValue:
        "Showing sample placeholders. Published events with a today or future event date appear here. Drafts and past dates are hidden.",
    }),
    defineField({
      name: "eventsListDetailsLabel",
      title: '[Events list] "Details" button label',
      type: "string",
      initialValue: "Details",
    }),

    defineField({
      name: "newsletterEyebrow",
      title: "[Newsletter] Eyebrow",
      type: "string",
      initialValue: "Updates",
    }),
    defineField({
      name: "newsletterTitle",
      title: "[Newsletter] Title",
      type: "string",
      initialValue: "Hear what's spinning",
    }),
    defineField({
      name: "newsletterSubmitLabel",
      title: "[Newsletter] Submit button label",
      type: "string",
      initialValue: "Join the list",
    }),

    defineField({
      name: "seoDefaultTitle",
      title: "Fallback page title",
      type: "string",
      description: 'Used where route metadata has no Sanity title.',
      initialValue: "Standing Sun Wines · Santa Barbara County",
    }),
    defineField({
      name: "seoDefaultDescription",
      title: "Default meta description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "seoOgImage",
      title: "Default Open Graph image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "schemaDescription",
      title: "[Schema.org] Winery description",
      type: "text",
      rows: 3,
      initialValue:
        "Custom crush winery, live music venue, and private event space in Buellton, California.",
    }),
    defineField({
      name: "schemaStreetAddress",
      title: "[Schema.org] Street",
      type: "string",
      initialValue: "92 2nd Street",
    }),
    defineField({
      name: "schemaAddressLocality",
      title: "[Schema.org] City",
      type: "string",
      initialValue: "Buellton",
    }),
    defineField({
      name: "schemaAddressRegion",
      title: "[Schema.org] Region",
      type: "string",
      initialValue: "CA",
    }),
    defineField({
      name: "schemaPostalCode",
      title: "[Schema.org] Postal code",
      type: "string",
      initialValue: "93427",
    }),
    defineField({
      name: "schemaAddressCountry",
      title: "[Schema.org] Country",
      type: "string",
      initialValue: "US",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
})
