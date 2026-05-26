/**
 * Replaces data:image/...;base64,... URIs in newSiteFiles/*.html with /images/ssw/* files.
 * Run from repo root: node scripts/extract-ssw-assets.mjs
 */
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const srcDir = path.join(root, "newSiteFiles")
const outImgDir = path.join(root, "public", "images", "ssw")
const outHtmlDir = path.join(root, "generated", "ssw-html")

const mimeToExt = {
  png: "png",
  jpeg: "jpg",
  jpg: "jpg",
  webp: "webp",
  gif: "gif",
  "svg+xml": "svg",
}

/** Allow line breaks / spaces inside long base64 payloads. */
const dataUriRe =
  /data:image\/([\w.+-]+);base64,([A-Za-z0-9+/=\s]+)/g

function extFromMagic(buf) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)
    return "jpg"
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  )
    return "png"
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46
  )
    return "webp"
  if (buf.length >= 6 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46)
    return "gif"
  return null
}

function extForMime(sub) {
  const key = String(sub).toLowerCase()
  return mimeToExt[key] || "png"
}

fs.mkdirSync(outImgDir, { recursive: true })
fs.mkdirSync(outHtmlDir, { recursive: true })

function replaceDataUris(html) {
  /** @type {Map<string, string>} */
  const byContent = new Map()
  return html.replace(dataUriRe, (full, mimeSub, b64) => {
    let buf
    try {
      buf = Buffer.from(String(b64).replace(/\s+/g, ""), "base64")
    } catch {
      return full
    }
    if (!buf.length) return full
    const contentKey = crypto.createHash("sha256").update(buf).digest("hex")
    if (byContent.has(contentKey)) return byContent.get(contentKey)

    const ext = extFromMagic(buf) || extForMime(mimeSub)
    const fname = `ssw-${contentKey.slice(0, 16)}.${ext}`
    fs.writeFileSync(path.join(outImgDir, fname), buf)
    const pub = `/images/ssw/${fname}`
    byContent.set(contentKey, pub)
    return pub
  })
}

const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".html"))
for (const f of files) {
  const raw = fs.readFileSync(path.join(srcDir, f), "utf8")
  const cleaned = replaceDataUris(raw)
  fs.writeFileSync(path.join(outHtmlDir, f), cleaned, "utf8")
  console.log("Wrote", f, "-> generated/ssw-html/", "chars", cleaned.length)
}

console.log("Done. Images in public/images/ssw/")
