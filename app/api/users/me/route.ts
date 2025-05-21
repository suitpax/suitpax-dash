import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/services/user-service"

// Función auxiliar para obtener el token de autorización
const getToken = (req: NextRequest): string | null => {
  const authHeader = req.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  return authHeader.substring(7)
}

export async function GET(request: NextRequest) {
  try {
    const token = getToken(request)
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const user = await UserService.getCurrentUser(token)
    return NextResponse.json(user)
  } catch (error: any) {
    console.error("Error al obtener el perfil del usuario:", error)
    return NextResponse.json({ error: error.message || "Error al obtener el perfil del usuario" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getToken(request)
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()
    const user = await UserService.updateCurrentUser(data, token)
    return NextResponse.json(user)
  } catch (error: any) {
    console.error("Error al actualizar el perfil del usuario:", error)
    return NextResponse.json({ error: error.message || "Error al actualizar el perfil del usuario" }, { status: 500 })
  }
}
