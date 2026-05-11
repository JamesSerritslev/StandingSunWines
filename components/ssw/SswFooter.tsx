import Image from "next/image"
import Link from "next/link"

export function SswFooter() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <Image
            className="footer-logo"
            src="/images/ssw/ssw-d553bb7215e2dee2.png"
            alt="Standing Sun Wines"
            width={160}
            height={80}
          />
        </div>
        <div className="footer-nav-group">
          <div className="footer-col">
            <Link href="/">Home</Link>
            <Link href="/#about">About</Link>
            <Link href="/winery">The Winery</Link>
          </div>
          <div className="footer-col">
            <Link href="/#events">Live Events</Link>
            <Link href="/private-events">Private Events</Link>
            <Link href="/contact#contact-form">Contact</Link>
          </div>
        </div>
        <div className="footer-addr">
          <strong>Standing Sun Wines</strong>
          <p>
            92 2nd Street
            <br />
            Buellton, CA 93427
          </p>
        </div>
      </div>
      <p className="footer-copy">
        © {new Date().getFullYear()} Standing Sun Wines · All Rights Reserved · Buellton, California
      </p>
    </footer>
  )
}
