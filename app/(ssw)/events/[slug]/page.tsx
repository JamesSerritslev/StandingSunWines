import { redirect } from "next/navigation"

type PageProps = { params: Promise<{ slug: string }> }

/** Legacy event detail /events/[slug] → /shawnmullins */
export default async function LegacyEventSlugPage(_props: PageProps) {
  redirect("/shawnmullins")
}
