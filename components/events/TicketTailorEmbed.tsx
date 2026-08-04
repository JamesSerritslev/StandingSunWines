"use client"

import { useEffect, useRef } from "react"

type Props = {
  /** Ticket Tailor box office URL from Promote → Website embed codes */
  boxOfficeUrl?: string
}

const WIDGET_SCRIPT = "https://cdn.tickettailor.com/js/widgets/min/widget.js"

/** Standing Sun Live box office — from Ticket Tailor embed code */
export const DEFAULT_TICKET_TAILOR_URL =
  "https://www.tickettailor.com/all-tickets-by-date/standingsunwines/?ref=website_widget"

/** Renders the Ticket Tailor inline widget (matches their official embed attributes). */
export function TicketTailorEmbed({
  boxOfficeUrl = DEFAULT_TICKET_TAILOR_URL,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const url = boxOfficeUrl.trim() || DEFAULT_TICKET_TAILOR_URL

  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    root.replaceChildren()

    const fallback = document.createElement("div")
    fallback.className = "tt-widget-fallback"
    fallback.innerHTML = `<p><a href="${url}" target="_blank" rel="noopener noreferrer">Click here to buy tickets</a></p>`
    root.appendChild(fallback)

    const script = document.createElement("script")
    script.src = WIDGET_SCRIPT
    script.async = true
    script.setAttribute("data-url", url)
    script.setAttribute("data-type", "inline")
    script.setAttribute("data-inline-minimal", "true")
    script.setAttribute("data-inline-show-logo", "false")
    script.setAttribute("data-inline-bg-fill", "false")
    script.setAttribute("data-inline-inherit-ref-from-url-param", "")
    script.setAttribute("data-inline-ref", "website_widget")
    root.appendChild(script)

    return () => {
      root.replaceChildren()
    }
  }, [url])

  return <div className="tt-widget" ref={containerRef} />
}
