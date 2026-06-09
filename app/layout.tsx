import type { Metadata, Viewport } from "next"
import { draftMode } from "next/headers"
import { VisualEditing } from "next-sanity/visual-editing"
import "./globals.css"
import {
  buildOpenGraph,
  buildTwitter,
  defaultDescription,
  siteName,
  siteUrl,
} from "@/lib/site-metadata"
import { SanityLive } from "@/sanity/lib/live"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#231f20",
}

/** Fonts load at runtime via <link> — avoids build failures when fonts.googleapis.com is unreachable. */

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Standing Sun Wines · Santa Barbara County",
    template: "%s · Standing Sun Wines",
  },
  description: defaultDescription,
  keywords: [
    "Standing Sun Wines",
    "Buellton winery",
    "Santa Ynez Valley",
    "Santa Barbara County wine",
    "custom crush",
    "private events",
    "winery venue",
  ],
  openGraph: buildOpenGraph({
    title: "Standing Sun Wines · Santa Barbara County",
    description:
      "Wine, music, and art: custom crush, live events, and private gatherings in Buellton, California.",
    url: siteUrl,
  }),
  twitter: buildTwitter({
    title: siteName,
    description:
      "Custom crush winery and event destination in Buellton, Santa Barbara County.",
  }),
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/ssw/ssw-3a30683668704b66.png",
    apple: "/images/ssw/ssw-3a30683668704b66.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isEnabled: isDraftMode } = await draftMode()

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh min-w-0 antialiased">
        <div className="relative z-[1] min-h-dvh min-w-0 w-full max-w-full overflow-x-hidden">
          {children}
        </div>

        {/* Live Content API — only in Draft Mode (needs Sanity CORS for the preview origin) */}
        {isDraftMode ? <SanityLive /> : null}

        {/* Visual Editing overlays — only active in Draft Mode (inside Presentation iframe) */}
        {isDraftMode ? <VisualEditing /> : null}
      </body>
    </html>
  )
}
