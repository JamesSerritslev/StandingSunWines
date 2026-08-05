"use client"

import { useEffect, useState } from "react"

type Props = {
  label: string
  /** id of the ticket section this scrolls to */
  targetId: string
}

/**
 * Mobile-only sticky checkout bar. Hides itself once the ticket section is
 * reached so it never sits on top of the widget or the footer.
 */
export function ShowStickyCta({ label, targetId }: Props) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const reached =
          entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight
        setHidden(reached)
      },
      { threshold: 0 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [targetId])

  return (
    <div
      className={`show-sticky-cta${hidden ? " show-sticky-cta--hidden" : ""}`}
      aria-hidden={hidden}
    >
      <a
        href={`#${targetId}`}
        className="btn btn-primary"
        tabIndex={hidden ? -1 : undefined}
      >
        {label}
      </a>
    </div>
  )
}
