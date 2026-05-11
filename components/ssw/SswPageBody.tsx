"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  html: string
  pageSource: string
}

export function SswPageBody({ html, pageSource }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle")
  const [msg, setMsg] = useState<string | null>(null)

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

    const forms = root.querySelectorAll<HTMLFormElement>(
      'form[action*="web3forms"], form[action*="api.web3forms"]',
    )
    const cleanups: Array<() => void> = []

    forms.forEach((form) => {
      const handler = async (e: Event) => {
        e.preventDefault()
        setStatus("sending")
        setMsg(null)
        const fd = new FormData(form)
        const fields: Record<string, string> = {}
        fd.forEach((v, k) => {
          if (typeof v === "string") fields[k] = v
        })
        try {
          const res = await fetch("/api/ssw-contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page: pageSource, fields }),
          })
          const data = (await res.json().catch(() => ({}))) as { error?: string }
          if (!res.ok) {
            setStatus("err")
            setMsg(data.error ?? "Something went wrong.")
            return
          }
          setStatus("ok")
          setMsg("Thanks — we received your message.")
          form.reset()
        } catch {
          setStatus("err")
          setMsg("Network error. Please try again.")
        }
      }
      form.addEventListener("submit", handler)
      cleanups.push(() => form.removeEventListener("submit", handler))
    })

    return () => cleanups.forEach((fn) => fn())
  }, [html, pageSource])

  useEffect(() => {
    if (pageSource !== "contact") return
    const scrollToForm = () => {
      if (window.location.hash !== "#contact-form") return
      const el = document.getElementById("contact-form")
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    scrollToForm()
    const t = window.setTimeout(scrollToForm, 80)
    window.addEventListener("hashchange", scrollToForm)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener("hashchange", scrollToForm)
    }
  }, [html, pageSource])

  return (
    <>
      {msg ? (
        <p
          className="ssw-form-status"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 200,
            padding: "12px 18px",
            background: status === "ok" ? "#1a3d1a" : "#3d1a1a",
            color: "#f9f5e5",
            fontSize: 13,
            maxWidth: 320,
          }}
          role="status"
        >
          {msg}
        </p>
      ) : null}
      <div
        ref={ref}
        className="ssw-page-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}
