"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { FormStatusToast } from "@/components/forms/FormStatusToast"
import { bindInquiryForms, type FormBindStatus } from "@/lib/forms/bind-inquiry-forms"
import { pinScrollToTop } from "@/lib/ssw/scroll-home-to-top"

const PAGE_HASH_SECTIONS: Record<string, ReadonlySet<string>> = {
  home: new Set([
    "about",
    "winemaker",
    "events",
    "private",
    "contact",
    "gallery",
    "winery",
  ]),
  "private-events": new Set(["types", "inquiry"]),
  winery: new Set(["facility", "serious-wine", "winemaker", "inquiry"]),
}

const PAGE_BODY_CLASS: Record<string, string> = {
  home: "ssw-page-body--home",
  winery: "ssw-page-body--winery",
  contact: "ssw-page-body--contact",
  "private-events": "ssw-page-body--private-events",
}

type Props = {
  html: string
  pageSource: string
}

const PAGE_ENTER_ANIMATION_TARGETS =
  ".hero-logo, .hero-tagline, .hero-ctas, .hero-scroll, .hero-content > *, .hero ~ *"

function resetPageEnterAnimations(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>(PAGE_ENTER_ANIMATION_TARGETS).forEach((el) => {
    el.style.animation = "none"
    void el.offsetHeight
    el.style.removeProperty("animation")
    el.style.removeProperty("transform")
  })
}

export function SswPageBody({ html, pageSource }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const htmlRef = useRef<string | null>(null)
  const [status, setStatus] = useState<FormBindStatus>("idle")
  const [msg, setMsg] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  // Imperatively set HTML only when the prop changes. Using dangerouslySetInnerHTML
  // on every render would wipe inline form feedback injected after submit.
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return

    setReady(false)

    const needsInject = htmlRef.current !== html || root.childElementCount === 0
    if (needsInject) {
      root.innerHTML = html
      htmlRef.current = html

      const heroLogo = root.querySelector<HTMLImageElement>(".hero-logo")
      if (heroLogo) {
        heroLogo.loading = "eager"
        heroLogo.fetchPriority = "high"
        heroLogo.decoding = "async"
      }
    }

    resetPageEnterAnimations(root)

    let outer = 0
    let inner = 0
    outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setReady(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [html, pageSource])

  useEffect(() => {
    if (!msg) return
    const t = window.setTimeout(() => {
      setMsg(null)
      setStatus("idle")
    }, 5200)
    return () => window.clearTimeout(t)
  }, [msg])

  useEffect(() => {
    const root = ref.current
    if (!root) return

    return bindInquiryForms(root, {
      pageSource,
      onStatus: (nextStatus, message) => {
        if (!message) return
        setStatus(nextStatus)
        setMsg(message)
      },
    })
  }, [html, pageSource])

  useEffect(() => {
    if (pageSource === "contact") {
      const pinContactTop = () => {
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname)
        }
        pinScrollToTop()
      }

      pinContactTop()

      const onHashChange = () => {
        const hash = window.location.hash.replace(/^#/, "")
        if (hash === "contact-form") {
          const el = document.getElementById("contact-form")
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
          return
        }
        if (!hash) pinContactTop()
      }

      window.addEventListener("hashchange", onHashChange)
      return () => window.removeEventListener("hashchange", onHashChange)
    }

    if (pageSource === "home") {
      const sections = PAGE_HASH_SECTIONS.home
      const pinHomeTop = () => {
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname)
        }
        pinScrollToTop()
      }

      const scrollToTarget = () => {
        const hash = window.location.hash.replace(/^#/, "")
        if (!hash) {
          pinHomeTop()
          return
        }
        if (!sections.has(hash)) return
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
      }

      scrollToTarget()
      const t = window.setTimeout(scrollToTarget, 80)
      window.addEventListener("hashchange", scrollToTarget)
      return () => {
        window.clearTimeout(t)
        window.removeEventListener("hashchange", scrollToTarget)
      }
    }

    const sections = PAGE_HASH_SECTIONS[pageSource]
    if (!sections) {
      if (!window.location.hash) window.scrollTo(0, 0)
      return
    }

    const scrollToTarget = () => {
      const hash = window.location.hash.replace(/^#/, "")
      if (!hash) {
        pinScrollToTop()
        return
      }
      if (!sections.has(hash)) return
      const el = document.getElementById(hash)
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    scrollToTarget()
    const t = window.setTimeout(scrollToTarget, 80)
    window.addEventListener("hashchange", scrollToTarget)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener("hashchange", scrollToTarget)
    }
  }, [html, pageSource])

  return (
    <>
      <FormStatusToast message={msg} status={status} />
      <div
        ref={ref}
        className={[
          "ssw-page-body",
          PAGE_BODY_CLASS[pageSource] ?? "",
          ready ? "ssw-page-body--ready" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </>
  )
}
