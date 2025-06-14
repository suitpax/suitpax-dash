import { type NextRequest, NextResponse } from "next/server"
import { DuffelService, type FlightSearchParams } from "@/lib/services/duffel.service"

export async function POST(request: NextRequest) {
  try {
    console.log("Flight search API called")

    const body = await request.json()
    console.log("Request body:", body)

    const searchParams: FlightSearchParams = {
      origin: body.origin,
      destination: body.destination,
      departureDate: body.departureDate,
      returnDate: body.returnDate,
      passengers: Number.parseInt(body.passengers) || 1,
      cabinClass: body.cabinClass || "economy",
    }

    // Validate required parameters
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      console.log("Missing required parameters")
      return NextResponse.json(
        { error: "Missing required parameters: origin, destination, departureDate" },
        { status: 400 },
      )
    }

    console.log("Searching flights with params:", searchParams)

    // Check if Duffel is available
    if (!DuffelService.isAvailable()) {
      console.log("Duffel API not available, using mock data")
    }

    const offers = await DuffelService.searchFlights(searchParams)
    console.log("Found offers:", offers.length)

    // Transform offers to our internal format
    const transformedOffers = offers.map((offer) => DuffelService.transformOffer(offer))
    console.log("Transformed offers:", transformedOffers.length)

    return NextResponse.json({
      success: true,
      data: transformedOffers,
      count: transformedOffers.length,
      duffelAvailable: DuffelService.isAvailable(),
      message: DuffelService.isAvailable() ? "Using Duffel API" : "Using mock data for demo",
    })
  } catch (error) {
    console.error("Flight search API error:", error)
    return NextResponse.json(
      {
        error: "Failed to search flights",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
