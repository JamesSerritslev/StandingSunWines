export function RoomSection() {
  return (
    <section className="relative z-2 bg-cream px-4 py-20 sm:px-6 sm:py-24 md:px-10 md:py-28 lg:px-12 lg:py-30">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
        {/* Text */}
        <div>
          <p className="font-label text-[10px] tracking-[0.5em] uppercase text-orange mb-4">
            The Space
          </p>
          <h2 className="font-display text-[clamp(36px,5vw,56px)] text-coal leading-[1.05] mb-6">
            A Place to <span className="text-orange">Slow Down</span>
          </h2>
          <div className="w-12 h-0.5 bg-orange mb-6" />
          <p className="font-body text-[15px] font-normal leading-relaxed text-coal/85 max-w-[560px] mb-6">
            The Analogue Room is a vinyl bar and record lounge in Solvang, California — a space designed for those who believe the best moments come with a glass in your hand and a needle in the groove.
          </p>
          <p className="font-body text-[15px] font-normal leading-relaxed text-coal/85 max-w-[560px]">
            We&apos;re not a club. We&apos;re not a museum. We&apos;re a room. A warm, intentional, beautifully cluttered room where the music breathes, the drinks are thoughtful, and the conversation finds its rhythm.
          </p>
        </div>

        {/* Vinyl Visual */}
        <div className="aspect-square relative animate-spin-slow">
          <div
            className="w-full h-full rounded-full shadow-2xl"
            style={{
              background: `
                radial-gradient(circle at center, var(--coal) 0%, var(--coal) 28%, transparent 28.5%),
                radial-gradient(circle at center, transparent 28%, rgba(40,43,46,0.08) 28%, transparent 30%),
                repeating-radial-gradient(circle at center, var(--coal) 30%, var(--coal) calc(30% + 1px), transparent calc(30% + 1px), transparent calc(30% + 4px)),
                var(--orange)
              `,
              boxShadow: '0 30px 60px rgba(40,43,46,0.25), inset 0 0 100px rgba(40,43,46,0.15)',
            }}
          >
            {/* Center label */}
            <div className="absolute inset-[46%] bg-orange rounded-full border border-coal shadow-md" />
            {/* Spindle */}
            <div className="absolute top-[48%] left-[48%] w-[4%] h-[4%] bg-coal rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
