/** Scroll to the home hero and drop any hash (e.g. /#events → /). */
export function scrollHomeToTop(behavior: ScrollBehavior = "smooth") {
  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname)
  }
  window.scrollTo({ top: 0, left: 0, behavior })
}

/** Scroll to the contact hero and drop any hash (e.g. /contact#contact-form → /contact). */
export function scrollContactToTop(behavior: ScrollBehavior = "smooth") {
  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname)
  }
  window.scrollTo({ top: 0, left: 0, behavior })
}

/** Beat browser / Next.js scroll restoration after client navigation. */
export function pinScrollToTop() {
  const snap = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  snap()
  requestAnimationFrame(snap)
  window.setTimeout(snap, 0)
  window.setTimeout(snap, 80)
  window.setTimeout(snap, 350)
}

/** @deprecated Use pinScrollToTop */
export const pinHomeScrollToTop = pinScrollToTop

export function isHomeTopHref(href: string): boolean {
  const hashIndex = href.indexOf("#")
  const path = (hashIndex === -1 ? href : href.slice(0, hashIndex)) || "/"
  return path === "/" && hashIndex === -1
}

export function isHomeNavItem(item: { key: string; href: string }): boolean {
  return item.key === "home" || isHomeTopHref(item.href)
}

export function isContactTopHref(href: string): boolean {
  const hashIndex = href.indexOf("#")
  const path = (hashIndex === -1 ? href : href.slice(0, hashIndex)) || "/"
  return path === "/contact" && hashIndex === -1
}
