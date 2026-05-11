"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/host-event", label: "Host Your Event" },
]

const NAV_LINK_CLASS =
  "font-label text-[11px] tracking-[0.22em] sm:tracking-[0.28em] md:tracking-[0.3em] uppercase transition-colors duration-200"

export function Navigation() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [menuOpen])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between gap-3 border-b border-coal/8 bg-cream/92 px-4 py-3 backdrop-blur-md sm:px-6 md:px-10 lg:px-12 lg:py-4"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <Link href="/" className="z-50 flex shrink-0 items-center" onClick={() => setMenuOpen(false)}>
          <Image
            src="/images/ar-logo.png"
            alt="The Analogue Room"
            width={60}
            height={60}
            className="h-11 w-11 object-contain sm:h-12 sm:w-12 lg:h-[60px] lg:w-[60px]"
            priority
          />
        </Link>

        <ul className="hidden items-center justify-end gap-3 lg:flex xl:gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${NAV_LINK_CLASS} inline-flex min-h-10 items-center border-b pb-0.5 ${
                  pathname === link.href
                    ? "border-orange text-orange"
                    : "border-transparent text-coal hover:text-orange"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://www.standingsunwines.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${NAV_LINK_CLASS} inline-flex min-h-10 items-center border-b border-spanish-dk/40 pb-0.5 text-spanish-dk hover:text-orange`}
            >
              Standing Sun Wines
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/analogueroomsyv"
              target="_blank"
              rel="noopener noreferrer"
              className={`${NAV_LINK_CLASS} inline-flex min-h-10 items-center bg-orange px-4 py-2.5 text-cream hover:bg-spanish sm:px-5`}
            >
              Instagram
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-sm border border-coal/15 text-coal lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="site-mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile / small tablet: slide-over menu */}
      <div
        className={`fixed inset-0 z-[90] lg:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-coal/45 transition-opacity duration-200 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{ top: "max(5.25rem, calc(3.5rem + env(safe-area-inset-top)))" }}
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        />
        <div
          id="site-mobile-nav"
          className={`absolute bottom-0 right-0 z-[95] flex w-[min(100%,20rem)] flex-col border-l border-coal/10 bg-cream shadow-xl transition-transform duration-200 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{
            top: "max(5.25rem, calc(3.5rem + env(safe-area-inset-top)))",
            paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
          }}
        >
          <div className="border-b border-coal/10 px-5 py-4">
            <p className="font-label text-[9px] tracking-[0.35em] uppercase text-orange">Menu</p>
          </div>
          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-3" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-sm px-3 py-3.5 font-label text-[12px] tracking-[0.25em] uppercase transition-colors ${
                  pathname === link.href ? "bg-orange/12 text-orange" : "text-coal active:bg-coal/8"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.standingsunwines.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm px-3 py-3.5 font-label text-[12px] tracking-[0.25em] uppercase text-spanish-dk active:bg-coal/8"
            >
              Standing Sun Wines
            </a>
            <a
              href="https://www.instagram.com/analogueroomsyv"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-3 mt-2 inline-flex min-h-11 items-center justify-center bg-orange px-4 py-3 font-label text-[11px] tracking-[0.28em] uppercase text-cream"
            >
              Instagram
            </a>
          </nav>
        </div>
      </div>
    </>
  )
}
