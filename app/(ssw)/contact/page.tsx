import type { Metadata } from "next"
import { buildOpenGraph } from "@/lib/site-metadata"
import "@/app/ssw/ssw-contact.css"
import { SswPageBody } from "@/components/ssw/SswPageBody"
import { PageBuilder } from "@/components/pages/PageBuilder"
import { html } from "@/lib/ssw/prepared/contact"
import { getPage, getResolvedSiteSettings } from "@/lib/sanity/queries"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Standing Sun Wines in Buellton, California: custom crush, private events, and general inquiries.",
  openGraph: buildOpenGraph({
    title: "Contact · Standing Sun Wines",
    description: "Get in touch with Standing Sun Wines in Buellton, CA.",
    url: "/contact",
  }),
  alternates: { canonical: "/contact" },
}

export default async function ContactPage() {
  const [page, site] = await Promise.all([getPage("contact"), getResolvedSiteSettings()])

  if (page?.sections?.length) {
    return <PageBuilder page={page} site={site} />
  }

  return <SswPageBody html={html} pageSource="contact" />
}
