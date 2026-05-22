import type { ReactNode } from "react"

import { SswChrome } from "@/components/ssw/SswChrome"
import { getResolvedSiteSettings } from "@/lib/sanity/queries"

export default async function SswMarketingLayout({
  children,
}: {
  children: ReactNode
}) {
  const siteUrl =
    (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://www.standingsunwines.com") as string

  const s = await getResolvedSiteSettings()

  const wineryJsonLd = {
    "@context": "https://schema.org",
    "@type": "Winery",
    name: s.brandName,
    url: siteUrl,
    description: s.schemaDescription,
    address: {
      "@type": "PostalAddress",
      streetAddress: s.schemaStreetAddress,
      addressLocality: s.schemaAddressLocality,
      addressRegion: s.schemaAddressRegion,
      postalCode: s.schemaPostalCode,
      addressCountry: s.schemaAddressCountry,
    },
  }

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
