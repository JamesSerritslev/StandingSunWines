"use client"

import { useEffect, useRef, useState } from "react"
import type { SectionContactForm } from "@/lib/sanity/types"

export function SectionContactForm({ section }: { section: SectionContactForm }) {
  const { eyebrow, titleMain, titleEm, pageSource = "home" } = section
  const formRef = useRef<HTMLFormElement>(null)
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    setMsg(null)
    const form = e.currentTarget
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

  return (
    <section className="contact" id="contact">
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

      {eyebrow ? (
        <p className="eyebrow" style={{ textAlign: "center" }}>
          {eyebrow}
        </p>
      ) : null}
      {(titleMain || titleEm) ? (
        <h2 className="section-title" style={{ textAlign: "center", marginBottom: 14 }}>
          {titleMain}
          {titleEm ? <><br /><em>{titleEm}</em></> : null}
        </h2>
      ) : null}
      <div className="hr" style={{ margin: "18px auto 36px" }} />

      <form ref={formRef} onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" />
        <input type="email" name="email" placeholder="Email" />
        <select name="interest">
          <option value="">I&apos;m interested in...</option>
          <option>Winemaker in Residence / Custom Crush</option>
          <option>Private Event Inquiry</option>
          <option>Live Event / Concert</option>
          <option>General Inquiry</option>
        </select>
        <textarea name="message" placeholder="Tell us about your project or event" rows={5} />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === "sending"}
          style={{ border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}
        >
          {status === "sending" ? "Sending…" : "Send Inquiry"}
        </button>
      </form>
    </section>
  )
}
