import { createClient } from "next-sanity"

const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "").trim()

/** Only constructed when a project id exists — avoids next-sanity throwing at import time during builds without env. */
export const client =
  projectId.length > 0
    ? createClient({
        projectId,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
        apiVersion:
          process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2024-01-01",
        useCdn: process.env.NODE_ENV === "production",
      })
    : null
