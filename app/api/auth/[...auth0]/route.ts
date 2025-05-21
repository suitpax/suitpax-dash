import { NextResponse } from "next/server"

// This is a simplified mock implementation for the preview environment
// In production, you would use the actual Auth0 implementation
export async function GET(request: Request) {
  const url = new URL(request.url)
  const path = url.pathname

  // Handle login
  if (path.endsWith("/login")) {
    // In preview, we'll just set a cookie and redirect to dashboard
    const response = NextResponse.redirect(new URL("/dashboard", request.url))
    response.cookies.set("appSession", "preview-session", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    })
    return response
  }

  // Handle logout
  if (path.endsWith("/logout")) {
    // Clear the cookie and redirect to home
    const response = NextResponse.redirect(new URL("/", request.url))
    response.cookies.delete("appSession")
    return response
  }

  // Handle callback (not really used in preview)
  if (path.endsWith("/callback")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Handle me endpoint
  if (path.endsWith("/me")) {
    const appSession = url.searchParams.get("appSession")
    if (appSession) {
      return NextResponse.json({
        user: {
          sub: "preview-user",
          name: "Preview User",
          email: "preview@example.com",
        },
      })
    } else {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
  }

  // Default response for unknown paths
  return NextResponse.json({ error: "Not found" }, { status: 404 })
}

export async function POST(request: Request) {
  return GET(request)
}
