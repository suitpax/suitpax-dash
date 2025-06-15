import { Duffel } from "@duffel/api"

// Initialize Duffel client only on server side
let duffel: Duffel | null = null

if (typeof window === "undefined" && process.env.DUFFEL_API_KEY) {
  try {
    duffel = new Duffel({
      token: process.env.DUFFEL_API_KEY,
    })
    console.log("Duffel client initialized successfully")
  } catch (error) {
    console.error("Failed to initialize Duffel client:", error)
  }
}

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
   * Check if Duffel is available
   */
  static isAvailable(): boolean {
    return duffel !== null && !!process.env.DUFFEL_API_KEY
  }

  /**
   * Search for flight offers
   */
  static async searchFlights(params: FlightSearchParams): Promise<DuffelOffer[]> {
    if (!DuffelService.isAvailable()) {
      console.log("Duffel not available, returning mock data")
      return DuffelService.getMockFlights(params)
    }

    try {
      console.log("Searching flights with Duffel API:", params)

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
        max_connections: 2,
      }

      console.log("Duffel search params:", searchParams)

      const offerRequest = await duffel!.offerRequests.create(searchParams)
      console.log("Offer request created:", offerRequest.data.id)

      // Wait for the search to complete
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Get the offers
      const offers = await duffel!.offerRequests.get(offerRequest.data.id, {
        include: ["offers"],
      })

      console.log("Offers retrieved:", offers.data.offers?.length || 0)

      if (offers.data && offers.data.offers && offers.data.offers.length > 0) {
        return offers.data.offers as DuffelOffer[]
      }

      // If no offers found, return mock data for demo
      console.log("No offers found, returning mock data for demo")
      return DuffelService.getMockFlights(params)
    } catch (error) {
      console.error("Duffel API Error:", error)
      console.log("Falling back to mock data")
      return DuffelService.getMockFlights(params)
    }
  }

  /**
   * Get mock flights for demo purposes
   */
  static getMockFlights(params: FlightSearchParams): DuffelOffer[] {
    const mockOffers: DuffelOffer[] = [
      {
        id: `mock_offer_${Date.now()}_1`,
        total_amount: "450.00",
        total_currency: "USD",
        base_amount: "380.00",
        tax_amount: "70.00",
        slices: [
          {
            id: "mock_slice_1",
            origin: {
              iata_code: params.origin.toUpperCase(),
              name: `${params.origin} Airport`,
              city_name: params.origin,
              country_name: "United States",
            },
            destination: {
              iata_code: params.destination.toUpperCase(),
              name: `${params.destination} Airport`,
              city_name: params.destination,
              country_name: "United Kingdom",
            },
            departure_date: `${params.departureDate}T08:30:00`,
            arrival_date: `${params.departureDate}T20:45:00`,
            duration: "PT8H15M",
            segments: [
              {
                id: "mock_segment_1",
                aircraft: {
                  name: "Boeing 777-300ER",
                  iata_code: "77W",
                },
                marketing_carrier: {
                  name: "British Airways",
                  iata_code: "BA",
                },
                operating_carrier: {
                  name: "British Airways",
                  iata_code: "BA",
                },
                marketing_carrier_flight_number: "178",
                departure_date: `${params.departureDate}T08:30:00`,
                arrival_date: `${params.departureDate}T20:45:00`,
                origin: {
                  iata_code: params.origin.toUpperCase(),
                  name: `${params.origin} Airport`,
                  city_name: params.origin,
                },
                destination: {
                  iata_code: params.destination.toUpperCase(),
                  name: `${params.destination} Airport`,
                  city_name: params.destination,
                },
                passengers: [
                  {
                    cabin_class: params.cabinClass || "economy",
                    cabin_class_marketing_name: "Economy",
                    passenger_id: "mock_passenger_1",
                  },
                ],
              },
            ],
          },
        ],
        passengers: [
          {
            id: "mock_passenger_1",
            type: "adult",
          },
        ],
        conditions: {
          change_before_departure: {
            allowed: true,
            penalty_amount: "50.00",
            penalty_currency: "USD",
          },
          cancel_before_departure: {
            allowed: true,
            penalty_amount: "100.00",
            penalty_currency: "USD",
          },
          refund_before_departure: {
            allowed: false,
          },
        },
        owner: {
          name: "British Airways",
          iata_code: "BA",
        },
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: `mock_offer_${Date.now()}_2`,
        total_amount: "520.00",
        total_currency: "USD",
        base_amount: "440.00",
        tax_amount: "80.00",
        slices: [
          {
            id: "mock_slice_2",
            origin: {
              iata_code: params.origin.toUpperCase(),
              name: `${params.origin} Airport`,
              city_name: params.origin,
              country_name: "United States",
            },
            destination: {
              iata_code: params.destination.toUpperCase(),
              name: `${params.destination} Airport`,
              city_name: params.destination,
              country_name: "United Kingdom",
            },
            departure_date: `${params.departureDate}T14:20:00`,
            arrival_date: `${params.departureDate}T02:35:00`,
            duration: "PT7H15M",
            segments: [
              {
                id: "mock_segment_2",
                aircraft: {
                  name: "Airbus A350-900",
                  iata_code: "359",
                },
                marketing_carrier: {
                  name: "Virgin Atlantic",
                  iata_code: "VS",
                },
                operating_carrier: {
                  name: "Virgin Atlantic",
                  iata_code: "VS",
                },
                marketing_carrier_flight_number: "45",
                departure_date: `${params.departureDate}T14:20:00`,
                arrival_date: `${params.departureDate}T02:35:00`,
                origin: {
                  iata_code: params.origin.toUpperCase(),
                  name: `${params.origin} Airport`,
                  city_name: params.origin,
                },
                destination: {
                  iata_code: params.destination.toUpperCase(),
                  name: `${params.destination} Airport`,
                  city_name: params.destination,
                },
                passengers: [
                  {
                    cabin_class: params.cabinClass || "economy",
                    cabin_class_marketing_name: "Premium Economy",
                    passenger_id: "mock_passenger_2",
                  },
                ],
              },
            ],
          },
        ],
        passengers: [
          {
            id: "mock_passenger_2",
            type: "adult",
          },
        ],
        conditions: {
          change_before_departure: {
            allowed: true,
            penalty_amount: "75.00",
            penalty_currency: "USD",
          },
          cancel_before_departure: {
            allowed: true,
            penalty_amount: "150.00",
            penalty_currency: "USD",
          },
          refund_before_departure: {
            allowed: false,
          },
        },
        owner: {
          name: "Virgin Atlantic",
          iata_code: "VS",
        },
        expires_at: new Date(Date.now() + 25 * 60 * 1000).toISOString(), // 25 minutes from now
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    return mockOffers
  }

  /**
   * Get airports by search term
   */
  static async searchAirports(query: string): Promise<Airport[]> {
    if (!DuffelService.isAvailable()) {
      return DuffelService.getMockAirports(query)
    }

    try {
      if (query.length < 2) return []

      const response = await duffel!.airports.list({
        name: query,
      })

      const airports = (response.data || []).slice(0, 10) as Airport[]

      if (airports.length === 0) {
        return DuffelService.getMockAirports(query)
      }

      return airports
    } catch (error) {
      console.error("Duffel Airports Error:", error)
      return DuffelService.getMockAirports(query)
    }
  }

  /**
   * Get mock airports for demo
   */
  static getMockAirports(query: string): Airport[] {
    const mockAirports = [
      {
        id: "jfk",
        iata_code: "JFK",
        icao_code: "KJFK",
        name: "John F. Kennedy International Airport",
        city_name: "New York",
        country_name: "United States",
        country_code: "US",
        latitude: 40.6413,
        longitude: -73.7781,
        time_zone: "America/New_York",
      },
      {
        id: "lhr",
        iata_code: "LHR",
        icao_code: "EGLL",
        name: "London Heathrow Airport",
        city_name: "London",
        country_name: "United Kingdom",
        country_code: "GB",
        latitude: 51.47,
        longitude: -0.4543,
        time_zone: "Europe/London",
      },
      {
        id: "lax",
        iata_code: "LAX",
        icao_code: "KLAX",
        name: "Los Angeles International Airport",
        city_name: "Los Angeles",
        country_name: "United States",
        country_code: "US",
        latitude: 33.9425,
        longitude: -118.4081,
        time_zone: "America/Los_Angeles",
      },
      {
        id: "cdg",
        iata_code: "CDG",
        icao_code: "LFPG",
        name: "Charles de Gaulle Airport",
        city_name: "Paris",
        country_name: "France",
        country_code: "FR",
        latitude: 49.0097,
        longitude: 2.5479,
        time_zone: "Europe/Paris",
      },
      {
        id: "dxb",
        iata_code: "DXB",
        icao_code: "OMDB",
        name: "Dubai International Airport",
        city_name: "Dubai",
        country_name: "United Arab Emirates",
        country_code: "AE",
        latitude: 25.2532,
        longitude: 55.3657,
        time_zone: "Asia/Dubai",
      },
    ]

    return mockAirports.filter(
      (airport) =>
        airport.city_name.toLowerCase().includes(query.toLowerCase()) ||
        airport.name.toLowerCase().includes(query.toLowerCase()) ||
        airport.iata_code.toLowerCase().includes(query.toLowerCase()),
    )
  }

  /**
   * Create a booking (demo version)
   */
  static async createBooking(offerId: string, passengers: any[]) {
    try {
      // For demo purposes, always return a successful mock booking
      const mockBooking = {
        id: `booking_${Date.now()}`,
        reference: `SPX${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        status: "confirmed",
        offer_id: offerId,
        passengers: passengers,
        created_at: new Date().toISOString(),
        booking_reference: `DUFFEL${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      }

      console.log("Demo booking created:", mockBooking)
      return mockBooking
    } catch (error) {
      console.error("Booking Error:", error)
      throw new Error("Failed to create booking")
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
      travelPolicy: "Compliant" as const,
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
      const premiumAirlines = ["Emirates", "Qatar Airways", "Singapore Airlines", "Lufthansa", "British Airways"]
      if (premiumAirlines.some((pa) => airline.includes(pa))) {
        return [...baseAmenities, "WiFi", "Entertainment", "Meals"]
      }
      return [...baseAmenities, "Entertainment"]
    }
  }

  /**
   * Check if offer is still valid
   */
  static isOfferValid(offer: any): boolean {
    if (!offer.expiresAt) return true
    return new Date(offer.expiresAt) > new Date()
  }
}
