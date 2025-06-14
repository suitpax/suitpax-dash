"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"

interface Location {
  lat: number
  lng: number
  address?: string
}

interface GoogleMapProps {
  pickup?: Location
  dropoff?: Location
  className?: string
  onLocationSelect?: (location: Location, type: "pickup" | "dropoff") => void
  showRoute?: boolean
  style?: "uber" | "default"
}

export function GoogleMap({
  pickup,
  dropoff,
  className = "w-full h-64 rounded-xl",
  onLocationSelect,
  showRoute = true,
  style = "uber",
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)
  const [pickupMarker, setPickupMarker] = useState<google.maps.Marker | null>(null)
  const [dropoffMarker, setDropoffMarker] = useState<google.maps.Marker | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Uber-style map configuration
  const uberMapStyles = [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ color: "#1d1d1d" }],
    },
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#000000" }, { lightness: 13 }],
    },
    {
      featureType: "administrative",
      elementType: "geometry.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{ color: "#144b53" }, { lightness: 14 }, { weight: 1.4 }],
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [{ color: "#08304b" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#0c4152" }, { lightness: 5 }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#0b434f" }, { lightness: 25 }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.stroke",
      stylers: [{ color: "#0b3d51" }, { lightness: 16 }],
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [{ color: "#146474" }],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [{ color: "#021019" }],
    },
  ]

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
          version: "weekly",
          libraries: ["places", "geometry"],
        })

        await loader.load()

        if (mapRef.current) {
          const mapInstance = new (window as any).google.maps.Map(mapRef.current, {
            center: pickup || { lat: 40.7128, lng: -74.006 }, // Default to NYC
            zoom: 13,
            styles: style === "uber" ? uberMapStyles : [],
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            gestureHandling: "cooperative",
          })

          setMap(mapInstance)
          setDirectionsService(new (window as any).google.maps.DirectionsService())
          setDirectionsRenderer(
            new (window as any).google.maps.DirectionsRenderer({
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#ffffff",
                strokeWeight: 4,
                strokeOpacity: 0.8,
              },
            }),
          )

          // Add click listener for location selection
          if (onLocationSelect) {
            mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
              if (event.latLng) {
                const location = {
                  lat: event.latLng.lat(),
                  lng: event.latLng.lng(),
                }
                // For now, default to pickup. You can add logic to determine pickup vs dropoff
                onLocationSelect(location, "pickup")
              }
            })
          }

          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error)
        setIsLoading(false)
      }
    }

    initMap()
  }, [])

  // Update markers when locations change
  useEffect(() => {
    if (!map) return

    // Clear existing markers
    if (pickupMarker) pickupMarker.setMap(null)
    if (dropoffMarker) dropoffMarker.setMap(null)

    // Add pickup marker
    if (pickup) {
      const marker = new (window as any).google.maps.Marker({
        position: pickup,
        map: map,
        title: "Pickup Location",
        icon: {
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#00ff00",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      })
      setPickupMarker(marker)
    }

    // Add dropoff marker
    if (dropoff) {
      const marker = new (window as any).google.maps.Marker({
        position: dropoff,
        map: map,
        title: "Dropoff Location",
        icon: {
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#ff0000",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      })
      setDropoffMarker(marker)
    }
  }, [map, pickup, dropoff])

  // Draw route when both locations are available
  useEffect(() => {
    if (!map || !directionsService || !directionsRenderer || !pickup || !dropoff || !showRoute) return

    directionsRenderer.setMap(map)

    directionsService.route(
      {
        origin: pickup,
        destination: dropoff,
        travelMode: (window as any).google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false,
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRenderer.setDirections(result)

          // Fit map to show entire route
          const bounds = new (window as any).google.maps.LatLngBounds()
          bounds.extend(pickup)
          bounds.extend(dropoff)
          map.fitBounds(bounds)
        }
      },
    )

    return () => {
      directionsRenderer.setMap(null)
    }
  }, [map, directionsService, directionsRenderer, pickup, dropoff, showRoute])

  if (isLoading) {
    return (
      <div className={`${className} bg-white/5 border border-white/10 flex items-center justify-center`}>
        <div className="flex items-center space-x-2 text-white/70">
          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-sm">Loading map...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} bg-white/5 border border-white/10 overflow-hidden relative`}>
      <div ref={mapRef} className="w-full h-full" />

      {/* Map controls overlay */}
      <div className="absolute top-3 right-3 flex flex-col space-y-2">
        <button
          onClick={() => map?.setZoom((map.getZoom() || 13) + 1)}
          className="bg-black/80 text-white p-2 rounded-lg hover:bg-black/90 transition-colors"
          aria-label="Zoom in"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button
          onClick={() => map?.setZoom((map.getZoom() || 13) - 1)}
          className="bg-black/80 text-white p-2 rounded-lg hover:bg-black/90 transition-colors"
          aria-label="Zoom out"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
      </div>

      {/* Location indicators */}
      {(pickup || dropoff) && (
        <div className="absolute bottom-3 left-3 bg-black/80 text-white p-2 rounded-lg text-xs space-y-1">
          {pickup && (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-400 rounded-full" />
              <span>Pickup</span>
            </div>
          )}
          {dropoff && (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-red-400 rounded-full" />
              <span>Dropoff</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
