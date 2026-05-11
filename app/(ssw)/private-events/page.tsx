import type { Metadata } from "next"
import "@/app/ssw/ssw-private-events.css"
import { SswPageBody } from "@/components/ssw/SswPageBody"
import { html } from "@/lib/ssw/prepared/privateEvents"

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

export default function PrivateEventsPage() {
  return <SswPageBody html={html} pageSource="private-events" />
}
