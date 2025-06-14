import { Duffel } from "@duffel/api"

// Initialize Duffel client
const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY!,
})

export interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass?: "economy" | "premium_economy" | "business" | "first"
}

export interface DuffelOffer {
  id: string
  total_amount: string
  total_currency: string
  tax_amount?: string
  base_amount?: string
  slices: Array<{
    id: string
    origin: {
      iata_code: string
      name: string
      city_name: string
      country_name: string
    }
    destination: {
      iata_code: string
      name: string
      city_name: string
      country_name: string
    }
    departure_date: string
    arrival_date: string
    duration: string
    segments: Array<{
      id: string
      aircraft: {
        name: string
        iata_code: string
      }
      marketing_carrier: {
        name: string
        iata_code: string
        logo_symbol_url?: string
      }
      operating_carrier: {
        name: string
        iata_code: string
      }
      marketing_carrier_flight_number: string
      departure_date: string
      arrival_date: string
      origin: {
        iata_code: string
        name: string
        city_name: string
      }
      destination: {
        iata_code: string
        name: string
        city_name: string
      }
      distance?: string
      passengers: Array<{
        cabin_class: string
        cabin_class_marketing_name: string
        passenger_id: string
      }>
    }>
  }>
  passengers: Array<{
    id: string
    type: string
  }>
  conditions: {
    change_before_departure?: {
      allowed: boolean
      penalty_amount?: string
      penalty_currency?: string
    }
    cancel_before_departure?: {
      allowed: boolean
      penalty_amount?: string
      penalty_currency?: string
    }
    refund_before_departure?: {
      allowed: boolean
    }
  }
  owner: {
    name: string
    iata_code: string
  }
  expires_at: string
  created_at: string
  updated_at: string
}

export interface Airport {
  id: string
  iata_code: string
  icao_code: string
  name: string
  city_name: string
  country_name: string
  country_code: string
  latitude: number
  longitude: number
  time_zone: string
}

export class DuffelService {
  /**
   * Search for flight offers
   */
  static async searchFlights(params: FlightSearchParams): Promise<DuffelOffer[]> {
    try {
      console.log("Searching flights with params:", params)

      const searchParams = {
        slices: [
          {
            origin: params.origin.toUpperCase(),
            destination: params.destination.toUpperCase(),
            departure_date: params.departureDate,
          },
        ],
        passengers: Array(params.passengers).fill({ type: "adult" }),
        cabin_class: params.cabinClass || "economy",
        max_connections: 2, // Allow up to 2 connections
      }

      // Add return slice if return date is provided
      if (params.returnDate) {
        searchParams.slices.push({
          origin: params.destination.toUpperCase(),
          destination: params.origin.toUpperCase(),
          departure_date: params.returnDate,
        })
      }

      console.log("Duffel search params:", searchParams)

      const offerRequest = await duffel.offerRequests.create(searchParams)
      console.log("Offer request created:", offerRequest.data.id)

      // Wait a moment for the search to complete
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Get the offers
      const offers = await duffel.offerRequests.get(offerRequest.data.id, {
        include: ["offers"],
      })

      console.log("Offers retrieved:", offers.data.offers?.length || 0)

      if (offers.data && offers.data.offers) {
        return offers.data.offers as DuffelOffer[]
      }

      return []
    } catch (error) {
      console.error("Duffel API Error:", error)
      if (error instanceof Error) {
        throw new Error(`Failed to search flights: ${error.message}`)
      }
      throw new Error("Failed to search flights")
    }
  }

  /**
   * Get specific offer details
   */
  static async getOffer(offerId: string): Promise<DuffelOffer | null> {
    try {
      const response = await duffel.offers.get(offerId)
      return response.data as DuffelOffer
    } catch (error) {
      console.error("Duffel API Error:", error)
      return null
    }
  }

  /**
   * Create a booking (simplified version for demo)
   */
  static async createBooking(offerId: string, passengers: any[]) {
    try {
      // For demo purposes, we'll just return a mock booking
      // In production, you'd need to collect passenger details and payment info
      const mockBooking = {
        id: `booking_${Date.now()}`,
        reference: `SPX${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        status: "confirmed",
        offer_id: offerId,
        passengers: passengers,
        created_at: new Date().toISOString(),
      }

      console.log("Mock booking created:", mockBooking)
      return mockBooking

      // Real implementation would be:
      // const response = await duffel.orders.create({
      //   selected_offers: [offerId],
      //   passengers: passengers,
      //   payments: [
      //     {
      //       type: "balance",
      //       amount: offer.total_amount,
      //       currency: offer.total_currency,
      //     },
      //   ],
      // })
      // return response.data
    } catch (error) {
      console.error("Duffel Booking Error:", error)
      throw new Error("Failed to create booking")
    }
  }

  /**
   * Get airports by search term
   */
  static async searchAirports(query: string): Promise<Airport[]> {
    try {
      if (query.length < 2) return []

      const response = await duffel.airports.list({
        name: query,
      })

      return (response.data || []).slice(0, 10) as Airport[] // Limit to 10 results
    } catch (error) {
      console.error("Duffel Airports Error:", error)
      return []
    }
  }

  /**
   * Get airport by IATA code
   */
  static async getAirport(iataCode: string): Promise<Airport | null> {
    try {
      const response = await duffel.airports.get(iataCode)
      return response.data as Airport
    } catch (error) {
      console.error("Duffel Airport Error:", error)
      return null
    }
  }

  /**
   * Transform Duffel offer to our internal format
   */
  static transformOffer(offer: DuffelOffer) {
    const slice = offer.slices[0]
    const segment = slice.segments[0]
    const lastSegment = slice.segments[slice.segments.length - 1]

    // Calculate duration in hours and minutes
    const durationMatch = slice.duration.match(/PT(\d+H)?(\d+M)?/)
    let durationFormatted = slice.duration
    if (durationMatch) {
      const hours = durationMatch[1] ? durationMatch[1].replace("H", "h ") : ""
      const minutes = durationMatch[2] ? durationMatch[2].replace("M", "m") : ""
      durationFormatted = `${hours}${minutes}`.trim()
    }

    // Get cabin class from first passenger
    const cabinClass =
      segment.passengers?.[0]?.cabin_class_marketing_name || segment.passengers?.[0]?.cabin_class || "Economy"

    // Calculate stops
    const stops = slice.segments.length - 1

    // Get amenities based on cabin class and carrier
    const amenities = DuffelService.getAmenities(cabinClass, segment.marketing_carrier.name)

    // Format times
    const departureTime = new Date(segment.departure_date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    const arrivalTime = new Date(lastSegment.arrival_date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

    return {
      id: offer.id,
      airline: segment.marketing_carrier.name,
      flightNumber: `${segment.marketing_carrier.iata_code}${segment.marketing_carrier_flight_number}`,
      origin: slice.origin.city_name,
      originCode: slice.origin.iata_code,
      destination: slice.destination.city_name,
      destinationCode: slice.destination.iata_code,
      departureTime,
      arrivalTime,
      departureDate: new Date(segment.departure_date).toISOString().split("T")[0],
      duration: durationFormatted,
      price: Math.round(Number.parseFloat(offer.total_amount)),
      currency: offer.total_currency,
      basePrice: offer.base_amount ? Math.round(Number.parseFloat(offer.base_amount)) : null,
      taxAmount: offer.tax_amount ? Math.round(Number.parseFloat(offer.tax_amount)) : null,
      class: cabinClass.toLowerCase().replace(/\s+/g, "_"),
      stops,
      stopCities: stops > 0 ? slice.segments.slice(0, -1).map((seg) => seg.destination.city_name) : [],
      amenities,
      travelPolicy: "Compliant" as const, // This would need business logic
      aircraftType: segment.aircraft.name,
      operatingCarrier:
        segment.operating_carrier.name !== segment.marketing_carrier.name ? segment.operating_carrier.name : null,
      conditions: offer.conditions,
      expiresAt: offer.expires_at,
      owner: offer.owner,
      segments: slice.segments.map((seg) => ({
        id: seg.id,
        origin: seg.origin,
        destination: seg.destination,
        departure: seg.departure_date,
        arrival: seg.arrival_date,
        aircraft: seg.aircraft.name,
        flightNumber: `${seg.marketing_carrier.iata_code}${seg.marketing_carrier_flight_number}`,
        duration: seg.distance,
      })),
    }
  }

  /**
   * Get amenities based on cabin class and airline
   */
  private static getAmenities(cabinClass: string, airline: string): string[] {
    const baseAmenities = ["Seat Selection"]

    const classLower = cabinClass.toLowerCase()

    if (classLower.includes("business") || classLower.includes("first")) {
      return [
        ...baseAmenities,
        "Priority Boarding",
        "Lounge Access",
        "Premium Meals",
        "WiFi",
        "Entertainment",
        "Extra Baggage",
        "Lie-flat Seats",
      ]
    } else if (classLower.includes("premium")) {
      return [...baseAmenities, "Priority Boarding", "Premium Meals", "WiFi", "Entertainment", "Extra Legroom"]
    } else {
      // Economy
      const premiumAirlines = ["Emirates", "Qatar Airways", "Singapore Airlines", "Lufthansa"]
      if (premiumAirlines.some((pa) => airline.includes(pa))) {
        return [...baseAmenities, "WiFi", "Entertainment", "Meals"]
      }
      return [...baseAmenities, "Entertainment"]
    }
  }

  /**
   * Format price with currency
   */
  static formatPrice(amount: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  /**
   * Check if offer is still valid
   */
  static isOfferValid(offer: any): boolean {
    if (!offer.expiresAt) return true
    return new Date(offer.expiresAt) > new Date()
  }
}
