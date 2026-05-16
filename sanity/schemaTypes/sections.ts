import { defineField, defineType } from "sanity"

/** Shared sub-fields */
const titleFields = [
  defineField({
    name: "titleMain",
    title: "Title",
    type: "string",
    description: "Main part of the heading",
  }),
  defineField({
    name: "titleEm",
    title: "Title (italic / accent)",
    type: "string",
    description: "Rendered in italic accent colour after the main title",
  }),
]

const eyebrowField = defineField({
  name: "eyebrow",
  title: "Eyebrow label",
  type: "string",
  description: "Small uppercase label above the heading",
})

const bodyTextField = defineField({
  name: "body",
  title: "Body text",
  type: "text",
  rows: 4,
})

const ctaFields = [
  defineField({ name: "ctaLabel", title: "CTA label", type: "string" }),
  defineField({ name: "ctaHref", title: "CTA URL / anchor", type: "string" }),
]

// ─── HERO ────────────────────────────────────────────────────────────────────
export const sectionHeroType = defineType({
  name: "sectionHero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: 'e.g. "Wines · Music · Art"',
      initialValue: "Wines · Music · Art",
    }),
    defineField({
      name: "ctas",
      title: "Call-to-action buttons",
      type: "array",
      of: [
        {
          type: "object",
          name: "cta",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({
              name: "href",
              title: "URL / anchor",
              type: "string",
            }),
            defineField({
              name: "variant",
              title: "Style",
              type: "string",
              options: {
                list: [
                  { title: "Primary (filled)", value: "primary" },
                  { title: "Outline", value: "outline" },
                ],
                layout: "radio",
              },
              initialValue: "primary",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    }),
  ],
  preview: { select: { title: "tagline" }, prepare: (s) => ({ title: `Hero — ${s.title}` }) },
})

// ─── RICH TEXT BLOCK ─────────────────────────────────────────────────────────
export const sectionRichTextType = defineType({
  name: "sectionRichText",
  title: "Rich Text Block",
  type: "object",
  fields: [
    eyebrowField,
    ...titleFields,
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "backgroundColor",
      title: "Background",
      type: "string",
      options: {
        list: [
          { title: "Dark (void)", value: "dark" },
          { title: "Medium dark", value: "medium" },
          { title: "Light (cream)", value: "light" },
        ],
        layout: "radio",
      },
      initialValue: "dark",
    }),
  ],
  preview: {
    select: { title: "titleMain", subtitle: "titleEm" },
    prepare: (s) => ({ title: `Text — ${s.title}${s.subtitle ? ` ${s.subtitle}` : ""}` }),
  },
})

// ─── SPLIT CONTENT ───────────────────────────────────────────────────────────
export const sectionSplitType = defineType({
  name: "sectionSplit",
  title: "Split Content (image + text)",
  type: "object",
  fields: [
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "About / Winery (photo left)", value: "about" },
          { title: "Winemaker (photo right)", value: "winemaker" },
        ],
        layout: "radio",
      },
      initialValue: "about",
    }),
    defineField({
      name: "image",
      title: "Photo (overrides default background)",
      type: "image",
      options: { hotspot: true },
    }),
    eyebrowField,
    ...titleFields,
    defineField({
      name: "body",
      title: "Body paragraphs",
      type: "array",
      of: [{ type: "block" }],
    }),
    ...ctaFields,
  ],
  preview: {
    select: { title: "titleMain", subtitle: "variant" },
    prepare: (s) => ({ title: `Split — ${s.title ?? ""}`, subtitle: s.subtitle }),
  },
})

// ─── EVENTS FEATURE ──────────────────────────────────────────────────────────
export const sectionEventsFeatureType = defineType({
  name: "sectionEventsFeature",
  title: "Events Feature",
  type: "object",
  fields: [
    eyebrowField,
    ...titleFields,
    bodyTextField,
    defineField({
      name: "eventbriteUrl",
      title: "Eventbrite URL",
      type: "url",
      initialValue: "https://www.eventbrite.com/o/standing-sun-wines-121252721971",
    }),
    defineField({
      name: "eventbriteLabel",
      title: "Eventbrite button label",
      type: "string",
      initialValue: "See Upcoming Events on Eventbrite",
    }),
    defineField({
      name: "featureImage",
      title: "Feature photo",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "titleMain" },
    prepare: (s) => ({ title: `Events Feature — ${s.title ?? ""}` }),
  },
})

// ─── PRIVATE EVENTS ──────────────────────────────────────────────────────────
export const sectionPrivateEventsType = defineType({
  name: "sectionPrivateEvents",
  title: "Private Events",
  type: "object",
  fields: [
    eyebrowField,
    ...titleFields,
    bodyTextField,
    defineField({
      name: "quote",
      title: "Pull quote",
      type: "text",
      rows: 3,
    }),
    ...ctaFields,
  ],
  preview: {
    select: { title: "titleMain" },
    prepare: (s) => ({ title: `Private Events — ${s.title ?? ""}` }),
  },
})

// ─── CONTACT FORM ────────────────────────────────────────────────────────────
export const sectionContactFormType = defineType({
  name: "sectionContactForm",
  title: "Contact Form",
  type: "object",
  fields: [
    eyebrowField,
    ...titleFields,
    defineField({
      name: "pageSource",
      title: "Page identifier (for email subject)",
      type: "string",
      description: 'Used in the email subject line, e.g. "home", "contact", "private-events"',
      initialValue: "home",
    }),
  ],
  preview: {
    select: { title: "titleMain" },
    prepare: (s) => ({ title: `Contact Form — ${s.title ?? ""}` }),
  },
})

// ─── CTA BANNER ──────────────────────────────────────────────────────────────
export const sectionCtaType = defineType({
  name: "sectionCta",
  title: "CTA Banner",
  type: "object",
  fields: [
    eyebrowField,
    ...titleFields,
    bodyTextField,
    ...ctaFields,
    defineField({
      name: "backgroundColor",
      title: "Background",
      type: "string",
      options: {
        list: [
          { title: "Coal (dark)", value: "coal" },
          { title: "Void (very dark)", value: "void" },
          { title: "Cream (light)", value: "cream" },
        ],
        layout: "radio",
      },
      initialValue: "coal",
    }),
  ],
  preview: {
    select: { title: "titleMain", subtitle: "titleEm" },
    prepare: (s) => ({ title: `CTA — ${s.title ?? ""}${s.subtitle ? ` ${s.subtitle}` : ""}` }),
  },
})

// ─── EVENTS LIST ─────────────────────────────────────────────────────────────
// A full events-page-style listing block (used on the Events page)
export const sectionEventsListType = defineType({
  name: "sectionEventsList",
  title: "Events Listing",
  type: "object",
  fields: [
    eyebrowField,
    ...titleFields,
    bodyTextField,
  ],
  preview: {
    select: { title: "titleMain" },
    prepare: (s) => ({ title: `Events Listing — ${s.title ?? "Upcoming Nights"}` }),
  },
})
