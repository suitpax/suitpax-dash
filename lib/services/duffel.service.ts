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
  slices: Array<{
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
    departure_date: string
    arrival_date: string
    duration: string
    segments: Array<{
      aircraft: {
        name: string
      }
      marketing_carrier: {
        name: string
        iata_code: string
      }
      marketing_carrier_flight_number: string
      departure_date: string
      arrival_date: string
      origin: {
        iata_code: string
      }
      destination: {
        iata_code: string
      }
    }>
  }>
  passengers: Array<{
    type: string
  }>
  conditions: {
    change_before_departure?: {
      allowed: boolean
      penalty_amount?: string
    }
    cancel_before_departure?: {
      allowed: boolean
      penalty_amount?: string
    }
  }
}

export class DuffelService {
  /**
   * Search for flight offers
   */
  static async searchFlights(params: FlightSearchParams): Promise<DuffelOffer[]> {
    try {
      const searchParams = {
        slices: [
          {
            origin: params.origin,
            destination: params.destination,
            departure_date: params.departureDate,
          },
        ],
        passengers: Array(params.passengers).fill({ type: "adult" }),
        cabin_class: params.cabinClass || "economy",
      }

      // Add return slice if return date is provided
      if (params.returnDate) {
        searchParams.slices.push({
          origin: params.destination,
          destination: params.origin,
          departure_date: params.returnDate,
        })
      }

      const response = await duffel.offerRequests.create(searchParams)

      if (response.data && response.data.offers) {
        return response.data.offers as DuffelOffer[]
      }

      return []
    } catch (error) {
      console.error("Duffel API Error:", error)
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
   * Create a booking (simplified version)
   */
  static async createBooking(offerId: string, passengers: any[]) {
    try {
      const response = await duffel.orders.create({
        selected_offers: [offerId],
        passengers: passengers,
        payments: [
          {
            type: "balance",
            amount: "0", // This would be the actual payment amount
            currency: "USD",
          },
        ],
      })

      return response.data
    } catch (error) {
      console.error("Duffel Booking Error:", error)
      throw new Error("Failed to create booking")
    }
  }

  /**
   * Get airports by search term
   */
  static async searchAirports(query: string) {
    try {
      const response = await duffel.airports.list({
        name: query,
      })

      return response.data || []
    } catch (error) {
      console.error("Duffel Airports Error:", error)
      return []
    }
  }

  /**
   * Transform Duffel offer to our internal format
   */
  static transformOffer(offer: DuffelOffer) {
    const slice = offer.slices[0]
    const segment = slice.segments[0]

    return {
      id: offer.id,
      airline: segment.marketing_carrier.name,
      flightNumber: `${segment.marketing_carrier.iata_code}${segment.marketing_carrier_flight_number}`,
      origin: slice.origin.city_name,
      originCode: slice.origin.iata_code,
      destination: slice.destination.city_name,
      destinationCode: slice.destination.iata_code,
      departureTime: new Date(slice.departure_date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      arrivalTime: new Date(slice.arrival_date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      departureDate: new Date(slice.departure_date).toISOString().split("T")[0],
      duration: slice.duration,
      price: Math.round(Number.parseFloat(offer.total_amount)),
      currency: offer.total_currency,
      class: "economy", // This would need to be determined from the offer
      stops: slice.segments.length - 1,
      amenities: ["WiFi", "Entertainment"], // This would come from the actual offer
      travelPolicy: "Compliant" as const,
      aircraftType: segment.aircraft.name,
      conditions: offer.conditions,
    }
  }
}
