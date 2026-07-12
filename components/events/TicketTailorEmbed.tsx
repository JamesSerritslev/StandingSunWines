"use client"

import { useEffect, useRef } from "react"

type Props = {
  /** Ticket Tailor box office URL from Promote → Website embed codes */
  boxOfficeUrl?: string
}

const WIDGET_SCRIPT = "https://cdn.tickettailor.com/js/widgets/min/widget.js"

/** Renders the Ticket Tailor widget when configured; otherwise nothing (no public placeholder). */
export function TicketTailorEmbed({ boxOfficeUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const url = boxOfficeUrl?.trim()

  useEffect(() => {
    const root = containerRef.current
    if (!root || !url) return

    root.replaceChildren()
    const script = document.createElement("script")
    script.src = WIDGET_SCRIPT
    script.async = true
    script.setAttribute("data-url", url)
    script.setAttribute("data-type", "widget")
    root.appendChild(script)

    return () => {
      root.replaceChildren()
    }
  }, [url])

  if (!url) return null

  return <div className="tt-widget" ref={containerRef} />
}
