import { type NextRequest, NextResponse } from "next/server"
import { DuffelService } from "@/lib/services/duffel.service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json({ airports: [] })
    }

    console.log("Searching airports for:", query)

    const airports = await DuffelService.searchAirports(query)

    return NextResponse.json({
      success: true,
      airports: airports,
      count: airports.length,
      duffelAvailable: DuffelService.isAvailable(),
    })
  } catch (error) {
    console.error("Airport search API error:", error)
    return NextResponse.json(
      {
        error: "Failed to search airports",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
