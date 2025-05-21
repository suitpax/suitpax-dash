import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/services/auth-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case "login":
        const loginResponse = await AuthService.login(data)
        return NextResponse.json(loginResponse)

      case "register":
        const registerResponse = await AuthService.register(data)
        return NextResponse.json(registerResponse)

      case "verify-token":
        const verifyResponse = await AuthService.verifyToken(data.token)
        return NextResponse.json(verifyResponse)

      case "logout":
        const logoutSuccess = await AuthService.logout(data.token)
        return NextResponse.json({ success: logoutSuccess })

      case "request-password-reset":
        const resetRequestSuccess = await AuthService.requestPasswordReset(data.email)
        return NextResponse.json({ success: resetRequestSuccess })

      case "reset-password":
        const resetSuccess = await AuthService.resetPassword(data.token, data.newPassword)
        return NextResponse.json({ success: resetSuccess })

      default:
        return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Error en API de autenticación:", error)
    return NextResponse.json({ error: error.message || "Error en el servicio de autenticación" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    switch (action) {
      case "google-login":
        const redirectUri = searchParams.get("redirect_uri") || `${process.env.FE_BASE_URL}/auth/google/callback`
        const authUrl = await AuthService.googleLogin(redirectUri)
        return NextResponse.json({ authorization_url: authUrl })

      default:
        return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Error en API de autenticación:", error)
    return NextResponse.json({ error: error.message || "Error en el servicio de autenticación" }, { status: 500 })
  }
}
