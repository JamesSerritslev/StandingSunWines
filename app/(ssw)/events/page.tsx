import { redirect } from "next/navigation"

/** Legacy /events URL → /shawnmullins */
export default function LegacyEventsRedirect() {
  redirect("/shawnmullins")
}
