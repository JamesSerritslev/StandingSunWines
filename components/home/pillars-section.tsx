export function PillarsSection() {
  const pillars = [
    {
      num: "01",
      title: "Curation",
      description:
        "A rotating selection of wines, beers, and non-alcoholic offerings — chosen with care, served with context. Every record on the wall, every bottle on the shelf.",
    },
    {
      num: "02",
      title: "Intention",
      description:
        "Nothing here is by accident. The lighting, the volume, the pour. We design a room that asks you to be present, to listen, to settle in.",
    },
    {
      num: "03",
      title: "Analogue",
      description:
        "Vinyl, played properly. No algorithms. No skips. The full album, the way the artist meant it. A return to the analogue way of listening.",
    },
  ]

  return (
    <section className="relative z-2 bg-coal px-4 py-20 text-cream sm:px-6 sm:py-24 md:px-10 md:py-28 lg:px-12 lg:py-30">
      {/* Header */}
      <div className="mx-auto mb-12 max-w-[680px] text-center sm:mb-16 md:mb-20">
        <p className="font-label text-[10px] tracking-[0.5em] uppercase text-orange mb-4">
          Our Approach
        </p>
        <h2 className="font-display text-[clamp(36px,5vw,56px)] text-cream leading-[1.05] mb-6">
          Three Words.
          <br />
          One <span className="text-orange">Room</span>.
        </h2>
        <div className="w-12 h-0.5 bg-orange mx-auto mb-6" />
        <p className="font-body text-[15px] font-normal leading-relaxed text-cream/70 max-w-[560px] mx-auto">
          Everything we do is anchored in three principles. They&apos;re our compass, our standard, and our invitation to slow down.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 sm:gap-10 md:grid-cols-3 md:gap-12">
        {pillars.map((pillar) => (
          <div
            key={pillar.num}
            className="border border-cream/12 px-4 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-orange hover:bg-orange/4 sm:px-6 sm:py-10"
          >
            <p className="font-display text-5xl text-orange/80 leading-none mb-4">
              {pillar.num}
            </p>
            <h3 className="font-display text-2xl text-cream mb-3.5">
              {pillar.title}
            </h3>
            <div className="w-8 h-px bg-orange mx-auto mb-4" />
            <p className="font-body text-[13px] leading-relaxed text-cream/70">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
