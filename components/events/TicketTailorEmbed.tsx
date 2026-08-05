"use client"

import { useEffect, useRef } from "react"

type Props = {
  /**
   * Ticket Tailor URL from Promote → Website embed codes.
   * Prefer a checkout/new-session URL so the widget shows quantity + buy,
   * not the event page (which surfaces "Manage tickets").
   */
  boxOfficeUrl?: string
}

const WIDGET_SCRIPT = "https://cdn.tickettailor.com/js/widgets/min/widget.js"

/** All Standing Sun Live shows — fallback when a page does not name a checkout */
export const DEFAULT_TICKET_TAILOR_URL =
  "https://www.tickettailor.com/all-tickets-by-date/standingsunwines/?ref=website_widget"

/**
 * Renders the Ticket Tailor inline widget.
 * Attributes match their official embed; do not invent extras.
 */
export function TicketTailorEmbed({
  boxOfficeUrl = DEFAULT_TICKET_TAILOR_URL,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const url = boxOfficeUrl.trim() || DEFAULT_TICKET_TAILOR_URL

  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    root.replaceChildren()

    // Ticket Tailor's loader only boots once per script URL. Drop any prior
    // copy so a fresh load picks up this container's data-* attributes.
    document
      .querySelectorAll(`script[src^="${WIDGET_SCRIPT}"]`)
      .forEach((node) => node.remove())

    // Only surface a manual link if the widget never renders (blocked script,
    // ad blocker, offline). Otherwise it just duplicates the checkout button.
    const showFallback = () => {
      if (root.querySelector("iframe") || root.querySelector(".tt-widget-fallback")) return
      const fallback = document.createElement("div")
      fallback.className = "tt-widget-fallback"
      fallback.innerHTML = `<p><a href="${url}" target="_blank" rel="noopener noreferrer">Buy tickets on Ticket Tailor</a></p>`
      root.appendChild(fallback)
    }
    const fallbackTimer = window.setTimeout(showFallback, 6000)

    const script = document.createElement("script")
    script.src = `${WIDGET_SCRIPT}?t=${Date.now()}`
    script.async = true
    script.setAttribute("data-url", url)
    script.setAttribute("data-type", "inline")
    script.setAttribute("data-inline-minimal", "false")
    script.setAttribute("data-inline-show-logo", "false")
    script.setAttribute("data-inline-bg-fill", "true")
    script.setAttribute("data-inline-inherit-ref-from-url-param", "")
    script.setAttribute("data-inline-ref", "website_widget")
    script.addEventListener("error", showFallback)
    root.appendChild(script)

    return () => {
      window.clearTimeout(fallbackTimer)
      script.removeEventListener("error", showFallback)
      root.replaceChildren()
    }
  }, [url])

  return <div className="tt-widget" ref={containerRef} />
}
