import type { MetadataRoute } from "next"

const base =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.standingsunwines.com"

export default function robots(): MetadataRoute.Robots {
  let host = "www.standingsunwines.com"
  try {
    const u = base.startsWith("http") ? new URL(base) : new URL(`https://${base}`)
    host = u.host
  } catch {
    /* keep default */
  }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] },
    ],
    sitemap: `${base.startsWith("http") ? base : `https://${base}`}/sitemap.xml`,
    host,
  }
}
