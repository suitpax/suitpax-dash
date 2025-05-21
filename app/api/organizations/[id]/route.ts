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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getToken(request)
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const organization = await OrganizationService.getOrganization(params.id, token)
    return NextResponse.json(organization)
  } catch (error: any) {
    console.error(`Error al obtener la organización ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Error al obtener la organización" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getToken(request)
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()
    const organization = await OrganizationService.updateOrganization(params.id, data, token)
    return NextResponse.json(organization)
  } catch (error: any) {
    console.error(`Error al actualizar la organización ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Error al actualizar la organización" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getToken(request)
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const success = await OrganizationService.deleteOrganization(params.id, token)
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Error al eliminar la organización" }, { status: 500 })
    }
  } catch (error: any) {
    console.error(`Error al eliminar la organización ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Error al eliminar la organización" }, { status: 500 })
  }
}
