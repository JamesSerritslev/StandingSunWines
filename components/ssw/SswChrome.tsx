import { SswFooter } from "./SswFooter"
import { SswNav } from "./SswNav"

import type { ResolvedSiteSettings } from "@/lib/site-settings-resolve"
import { getResolvedSiteSettings } from "@/lib/sanity/queries"

export async function SswChrome({ children }: { children: React.ReactNode }) {
  const s = await getResolvedSiteSettings()

  return (
    <>
      <SswNav logo={s.navLogo} items={s.navigation} />
      {children}
      <SswFooter
        footerLogo={s.footerLogo}
        footerColumnLeft={s.footerColumnLeft}
        footerColumnRight={s.footerColumnRight}
        footerAddressTitle={s.footerAddressTitle}
        footerAddressLines={s.footerAddressLines}
        copyrightSuffix={s.copyrightSuffix}
      />
    </>
  )
}
