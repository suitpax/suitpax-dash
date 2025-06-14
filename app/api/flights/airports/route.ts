import { type NextRequest, NextResponse } from "next/server"
import { DuffelService } from "@/lib/services/duffel.service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        airports: [],
      })
    }

    const airports = await DuffelService.searchAirports(query)

    return NextResponse.json({
      success: true,
      airports: airports,
      count: airports.length,
    })
  } catch (error) {
    console.error("Airport search API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search airports",
        airports: [],
      },
      { status: 500 },
    )
  }
}
