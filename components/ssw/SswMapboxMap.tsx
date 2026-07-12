"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import {
  getNativeMapsUrl,
  STANDING_SUN_LOCATION,
} from "@/lib/site-location"
import {
  createMapMarkerElement,
  enableBasemapIcons,
} from "@/lib/ssw/mapbox-map"

const ROUTE_SOURCE_ID = "ssw-user-route"
const ROUTE_LAYER_ID = "ssw-user-route-line"

async function fetchDrivingRoute(
  token: string,
  from: [number, number],
  to: [number, number],
): Promise<GeoJSON.LineString | null> {
  const coords = `${from[0]},${from[1]};${to[0]},${to[1]}`
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${encodeURIComponent(token)}`

  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = (await res.json()) as {
      routes?: Array<{ geometry?: GeoJSON.LineString }>
    }
    return data.routes?.[0]?.geometry ?? null
  } catch {
    return null
  }
}

export function SswMapboxMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [userCoords, setUserCoords] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [nativeMapsHref, setNativeMapsHref] = useState(
    STANDING_SUN_LOCATION.directionsUrl,
  )

  useEffect(() => {
    setNativeMapsHref(
      getNativeMapsUrl(
        userCoords
          ? { fromLat: userCoords.lat, fromLng: userCoords.lng }
          : undefined,
      ),
    )
  }, [userCoords])

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim()
    const container = containerRef.current
    if (!token || !container) return

    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/mapbox/streets-v12",
      center: STANDING_SUN_LOCATION.coordinates,
      zoom: 15,
      attributionControl: true,
    })

    map.once("load", () => {
      enableBasemapIcons(map)
    })

    const popupHtml = [
      "<strong>Standing Sun Wines</strong>",
      `${STANDING_SUN_LOCATION.street}<br/>${STANDING_SUN_LOCATION.cityStateZip}`,
      `<a href="${STANDING_SUN_LOCATION.directionsUrl}" target="_blank" rel="noopener noreferrer" style="color:#d4713a">Get directions</a>`,
    ].join("<br/>")

    new mapboxgl.Marker({ element: createMapMarkerElement("winery") })
      .setLngLat(STANDING_SUN_LOCATION.coordinates)
      .setPopup(new mapboxgl.Popup({ offset: 28 }).setHTML(popupHtml))
      .addTo(map)

    let userMarker: mapboxgl.Marker | null = null
    let locationRequested = false
    let cancelled = false

    const showUserRoute = async (userCoords: [number, number]) => {
      if (cancelled) return
      userMarker?.remove()
      userMarker = new mapboxgl.Marker({ element: createMapMarkerElement("user") })
        .setLngLat(userCoords)
        .setPopup(
          new mapboxgl.Popup({ offset: 20 }).setText("Your location"),
        )
        .addTo(map)

      const geometry = await fetchDrivingRoute(
        token,
        userCoords,
        STANDING_SUN_LOCATION.coordinates,
      )

      if (cancelled) return

      if (geometry) {
        const existing = map.getSource(ROUTE_SOURCE_ID)
        if (existing) {
          ;(existing as mapboxgl.GeoJSONSource).setData({
            type: "Feature",
            properties: {},
            geometry,
          })
        } else {
          map.addSource(ROUTE_SOURCE_ID, {
            type: "geojson",
            data: { type: "Feature", properties: {}, geometry },
          })
          map.addLayer({
            id: ROUTE_LAYER_ID,
            type: "line",
            source: ROUTE_SOURCE_ID,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#d4713a",
              "line-width": 4,
              "line-opacity": 0.9,
            },
          })
        }

        const bounds = new mapboxgl.LngLatBounds()
        for (const [lng, lat] of geometry.coordinates) {
          bounds.extend([lng, lat])
        }
        map.fitBounds(bounds, { padding: 56, maxZoom: 14, duration: 800 })
      } else {
        const bounds = new mapboxgl.LngLatBounds()
        bounds.extend(userCoords)
        bounds.extend(STANDING_SUN_LOCATION.coordinates)
        map.fitBounds(bounds, { padding: 56, maxZoom: 13, duration: 800 })
      }

      setUserCoords({ lat: userCoords[1], lng: userCoords[0] })
    }

    const requestUserLocation = () => {
      if (locationRequested || !navigator.geolocation) return
      locationRequested = true

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          void showUserRoute([pos.coords.longitude, pos.coords.latitude])
        },
        () => {
          locationRequested = false
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 120000 },
      )
    }

    map.on("touchstart", requestUserLocation)
    map.on("dragstart", requestUserLocation)

    return () => {
      cancelled = true
      map.off("touchstart", requestUserLocation)
      map.off("dragstart", requestUserLocation)
      userMarker?.remove()
      map.remove()
    }
  }, [])

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim()
  if (!token) {
    return (
      <div className="ssw-mapbox-map ssw-mapbox-map--fallback">
        <p className="ssw-mapbox-map__address">
          <strong>Standing Sun Wines</strong>
          <br />
          {STANDING_SUN_LOCATION.street}
          <br />
          {STANDING_SUN_LOCATION.cityStateZip}
        </p>
        <a
          href={nativeMapsHref}
          className="btn btn-outline ssw-mapbox-map__open"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in Maps
        </a>
      </div>
    )
  }

  return (
    <div className="ssw-mapbox-map">
      <div ref={containerRef} className="ssw-mapbox-map__canvas" />
      <a
        href={nativeMapsHref}
        className="btn btn-outline ssw-mapbox-map__open"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Maps
      </a>
    </div>
  )
}
