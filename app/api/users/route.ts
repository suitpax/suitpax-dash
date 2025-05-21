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

    const users = await UserService.getUsers(token)
    return NextResponse.json(users)
  } catch (error: any) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ error: error.message || "Error al obtener usuarios" }, { status: 500 })
  }
}
