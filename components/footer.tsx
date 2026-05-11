import Link from "next/link"
import Image from "next/image"
import { NewsletterSignupForm } from "@/components/newsletter-signup-form"

export function Footer() {
  return (
    <footer className="relative z-2 min-w-0 max-w-full overflow-x-hidden bg-coal px-4 py-16 text-cream sm:px-6 sm:py-20 md:px-10 md:py-22 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 grid max-md:grid-cols-[auto_auto] max-md:items-center max-md:justify-center max-md:gap-x-2.5 max-md:gap-y-8 md:mb-14 md:grid-cols-[auto_1fr_auto] md:items-start md:justify-normal md:gap-14 lg:gap-16">
          {/* Logo — smaller + centered in column below md; same row as tagline */}
          <div className="max-md:col-start-1 max-md:row-start-1 max-md:justify-self-center md:col-start-1 md:row-start-1 md:justify-self-start">
            <Link
              href="/"
              className="inline-flex shrink-0 rounded-full outline outline-2 outline-orange outline-offset-2 md:outline-offset-4"
            >
              <Image
                src="/images/ar-logo.png"
                alt="The Analogue Room"
                width={80}
                height={80}
                className="h-16 w-16 rounded-full object-contain md:h-20 md:w-20"
              />
            </Link>
          </div>

          {/* Tagline & Social — below md: `contents` so tagline shares row 1 with logo, Instagram row 2 */}
          <div className="max-md:contents md:col-start-2 md:row-start-1 md:flex md:flex-col md:items-center md:gap-6 md:text-center">
            <p className="font-display mb-0 max-md:col-start-2 max-md:row-start-1 max-md:min-w-0 max-md:text-center max-md:leading-snug text-sm text-cream/80 md:mb-6 md:text-center">
              Curation. <em className="not-italic text-orange">Intention.</em> Analogue.
            </p>
            <div className="flex max-md:col-span-2 max-md:row-start-2 justify-center md:justify-center">
              <a
                href="https://www.instagram.com/analogueroomsyv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-orange px-5 py-3 font-label text-[11px] tracking-[0.28em] uppercase text-orange transition-colors hover:bg-orange hover:text-coal sm:min-h-0 sm:py-2.5 sm:tracking-[0.3em]"
              >
                Follow @analogueroomsyv
              </a>
            </div>
          </div>

          {/* Address — centered below md; right-aligned in grid from md up */}
          <div className="max-md:col-span-2 max-md:row-start-3 text-center md:col-start-3 md:row-start-1 md:text-right">
            <p className="text-[13px] leading-relaxed text-cream/70">
              <strong className="font-label text-[10px] tracking-[0.3em] uppercase text-orange block mb-2">
                The Analogue Room
              </strong>
              1693 Mission Drive, Ste D2
              <br />
              Solvang, CA 93463
            </p>
            <div className="mt-6">
              <a
                href="https://www.standingsunwines.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-label text-[10px] tracking-[0.3em] uppercase text-orange border-b border-orange/40 pb-0.5 hover:text-cream transition-colors"
              >
                Visit Standing Sun Wines →
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mb-12 max-w-md border-t border-cream/10 pt-10 md:max-w-lg">
          <NewsletterSignupForm />
        </div>

        {/* Copyright */}
        <p className="text-center font-label text-[10px] tracking-[0.3em] uppercase text-cream/40 border-t border-cream/10 pt-6">
          © 2025 The Analogue Room · Solvang, California
        </p>
      </div>
    </footer>
  )
}
