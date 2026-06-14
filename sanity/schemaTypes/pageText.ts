import { defineField, defineType } from "sanity"

/** One document per route — paragraphs only. Fixed _id: `text-{pageKey}`. */
export const pageTextType = defineType({
  name: "pageText",
  title: "Page text",
  type: "document",
  fields: [
    defineField({
      name: "pageKey",
      title: "Page key",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "pageTitle",
      title: "Page",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "paragraphs",
      title: "Paragraphs",
      type: "array",
      of: [{ type: "pageParagraph" }],
      options: { sortable: false },
      description: "Edit body copy only. Headings and buttons are not listed here.",
    }),
  ],
  preview: {
    select: { title: "pageTitle" },
    prepare: ({ title }) => ({ title: title ?? "Page text" }),
  },
})
