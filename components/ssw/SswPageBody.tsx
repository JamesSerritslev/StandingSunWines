"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { FormStatusToast } from "@/components/forms/FormStatusToast"
import { bindInquiryForms, type FormBindStatus } from "@/lib/forms/bind-inquiry-forms"

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
  contact: new Set(["contact-form"]),
}

type Props = {
  html: string
  pageSource: string
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
    if (!root || htmlRef.current === html) return

    root.innerHTML = html
    htmlRef.current = html
    setReady(false)
    const frame = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(frame)
  }, [html])

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
    const sections = PAGE_HASH_SECTIONS[pageSource]
    if (!sections) {
      if (!window.location.hash) window.scrollTo(0, 0)
      return
    }

    const scrollToTarget = () => {
      const hash = window.location.hash.replace(/^#/, "")
      if (!hash) {
        window.scrollTo(0, 0)
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
        className={`ssw-page-body${ready ? " ssw-page-body--ready" : ""}`}
      />
    </>
  )
}
