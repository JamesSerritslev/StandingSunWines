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

const PAGE_ROUTES: Record<string, string> = {
  home: "/",
  winery: "/winery",
  contact: "/contact",
  "private-events": "/private-events",
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
            filter: `_type == "pageImages" && pageKey == "home"`,
          },
          {
            route: "/winery",
            filter: `_type == "pageImages" && pageKey == "winery"`,
          },
          {
            route: "/contact",
            filter: `_type == "pageImages" && pageKey == "contact"`,
          },
          {
            route: "/private-events",
            filter: `_type == "pageImages" && pageKey == "private-events"`,
          },
          {
            route: "/events/:slug",
            filter: `_type == "event" && slug.current == $slug`,
          },
        ]),

        locations: {
          pageImages: defineLocations({
            select: { pageTitle: "pageTitle", pageKey: "pageKey" },
            resolve: (doc) => {
              const key = doc?.pageKey as string | undefined
              const href = key ? PAGE_ROUTES[key] : undefined
              return {
                locations: href
                  ? [{ title: `${(doc?.pageTitle as string) || "Page"} (images)`, href }]
                  : [],
              }
            },
          }),
          pageText: defineLocations({
            select: { pageTitle: "pageTitle", pageKey: "pageKey" },
            resolve: (doc) => {
              const key = doc?.pageKey as string | undefined
              const href = key ? PAGE_ROUTES[key] : undefined
              return {
                locations: href
                  ? [{ title: `${(doc?.pageTitle as string) || "Page"} (text)`, href }]
                  : [],
              }
            },
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
