/**
 * Re-extracts the homepage `.hero-bg` image from raw `newSiteFiles/standingsunwines_v19.html`
 * (full base64, whitespace stripped) and writes a stable asset for sharper `background-size: cover`.
 *
 * Optional (recommended): `sharp` for high-quality JPEG + optional upscaling for retina viewports.
 *
 * Usage (from repo root):
 *   node scripts/extract-hero-hires.mjs
 *   HERO_MIN_WIDTH=3840 node scripts/extract-hero-hires.mjs   # upscale narrow sources to this width (Lanczos3)
 *   HERO_JPEG_QUALITY=98 node scripts/extract-hero-hires.mjs
 *
 * Run after `npm i -D sharp` for the processing path; without sharp, raw decoded bytes are written.
 */
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const htmlPath = path.join(root, "newSiteFiles", "standingsunwines_v19.html")
const cssPath = path.join(root, "app", "ssw", "ssw-base.css")
const outDir = path.join(root, "public", "images", "ssw")
const outName = "hero-home-cover.jpg"
const outAbs = path.join(outDir, outName)
const publicUrl = `/images/ssw/${outName}`

function decodeDataUri(dataUri) {
  const m = String(dataUri).match(
    /^data:image\/([\w.+-]+);base64,([\s\S]+)$/i,
  )
  if (!m) throw new Error("Not a data:image base64 URI")
  const b64 = m[2].replace(/\s+/g, "")
  const buf = Buffer.from(b64, "base64")
  if (!buf.length) throw new Error("Empty decoded buffer")
  return { mime: m[1].toLowerCase(), buf }
}

function extractHeroDataUriFromHtml(html) {
  const re =
    /\.hero-bg\s*\{[^}]*background-image:\s*url\(\s*['"]?(data:image\/[^'")]+)['"]?\s*\)/i
  const m = html.match(re)
  if (!m) {
    throw new Error(
      "Could not find .hero-bg { ... background-image:url(data:...) } in newSiteFiles/standingsunwines_v19.html",
    )
  }
  return m[1]
}

function patchHeroBgUrlInCss(css) {
  let replaced = 0
  const next = css.replace(/\.hero-bg\s*\{[\s\S]*?\}/, (block) => {
    if (replaced) return block
    replaced = 1
    return block.replace(
      /(background-image:\s*url\(')([^']+)('\))/,
      `$1${publicUrl}$3`,
    )
  })
  if (!replaced) {
    throw new Error(
      "Could not find .hero-bg { ... } block in app/ssw/ssw-base.css — run npm run merge:ssw-css first.",
    )
  }
  return next
}

async function main() {
  if (!fs.existsSync(htmlPath)) {
    console.error("Missing", htmlPath)
    process.exit(1)
  }
  const html = fs.readFileSync(htmlPath, "utf8")
  const dataUri = extractHeroDataUriFromHtml(html)
  const { buf } = decodeDataUri(dataUri)

  fs.mkdirSync(outDir, { recursive: true })

  const minWEnv = parseInt(process.env.HERO_MIN_WIDTH || "0", 10) || 0
  const jpegQ = Math.min(
    100,
    Math.max(70, parseInt(process.env.HERO_JPEG_QUALITY || "98", 10) || 98),
  )

  let sharpMod = null
  try {
    sharpMod = (await import("sharp")).default
  } catch {
    /* optional */
  }

  if (sharpMod) {
    const meta = await sharpMod(buf, { failOn: "none" }).metadata()
    console.log("Source:", meta.width, "x", meta.height, meta.format)

    let minW = minWEnv
    if (
      !minW &&
      process.env.HERO_NO_UPSCALE !== "1" &&
      meta.width &&
      meta.width < 1800
    ) {
      minW = 2560
      console.log(
        "Auto HERO_MIN_WIDTH=2560 (source < 1800px wide). Set HERO_NO_UPSCALE=1 to keep native size.",
      )
    }

    let pipeline = sharpMod(buf, { failOn: "none" })
    if (minW > 0 && meta.width && meta.width < minW) {
      pipeline = pipeline.resize({
        width: minW,
        fit: "inside",
        withoutEnlargement: false,
        kernel: sharpMod.kernel.lanczos3,
      })
      console.log("Upscaled toward min width", minW, "(HERO_MIN_WIDTH)")
    }

    await pipeline
      .jpeg({
        quality: jpegQ,
        mozjpeg: true,
        chromaSubsampling: "4:4:4",
      })
      .toFile(outAbs)

    console.log("Wrote (sharp)", outAbs)
  } else {
    fs.writeFileSync(outAbs, buf)
    console.log(
      "Wrote raw decoded bytes to",
      outAbs,
      "(install sharp with: npm i -D sharp — for JPEG chroma + optional upscaling)",
    )
  }

  const css = fs.readFileSync(cssPath, "utf8")
  const updated = patchHeroBgUrlInCss(css)
  fs.writeFileSync(cssPath, updated, "utf8")
  console.log("Patched first .hero-bg URL in", cssPath, "->", publicUrl)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
