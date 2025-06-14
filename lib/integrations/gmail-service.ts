import { google } from "googleapis"

export interface GmailConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  refreshToken?: string
  accessToken?: string
}

export interface EmailMessage {
  id: string
  threadId: string
  from: string
  to: string
  subject: string
  body: string
  date: Date
  isRead: boolean
  labels: string[]
  attachments?: EmailAttachment[]
}

export interface EmailAttachment {
  filename: string
  mimeType: string
  size: number
  attachmentId: string
}

export class GmailService {
  private oauth2Client: any
  private gmail: any

  constructor(config: GmailConfig) {
    this.oauth2Client = new google.auth.OAuth2(config.clientId, config.clientSecret, config.redirectUri)

    if (config.refreshToken) {
      this.oauth2Client.setCredentials({
        refresh_token: config.refreshToken,
        access_token: config.accessToken,
      })
    }

    this.gmail = google.gmail({ version: "v1", auth: this.oauth2Client })
  }

  async getAuthUrl(): Promise<string> {
    const scopes = [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.modify",
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

  async getEmails(query?: string, maxResults = 50): Promise<EmailMessage[]> {
    try {
      const response = await this.gmail.users.messages.list({
        userId: "me",
        q: query || "is:unread OR is:important",
        maxResults,
      })

      const messages = response.data.messages || []
      const emailPromises = messages.map((msg: any) => this.getEmailDetails(msg.id))

      return Promise.all(emailPromises)
    } catch (error) {
      console.error("Error fetching emails:", error)
      throw error
    }
  }

  async getEmailDetails(messageId: string): Promise<EmailMessage> {
    const response = await this.gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    })

    const message = response.data
    const headers = message.payload.headers

    const getHeader = (name: string) =>
      headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || ""

    return {
      id: message.id,
      threadId: message.threadId,
      from: getHeader("from"),
      to: getHeader("to"),
      subject: getHeader("subject"),
      body: this.extractEmailBody(message.payload),
      date: new Date(Number.parseInt(message.internalDate)),
      isRead: !message.labelIds?.includes("UNREAD"),
      labels: message.labelIds || [],
      attachments: this.extractAttachments(message.payload),
    }
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    const email = [`To: ${to}`, `Subject: ${subject}`, "", body].join("\n")

    const encodedEmail = Buffer.from(email).toString("base64").replace(/\+/g, "-").replace(/\//g, "_")

    await this.gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedEmail,
      },
    })
  }

  async markAsRead(messageId: string): Promise<void> {
    await this.gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: {
        removeLabelIds: ["UNREAD"],
      },
    })
  }

  async categorizeEmail(email: EmailMessage): Promise<string> {
    const subject = email.subject.toLowerCase()
    const body = email.body.toLowerCase()
    const from = email.from.toLowerCase()

    // Travel-related keywords
    if (
      /flight|airline|booking|confirmation|itinerary|travel|hotel|reservation/.test(subject + body) ||
      /booking\.com|expedia|hotels\.com|marriott|hilton|airbnb/.test(from)
    ) {
      return "travel"
    }

    // Expense-related keywords
    if (
      /expense|receipt|invoice|payment|bill|reimbursement/.test(subject + body) ||
      /finance|accounting|expense/.test(from)
    ) {
      return "expense"
    }

    // Meeting-related keywords
    if (
      /meeting|calendar|invite|appointment|conference|zoom|teams/.test(subject + body) ||
      /calendar|meeting/.test(from)
    ) {
      return "meeting"
    }

    return "general"
  }

  private extractEmailBody(payload: any): string {
    if (payload.body?.data) {
      return Buffer.from(payload.body.data, "base64").toString()
    }

    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === "text/plain" && part.body?.data) {
          return Buffer.from(part.body.data, "base64").toString()
        }
      }
    }

    return ""
  }

  private extractAttachments(payload: any): EmailAttachment[] {
    const attachments: EmailAttachment[] = []

    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.filename && part.body?.attachmentId) {
          attachments.push({
            filename: part.filename,
            mimeType: part.mimeType,
            size: part.body.size,
            attachmentId: part.body.attachmentId,
          })
        }
      }
    }

    return attachments
  }
}

// Mock service for development
export class MockGmailService extends GmailService {
  constructor() {
    super({
      clientId: "mock",
      clientSecret: "mock",
      redirectUri: "mock",
    })
  }

  async getEmails(): Promise<EmailMessage[]> {
    return [
      {
        id: "1",
        threadId: "thread1",
        from: "Travel Coordinator <travel@suitpax.com>",
        to: "user@company.com",
        subject: "Flight confirmation for NYC trip - BA 2847",
        body: "Your flight to New York has been confirmed for March 15th. Flight BA 2847 departing Madrid at 14:30...",
        date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        labels: ["INBOX", "IMPORTANT"],
      },
      {
        id: "2",
        threadId: "thread2",
        from: "Marriott Hotels <reservations@marriott.com>",
        to: "user@company.com",
        subject: "Booking confirmation #MR2024-NYC-001",
        body: "Thank you for choosing Marriott. Your reservation at Marriott Marquis Times Square is confirmed...",
        date: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        isRead: true,
        labels: ["INBOX"],
      },
    ]
  }

  async categorizeEmail(email: EmailMessage): Promise<string> {
    return super.categorizeEmail(email)
  }
}
