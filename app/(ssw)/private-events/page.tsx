import type { Metadata } from "next"
import "@/app/ssw/ssw-private-events.css"
import { SswPageBody } from "@/components/ssw/SswPageBody"
import { PageBuilder } from "@/components/pages/PageBuilder"
import { html } from "@/lib/ssw/prepared/privateEvents"
import { getPage } from "@/lib/sanity/queries"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Private Events",
  description:
    "Weddings, corporate retreats, and private parties in a 4,000 sq ft working winery in Buellton — Santa Ynez Valley event venue.",
  openGraph: {
    title: "Private Events · Standing Sun Wines",
    description:
      "Industrial winery venue for weddings and private events in Buellton, CA.",
    type: "website",
  },
  alternates: { canonical: "/private-events" },
}

export default async function PrivateEventsPage() {
  const page = await getPage("private-events")

  if (page?.sections?.length) {
    return <PageBuilder page={page} />
  }

  return <SswPageBody html={html} pageSource="private-events" />
}
