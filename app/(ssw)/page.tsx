import type { Metadata } from "next"
import { buildOpenGraph } from "@/lib/site-metadata"
import "@/app/ssw/ssw-base.css"
import { SswPageBody } from "@/components/ssw/SswPageBody"
import { applyPageContent } from "@/lib/ssw/apply-page-content"
import { html as homeHtml } from "@/lib/ssw/prepared/home"
import { getPage } from "@/lib/sanity/queries"

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
  const page = await getPage("home")
  const html = applyPageContent(homeHtml, page)
  return <SswPageBody html={html} pageSource="home" />
}
