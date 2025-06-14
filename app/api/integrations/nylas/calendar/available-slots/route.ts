import { type NextRequest, NextResponse } from "next/server"
import { nylasCalendarService } from "@/lib/integrations/nylas-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { duration, startDate, endDate, participants, workingHours } = body

    if (!duration || !startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: duration, startDate, endDate",
        },
        { status: 400 },
      )
    }

    const availableSlots = await nylasCalendarService.findAvailableSlots({
      duration,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      participants,
      workingHours,
    })

    return NextResponse.json({
      success: true,
      data: availableSlots,
      count: availableSlots.length,
      message: `Found ${availableSlots.length} available time slots`,
    })
  } catch (error) {
    console.error("Error finding available slots:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to find available slots",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
