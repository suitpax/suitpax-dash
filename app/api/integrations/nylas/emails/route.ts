import { type NextRequest, NextResponse } from "next/server"
import { nylasEmailService } from "@/lib/integrations/nylas-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const unread = searchParams.get("unread") === "true"
    const starred = searchParams.get("starred") === "true"
    const from = searchParams.get("from") || undefined
    const subject = searchParams.get("subject") || undefined

    const emails = await nylasEmailService.getEmails({
      limit,
      unread: unread || undefined,
      starred: starred || undefined,
      from,
      subject,
    })

    // Categorize emails for travel management
    const categorizedEmails = emails.map((email) => ({
      ...email,
      category: nylasEmailService.categorizeEmail(email),
    }))

    return NextResponse.json({
      success: true,
      data: categorizedEmails,
      count: categorizedEmails.length,
    })
  } catch (error) {
    console.error("Error fetching emails:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch emails",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, cc, bcc, subject, body: emailBody, replyToMessageId } = body

    if (!to || !subject || !emailBody) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: to, subject, body",
        },
        { status: 400 },
      )
    }

    const sentEmail = await nylasEmailService.sendEmail({
      to,
      cc,
      bcc,
      subject,
      body: emailBody,
      replyToMessageId,
    })

    return NextResponse.json({
      success: true,
      data: sentEmail,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
