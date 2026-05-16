import type { Metadata } from "next"
import "@/app/ssw/ssw-contact.css"
import { SswPageBody } from "@/components/ssw/SswPageBody"
import { PageBuilder } from "@/components/pages/PageBuilder"
import { html } from "@/lib/ssw/prepared/contact"
import { getPage } from "@/lib/sanity/queries"

export const revalidate = 60

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

export default async function ContactPage() {
  const page = await getPage("contact")

  if (page?.sections?.length) {
    return <PageBuilder page={page} />
  }

  return <SswPageBody html={html} pageSource="contact" />
}
