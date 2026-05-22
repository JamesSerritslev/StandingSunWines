/**
 * Sanity Studio mounted at `/studio` (see `app/studio/[[...index]]/page.tsx`).
 * https://www.sanity.io/docs/api-versioning
 */

import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { presentationTool, defineDocuments, defineLocations } from "sanity/presentation"
import { structureTool } from "sanity/structure"

import { apiVersion, dataset, projectId } from "./sanity/env"
import { schema } from "./sanity/schemaTypes"
import { structure } from "./sanity/structure"

/** Maps page document _id → route */
const PAGE_ROUTES: Record<string, string> = {
  home: "/",
  winery: "/winery",
  contact: "/contact",
  "private-events": "/private-events",
  events: "/events",
}

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),

    presentationTool({
      previewUrl: {
        origin:
          typeof process !== "undefined"
            ? (process.env.SANITY_STUDIO_PREVIEW_ORIGIN ?? "http://localhost:3000")
            : "http://localhost:3000",
        draftMode: {
          enable: "/api/draft-mode",
        },
      },
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: "/",
            filter: `_type == "page" && _id == "home"`,
          },
          {
            route: "/winery",
            filter: `_type == "page" && _id == "winery"`,
          },
          {
            route: "/contact",
            filter: `_type == "page" && _id == "contact"`,
          },
          {
            route: "/private-events",
            filter: `_type == "page" && _id == "private-events"`,
          },
          {
            route: "/events",
            filter: `_type == "page" && _id == "events"`,
          },
          {
            route: "/events/:slug",
            filter: `_type == "event" && slug.current == $slug`,
          },
        ]),

        locations: {
          siteSettings: defineLocations({
            select: { sid: "_id" },
            resolve: () => ({
              locations: [
                { title: "Home (global chrome preview)", href: "/" },
                { title: "Events list", href: "/events" },
                { title: "Private Events", href: "/private-events" },
                { title: "Contact", href: "/contact" },
              ],
            }),
          }),
          page: defineLocations({
            select: { title: "title", id: "_id" },
            resolve: (doc) => {
              const id = doc?.id as string | undefined
              const href = id ? PAGE_ROUTES[id] : undefined
              return {
                locations: href ? [{ title: (doc?.title as string) || "Page", href }] : [],
              }
            },
          }),
          hostEventVenueStats: defineLocations({
            select: { sid: "_id" },
            resolve: () => ({
              locations: [{ title: "Private Events (preview)", href: "/private-events" }],
            }),
          }),
          event: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [
                    {
                      title: (doc.title as string) || "Event",
                      href: `/events/${doc.slug as string}`,
                    },
                    { title: "Events list", href: "/events" },
                  ]
                : [],
            }),
          }),
        },
      },
    }),

    visionTool({
      defaultApiVersion: apiVersion,
      defaultDataset: dataset,
    }),
  ],
})
