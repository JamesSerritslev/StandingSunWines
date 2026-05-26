"use client"

import { useEffect, useRef, useState } from "react"
import { FormStatusToast } from "@/components/forms/FormStatusToast"
import { bindInquiryForms, type FormBindStatus } from "@/lib/forms/bind-inquiry-forms"

type Props = {
  html: string
  pageSource: string
}

export function SswPageBody({ html, pageSource }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<FormBindStatus>("idle")
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

    return bindInquiryForms(root, {
      pageSource,
      onStatus: (nextStatus, message) => {
        setStatus(nextStatus)
        setMsg(message)
      },
    })
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
      <FormStatusToast message={msg} status={status} />
      <div
        ref={ref}
        className="ssw-page-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}
