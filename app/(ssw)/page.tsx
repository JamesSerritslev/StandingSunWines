import type { Metadata } from "next"
import { SswPageBody } from "@/components/ssw/SswPageBody"
import { html } from "@/lib/ssw/prepared/home"

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

export default function HomePage() {
  return <SswPageBody html={html} pageSource="home" />
}
