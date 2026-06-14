import type { Metadata } from "next"
import { buildOpenGraph } from "@/lib/site-metadata"
import "@/app/ssw/ssw-private-events.css"
import { SswPageBody } from "@/components/ssw/SswPageBody"
import { applyPageContent } from "@/lib/ssw/apply-page-content"
import { html as privateEventsHtml } from "@/lib/ssw/prepared/privateEvents"
import { getPage } from "@/lib/sanity/queries"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Private Events",
  description:
    "Weddings, corporate retreats, and private parties in a 4,000 sq ft working winery in Buellton: Santa Ynez Valley event venue.",
  openGraph: buildOpenGraph({
    title: "Private Events · Standing Sun Wines",
    description:
      "Industrial winery venue for weddings and private events in Buellton, CA.",
    url: "/private-events",
  }),
  alternates: { canonical: "/private-events" },
}

export default async function PrivateEventsPage() {
  const page = await getPage("private-events")
  const html = applyPageContent(privateEventsHtml, page)
  return <SswPageBody html={html} pageSource="private-events" />
}
