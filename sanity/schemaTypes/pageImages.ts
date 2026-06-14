import { defineField, defineType } from "sanity"

/** One document per route — images only. Fixed _id: `images-{pageKey}`. */
export const pageImagesType = defineType({
  name: "pageImages",
  title: "Page images",
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
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "pageImage" }],
      options: { sortable: false },
      description: "Upload replacements for photos on this page. Labels show where each image appears.",
    }),
  ],
  preview: {
    select: { title: "pageTitle" },
    prepare: ({ title }) => ({ title: title ?? "Page images" }),
  },
})
