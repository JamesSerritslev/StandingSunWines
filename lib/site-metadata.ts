import type { Metadata } from "next"

export const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.standingsunwines.com") as string

export const siteName = "Standing Sun Wines"

export const defaultDescription =
  "Standing Sun Wines — custom crush winery, live music, and private events in Buellton at the gateway to Santa Ynez Valley, Santa Barbara County, California."

export const ogImagePath = "/og-image.jpg"

export const ogImage = {
  url: ogImagePath,
  secureUrl: `${siteUrl}${ogImagePath}`,
  width: 1200,
  height: 630,
  alt: "Standing Sun Wines — Santa Barbara County",
  type: "image/jpeg",
} as const

/** Child `openGraph` blocks replace the layout's — always spread this so og:image survives. */
export function buildOpenGraph(
  overrides: NonNullable<Metadata["openGraph"]> = {},
): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    locale: "en_US",
    siteName,
    images: [ogImage],
    ...overrides,
    images: overrides.images ?? [ogImage],
  }
}

export function buildTwitter(
  overrides: NonNullable<Metadata["twitter"]> = {},
): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    images: [ogImage.secureUrl],
    ...overrides,
    images: overrides.images ?? [ogImage.secureUrl],
  }
}
