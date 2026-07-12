import { createRoot, type Root } from "react-dom/client"
import { SswMapboxMap } from "@/components/ssw/SswMapboxMap"

/** Mount Mapbox maps into `[data-ssw-map]` placeholders inside prepared SSW HTML. */
export function mountSswMaps(container: HTMLElement): () => void {
  const roots: Root[] = []

  container.querySelectorAll<HTMLElement>("[data-ssw-map]").forEach((el) => {
    el.innerHTML = ""
    const root = createRoot(el)
    root.render(<SswMapboxMap />)
    roots.push(root)
  })

  return () => {
    for (const root of roots) root.unmount()
  }
}
