import { defineEnableDraftMode } from "next-sanity/draft-mode"
import { client } from "@/lib/sanity/client"

const token = process.env.SANITY_API_READ_TOKEN

export const { GET } = client && token
  ? defineEnableDraftMode({
      client: client.withConfig({ token }),
    })
  : {
      GET: async () =>
        new Response(
          "Draft mode is not configured. Set SANITY_API_READ_TOKEN and redeploy.",
          { status: 503 },
        ),
    }
