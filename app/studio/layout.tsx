import type { Metadata, Viewport } from "next"
import {
  NextStudioLayout,
  metadata as studioMetadata,
  viewport as studioViewport,
} from "next-sanity/studio"

export const metadata: Metadata = {
  ...studioMetadata,
  title: "Studio | Standing Sun Wines",
}

export const viewport: Viewport = studioViewport

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <NextStudioLayout>{children}</NextStudioLayout>
}
