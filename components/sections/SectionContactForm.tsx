"use client"

import { useEffect, useRef, useState } from "react"
import type { SectionContactForm } from "@/lib/sanity/types"
import { onFormEngage } from "@/lib/forms/location"
import { formDataToFields, submitInquiry } from "@/lib/forms/submit-inquiry"

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
    const fields = formDataToFields(form)
    const result = await submitInquiry(pageSource, fields)
    if (!result.ok) {
      setStatus("err")
      setMsg(result.error)
      return
    }
    setStatus("ok")
    setMsg("Thanks, you're on the list.")
    form.reset()
  }

  return (
    <section className="contact" id="contact">
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

      <form
        ref={formRef}
        className="ssw-inquiry-form"
        action="#"
        method="post"
        onSubmit={handleSubmit}
        onFocusCapture={() => onFormEngage()}
        onInputCapture={() => onFormEngage()}
      >
        <input type="hidden" name="interest" value="Newsletter" />
        <input type="text" name="first_name" placeholder="First Name" required />
        <input type="text" name="last_name" placeholder="Last Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="tel" name="phone" placeholder="Phone (optional)" />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === "sending"}
          style={{ border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}
        >
          {status === "sending" ? "Sending…" : "Subscribe"}
        </button>
      </form>

      {status === "ok" ? (
        <div className="ssw-form-feedback-wrap">
          <p className="ssw-form-feedback" data-state="ok" role="status">
            Thanks, you&apos;re on the list. We&apos;ll be in touch soon.
          </p>
        </div>
      ) : status === "err" && msg ? (
        <div className="ssw-form-feedback-wrap">
          <p className="ssw-form-feedback" data-state="err" role="alert">
            {msg}
          </p>
        </div>
      ) : status === "sending" ? (
        <div className="ssw-form-feedback-wrap">
          <p className="ssw-form-feedback" data-state="sending" role="status">
            Subscribing…
          </p>
        </div>
      ) : null}
    </section>
  )
}
