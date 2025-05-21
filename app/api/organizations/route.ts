import { type NextRequest, NextResponse } from "next/server"
import { OrganizationService } from "@/lib/services/organization-service"

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

    const organizations = await OrganizationService.getOrganizations(token)
    return NextResponse.json(organizations)
  } catch (error: any) {
    console.error("Error al obtener organizaciones:", error)
    return NextResponse.json({ error: error.message || "Error al obtener organizaciones" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getToken(request)
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()
    const organization = await OrganizationService.createOrganization(data, token)
    return NextResponse.json(organization)
  } catch (error: any) {
    console.error("Error al crear organización:", error)
    return NextResponse.json({ error: error.message || "Error al crear organización" }, { status: 500 })
  }
}
