import { redirect } from "next/navigation"

type PageProps = { params: Promise<{ slug: string }> }

/** Event detail pages are handled by Ticket Tailor; legacy Sanity slugs redirect to the list. */
export default async function LegacyEventSlugPage(_props: PageProps) {
  redirect("/events")
}
