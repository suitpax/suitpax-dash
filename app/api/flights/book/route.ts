import { type NextRequest, NextResponse } from "next/server"
import { DuffelService } from "@/lib/services/duffel.service"

export async function POST(request: NextRequest) {
  try {
    console.log("Flight booking API called")

    const body = await request.json()
    console.log("Booking request:", body)

    const { offerId, passengers } = body

    if (!offerId || !passengers) {
      return NextResponse.json({ error: "Missing required parameters: offerId, passengers" }, { status: 400 })
    }

    console.log("Creating booking for offer:", offerId)

    const booking = await DuffelService.createBooking(offerId, passengers)

    return NextResponse.json({
      success: true,
      booking: booking,
      message: "Booking created successfully (demo mode)",
    })
  } catch (error) {
    console.error("Flight booking API error:", error)
    return NextResponse.json(
      {
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
