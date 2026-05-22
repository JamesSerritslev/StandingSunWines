"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import type { ResolvedNavItem, ResolvedLogo } from "@/lib/site-settings-resolve"

type Props = {
  logo: ResolvedLogo
  items: ResolvedNavItem[]
}

export function SswNav({ logo, items }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <nav>
        <Link href="/" className="nav-logo-wrap" onClick={() => setOpen(false)}>
          <Image
            className="nav-logo-mark"
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            priority
            sizes="180px"
            unoptimized
          />
        </Link>
        <div className="nav-end">
          <ul className={`nav-links ${open ? "nav-links-open" : ""}`}>
            {items.map((item) => {
              if (item.external) {
                return (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      className={item.classNameHints.analogue ? "nav-analogue" : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              }
              const active = item.activeExactPaths.some((p) => pathname === p)
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={`${item.classNameHints.cta ? "nav-cta " : ""}${active ? "active " : ""}`.trim()}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            className="ssw-nav-toggle"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="ssw-nav-toggle-bar" aria-hidden />
            <span className="ssw-nav-toggle-bar" aria-hidden />
            <span className="ssw-nav-toggle-bar" aria-hidden />
          </button>
        </div>
      </nav>
      {open ? (
        <button
          type="button"
          className="ssw-nav-overlay"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </>
  )
}
