/**
 * Writes one CSS file per generated HTML page so shared selectors (.hero-bg, nav, :root, …)
 * from winery/contact/private-events do not override the homepage (see Standing Sun port).
 * Then runs extract-hero-hires (patches ssw-base.css).
 */
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const srcDir = path.join(root, "generated", "ssw-html")
const outDir = path.join(root, "app", "ssw")

/** Tailwind preflight sets img { max-width: 100% } which breaks some static HTML layouts. */
const tailwindSswImgFix = `
/* After Tailwind preflight: static SSW markup expects full-width decorative imgs */
.ssw-page-body img {
  max-width: none;
  height: auto;
}
`

const pages = [
  { html: "standingsunwines_v19.html", css: "ssw-base.css" },
  { html: "winery.html", css: "ssw-winery.css" },
  { html: "private-events.html", css: "ssw-private-events.css" },
  { html: "contact.html", css: "ssw-contact.css" },
]

fs.mkdirSync(outDir, { recursive: true })

for (const { html, css } of pages) {
  const htmlPath = path.join(srcDir, html)
  if (!fs.existsSync(htmlPath)) {
    console.warn("Skip (missing):", htmlPath)
    continue
  }
  const raw = fs.readFileSync(htmlPath, "utf8")
  const m = raw.match(/<style>([\s\S]*?)<\/style>/i)
  if (!m) {
    console.warn("No <style> in", html)
    continue
  }
  let body = m[1].trim()
  if (css === "ssw-base.css") {
    body += tailwindSswImgFix
  }
  const out = `/* From ${html} — do not merge with other pages (selector conflicts) */\n${body}\n`
  const outPath = path.join(outDir, css)
  fs.writeFileSync(outPath, out, "utf8")
  console.log("Wrote", outPath, "bytes", out.length)
}

try {
  execFileSync(process.execPath, [path.join(root, "scripts", "extract-hero-hires.mjs")], {
    stdio: "inherit",
    cwd: root,
    env: process.env,
  })
} catch (e) {
  console.warn("extract-hero-hires failed (run manually: npm run extract:hero-hires):", e?.message || e)
}
