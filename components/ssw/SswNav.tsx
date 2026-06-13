"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import type { ResolvedNavItem, ResolvedLogo } from "@/lib/site-settings-resolve"
import {
  isContactTopHref,
  isHomeNavItem,
  pinScrollToTop,
  scrollContactToTop,
  scrollHomeToTop,
} from "@/lib/ssw/scroll-home-to-top"

type Props = {
  logo: ResolvedLogo
  items: ResolvedNavItem[]
}

const HOME_SCROLL_SECTIONS = ["about", "events"] as const

function anchorIdFromHref(href: string): string | null {
  const hash = href.includes("#") ? href.split("#").pop() : null
  return hash?.trim() ? hash.trim() : null
}

function readHomeHashSection(): (typeof HOME_SCROLL_SECTIONS)[number] | null {
  const id = window.location.hash.replace(/^#/, "")
  return HOME_SCROLL_SECTIONS.includes(id as (typeof HOME_SCROLL_SECTIONS)[number])
    ? (id as (typeof HOME_SCROLL_SECTIONS)[number])
    : null
}

function readHomeScrollSection(): (typeof HOME_SCROLL_SECTIONS)[number] | null {
  const styles = getComputedStyle(document.documentElement)
  const navOffset = Number.parseFloat(styles.getPropertyValue("--ssw-nav-offset")) || 100
  const probe = navOffset + 40

  let current: (typeof HOME_SCROLL_SECTIONS)[number] | null = null
  for (const id of HOME_SCROLL_SECTIONS) {
    const el = document.getElementById(id)
    if (!el) continue
    const { top, bottom } = el.getBoundingClientRect()
    if (top <= probe && bottom > probe) current = id
  }
  return current
}

function isNavItemActive(
  item: ResolvedNavItem,
  pathname: string,
  homeSection: (typeof HOME_SCROLL_SECTIONS)[number] | null,
): boolean {
  if (item.activeExactPaths.some((p) => pathname === p)) {
    if (isHomeNavItem(item)) {
      return pathname === "/" && !homeSection
    }
    return true
  }
  if (pathname !== "/" || !homeSection) return false
  const anchor = anchorIdFromHref(item.href)
  return anchor === homeSection
}

function NavLinks({
  items,
  pathname,
  homeSection,
  open,
  onNavigate,
  onHomeSectionSelect,
  onHomeTop,
  onContactTop,
}: {
  items: ResolvedNavItem[]
  pathname: string
  homeSection: (typeof HOME_SCROLL_SECTIONS)[number] | null
  open: boolean
  onNavigate: () => void
  onHomeSectionSelect: (id: (typeof HOME_SCROLL_SECTIONS)[number]) => void
  onHomeTop: () => void
  onContactTop: () => void
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
        const active = isNavItemActive(item, pathname, homeSection)
        return (
          <li key={item.key}>
            <Link
              href={item.href}
              className={`${item.classNameHints.cta ? "nav-cta " : ""}${active ? "active " : ""}`.trim()}
              onClick={(e) => {
                if (isHomeNavItem(item)) {
                  e.preventDefault()
                  onHomeTop()
                  onNavigate()
                  return
                }
                if (isContactTopHref(item.href)) {
                  onContactTop()
                  onNavigate()
                  return
                }
                const anchor = anchorIdFromHref(item.href)
                if (
                  pathname === "/" &&
                  anchor &&
                  HOME_SCROLL_SECTIONS.includes(
                    anchor as (typeof HOME_SCROLL_SECTIONS)[number],
                  )
                ) {
                  onHomeSectionSelect(anchor as (typeof HOME_SCROLL_SECTIONS)[number])
                }
                onNavigate()
              }}
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
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [homeSection, setHomeSection] = useState<
    (typeof HOME_SCROLL_SECTIONS)[number] | null
  >(null)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia("(max-width: 900px)")
    const sync = () => setMobile(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (pathname !== "/") {
      setHomeSection(null)
      return
    }

    const hash = window.location.hash.replace(/^#/, "")
    if (!hash) {
      pinScrollToTop()
    }

    const sync = () => {
      setHomeSection(readHomeScrollSection() ?? readHomeHashSection())
    }

    sync()
    const onHash = () => sync()
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        setHomeSection(readHomeScrollSection() ?? readHomeHashSection())
      })
    }

    window.addEventListener("hashchange", onHash)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("hashchange", onHash)
      window.removeEventListener("scroll", onScroll)
    }
  }, [pathname])

  useEffect(() => {
    if (pathname !== "/contact") return
    pinScrollToTop()
  }, [pathname])

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

  const goHomeTop = () => {
    close()
    setHomeSection(null)
    if (pathname === "/") {
      scrollHomeToTop()
      pinScrollToTop()
    } else {
      router.push("/")
    }
  }

  const goContactTop = () => {
    close()
    if (pathname === "/contact") {
      scrollContactToTop()
    } else {
      router.push("/contact")
    }
  }

  const links = (
    <NavLinks
      items={items}
      pathname={pathname}
      homeSection={homeSection}
      open={open}
      onNavigate={close}
      onHomeSectionSelect={setHomeSection}
      onHomeTop={goHomeTop}
      onContactTop={goContactTop}
    />
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
        <button
          type="button"
          className="nav-logo-wrap"
          aria-label="Go to top of home page"
          onClick={goHomeTop}
        >
          <Image
            className="nav-logo-mark"
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            style={{ width: "auto", height: "72px" }}
            priority
            sizes="180px"
            unoptimized
          />
        </button>
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
