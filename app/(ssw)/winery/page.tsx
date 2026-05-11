import type { Metadata } from "next"
import "@/app/ssw/ssw-winery.css"
import { SswPageBody } from "@/components/ssw/SswPageBody"
import { html } from "@/lib/ssw/prepared/winery"

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

export default function WineryPage() {
  return <SswPageBody html={html} pageSource="winery" />
}
