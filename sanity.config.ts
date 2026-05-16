/**
 * Sanity Studio mounted at `/studio` (see `app/studio/[[...index]]/page.tsx`).
 * https://www.sanity.io/docs/api-versioning
 */

import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { presentationTool, defineDocuments, defineLocations } from "sanity/presentation"

import { apiVersion, dataset, projectId } from "./sanity/env"
import { schema } from "./sanity/schemaTypes"
import { structure } from "./sanity/structure"

/** Maps page document _id → route */
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
        // In development the studio is hosted on the same Next.js origin.
        // Set SANITY_STUDIO_PREVIEW_ORIGIN in .env.local to override for remote
        // deployments (e.g. "https://www.standingsunwines.com").
        origin:
          typeof process !== "undefined"
            ? (process.env.SANITY_STUDIO_PREVIEW_ORIGIN ?? "http://localhost:3000")
            : "http://localhost:3000",
        draftMode: {
          enable: "/api/draft-mode",
        },
      },
      resolve: {
        // ── Which document to open when viewing a given route ─────────────
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
            // The events list has no single document — open first upcoming event
            filter: `_type == "event"`,
          },
          {
            route: "/events/:slug",
            filter: `_type == "event" && slug.current == $slug`,
          },
        ]),

        // ── Which URL(s) to open when a document is selected ─────────────
        locations: {
          page: defineLocations({
            select: { title: "title", id: "_id" },
            resolve: (doc) => {
              const id = doc?.id as string | undefined
              const href = id ? PAGE_ROUTES[id] : undefined
              return {
                locations: href
                  ? [{ title: (doc?.title as string) || "Page", href }]
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
                    // Also surface on the events list
                    { title: "Events list", href: "/events" },
                  ]
                : [],
            }),
          }),
        },
      },
    }),

    // GROQ playground
    visionTool({
      defaultApiVersion: apiVersion,
      defaultDataset: dataset,
    }),
  ],
})
