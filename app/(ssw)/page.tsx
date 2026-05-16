import type { Metadata } from "next"
import { SswPageBody } from "@/components/ssw/SswPageBody"
import { PageBuilder } from "@/components/pages/PageBuilder"
import { html } from "@/lib/ssw/prepared/home"
import { getPage } from "@/lib/sanity/queries"

export const revalidate = 60

export const metadata: Metadata = {
  title: {
    absolute: "Standing Sun Wines · Santa Barbara County",
  },
  description:
    "Custom crush winery, live music, and private events in Buellton, California — wine, art, and music at the gateway to Santa Ynez Valley.",
  openGraph: {
    title: "Standing Sun Wines · Santa Barbara County",
    description:
      "Custom crush winery, live music, and private events in Buellton, California.",
    type: "website",
  },
  alternates: { canonical: "/" },
}

export default async function HomePage() {
  const page = await getPage("home")

  if (page?.sections?.length) {
    return <PageBuilder page={page} />
  }

  // Fallback to prepared HTML until the "home" page document is created in Sanity
  return <SswPageBody html={html} pageSource="home" />
}
