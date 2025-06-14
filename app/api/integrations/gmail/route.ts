import { type NextRequest, NextResponse } from "next/server"
import { GmailService, MockGmailService } from "@/lib/integrations/gmail-service"

const isDevelopment = process.env.NODE_ENV === "development"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const query = searchParams.get("query")
    const maxResults = Number.parseInt(searchParams.get("maxResults") || "50")

    // Use mock service in development or when no credentials are available
    const gmailService =
      isDevelopment || !process.env.GMAIL_CLIENT_ID
        ? new MockGmailService()
        : new GmailService({
            clientId: process.env.GMAIL_CLIENT_ID!,
            clientSecret: process.env.GMAIL_CLIENT_SECRET!,
            redirectUri: process.env.GMAIL_REDIRECT_URI!,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            accessToken: process.env.GMAIL_ACCESS_TOKEN,
          })

    switch (action) {
      case "auth-url":
        if (isDevelopment) {
          return NextResponse.json({
            authUrl: "/api/integrations/gmail?action=mock-auth",
            message: "Development mode - using mock authentication",
          })
        }
        const authUrl = await gmailService.getAuthUrl()
        return NextResponse.json({ authUrl })

      case "emails":
        const emails = await gmailService.getEmails(query || undefined, maxResults)

        // Categorize emails
        const categorizedEmails = await Promise.all(
          emails.map(async (email) => ({
            ...email,
            category: await gmailService.categorizeEmail(email),
            priority: email.labels.includes("IMPORTANT") ? "high" : "medium",
          })),
        )

        return NextResponse.json({ emails: categorizedEmails })

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
    console.error("Gmail API error:", error)
    return NextResponse.json(
      { error: "Failed to process Gmail request", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    const gmailService =
      isDevelopment || !process.env.GMAIL_CLIENT_ID
        ? new MockGmailService()
        : new GmailService({
            clientId: process.env.GMAIL_CLIENT_ID!,
            clientSecret: process.env.GMAIL_CLIENT_SECRET!,
            redirectUri: process.env.GMAIL_REDIRECT_URI!,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            accessToken: process.env.GMAIL_ACCESS_TOKEN,
          })

    switch (action) {
      case "send-email":
        if (isDevelopment) {
          return NextResponse.json({
            success: true,
            message: "Mock email sent successfully",
            messageId: "mock_" + Date.now(),
          })
        }
        await gmailService.sendEmail(data.to, data.subject, data.body)
        return NextResponse.json({ success: true, message: "Email sent successfully" })

      case "mark-read":
        if (isDevelopment) {
          return NextResponse.json({ success: true, message: "Mock email marked as read" })
        }
        await gmailService.markAsRead(data.messageId)
        return NextResponse.json({ success: true, message: "Email marked as read" })

      case "exchange-token":
        if (isDevelopment) {
          return NextResponse.json({
            tokens: { access_token: "mock_token", refresh_token: "mock_refresh" },
          })
        }
        const tokens = await gmailService.exchangeCodeForTokens(data.code)
        return NextResponse.json({ tokens })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Gmail API error:", error)
    return NextResponse.json(
      { error: "Failed to process Gmail request", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
