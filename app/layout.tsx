import type { Metadata, Viewport } from "next"
import "./globals.css"
import "./ssw/ssw-base.css"

const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.standingsunwines.com") as string

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
  description:
    "Standing Sun Wines — custom crush winery, live music, and private events in Buellton at the gateway to Santa Ynez Valley, Santa Barbara County, California.",
  keywords: [
    "Standing Sun Wines",
    "Buellton winery",
    "Santa Ynez Valley",
    "Santa Barbara County wine",
    "custom crush",
    "private events",
    "winery venue",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Standing Sun Wines",
    title: "Standing Sun Wines · Santa Barbara County",
    description:
      "Wine, music, and art — custom crush, live events, and private gatherings in Buellton, California.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Standing Sun Wines",
    description:
      "Custom crush winery and event destination in Buellton, Santa Barbara County.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
      </body>
    </html>
  )
}
