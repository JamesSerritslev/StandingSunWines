import type { Metadata } from "next"
import "@/app/ssw/ssw-winery.css"
import { SswPageBody } from "@/components/ssw/SswPageBody"
import { PageBuilder } from "@/components/pages/PageBuilder"
import { html } from "@/lib/ssw/prepared/winery"
import { getPage } from "@/lib/sanity/queries"

export const revalidate = 60

export const metadata: Metadata = {
  title: "The Winery",
  description:
    "4,000 sq ft industrial winery and custom crush facility in Buellton, Santa Barbara County — production, Winemaker in Residence, and private events.",
  openGraph: {
    title: "The Winery · Standing Sun Wines",
    description:
      "Industrial winery and custom crush at the gateway to Santa Ynez Valley.",
    type: "website",
  },
  alternates: { canonical: "/winery" },
}

export default async function WineryPage() {
  const page = await getPage("winery")

  if (page?.sections?.length) {
    return <PageBuilder page={page} />
  }

  return <SswPageBody html={html} pageSource="winery" />
}
