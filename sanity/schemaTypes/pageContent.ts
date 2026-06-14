import { defineField, defineType } from "sanity"

/** Editable image slot — `key` maps to a fixed place on the live page. */
export const pageImageType = defineType({
  name: "pageImage",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Where this appears",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "key",
      title: "Key",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "label", media: "image", subtitle: "alt" },
  },
})

/** Editable paragraph — `key` maps to a fixed place on the live page. */
export const pageParagraphType = defineType({
  name: "pageParagraph",
  title: "Paragraph",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Where this appears",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "key",
      title: "Key",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 5,
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "text" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? `${subtitle.slice(0, 72)}${subtitle.length > 72 ? "…" : ""}` : "",
    }),
  },
})
