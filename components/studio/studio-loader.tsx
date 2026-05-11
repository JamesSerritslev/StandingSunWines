"use client"

import dynamic from "next/dynamic"

const SanityStudio = dynamic(() => import("./sanity-studio"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        color: "#282b2e",
      }}
    >
      Loading studio…
    </div>
  ),
})

export default function StudioLoader() {
  return <SanityStudio />
}
