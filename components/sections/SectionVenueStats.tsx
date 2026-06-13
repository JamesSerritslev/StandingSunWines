import type { SectionVenueStats } from "@/lib/sanity/types"
import type { VenueStatDisplay } from "@/lib/host-event-venue-stats"

interface Props {
  section: SectionVenueStats
  stats: VenueStatDisplay[]
}

export function SectionVenueStats({ section, stats }: Props) {
  const { eyebrow, title } = section

  return (
    <section className="bg-coal/[0.04] px-4 py-16 sm:px-6 md:px-10 lg:px-12">
      <div className="mx-auto max-w-[960px] text-center md:text-left">
        {eyebrow ? (
          <p className="font-label mb-3 uppercase text-orange-accent">{eyebrow}</p>
        ) : null}
        {title ? (
          <h2 className="font-display mb-10 text-[clamp(28px,3.8vw,40px)] leading-tight text-coal">{title}</h2>
        ) : null}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((row) => (
            <div key={row.label} className="border-l-[3px] border-orange px-6 py-4">
              <p className="font-display text-[clamp(32px,4vw,48px)] leading-none text-coal">{row.value}</p>
              <p className="mt-3 font-body text-[13px] uppercase tracking-[0.2em] text-coal/60">{row.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
