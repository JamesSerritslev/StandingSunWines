import { defineField, defineType } from "sanity"

/**
 * Page document — one per marketing route.
 * Fixed _id values: "home" | "winery" | "contact" | "private-events"
 *
 * Sections are polymorphic blocks that map to individual React components.
 * Add / remove / reorder sections in Presentation to change the page layout.
 */
export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Route slug",
      type: "slug",
      description: 'URL path, e.g. "/" for home, "/winery" for the winery page',
      options: { source: "title", maxLength: 96 },
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "sections",
      title: "Page sections",
      type: "array",
      of: [
        { type: "sectionHero" },
        { type: "sectionRichText" },
        { type: "sectionSplit" },
        { type: "sectionEventsFeature" },
        { type: "sectionPrivateEvents" },
        { type: "sectionContactForm" },
        { type: "sectionCta" },
        { type: "sectionEventsList" },
      ],
      description:
        "Add, remove, and reorder sections. Each section type maps to a different visual component.",
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: (s) => ({
      title: s.title ?? "Untitled page",
      subtitle: s.slug ?? "",
    }),
  },
})
