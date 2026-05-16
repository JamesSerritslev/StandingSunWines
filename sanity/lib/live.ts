/**
 * sanityFetch  — use this instead of client.fetch() everywhere so that:
 *   • Draft Mode automatically switches to previewDrafts perspective
 *   • stega encoding is injected for Presentation click-to-edit
 *   • The Live Content API keeps Presentation preview in sync
 *
 * SanityLive   — render once in the root layout to enable live updates.
 *
 * Requires SANITY_API_READ_TOKEN (server-only env) with "viewer" permission
 * for draft previews. Without it, only published content is shown.
 */
import { defineLive } from "next-sanity/live"
import { client } from "@/lib/sanity/client"

if (!client) {
  throw new Error(
    "Sanity client is null — set NEXT_PUBLIC_SANITY_PROJECT_ID in your environment.",
  )
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Server-only token — gives Presentation access to draft documents.
  // Generate at https://www.sanity.io/manage → API → Tokens (viewer role).
  serverToken: process.env.SANITY_API_READ_TOKEN,
  // Optional browser token for real-time updates in the Presentation iframe.
  browserToken: process.env.NEXT_PUBLIC_SANITY_TOKEN,
})
