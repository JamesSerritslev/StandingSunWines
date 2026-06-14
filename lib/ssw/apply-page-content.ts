import { sanityImageUrl } from "@/lib/sanity/image-url"
import type { PageContentImage, PageContentParagraph, SanityPage } from "@/lib/sanity/types"

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function replaceImgSrc(html: string, className: string, url: string, alt?: string): string {
  const classPattern = escapeRegExp(className)
  let out = html.replace(
    new RegExp(`(<img[^>]*class="${classPattern}"[^>]*src=")[^"]*(")`, "i"),
    `$1${url}$2`,
  )
  if (alt) {
    out = out.replace(
      new RegExp(`(<img[^>]*class="${classPattern}"[^>]*alt=")[^"]*(")`, "i"),
      `$1${alt.replace(/"/g, "&quot;")}$2`,
    )
  }
  return out
}

function replaceHeroBg(html: string, url: string): string {
  if (/class="hero-bg"[^>]*style="background-image:url\('/i.test(html)) {
    return html.replace(
      /(class="hero-bg" style="background-image:url\(')[^']*('\))/i,
      `$1${url}$2`,
    )
  }
  return html.replace(
    /<div class="hero-bg"><\/div>/i,
    `<div class="hero-bg" style="background-image:url('${url}')"></div>`,
  )
}

function replaceBgDiv(html: string, className: string, url: string): string {
  const re = new RegExp(`<div class="${escapeRegExp(className)}"([^>]*)>`, "i")
  return html.replace(re, (_match, attrs: string) => {
    if (/style="/i.test(attrs)) {
      const next = attrs.replace(
        /background-image:url\('[^']*'\)/i,
        `background-image:url('${url}')`,
      )
      if (next !== attrs) return `<div class="${className}"${next}>`
      return `<div class="${className}"${attrs.replace(/ style="/i, ` style="background-image:url('${url}'); `)}>`
    }
    return `<div class="${className}" style="background-image:url('${url}')">`
  })
}

function replaceSectionBodyText(
  html: string,
  sectionId: string,
  index: number,
  text: string,
): string {
  const sectionRe = new RegExp(
    `<section[^>]*id="${escapeRegExp(sectionId)}"[^>]*>[\\s\\S]*?<\\/section>`,
    "i",
  )
  const match = html.match(sectionRe)
  if (!match) return html

  let sectionHtml = match[0]
  let count = 0
  sectionHtml = sectionHtml.replace(/<p class="body-text"[^>]*>[\s\S]*?<\/p>/gi, (pTag) => {
    if (count === index) {
      count += 1
      const open = pTag.match(/^<p class="body-text"[^>]*>/)?.[0] ?? '<p class="body-text">'
      return `${open}${text}</p>`
    }
    count += 1
    return pTag
  })

  return html.replace(sectionRe, sectionHtml)
}

function replaceScopedParagraph(
  html: string,
  selector: { sectionId?: string; className: string },
  text: string,
): string {
  if (selector.sectionId) {
    const sectionRe = new RegExp(
      `<section[^>]*id="${escapeRegExp(selector.sectionId)}"[^>]*>[\\s\\S]*?<\\/section>`,
      "i",
    )
    const match = html.match(sectionRe)
    if (!match) return html
    const classPattern = escapeRegExp(selector.className)
    const nextSection = match[0].replace(
      new RegExp(`(<p class="${classPattern}"[^>]*>)[\\s\\S]*?(<\\/p>)`, "i"),
      `$1${text}$2`,
    )
    return html.replace(sectionRe, nextSection)
  }

  const classPattern = escapeRegExp(selector.className)
  return html.replace(
    new RegExp(`(<p class="${classPattern}"[^>]*>)[\\s\\S]*?(<\\/p>)`, "i"),
    `$1${text}$2`,
  )
}

function replaceHeroBody(html: string, text: string): string {
  return html.replace(
    /(<p class="hero-body"[^>]*>)[\s\S]*?(<\/p>)/i,
    `$1${text}$2`,
  )
}

function replaceGalleryImage(html: string, index: number, url: string, alt?: string): string {
  const stripRe =
    /<div class="gallery-strip">[\s\S]*?<\/div>\s*(?=<section class="space-section"|<section id=|<div class="quote-strip"|<!-- FOOTER -->|$)/i
  const match = html.match(stripRe)
  if (!match) return html

  let gallery = match[0]
  let imgIndex = 0
  gallery = gallery.replace(/<img([^>]*)src="[^"]*"([^>]*)>/gi, (tag, before, after) => {
    if (imgIndex !== index) {
      imgIndex += 1
      return tag
    }
    imgIndex += 1
    let next = `<img${before}src="${url}"${after}>`
    if (alt) {
      next = next.replace(/alt="[^"]*"/i, `alt="${alt.replace(/"/g, "&quot;")}"`)
    }
    return next
  })

  return html.replace(stripRe, gallery)
}

function replaceFacilityImage(html: string, blockId: string | null, url: string, alt?: string): string {
  const facilityRe = /<section id="facility"[\s\S]*?<\/section>/i
  const match = html.match(facilityRe)
  if (!match) return html

  let block = match[0]
  const scopeRe = blockId
    ? new RegExp(
        `<div class="facility-grid[^"]*" id="${escapeRegExp(blockId)}"[\\s\\S]*?<\\/div>\\s*<\\/div>`,
        "i",
      )
    : /<div class="facility-grid"(?! id=)[\s\S]*?<\/div>\s*<\/div>/i

  const scopeMatch = block.match(scopeRe)
  if (!scopeMatch) return html

  let scoped = scopeMatch[0].replace(
    /(<img[^>]*src=")[^"]*(")/i,
    `$1${url}$2`,
  )
  if (alt) {
    scoped = scoped.replace(/(<img[^>]*alt=")[^"]*(")/i, `$1${alt.replace(/"/g, "&quot;")}$2`)
  }

  block = block.replace(scopeRe, scoped)
  return html.replace(facilityRe, block)
}

const IMAGE_APPLIERS: Record<
  string,
  (html: string, url: string, alt?: string) => string
> = {
  "hero-logo": (html, url, alt) => replaceImgSrc(html, "hero-logo", url, alt),
  "winery-section-photo": (html, url) => replaceBgDiv(html, "about-img", url),
  "winemaker-section-photo": (html, url) => replaceBgDiv(html, "winemaker-img", url),
  "private-events-bg": (html, url) => replaceBgDiv(html, "private-bg", url),
  "hero-bg": (html, url) => replaceHeroBg(html, url),
  "facility-barrels": (html, url, alt) => replaceFacilityImage(html, null, url, alt),
  "facility-tanks": (html, url, alt) =>
    replaceFacilityImage(html, "serious-wine", url, alt),
  "gallery-1": (html, url, alt) => replaceGalleryImage(html, 0, url, alt),
  "gallery-2": (html, url, alt) => replaceGalleryImage(html, 1, url, alt),
  "gallery-3": (html, url, alt) => replaceGalleryImage(html, 2, url, alt),
  "gallery-4": (html, url, alt) => replaceGalleryImage(html, 3, url, alt),
  "space-photo": (html, url, alt) =>
    html.replace(
      /(<section class="space-section"[\s\S]*?<div class="space-img">\s*<img[^>]*src=")[^"]*(")/i,
      `$1${url}$2`,
    ),
}

const TEXT_APPLIERS: Record<string, (html: string, text: string) => string> = {
  "about-intro-1": (html, text) => replaceSectionBodyText(html, "about", 0, text),
  "about-intro-2": (html, text) => replaceSectionBodyText(html, "about", 1, text),
  "winery-text-1": (html, text) => replaceSectionBodyText(html, "winery", 0, text),
  "winery-text-2": (html, text) => replaceSectionBodyText(html, "winery", 1, text),
  "winemaker-text-1": (html, text) => replaceSectionBodyText(html, "winemaker", 0, text),
  "winemaker-text-2": (html, text) => replaceSectionBodyText(html, "winemaker", 1, text),
  "events-intro": (html, text) => replaceSectionBodyText(html, "events", 0, text),
  "private-body": (html, text) =>
    replaceScopedParagraph(html, { sectionId: "private", className: "body-text" }, text),
  "private-quote": (html, text) =>
    replaceScopedParagraph(html, { sectionId: "private", className: "private-quote" }, text),
  "hero-body": (html, text) => replaceHeroBody(html, text),
  "facility-text-1": (html, text) => replaceSectionBodyText(html, "facility", 0, text),
  "facility-text-2": (html, text) => replaceSectionBodyText(html, "facility", 1, text),
  "serious-wine-text-1": (html, text) => replaceSectionBodyText(html, "facility", 2, text),
  "serious-wine-text-2": (html, text) => replaceSectionBodyText(html, "facility", 3, text),
  "winery-wir-text-1": (html, text) => {
    const re = /<section id="winemaker"[\s\S]*?<div class="wir-body">[\s\S]*?<\/section>/i
    const match = html.match(re)
    if (!match) return html
    let block = match[0]
    let count = 0
    block = block.replace(/<p class="body-text"[^>]*>[\s\S]*?<\/p>/gi, (pTag) => {
      if (count === 0) {
        count += 1
        const open = pTag.match(/^<p class="body-text"[^>]*>/)?.[0] ?? '<p class="body-text">'
        return `${open}${text}</p>`
      }
      count += 1
      return pTag
    })
    return html.replace(re, block)
  },
  "winery-wir-text-2": (html, text) => {
    const re = /<section id="winemaker"[\s\S]*?<div class="wir-body">[\s\S]*?<\/section>/i
    const match = html.match(re)
    if (!match) return html
    let block = match[0]
    let count = 0
    block = block.replace(/<p class="body-text"[^>]*>[\s\S]*?<\/p>/gi, (pTag) => {
      if (count === 1) {
        count += 1
        const open = pTag.match(/^<p class="body-text"[^>]*>/)?.[0] ?? '<p class="body-text">'
        return `${open}${text}</p>`
      }
      count += 1
      return pTag
    })
    return html.replace(re, block)
  },
  "types-intro": (html, text) =>
    replaceScopedParagraph(html, { sectionId: "types", className: "body-text" }, text),
  "space-text-1": (html, text) => {
    const re = /<section class="space-section"[\s\S]*?<\/section>/i
    const match = html.match(re)
    if (!match) return html
    let block = match[0]
    let count = 0
    block = block.replace(/<p class="body-text"[^>]*>[\s\S]*?<\/p>/gi, (pTag) => {
      if (count === 0) {
        count += 1
        const open = pTag.match(/^<p class="body-text"[^>]*>/)?.[0] ?? '<p class="body-text">'
        return `${open}${text}</p>`
      }
      count += 1
      return pTag
    })
    return html.replace(re, block)
  },
  "space-text-2": (html, text) => {
    const re = /<section class="space-section"[\s\S]*?<\/section>/i
    const match = html.match(re)
    if (!match) return html
    let block = match[0]
    let count = 0
    block = block.replace(/<p class="body-text"[^>]*>[\s\S]*?<\/p>/gi, (pTag) => {
      if (count === 1) {
        count += 1
        const open = pTag.match(/^<p class="body-text"[^>]*>/)?.[0] ?? '<p class="body-text">'
        return `${open}${text}</p>`
      }
      count += 1
      return pTag
    })
    return html.replace(re, block)
  },
  quote: (html, text) =>
    replaceScopedParagraph(html, { className: "quote-text" }, text),
}

function applyImage(html: string, item: PageContentImage): string {
  const url = sanityImageUrl(item.image)
  if (!url || !item.key) return html
  const apply = IMAGE_APPLIERS[item.key]
  return apply ? apply(html, url, item.alt) : html
}

function applyParagraph(html: string, item: PageContentParagraph): string {
  if (!item.text?.trim() || !item.key) return html
  const apply = TEXT_APPLIERS[item.key]
  return apply ? apply(html, item.text.trim()) : html
}

/** Merge Sanity image + paragraph overrides into prepared HTML. */
export function applyPageContent(html: string, page: SanityPage | null): string {
  if (!page) return html
  let out = html
  for (const item of page.images ?? []) {
    out = applyImage(out, item)
  }
  for (const item of page.paragraphs ?? []) {
    out = applyParagraph(out, item)
  }
  return out
}
