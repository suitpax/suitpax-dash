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

    const migrations = await MigrationsService.getMigrations(token)
    return NextResponse.json(migrations)
  } catch (error: any) {
    console.error("Error al obtener migraciones:", error)
    return NextResponse.json({ error: error.message || "Error al obtener migraciones" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getToken(request)
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { action } = await request.json()

    if (action === "apply") {
      const result = await MigrationsService.applyMigrations(token)
      return NextResponse.json(result)
    } else if (action === "revert") {
      const result = await MigrationsService.revertLastMigration(token)
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Error al ejecutar acción de migraciones:", error)
    return NextResponse.json({ error: error.message || "Error al ejecutar acción de migraciones" }, { status: 500 })
  }
}
