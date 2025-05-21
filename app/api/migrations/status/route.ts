import { type NextRequest, NextResponse } from "next/server"
import { MigrationsService } from "@/lib/services/migrations-service"

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

    const status = await MigrationsService.checkDatabaseStatus(token)
    return NextResponse.json(status)
  } catch (error: any) {
    console.error("Error al verificar el estado de la base de datos:", error)
    return NextResponse.json(
      { error: error.message || "Error al verificar el estado de la base de datos" },
      { status: 500 },
    )
  }
}
