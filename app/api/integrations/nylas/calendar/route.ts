import { type NextRequest, NextResponse } from "next/server"
import { nylasCalendarService } from "@/lib/integrations/nylas-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const calendarId = searchParams.get("calendarId") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const startsAfter = searchParams.get("startsAfter") ? new Date(searchParams.get("startsAfter")!) : new Date()
    const startsBefore = searchParams.get("startsBefore") ? new Date(searchParams.get("startsBefore")!) : undefined

    const events = await nylasCalendarService.getEvents({
      calendarId,
      startsAfter,
      startsBefore,
      limit,
    })

    return NextResponse.json({
      success: true,
      data: events,
      count: events.length,
    })
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch calendar events",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, location, startTime, endTime, participants, calendarId, conferencing } = body

    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, startTime, endTime",
        },
        { status: 400 },
      )
    }

    const event = await nylasCalendarService.createEvent({
      title,
      description,
      location,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      participants,
      calendarId,
      conferencing,
    })

    return NextResponse.json({
      success: true,
      data: event,
      message: "Event created successfully",
    })
  } catch (error) {
    console.error("Error creating calendar event:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create calendar event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
