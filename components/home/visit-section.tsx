import { VisitSectionMap } from "@/components/home/visit-section-map"

export function VisitSection() {
  const hours = [
    { day: "Monday", time: "Closed", closed: true },
    { day: "Tuesday", time: "Closed", closed: true },
    { day: "Wednesday", time: "4pm – 10pm", closed: false },
    { day: "Thursday", time: "4pm – 10pm", closed: false },
    { day: "Friday", time: "3pm – 11pm", closed: false },
    { day: "Saturday", time: "12pm – 11pm", closed: false },
    { day: "Sunday", time: "12pm – 8pm", closed: false },
  ]

  return (
    <section className="relative z-2 min-w-0 max-w-full bg-cream px-4 py-20 sm:px-6 sm:py-24 md:px-10 md:py-28 lg:px-12 lg:py-30">
      <div className="mx-auto grid min-w-0 max-w-[1100px] grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
        {/* Hours */}
        <div className="py-12">
          <p className="font-label text-[10px] tracking-[0.5em] uppercase text-orange mb-4">
            Hours
          </p>
          <h2 className="font-display text-[clamp(34px,4.5vw,52px)] text-coal leading-[1.05] mb-6">
            When We&apos;re <span className="text-orange">Spinning</span>
          </h2>
          <div className="w-12 h-0.5 bg-orange mb-6" />
          <p className="font-body text-[15px] font-normal leading-relaxed text-coal/85 max-w-[560px] mb-6">
            Doors open Thursday through Sunday. Come early to grab a corner,
            stay late to find your favorite record on the shelf.
          </p>

          <div className="border-t-2 border-coal">
            {hours.map((item) => (
              <div
                key={item.day}
                className="flex items-start justify-between gap-3 border-b border-coal/12 py-3.5 sm:items-center sm:py-4"
              >
                <span className="shrink-0 font-label text-[10px] tracking-[0.2em] text-coal uppercase sm:text-[11px] sm:tracking-[0.25em]">
                  {item.day}
                </span>
                <span
                  className={`min-w-0 text-right font-display text-xs sm:text-sm ${
                    item.closed ? "text-folder-dk italic" : "text-coal"
                  }`}
                >
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Visit Info */}
        <div className="bg-coal p-6 text-cream text-left sm:p-8 md:p-10 lg:p-12">
          <p className="font-label text-[10px] tracking-[0.5em] uppercase text-orange mb-4">
            Visit
          </p>
          <h2 className="font-display text-[32px] text-cream mb-6">
            Stop By.
          </h2>

          <div className="mb-7">
            <p className="font-label text-[9px] tracking-[0.4em] uppercase text-orange mb-2">
              Address
            </p>
            <p className="font-display text-base text-cream leading-normal">
              1693 Mission Drive
              <br />
              Suite D2
              <br />
              Solvang, CA 93463
            </p>
          </div>

          <div className="mb-7">
            <p className="font-label text-[9px] tracking-[0.4em] uppercase text-orange mb-2">
              Social
            </p>
            <p className="font-display text-base text-cream">
              <a
                href="https://www.instagram.com/analogueroomsyv"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-orange/50 hover:text-orange transition-colors"
              >
                @analogueroomsyv
              </a>
            </p>
          </div>

          <div>
            <p className="font-label text-[9px] tracking-[0.4em] uppercase text-orange mb-2">
              Sister Property
            </p>
            <p className="font-display text-base text-cream">
              <a
                href="https://www.standingsunwines.com"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-orange/50 hover:text-orange transition-colors"
              >
                Standing Sun Wines →
              </a>
            </p>
          </div>
        </div>
      </div>

      <VisitSectionMap />
    </section>
  )
}
