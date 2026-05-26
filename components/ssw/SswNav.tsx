"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import type { ResolvedNavItem, ResolvedLogo } from "@/lib/site-settings-resolve"

type Props = {
  logo: ResolvedLogo
  items: ResolvedNavItem[]
}

function NavLinks({
  items,
  pathname,
  open,
  onNavigate,
}: {
  items: ResolvedNavItem[]
  pathname: string
  open: boolean
  onNavigate: () => void
}) {
  return (
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
                onClick={onNavigate}
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
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function SswNav({ logo, items }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia("(max-width: 900px)")
    const sync = () => setMobile(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

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

  const close = () => setOpen(false)

  const links = (
    <NavLinks items={items} pathname={pathname} open={open} onNavigate={close} />
  )

  const mobileDrawer =
    mounted && mobile
      ? createPortal(
          <>
            {open ? (
              <button
                type="button"
                className="ssw-nav-overlay"
                aria-label="Close menu"
                onClick={close}
              />
            ) : null}
            {links}
          </>,
          document.body,
        )
      : null

  return (
    <>
      <nav>
        <Link href="/" className="nav-logo-wrap" onClick={close}>
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
          {!mobile ? links : null}
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
      {mobileDrawer}
    </>
  )
}
