import type { Metadata } from "next"
import "@/app/ssw/ssw-contact.css"
import { SswPageBody } from "@/components/ssw/SswPageBody"
import { html } from "@/lib/ssw/prepared/contact"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Standing Sun Wines in Buellton, California — custom crush, private events, and general inquiries.",
  openGraph: {
    title: "Contact · Standing Sun Wines",
    description: "Get in touch with Standing Sun Wines in Buellton, CA.",
    type: "website",
  },
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return <SswPageBody html={html} pageSource="contact" />
}
