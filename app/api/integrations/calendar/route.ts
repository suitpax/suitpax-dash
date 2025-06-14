import { type NextRequest, NextResponse } from "next/server"
import { CalendarService, MockCalendarService } from "@/lib/integrations/calendar-service"

const isDevelopment = process.env.NODE_ENV === "development"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const timeMin = searchParams.get("timeMin")
    const timeMax = searchParams.get("timeMax")
    const maxResults = Number.parseInt(searchParams.get("maxResults") || "50")

    const calendarService =
      isDevelopment || !process.env.GOOGLE_CLIENT_ID
        ? new MockCalendarService()
        : new CalendarService({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            redirectUri: process.env.GOOGLE_REDIRECT_URI!,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: process.env.GOOGLE_ACCESS_TOKEN,
          })

    switch (action) {
      case "auth-url":
        if (isDevelopment) {
          return NextResponse.json({
            authUrl: "/api/integrations/calendar?action=mock-auth",
            message: "Development mode - using mock authentication",
          })
        }
        const authUrl = await calendarService.getAuthUrl()
        return NextResponse.json({ authUrl })

      case "events":
        const events = await calendarService.getEvents(
          timeMin ? new Date(timeMin) : undefined,
          timeMax ? new Date(timeMax) : undefined,
          maxResults,
        )

        // Add priority and category to events
        const enhancedEvents = events.map((event) => ({
          ...event,
          priority:
            event.attendees && event.attendees.length > 5
              ? "high"
              : event.summary.toLowerCase().includes("client")
                ? "high"
                : "medium",
          type: event.location?.toLowerCase().includes("room") ? "in-person" : "video",
          status: event.start > new Date() ? "upcoming" : event.end < new Date() ? "completed" : "in-progress",
        }))

        return NextResponse.json({ events: enhancedEvents })

      case "available-slots":
        const duration = Number.parseInt(searchParams.get("duration") || "60")
        const startDate = new Date(searchParams.get("startDate") || Date.now())
        const endDate = new Date(searchParams.get("endDate") || Date.now() + 7 * 24 * 60 * 60 * 1000)

        const slots = await calendarService.findAvailableSlots(duration, startDate, endDate)
        return NextResponse.json({ slots })

      case "mock-auth":
        return NextResponse.json({
          success: true,
          message: "Mock authentication successful",
          tokens: { access_token: "mock_token", refresh_token: "mock_refresh" },
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Calendar API error:", error)
    return NextResponse.json(
      {
        error: "Failed to process calendar request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    const calendarService =
      isDevelopment || !process.env.GOOGLE_CLIENT_ID
        ? new MockCalendarService()
        : new CalendarService({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            redirectUri: process.env.GOOGLE_REDIRECT_URI!,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: process.env.GOOGLE_ACCESS_TOKEN,
          })

    switch (action) {
      case "create-event":
        if (isDevelopment) {
          return NextResponse.json({
            success: true,
            message: "Mock event created successfully",
            event: { id: "mock_" + Date.now(), ...data },
          })
        }
        const newEvent = await calendarService.createEvent(data)
        return NextResponse.json({ success: true, event: newEvent })

      case "update-event":
        if (isDevelopment) {
          return NextResponse.json({
            success: true,
            message: "Mock event updated successfully",
          })
        }
        const updatedEvent = await calendarService.updateEvent(data.eventId, data.updates)
        return NextResponse.json({ success: true, event: updatedEvent })

      case "delete-event":
        if (isDevelopment) {
          return NextResponse.json({
            success: true,
            message: "Mock event deleted successfully",
          })
        }
        await calendarService.deleteEvent(data.eventId)
        return NextResponse.json({ success: true, message: "Event deleted successfully" })

      case "exchange-token":
        if (isDevelopment) {
          return NextResponse.json({
            tokens: { access_token: "mock_token", refresh_token: "mock_refresh" },
          })
        }
        const tokens = await calendarService.exchangeCodeForTokens(data.code)
        return NextResponse.json({ tokens })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Calendar API error:", error)
    return NextResponse.json(
      {
        error: "Failed to process calendar request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
