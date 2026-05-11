import { SswChrome } from "@/components/ssw/SswChrome"

const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.standingsunwines.com") as string

const wineryJsonLd = {
  "@context": "https://schema.org",
  "@type": "Winery",
  name: "Standing Sun Wines",
  url: siteUrl,
  description:
    "Custom crush winery, live music venue, and private event space in Buellton, California.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "92 2nd Street",
    addressLocality: "Buellton",
    addressRegion: "CA",
    postalCode: "93427",
    addressCountry: "US",
  },
}

export default function SswMarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(wineryJsonLd),
        }}
      />
      <SswChrome>{children}</SswChrome>
    </>
  )
}
