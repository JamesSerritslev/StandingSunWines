import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"

/**
 * Called by the Sanity Presentation tool to enable Next.js Draft Mode.
 * The Presentation tool appends ?redirect=<path> so the iframe navigates
 * to the right page once preview is active.
 *
 * For production hardening add a SANITY_PREVIEW_SECRET and validate it here
 * before calling draft.enable().
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const redirectTo = searchParams.get("redirect") ?? "/"

  const draft = await draftMode()
  draft.enable()

  redirect(redirectTo)
}
