/**
 * Seeds siteSettings and all marketing page documents (images + paragraphs only).
 * Requires env: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 * SANITY_API_WRITE_TOKEN (Editor access).
 *
 * Loads `.env.local` then `.env` from the repo root (Next.js reads these; plain Node does not).
 * Usage: SANITY_API_WRITE_TOKEN=xxx node scripts/sanity-seed-content.mjs
 * Or: npm run seed:sanity
 */

import { existsSync, readFileSync } from "node:fs"
import { basename, resolve } from "node:path"

import { createClient } from "@sanity/client"

import { PAGE_IMAGE_DOCUMENTS, PAGE_TEXT_DOCUMENTS } from "./page-content-seed-data.mjs"

/** Parse KEY=value so `npm run seed:sanity` picks up NEXT_PUBLIC_* from `.env.local`. */
function loadDotenvFile(relPath) {
  const filepath = resolve(process.cwd(), relPath)
  if (!existsSync(filepath)) return
  const text = readFileSync(filepath, "utf8")
  for (let line of text.split(/\r?\n/)) {
    line = line.trim()
    if (!line || line.startsWith("#")) continue
    const eq = line.indexOf("=")
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    let val = line.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) {
      process.env[key] = val
    }
  }
}

loadDotenvFile(".env.local")
loadDotenvFile(".env")

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production"
const token = process.env.SANITY_API_WRITE_TOKEN?.trim()

if (!projectId) {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID is required.")
  process.exit(1)
}
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is required to create documents.")
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
})

const navKey = (k) => `nav_${k.replace(/-/g, "_")}`

const SITE_SETTINGS = {
  _id: "siteSettings",
  _type: "siteSettings",
  brandName: "Standing Sun Wines",
  navLogoAlt: "Standing Sun Wines",
  footerLogoAlt: "Standing Sun Wines",
  navigation: [
    {
      _key: navKey("home"),
      key: "home",
      label: "Home",
      href: "/",
      kind: "internal",
      styleVariant: "default",
      activePathPrefixes: ["/"],
    },
    {
      _key: navKey("about"),
      key: "about",
      label: "About",
      href: "/#about",
      kind: "anchor",
      styleVariant: "default",
      activePathPrefixes: [],
    },
    {
      _key: navKey("winery"),
      key: "winery",
      label: "The Winery",
      href: "/winery",
      kind: "internal",
      styleVariant: "default",
      activePathPrefixes: ["/winery"],
    },
    {
      _key: navKey("events"),
      key: "events",
      label: "Live Events",
      href: "/#events",
      kind: "anchor",
      styleVariant: "default",
      activePathPrefixes: [],
    },
    {
      _key: navKey("private"),
      key: "private",
      label: "Private Events",
      href: "/private-events",
      kind: "internal",
      styleVariant: "default",
      activePathPrefixes: ["/private-events"],
    },
    {
      _key: navKey("analogue"),
      key: "analogue",
      label: "The Analogue Room",
      href: "https://www.analogueroom.com",
      kind: "external",
      styleVariant: "analogue",
      activePathPrefixes: [],
    },
    {
      _key: navKey("newsletter"),
      key: "newsletter",
      label: "Join Our List",
      href: "/#contact",
      kind: "anchor",
      styleVariant: "cta",
      activePathPrefixes: [],
    },
    {
      _key: navKey("contact"),
      key: "contact",
      label: "Contact",
      href: "/contact",
      kind: "internal",
      styleVariant: "cta",
      activePathPrefixes: ["/contact"],
    },
  ],
  footerColumnLeft: {
    links: [
      { _key: "fc_l1", label: "Home", href: "/" },
      { _key: "fc_l2", label: "About", href: "/#about" },
      { _key: "fc_l3", label: "The Winery", href: "/winery" },
    ],
  },
  footerColumnRight: {
    links: [
      { _key: "fc_r1", label: "Live Events", href: "/#events" },
      { _key: "fc_r2", label: "Private Events", href: "/private-events" },
      { _key: "fc_r3", label: "Contact", href: "/contact" },
    ],
  },
  footerAddressTitle: "Standing Sun Wines",
  footerAddressLines: ["92 2nd Street", "Buellton, CA 93427"],
  copyrightSuffix: "Standing Sun Wines · All Rights Reserved · Buellton, California",
  eventbriteOrgUrl: "https://www.eventbrite.com/o/standing-sun-wines-121252721971",
  sisterSiteUrl: "https://www.analogueroom.com",
  interiorHeroImageFallback: "/images/interior.jpeg",
  eventDetailBackLabel: "← Back to events",
  eventDetailWhenLabel: "When",
  eventsListEmptyMessage:
    "Showing sample placeholders. Published events with a today or future event date appear here. Drafts and past dates are hidden.",
  eventsListDetailsLabel: "Details",
  newsletterEyebrow: "Updates",
  newsletterTitle: "Hear what's spinning",
  newsletterSubmitLabel: "Join the list",
  seoDefaultTitle: "Standing Sun Wines · Santa Barbara County",
  seoDefaultDescription:
    "Standing Sun Wines: custom crush winery, live music, and private events in Buellton at the gateway to Santa Ynez Valley, Santa Barbara County, California.",
  schemaDescription:
    "Custom crush winery, live music venue, and private event space in Buellton, California.",
  schemaStreetAddress: "92 2nd Street",
  schemaAddressLocality: "Buellton",
  schemaAddressRegion: "CA",
  schemaPostalCode: "93427",
  schemaAddressCountry: "US",
}

const uploadedAssets = new Map()

/** Upload a file from `public/` and return a Sanity image field value. */
async function uploadPublicImage(relativePath) {
  const normalized = relativePath.replace(/^\/+/, "")
  if (uploadedAssets.has(normalized)) {
    return uploadedAssets.get(normalized)
  }

  const filepath = resolve(process.cwd(), "public", normalized)
  if (!existsSync(filepath)) {
    throw new Error(`Missing seed image: public/${normalized}`)
  }

  const buffer = readFileSync(filepath)
  const asset = await client.assets.upload("image", buffer, {
    filename: basename(filepath),
  })

  const imageField = {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  }

  uploadedAssets.set(normalized, imageField)
  return imageField
}

async function hydrateImageDocument(doc) {
  const images = []
  for (const slot of doc.images) {
    const { sourceFile, ...rest } = slot
    if (sourceFile) {
      rest.image = await uploadPublicImage(sourceFile)
    }
    images.push(rest)
  }
  return { ...doc, images }
}

async function main() {
  const oldPages = await client.fetch(`*[_type == "page"]._id`)

  let tx = client.transaction().createOrReplace(SITE_SETTINGS)

  for (const doc of PAGE_IMAGE_DOCUMENTS) {
    const hydrated = await hydrateImageDocument(doc)
    tx = tx.createOrReplace(hydrated)
  }

  for (const doc of PAGE_TEXT_DOCUMENTS) {
    tx = tx.createOrReplace(doc)
  }

  for (const id of oldPages) {
    tx = tx.delete(id)
  }

  await tx.commit({ visibility: "async" })

  console.log(
    `Seeded ${PAGE_IMAGE_DOCUMENTS.length} image docs (${uploadedAssets.size} unique assets uploaded), ${PAGE_TEXT_DOCUMENTS.length} text docs.`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
