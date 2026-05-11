"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

type InternalNavItem = {
  key: string
  href: string
  label: string
  match: (pathname: string) => boolean
  cta?: boolean
}

type ExternalNavItem = {
  key: string
  href: string
  label: string
  external: true
  analogue?: boolean
}

type NavItem = InternalNavItem | ExternalNavItem

const navItems: NavItem[] = [
  { key: "home", href: "/", label: "Home", match: (p) => p === "/" },
  { key: "about", href: "/#about", label: "About", match: () => false },
  { key: "winery", href: "/winery", label: "The Winery", match: (p) => p === "/winery" },
  { key: "events", href: "/#events", label: "Live Events", match: () => false },
  { key: "gallery", href: "/#gallery", label: "Gallery", match: () => false },
  {
    key: "private",
    href: "/private-events",
    label: "Private Events",
    match: (p) => p === "/private-events",
  },
  {
    key: "analogue",
    href: "https://analogueroom.com",
    label: "The Analogue Room",
    external: true,
    analogue: true,
  },
  {
    key: "contact",
    href: "/contact#contact-form",
    label: "Contact",
    match: (p) => p === "/contact",
    cta: true,
  },
]

export function SswNav() {
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
            src="/images/ssw/ssw-3a30683668704b66.png"
            alt="Standing Sun Wines"
            width={180}
            height={72}
            priority
          />
        </Link>
        <div className="nav-end">
          <ul className={`nav-links ${open ? "nav-links-open" : ""}`}>
            {navItems.map((item) => {
              if ("external" in item && item.external) {
                return (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      className={item.analogue ? "nav-analogue" : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              }
              const { key, href, label, match, cta } = item as InternalNavItem
              const active = match(pathname)
              return (
                <li key={key}>
                  <Link
                    href={href}
                    className={`${cta ? "nav-cta " : ""}${active ? "active " : ""}`.trim()}
                    onClick={() => setOpen(false)}
                  >
                    {label}
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
