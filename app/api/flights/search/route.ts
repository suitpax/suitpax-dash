import { type NextRequest, NextResponse } from "next/server"
import { DuffelService, type FlightSearchParams } from "@/lib/services/duffel.service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

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
      return NextResponse.json(
        { error: "Missing required parameters: origin, destination, departureDate" },
        { status: 400 },
      )
    }

    const offers = await DuffelService.searchFlights(searchParams)

    // Transform offers to our internal format
    const transformedOffers = offers.map((offer) => DuffelService.transformOffer(offer))

    return NextResponse.json({
      success: true,
      data: transformedOffers,
      count: transformedOffers.length,
    })
  } catch (error) {
    console.error("Flight search API error:", error)
    return NextResponse.json({ error: "Failed to search flights" }, { status: 500 })
  }
}
