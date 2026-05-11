"use client"

import dynamic from "next/dynamic"

const VenueMap = dynamic(() => import("@/components/VenueMap"), {
  ssr: false,
})

export function VisitSectionMap() {
  return (
    <div className="mx-auto mt-12 w-full min-w-0 max-w-[1100px] overflow-hidden rounded-sm border-2 border-coal/10 sm:mt-14 md:mt-16">
      <VenueMap />
    </div>
  )
}
