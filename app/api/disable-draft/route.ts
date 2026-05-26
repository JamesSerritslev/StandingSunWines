import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"

/** Exits draft mode and redirects back to the given path (or home). */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const redirectTo = searchParams.get("redirect") ?? "/"

  const draft = await draftMode()
  draft.disable()

  redirect(redirectTo)
}
