import { type NextRequest, NextResponse } from "next/server"
import { DuffelService } from "@/lib/services/duffel.service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required and must be at least 2 characters' },
        { status: 400 },
      )
    }

    const airports = await DuffelService.searchAirports(query)

    return NextResponse.json({
      success: true,
      data: airports.map((airport) => ({
        iata_code: airport.iata_code,
        name: airport.name,
        city_name: airport.city?.name || "",
        country_name: airport.city?.country?.name || "",
      })),
    })
  } catch (error) {
    console.error("Airport search API error:", error)
    return NextResponse.json({ error: "Failed to search airports" }, { status: 500 })
  }
}
