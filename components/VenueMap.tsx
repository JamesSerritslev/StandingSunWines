"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Nudged south 0.0001° lat (~11 m); use smaller steps by changing this delta.
const DESTINATION: [number, number] = [-120.138116 + 0.000005, 34.59649 - 0.0002]

export default function VenueMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (map.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token || !mapContainer.current) return

    mapboxgl.accessToken = token

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: DESTINATION,
      zoom: 17,
    })

    new mapboxgl.Marker({ color: "#E24B4A" })
      .setLngLat(DESTINATION)
      .setPopup(
        new mapboxgl.Popup().setText(
          "Suite D2 — enter under the 2nd floor overhang"
        )
      )
      .addTo(map.current)

    map.current.on("load", () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const user: [number, number] = [
            pos.coords.longitude,
            pos.coords.latitude,
          ]

          new mapboxgl.Marker({ color: "#185FA5" })
            .setLngLat(user)
            .addTo(map.current!)

          fetch(
            `https://api.mapbox.com/directions/v5/mapbox/walking/${user[0]},${user[1]};${DESTINATION[0]},${DESTINATION[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
          )
            .then((r) => r.json())
            .then((data) => {
              const route = data.routes?.[0]?.geometry
              if (!route || !map.current) return
              map.current.addSource("route", {
                type: "geojson",
                data: { type: "Feature", geometry: route, properties: {} },
              })
              map.current.addLayer({
                id: "route",
                type: "line",
                source: "route",
                paint: {
                  "line-color": "#185FA5",
                  "line-width": 4,
                  "line-opacity": 0.8,
                },
              })
            })
        },
        () => {
          /* geolocation denied or unavailable */
        }
      )
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  return (
    <div
      ref={mapContainer}
      className="h-[min(52dvh,420px)] max-w-full min-w-0 overflow-hidden sm:h-[min(48dvh,460px)] md:h-[480px] lg:h-[500px]"
    />
  )
}
