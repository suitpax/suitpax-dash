import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (!code) {
      return NextResponse.json({ success: false, error: "No authorization code provided" }, { status: 400 })
    }

    if (state !== "suitpax_cal_ai") {
      return NextResponse.json({ success: false, error: "Invalid state parameter" }, { status: 400 })
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://api.nylas.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NYLAS_API_KEY}`,
      },
      body: JSON.stringify({
        client_id: process.env.NYLAS_CLIENT_ID,
        client_secret: process.env.NYLAS_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error || "Failed to exchange code for token")
    }

    // Store the access token securely (in a real app, you'd save this to your database)
    // For now, we'll redirect back to the Cal AI page

    return NextResponse.redirect(new URL("/suitpax-cal-ai?connected=true", request.url))
  } catch (error) {
    console.error("Error in Nylas callback:", error)
    return NextResponse.redirect(new URL("/suitpax-cal-ai?error=connection_failed", request.url))
  }
}
