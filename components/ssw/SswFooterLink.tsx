"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { isContactTopHref, isHomeTopHref, pinScrollToTop, scrollContactToTop, scrollHomeToTop } from "@/lib/ssw/scroll-home-to-top"

type Props = {
  href: string
  children: React.ReactNode
}

export function SswFooterLink({ href, children }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Link
      href={href}
      onClick={(e) => {
        if (isHomeTopHref(href)) {
          e.preventDefault()
          if (pathname === "/") {
            scrollHomeToTop()
            pinScrollToTop()
          } else {
            router.push("/")
          }
          return
        }
        if (isContactTopHref(href)) {
          e.preventDefault()
          if (pathname === "/contact") {
            scrollContactToTop()
          } else {
            router.push("/contact")
          }
        }
      }}
    >
      {children}
    </Link>
  )
}
