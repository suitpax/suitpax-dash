import Nylas, { type NylasConfig } from "nylas"

// Nylas Configuration
const nylasConfig: NylasConfig = {
  apiKey: process.env.NYLAS_API_KEY!,
  apiUri: process.env.NYLAS_API_URI || "https://api.us.nylas.com",
}

const nylas = new Nylas(nylasConfig)
const ACCOUNT_ID = process.env.NYLAS_ACCOUNT_ID!

// Email Types
export interface NylasEmail {
  id: string
  threadId: string
  subject: string
  from: Array<{ name?: string; email: string }>
  to: Array<{ name?: string; email: string }>
  cc?: Array<{ name?: string; email: string }>
  bcc?: Array<{ name?: string; email: string }>
  body: string
  snippet: string
  date: number
  unread: boolean
  starred: boolean
  folders: string[]
  labels: string[]
  attachments?: NylasAttachment[]
}

export interface NylasAttachment {
  id: string
  filename: string
  contentType: string
  size: number
}

// Calendar Types
export interface NylasEvent {
  id: string
  title: string
  description?: string
  location?: string
  when: {
    startTime: number
    endTime: number
    startTimezone?: string
    endTimezone?: string
  }
  participants: Array<{
    name?: string
    email: string
    status: "yes" | "no" | "maybe" | "noreply"
  }>
  busy: boolean
  readOnly: boolean
  calendarId: string
  conferencing?: {
    provider: string
    details: {
      url?: string
      meetingCode?: string
      password?: string
    }
  }
}

// Email Service
export class NylasEmailService {
  // Get emails with filters
  async getEmails(
    options: {
      limit?: number
      unread?: boolean
      starred?: boolean
      from?: string
      subject?: string
      hasAttachment?: boolean
    } = {},
  ): Promise<NylasEmail[]> {
    try {
      const queryParams: any = {
        limit: options.limit || 50,
      }

      if (options.unread !== undefined) {
        queryParams.unread = options.unread
      }
      if (options.starred !== undefined) {
        queryParams.starred = options.starred
      }
      if (options.from) {
        queryParams.from = options.from
      }
      if (options.subject) {
        queryParams.subject = options.subject
      }
      if (options.hasAttachment !== undefined) {
        queryParams.has_attachment = options.hasAttachment
      }

      const messages = await nylas.messages.list({
        identifier: ACCOUNT_ID,
        queryParams,
      })

      return messages.data.map(this.transformEmail)
    } catch (error) {
      console.error("Error fetching emails:", error)
      throw error
    }
  }

  // Get specific email by ID
  async getEmail(messageId: string): Promise<NylasEmail> {
    try {
      const message = await nylas.messages.find({
        identifier: ACCOUNT_ID,
        messageId,
      })

      return this.transformEmail(message)
    } catch (error) {
      console.error("Error fetching email:", error)
      throw error
    }
  }

  // Send email
  async sendEmail(options: {
    to: Array<{ name?: string; email: string }>
    cc?: Array<{ name?: string; email: string }>
    bcc?: Array<{ name?: string; email: string }>
    subject: string
    body: string
    replyToMessageId?: string
  }): Promise<NylasEmail> {
    try {
      const message = await nylas.messages.send({
        identifier: ACCOUNT_ID,
        requestBody: {
          to: options.to,
          cc: options.cc,
          bcc: options.bcc,
          subject: options.subject,
          body: options.body,
          replyToMessageId: options.replyToMessageId,
        },
      })

      return this.transformEmail(message)
    } catch (error) {
      console.error("Error sending email:", error)
      throw error
    }
  }

  // Mark email as read/unread
  async updateEmailStatus(messageId: string, unread: boolean): Promise<void> {
    try {
      await nylas.messages.update({
        identifier: ACCOUNT_ID,
        messageId,
        requestBody: {
          unread,
        },
      })
    } catch (error) {
      console.error("Error updating email status:", error)
      throw error
    }
  }

  // Star/unstar email
  async updateEmailStar(messageId: string, starred: boolean): Promise<void> {
    try {
      await nylas.messages.update({
        identifier: ACCOUNT_ID,
        messageId,
        requestBody: {
          starred,
        },
      })
    } catch (error) {
      console.error("Error updating email star:", error)
      throw error
    }
  }

  // Categorize email for travel management
  categorizeEmail(email: NylasEmail): "travel" | "expense" | "meeting" | "general" {
    const subject = email.subject.toLowerCase()
    const body = email.body.toLowerCase()
    const fromEmail = email.from[0]?.email.toLowerCase() || ""

    // Travel-related keywords
    if (
      /flight|airline|booking|confirmation|itinerary|travel|hotel|reservation|trip/.test(subject + body) ||
      /booking\.com|expedia|hotels\.com|marriott|hilton|airbnb|amadeus|sabre/.test(fromEmail)
    ) {
      return "travel"
    }

    // Expense-related keywords
    if (
      /expense|receipt|invoice|payment|bill|reimbursement|cost|budget/.test(subject + body) ||
      /finance|accounting|expense|billing/.test(fromEmail)
    ) {
      return "expense"
    }

    // Meeting-related keywords
    if (
      /meeting|calendar|invite|appointment|conference|zoom|teams|webex/.test(subject + body) ||
      /calendar|meeting|zoom|teams/.test(fromEmail)
    ) {
      return "meeting"
    }

    return "general"
  }

  private transformEmail(message: any): NylasEmail {
    return {
      id: message.id,
      threadId: message.threadId,
      subject: message.subject || "",
      from: message.from || [],
      to: message.to || [],
      cc: message.cc || [],
      bcc: message.bcc || [],
      body: message.body || "",
      snippet: message.snippet || "",
      date: message.date || Date.now(),
      unread: message.unread || false,
      starred: message.starred || false,
      folders: message.folders || [],
      labels: message.labels || [],
      attachments:
        message.attachments?.map((att: any) => ({
          id: att.id,
          filename: att.filename,
          contentType: att.contentType,
          size: att.size,
        })) || [],
    }
  }
}

// Calendar Service
export class NylasCalendarService {
  // Get events
  async getEvents(
    options: {
      calendarId?: string
      startsAfter?: Date
      startsBefore?: Date
      limit?: number
    } = {},
  ): Promise<NylasEvent[]> {
    try {
      const queryParams: any = {
        limit: options.limit || 50,
      }

      if (options.startsAfter) {
        queryParams.starts_after = Math.floor(options.startsAfter.getTime() / 1000)
      }
      if (options.startsBefore) {
        queryParams.starts_before = Math.floor(options.startsBefore.getTime() / 1000)
      }
      if (options.calendarId) {
        queryParams.calendar_id = options.calendarId
      }

      const events = await nylas.events.list({
        identifier: ACCOUNT_ID,
        queryParams,
      })

      return events.data.map(this.transformEvent)
    } catch (error) {
      console.error("Error fetching events:", error)
      throw error
    }
  }

  // Create event
  async createEvent(event: {
    title: string
    description?: string
    location?: string
    startTime: Date
    endTime: Date
    participants?: Array<{ name?: string; email: string }>
    calendarId?: string
    conferencing?: {
      provider: "Zoom Meeting" | "Microsoft Teams" | "Google Meet"
      autocreate?: boolean
    }
  }): Promise<NylasEvent> {
    try {
      const newEvent = await nylas.events.create({
        identifier: ACCOUNT_ID,
        requestBody: {
          title: event.title,
          description: event.description,
          location: event.location,
          when: {
            startTime: Math.floor(event.startTime.getTime() / 1000),
            endTime: Math.floor(event.endTime.getTime() / 1000),
          },
          participants: event.participants?.map((p) => ({
            name: p.name,
            email: p.email,
          })),
          calendarId: event.calendarId,
          conferencing: event.conferencing,
        },
      })

      return this.transformEvent(newEvent)
    } catch (error) {
      console.error("Error creating event:", error)
      throw error
    }
  }

  // Update event
  async updateEvent(
    eventId: string,
    updates: {
      title?: string
      description?: string
      location?: string
      startTime?: Date
      endTime?: Date
      participants?: Array<{ name?: string; email: string }>
    },
  ): Promise<NylasEvent> {
    try {
      const updateData: any = {}

      if (updates.title) updateData.title = updates.title
      if (updates.description) updateData.description = updates.description
      if (updates.location) updateData.location = updates.location
      if (updates.startTime || updates.endTime) {
        updateData.when = {}
        if (updates.startTime) {
          updateData.when.startTime = Math.floor(updates.startTime.getTime() / 1000)
        }
        if (updates.endTime) {
          updateData.when.endTime = Math.floor(updates.endTime.getTime() / 1000)
        }
      }
      if (updates.participants) {
        updateData.participants = updates.participants.map((p) => ({
          name: p.name,
          email: p.email,
        }))
      }

      const updatedEvent = await nylas.events.update({
        identifier: ACCOUNT_ID,
        eventId,
        requestBody: updateData,
      })

      return this.transformEvent(updatedEvent)
    } catch (error) {
      console.error("Error updating event:", error)
      throw error
    }
  }

  // Delete event
  async deleteEvent(eventId: string): Promise<void> {
    try {
      await nylas.events.destroy({
        identifier: ACCOUNT_ID,
        eventId,
      })
    } catch (error) {
      console.error("Error deleting event:", error)
      throw error
    }
  }

  // Get calendars
  async getCalendars(): Promise<
    Array<{
      id: string
      name: string
      description?: string
      readOnly: boolean
      isPrimary: boolean
    }>
  > {
    try {
      const calendars = await nylas.calendars.list({
        identifier: ACCOUNT_ID,
      })

      return calendars.data.map((cal) => ({
        id: cal.id,
        name: cal.name,
        description: cal.description,
        readOnly: cal.readOnly || false,
        isPrimary: cal.isPrimary || false,
      }))
    } catch (error) {
      console.error("Error fetching calendars:", error)
      throw error
    }
  }

  // Find available time slots
  async findAvailableSlots(options: {
    duration: number // in minutes
    startDate: Date
    endDate: Date
    participants?: string[]
    workingHours?: { start: number; end: number }
  }): Promise<Array<{ startTime: Date; endTime: Date }>> {
    try {
      const workingHours = options.workingHours || { start: 9, end: 17 }
      const events = await this.getEvents({
        startsAfter: options.startDate,
        startsBefore: options.endDate,
      })

      const availableSlots: Array<{ startTime: Date; endTime: Date }> = []
      const currentDate = new Date(options.startDate)

      while (currentDate < options.endDate) {
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
          .filter((event) => {
            const eventStart = new Date(event.when.startTime * 1000)
            return eventStart >= dayStart && eventStart < dayEnd
          })
          .sort((a, b) => a.when.startTime - b.when.startTime)

        let slotStart = dayStart
        for (const event of dayEvents) {
          const eventStart = new Date(event.when.startTime * 1000)
          const eventEnd = new Date(event.when.endTime * 1000)

          if (slotStart.getTime() + options.duration * 60000 <= eventStart.getTime()) {
            availableSlots.push({
              startTime: new Date(slotStart),
              endTime: new Date(slotStart.getTime() + options.duration * 60000),
            })
          }
          slotStart = new Date(Math.max(slotStart.getTime(), eventEnd.getTime()))
        }

        // Check if there's time after the last event
        if (slotStart.getTime() + options.duration * 60000 <= dayEnd.getTime()) {
          availableSlots.push({
            startTime: new Date(slotStart),
            endTime: new Date(slotStart.getTime() + options.duration * 60000),
          })
        }

        currentDate.setDate(currentDate.getDate() + 1)
      }

      return availableSlots.slice(0, 10) // Return first 10 slots
    } catch (error) {
      console.error("Error finding available slots:", error)
      throw error
    }
  }

  private transformEvent(event: any): NylasEvent {
    return {
      id: event.id,
      title: event.title || "Untitled Event",
      description: event.description,
      location: event.location,
      when: {
        startTime: event.when?.startTime || Date.now() / 1000,
        endTime: event.when?.endTime || Date.now() / 1000,
        startTimezone: event.when?.startTimezone,
        endTimezone: event.when?.endTimezone,
      },
      participants:
        event.participants?.map((p: any) => ({
          name: p.name,
          email: p.email,
          status: p.status || "noreply",
        })) || [],
      busy: event.busy || false,
      readOnly: event.readOnly || false,
      calendarId: event.calendarId || "",
      conferencing: event.conferencing
        ? {
            provider: event.conferencing.provider,
            details: event.conferencing.details || {},
          }
        : undefined,
    }
  }
}

// Export service instances
export const nylasEmailService = new NylasEmailService()
export const nylasCalendarService = new NylasCalendarService()
