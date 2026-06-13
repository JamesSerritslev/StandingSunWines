import Image from "next/image"

import type { ResolvedSiteSettings } from "@/lib/site-settings-resolve"
import { SswFooterLink } from "./SswFooterLink"

export function SswFooter({
  footerLogo,
  footerColumnLeft,
  footerColumnRight,
  footerAddressTitle,
  footerAddressLines,
  copyrightSuffix,
}: Pick<
  ResolvedSiteSettings,
  | "footerLogo"
  | "footerColumnLeft"
  | "footerColumnRight"
  | "footerAddressTitle"
  | "footerAddressLines"
  | "copyrightSuffix"
>) {
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="footer-grid">
        <div>
          <Image
            className="footer-logo"
            src={footerLogo.src}
            alt={footerLogo.alt}
            width={footerLogo.width}
            height={footerLogo.height}
            style={{ width: "160px", height: "auto" }}
            unoptimized
          />
        </div>
        <div className="footer-nav-group">
          <div className="footer-col">
            {footerColumnLeft.map((link) => (
              <SswFooterLink key={link.href + link.label} href={link.href}>
                {link.label}
              </SswFooterLink>
            ))}
          </div>
          <div className="footer-col">
            {footerColumnRight.map((link) => (
              <SswFooterLink key={link.href + link.label} href={link.href}>
                {link.label}
              </SswFooterLink>
            ))}
          </div>
        </div>
        <div className="footer-addr">
          <strong>{footerAddressTitle}</strong>
          <p>
            {footerAddressLines.map((line, i) => (
              <span key={`${line}-${i}`}>
                {line}
                {i < footerAddressLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        </div>
      </div>
      <p className="footer-copy">
        © {year} {copyrightSuffix}
      </p>
    </footer>
  )
}
