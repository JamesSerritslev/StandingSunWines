import type { Metadata } from "next"
import { buildOpenGraph } from "@/lib/site-metadata"
import { SswPageBody } from "@/components/ssw/SswPageBody"
import { PageBuilder } from "@/components/pages/PageBuilder"
import { html } from "@/lib/ssw/prepared/home"
import { getPage, getResolvedSiteSettings } from "@/lib/sanity/queries"

export const revalidate = 60

export const metadata: Metadata = {
  title: {
    absolute: "Standing Sun Wines · Santa Barbara County",
  },
  description:
    "Custom crush winery, live music, and private events in Buellton, California: wine, art, and music at the gateway to Santa Ynez Valley.",
  openGraph: buildOpenGraph({
    title: "Standing Sun Wines · Santa Barbara County",
    description:
      "Custom crush winery, live music, and private events in Buellton, California.",
    url: "/",
  }),
  alternates: { canonical: "/" },
}

export default async function HomePage() {
  const [page, site] = await Promise.all([getPage("home"), getResolvedSiteSettings()])

  if (page?.sections?.length) {
    return <PageBuilder page={page} site={site} />
  }

  // Fallback to prepared HTML until the "home" page document is created in Sanity
  return <SswPageBody html={html} pageSource="home" />
}
