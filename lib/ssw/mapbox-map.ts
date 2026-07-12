import type mapboxgl from "mapbox-gl"

const ICON_LAYER_PATTERN =
  /poi|transit|airport|natural-point|water-point|place-|landmark/i

/** Show POI / place icons on Mapbox vector styles (e.g. dark-v11). */
export function enableBasemapIcons(map: mapboxgl.Map) {
  const layers = map.getStyle()?.layers
  if (!layers) return

  for (const layer of layers) {
    if (layer.type !== "symbol") continue
    if (!ICON_LAYER_PATTERN.test(layer.id)) continue

    try {
      map.setLayoutProperty(layer.id, "visibility", "visible")
    } catch {
      /* unsupported */
    }
    try {
      if (typeof layer.minzoom === "number" && layer.minzoom > 12) {
        map.setLayerZoomRange(layer.id, 11, 24)
      }
    } catch {
      /* optional */
    }
    try {
      map.setPaintProperty(layer.id, "icon-opacity", 1)
      map.setPaintProperty(layer.id, "text-opacity", 0.95)
    } catch {
      /* optional */
    }
  }
}

export function createMapMarkerElement(
  kind: "winery" | "user",
): HTMLDivElement {
  const el = document.createElement("div")
  el.className = `ssw-map-marker ssw-map-marker--${kind}`
  el.setAttribute("aria-hidden", "true")

  if (kind === "winery") {
    el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 2v8"/><path d="M8.5 2h7L17 10H7L8.5 2z"/></svg>`
  } else {
    el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="m4.93 4.93 2.12 2.12"/><path d="m16.95 16.95 2.12 2.12"/><path d="M2 12h3"/><path d="M19 12h3"/><path d="m4.93 19.07 2.12-2.12"/><path d="m16.95 7.05 2.12-2.12"/></svg>`
  }

  return el
}
