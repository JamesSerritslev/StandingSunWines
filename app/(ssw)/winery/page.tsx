import type { Metadata } from "next"
import { buildOpenGraph } from "@/lib/site-metadata"
import "@/app/ssw/ssw-winery.css"
import { SswPageBody } from "@/components/ssw/SswPageBody"
import { PageBuilder } from "@/components/pages/PageBuilder"
import { html } from "@/lib/ssw/prepared/winery"
import { getPage, getResolvedSiteSettings } from "@/lib/sanity/queries"

export const revalidate = 60

export const metadata: Metadata = {
  title: "The Winery",
  description:
    "4,000 sq ft industrial winery and custom crush facility in Buellton, Santa Barbara County: production, Winemaker in Residence, and private events.",
  openGraph: buildOpenGraph({
    title: "The Winery · Standing Sun Wines",
    description:
      "Industrial winery and custom crush at the gateway to Santa Ynez Valley.",
    url: "/winery",
  }),
  alternates: { canonical: "/winery" },
}

export default async function WineryPage() {
  const [page, site] = await Promise.all([getPage("winery"), getResolvedSiteSettings()])

  if (page?.sections?.length) {
    return <PageBuilder page={page} site={site} />
  }

  return <SswPageBody html={html} pageSource="winery" />
}
