/** Single source for default nav/footer when `siteSettings` doc is absent or empty. */

import type { SanityImage } from "@/lib/sanity/types"

export const SITE_SETTINGS_DOC_ID = "siteSettings"

const DEFAULT_NAV_LOGO_PATH = "/images/ssw/ssw-3a30683668704b66.png"
const DEFAULT_FOOTER_LOGO_PATH = "/images/ssw/ssw-d553bb7215e2dee2.png"

export { DEFAULT_NAV_LOGO_PATH, DEFAULT_FOOTER_LOGO_PATH }

export interface NavLinkInput {
  _key?: string
  key?: string
  label?: string
  href?: string
  kind?: "internal" | "external" | "anchor"
  styleVariant?: "default" | "cta" | "analogue"
  activePathPrefixes?: string[]
}

export interface FooterLinkInput {
  label?: string
  href?: string
}

/** Raw document from Sanity (partial). */
export interface SiteSettingsDocument {
  _id?: string
  brandName?: string
  navLogo?: SanityImage
  navLogoAlt?: string
  footerLogo?: SanityImage
  footerLogoAlt?: string
  navigation?: NavLinkInput[]
  footerColumnLeft?: { links?: FooterLinkInput[] }
  footerColumnRight?: { links?: FooterLinkInput[] }
  footerAddressTitle?: string
  footerAddressLines?: string[]
  copyrightSuffix?: string
  eventbriteOrgUrl?: string
  sisterSiteUrl?: string
  interiorHeroImageFallback?: string
  interiorHeroImage?: SanityImage
  eventDetailBackLabel?: string
  eventDetailWhenLabel?: string
  eventsListEmptyMessage?: string
  eventsListDetailsLabel?: string
  newsletterEyebrow?: string
  newsletterTitle?: string
  newsletterSubmitLabel?: string
  seoDefaultTitle?: string
  seoDefaultDescription?: string
  seoOgImage?: SanityImage
  schemaDescription?: string
  schemaStreetAddress?: string
  schemaAddressLocality?: string
  schemaAddressRegion?: string
  schemaPostalCode?: string
  schemaAddressCountry?: string
}

export const DEFAULT_NAV_LINKS: Omit<NavLinkInput, "_key">[] = [
  { key: "home", label: "Home", href: "/", kind: "internal", styleVariant: "default", activePathPrefixes: ["/"] },
  { key: "about", label: "About", href: "/#about", kind: "anchor", styleVariant: "default", activePathPrefixes: [] },
  {
    key: "winery",
    label: "The Winery",
    href: "/winery",
    kind: "internal",
    styleVariant: "default",
    activePathPrefixes: ["/winery"],
  },
  { key: "events", label: "Live Events", href: "/#events", kind: "anchor", styleVariant: "default", activePathPrefixes: [] },
  { key: "gallery", label: "Gallery", href: "/#gallery", kind: "anchor", styleVariant: "default", activePathPrefixes: [] },
  {
    key: "private",
    label: "Private Events",
    href: "/private-events",
    kind: "internal",
    styleVariant: "default",
    activePathPrefixes: ["/private-events"],
  },
  {
    key: "analogue",
    label: "The Analogue Room",
    href: "https://www.analogueroom.com",
    kind: "external",
    styleVariant: "analogue",
    activePathPrefixes: [],
  },
  {
    key: "contact",
    label: "Contact",
    href: "/contact#contact-form",
    kind: "internal",
    styleVariant: "cta",
    activePathPrefixes: ["/contact"],
  },
]

export const DEFAULT_FOOTER_LEFT: FooterLinkInput[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "The Winery", href: "/winery" },
]

export const DEFAULT_FOOTER_RIGHT: FooterLinkInput[] = [
  { label: "Live Events", href: "/#events" },
  { label: "Private Events", href: "/private-events" },
  { label: "Contact", href: "/contact#contact-form" },
]

export interface ResolvedLogo {
  src: string
  alt: string
  width: number
  height: number
}

export interface ResolvedNavItem {
  key: string
  href: string
  label: string
  external: boolean
  classNameHints: { cta?: boolean; analogue?: boolean }
  activeExactPaths: string[]
}

export interface ResolvedFooterLink {
  label: string
  href: string
}

/** Normalized chrome data for layouts. */
export interface ResolvedSiteSettings {
  brandName: string
  navigation: ResolvedNavItem[]
  navLogo: ResolvedLogo
  footerLogo: ResolvedLogo
  footerColumnLeft: ResolvedFooterLink[]
  footerColumnRight: ResolvedFooterLink[]
  footerAddressTitle: string
  footerAddressLines: string[]
  copyrightSuffix: string
  eventbriteOrgUrl: string
  sisterSiteUrl: string
  interiorHeroUrl: string
  eventDetailBackLabel: string
  eventDetailWhenLabel: string
  eventsListEmptyMessage: string
  eventsListDetailsLabel: string
  newsletterEyebrow: string
  newsletterTitle: string
  newsletterSubmitLabel: string
  seoDefaultTitle: string
  seoDefaultDescription: string
  schemaDescription: string
  schemaStreetAddress: string
  schemaAddressLocality: string
  schemaAddressRegion: string
  schemaPostalCode: string
  schemaAddressCountry: string
}

function pickStr(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : fallback
}

export function normalizeFooterLinks(rows: FooterLinkInput[] | undefined): ResolvedFooterLink[] {
  const out: ResolvedFooterLink[] = []
  for (const row of rows ?? []) {
    const label = row.label?.trim()
    const href = row.href?.trim()
    if (!label || !href) continue
    out.push({ label, href })
  }
  return out
}

function normalizeNav(nav: NavLinkInput[] | undefined, sisterSiteUrl: string): ResolvedNavItem[] {
  const source = nav?.length ? nav : DEFAULT_NAV_LINKS
  const rows: ResolvedNavItem[] = []
  for (let i = 0; i < source.length; i++) {
    const raw = source[i]!
    const key = raw.key ?? `nav-${i}`
    const label = raw.label?.trim()
    let href = raw.href?.trim() ?? ""
    if (!label || !href) continue
    const kind = raw.kind ?? "internal"

    if (key === "analogue") {
      const s = sisterSiteUrl.trim()
      if (s) href = s
    }

    rows.push({
      key,
      href,
      label,
      external: kind === "external",
      classNameHints: {
        cta: raw.styleVariant === "cta",
        analogue: raw.styleVariant === "analogue",
      },
      activeExactPaths: raw.activePathPrefixes ?? [],
    })
  }
  return rows
}

export function resolveSiteSettings(
  doc: SiteSettingsDocument | null | undefined,
  resolvedImageUrl: (img: SanityImage | undefined | null, w: number) => string | undefined,
): ResolvedSiteSettings {
  const sister = pickStr(doc?.sisterSiteUrl, "https://www.analogueroom.com")

  const navLogoResolved =
    resolvedImageUrl(doc?.navLogo, 540) ?? DEFAULT_NAV_LOGO_PATH
  const footerLogoResolved =
    resolvedImageUrl(doc?.footerLogo, 320) ?? DEFAULT_FOOTER_LOGO_PATH

  const fallbackHero = pickStr(doc?.interiorHeroImageFallback, "/images/interior.jpeg")
  const interiorHeroUrl = resolvedImageUrl(doc?.interiorHeroImage, 2400) ?? fallbackHero

  const left = normalizeFooterLinks(doc?.footerColumnLeft?.links)
  const right = normalizeFooterLinks(doc?.footerColumnRight?.links)

  const defaultDesc =
    doc?.seoDefaultDescription ??
    "Standing Sun Wines — custom crush winery, live music, and private events in Buellton at the gateway to Santa Ynez Valley, Santa Barbara County, California."

  return {
    brandName: pickStr(doc?.brandName, "Standing Sun Wines"),
    navigation: normalizeNav(doc?.navigation, sister),
    navLogo: {
      src: navLogoResolved,
      alt: pickStr(doc?.navLogoAlt, "Standing Sun Wines"),
      width: 180,
      height: 72,
    },
    footerLogo: {
      src: footerLogoResolved,
      alt: pickStr(doc?.footerLogoAlt, "Standing Sun Wines"),
      width: 160,
      height: 80,
    },
    footerColumnLeft: left.length ? left : DEFAULT_FOOTER_LEFT.map((l) => ({ label: l.label!, href: l.href! })),
    footerColumnRight: right.length ? right : DEFAULT_FOOTER_RIGHT.map((l) => ({ label: l.label!, href: l.href! })),
    footerAddressTitle: pickStr(doc?.footerAddressTitle, "Standing Sun Wines"),
    footerAddressLines:
      (doc?.footerAddressLines?.filter(Boolean)?.length ?? 0) > 0
        ? doc!.footerAddressLines!.map((line) => line.trim()).filter(Boolean)
        : ["92 2nd Street", "Buellton, CA 93427"],
    copyrightSuffix: pickStr(
      doc?.copyrightSuffix,
      "Standing Sun Wines · All Rights Reserved · Buellton, California",
    ),
    eventbriteOrgUrl: pickStr(
      doc?.eventbriteOrgUrl,
      "https://www.eventbrite.com/o/standing-sun-wines-121252721971",
    ),
    sisterSiteUrl: sister,
    interiorHeroUrl,
    eventDetailBackLabel: pickStr(doc?.eventDetailBackLabel, "← Back to events"),
    eventDetailWhenLabel: pickStr(doc?.eventDetailWhenLabel, "When"),
    eventsListEmptyMessage: pickStr(
      doc?.eventsListEmptyMessage,
      "Showing sample placeholders. Published events with a today or future event date appear here. Drafts and past dates are hidden.",
    ),
    eventsListDetailsLabel: pickStr(doc?.eventsListDetailsLabel, "Details"),
    newsletterEyebrow: pickStr(doc?.newsletterEyebrow, "Updates"),
    newsletterTitle: pickStr(doc?.newsletterTitle, "Hear what's spinning"),
    newsletterSubmitLabel: pickStr(doc?.newsletterSubmitLabel, "Join the list"),
    seoDefaultTitle: pickStr(doc?.seoDefaultTitle, "Standing Sun Wines · Santa Barbara County"),
    seoDefaultDescription: typeof doc?.seoDefaultDescription === "string" && doc.seoDefaultDescription.trim()
      ? doc.seoDefaultDescription.trim()
      : defaultDesc,
    schemaDescription: pickStr(
      doc?.schemaDescription,
      "Custom crush winery, live music venue, and private event space in Buellton, California.",
    ),
    schemaStreetAddress: pickStr(doc?.schemaStreetAddress, "92 2nd Street"),
    schemaAddressLocality: pickStr(doc?.schemaAddressLocality, "Buellton"),
    schemaAddressRegion: pickStr(doc?.schemaAddressRegion, "CA"),
    schemaPostalCode: pickStr(doc?.schemaPostalCode, "93427"),
    schemaAddressCountry: pickStr(doc?.schemaAddressCountry, "US"),
  }
}
