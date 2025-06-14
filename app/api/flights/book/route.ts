import { type NextRequest, NextResponse } from "next/server"
import { DuffelService } from "@/lib/services/duffel.service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { offerId, passengers } = body

    if (!offerId) {
      return NextResponse.json({ error: "Missing required parameter: offerId" }, { status: 400 })
    }

    // For demo purposes, create a mock booking
    // In production, you'd collect passenger details and payment info
    const mockPassengers = passengers || [
      {
        id: "passenger_1",
        type: "adult",
        title: "mr",
        given_name: "John",
        family_name: "Doe",
        born_on: "1990-01-01",
        email: "john.doe@example.com",
        phone_number: "+1234567890",
      },
    ]

    const booking = await DuffelService.createBooking(offerId, mockPassengers)

    return NextResponse.json({
      success: true,
      booking: booking,
    })
  } catch (error) {
    console.error("Flight booking API error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
