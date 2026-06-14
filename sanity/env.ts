/** Must be a valid pinned date for the Content API (see https://www.sanity.io/docs/api-versioning). Arbitrary/future dates break Vision (“no query” / traceId). */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2024-01-01"

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

/**
 * Site origin for Sanity Presentation (runs in the browser).
 * Server-only vars like SANITY_STUDIO_PREVIEW_ORIGIN are not visible here —
 * use NEXT_PUBLIC_SITE_URL or NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_ORIGIN on Vercel.
 */
export function getStudioPreviewOrigin(): string {
  const explicit =
    process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_ORIGIN?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, "")
  if (typeof window !== "undefined") return window.location.origin
  return "http://localhost:3000"
}

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
