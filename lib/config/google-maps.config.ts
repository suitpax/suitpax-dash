export const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  libraries: ["places", "geometry"] as const,
  version: "weekly" as const,
  region: "US",
  language: "en",

  // Default map options
  defaultCenter: { lat: 40.7128, lng: -74.006 }, // NYC
  defaultZoom: 13,

  // Uber-style configuration
  uberStyle: {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    gestureHandling: "cooperative" as const,
  },
}

// Geocoding service
export class GeocodingService {
  static async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    if (!GOOGLE_MAPS_CONFIG.apiKey) {
      console.warn("Google Maps API key not configured")
      return null
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_CONFIG.apiKey}`,
      )
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location
        return { lat: location.lat, lng: location.lng }
      }

      return null
    } catch (error) {
      console.error("Geocoding error:", error)
      return null
    }
  }

  static async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    if (!GOOGLE_MAPS_CONFIG.apiKey) {
      console.warn("Google Maps API key not configured")
      return null
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_CONFIG.apiKey}`,
      )
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address
      }

      return null
    } catch (error) {
      console.error("Reverse geocoding error:", error)
      return null
    }
  }
}
