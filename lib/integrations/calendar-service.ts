import { google } from "googleapis"

export interface CalendarConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  refreshToken?: string
  accessToken?: string
}

export interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: Date
  end: Date
  location?: string
  attendees?: EventAttendee[]
  meetingLink?: string
  status: "confirmed" | "tentative" | "cancelled"
  organizer: string
  isAllDay: boolean
}

export interface EventAttendee {
  email: string
  name?: string
  responseStatus: "accepted" | "declined" | "tentative" | "needsAction"
}

export class CalendarService {
  private oauth2Client: any
  private calendar: any

  constructor(config: CalendarConfig) {
    this.oauth2Client = new google.auth.OAuth2(config.clientId, config.clientSecret, config.redirectUri)

    if (config.refreshToken) {
      this.oauth2Client.setCredentials({
        refresh_token: config.refreshToken,
        access_token: config.accessToken,
      })
    }

    this.calendar = google.calendar({ version: "v3", auth: this.oauth2Client })
  }

  async getAuthUrl(): Promise<string> {
    const scopes = [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/calendar.events",
    ]

    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    })
  }

  async exchangeCodeForTokens(code: string): Promise<any> {
    const { tokens } = await this.oauth2Client.getToken(code)
    this.oauth2Client.setCredentials(tokens)
    return tokens
  }

  async getEvents(timeMin?: Date, timeMax?: Date, maxResults = 50): Promise<CalendarEvent[]> {
    try {
      const response = await this.calendar.events.list({
        calendarId: "primary",
        timeMin: (timeMin || new Date()).toISOString(),
        timeMax: timeMax?.toISOString(),
        maxResults,
        singleEvents: true,
        orderBy: "startTime",
      })

      return response.data.items?.map(this.transformEvent) || []
    } catch (error) {
      console.error("Error fetching calendar events:", error)
      throw error
    }
  }

  async createEvent(event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const googleEvent = {
      summary: event.summary,
      description: event.description,
      start: {
        dateTime: event.start?.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: event.end?.toISOString(),
        timeZone: "UTC",
      },
      location: event.location,
      attendees: event.attendees?.map((a) => ({ email: a.email, displayName: a.name })),
      conferenceData: event.meetingLink
        ? {
            createRequest: {
              requestId: `meet-${Date.now()}`,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          }
        : undefined,
    }

    const response = await this.calendar.events.insert({
      calendarId: "primary",
      requestBody: googleEvent,
      conferenceDataVersion: event.meetingLink ? 1 : 0,
    })

    return this.transformEvent(response.data)
  }

  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const googleEvent = {
      summary: updates.summary,
      description: updates.description,
      start: updates.start
        ? {
            dateTime: updates.start.toISOString(),
            timeZone: "UTC",
          }
        : undefined,
      end: updates.end
        ? {
            dateTime: updates.end.toISOString(),
            timeZone: "UTC",
          }
        : undefined,
      location: updates.location,
      attendees: updates.attendees?.map((a) => ({ email: a.email, displayName: a.name })),
    }

    const response = await this.calendar.events.update({
      calendarId: "primary",
      eventId,
      requestBody: googleEvent,
    })

    return this.transformEvent(response.data)
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.calendar.events.delete({
      calendarId: "primary",
      eventId,
    })
  }

  async findAvailableSlots(
    duration: number, // in minutes
    startDate: Date,
    endDate: Date,
    workingHours: { start: number; end: number } = { start: 9, end: 17 },
  ): Promise<{ start: Date; end: Date }[]> {
    const events = await this.getEvents(startDate, endDate)
    const availableSlots: { start: Date; end: Date }[] = []

    const currentDate = new Date(startDate)
    while (currentDate < endDate) {
      // Skip weekends
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1)
        continue
      }

      const dayStart = new Date(currentDate)
      dayStart.setHours(workingHours.start, 0, 0, 0)

      const dayEnd = new Date(currentDate)
      dayEnd.setHours(workingHours.end, 0, 0, 0)

      // Find conflicts for this day
      const dayEvents = events
        .filter((event) => event.start >= dayStart && event.start < dayEnd)
        .sort((a, b) => a.start.getTime() - b.start.getTime())

      let slotStart = dayStart
      for (const event of dayEvents) {
        if (slotStart.getTime() + duration * 60000 <= event.start.getTime()) {
          availableSlots.push({
            start: new Date(slotStart),
            end: new Date(slotStart.getTime() + duration * 60000),
          })
        }
        slotStart = new Date(Math.max(slotStart.getTime(), event.end.getTime()))
      }

      // Check if there's time after the last event
      if (slotStart.getTime() + duration * 60000 <= dayEnd.getTime()) {
        availableSlots.push({
          start: new Date(slotStart),
          end: new Date(slotStart.getTime() + duration * 60000),
        })
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return availableSlots
  }

  private transformEvent(googleEvent: any): CalendarEvent {
    return {
      id: googleEvent.id,
      summary: googleEvent.summary || "Untitled Event",
      description: googleEvent.description,
      start: new Date(googleEvent.start?.dateTime || googleEvent.start?.date),
      end: new Date(googleEvent.end?.dateTime || googleEvent.end?.date),
      location: googleEvent.location,
      attendees:
        googleEvent.attendees?.map((a: any) => ({
          email: a.email,
          name: a.displayName,
          responseStatus: a.responseStatus,
        })) || [],
      meetingLink: googleEvent.conferenceData?.entryPoints?.[0]?.uri,
      status: googleEvent.status,
      organizer: googleEvent.organizer?.email || "",
      isAllDay: !googleEvent.start?.dateTime,
    }
  }
}

// Mock service for development
export class MockCalendarService extends CalendarService {
  constructor() {
    super({
      clientId: "mock",
      clientSecret: "mock",
      redirectUri: "mock",
    })
  }

  async getEvents(): Promise<CalendarEvent[]> {
    const now = new Date()
    return [
      {
        id: "1",
        summary: "Q1 Business Review",
        description: "Quarterly business review with leadership team",
        start: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
        end: new Date(now.getTime() + 3 * 60 * 60 * 1000), // 3 hours from now
        location: "Conference Room A",
        attendees: [
          { email: "ceo@company.com", name: "CEO", responseStatus: "accepted" },
          { email: "cfo@company.com", name: "CFO", responseStatus: "tentative" },
        ],
        status: "confirmed",
        organizer: "user@company.com",
        isAllDay: false,
      },
      {
        id: "2",
        summary: "Client Presentation - NYC",
        description: "Presentation for potential client in New York",
        start: new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 hours from now
        end: new Date(now.getTime() + 8 * 60 * 60 * 1000), // 8 hours from now
        location: "Client Office, NYC",
        attendees: [{ email: "client@company.com", name: "Client Contact", responseStatus: "accepted" }],
        status: "confirmed",
        organizer: "user@company.com",
        isAllDay: false,
      },
    ]
  }

  async findAvailableSlots(duration: number, startDate: Date, endDate: Date): Promise<{ start: Date; end: Date }[]> {
    // Mock available slots
    const slots = []
    const current = new Date(startDate)

    while (current < endDate) {
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        // Skip weekends
        slots.push({
          start: new Date(current.getTime()),
          end: new Date(current.getTime() + duration * 60000),
        })
      }
      current.setDate(current.getDate() + 1)
    }

    return slots.slice(0, 5) // Return first 5 slots
  }
}
