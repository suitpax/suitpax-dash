import { type NextRequest, NextResponse } from "next/server"
import { dataService } from "@/lib/ai/data-service"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const table = searchParams.get("table")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
    const column = searchParams.get("column")
    const term = searchParams.get("term")

    // Validar los datos de entrada
    if (!table) {
      return NextResponse.json({ error: "Se requiere un nombre de tabla" }, { status: 400 })
    }

    // Obtener los datos de la tabla
    let data
    if (column && term) {
      data = await dataService.searchTableData(table, column, term, pageSize)
    } else {
      data = await dataService.getTableData(table, pageSize, (page - 1) * pageSize)
    }

    // Obtener el total de registros (en una implementación real, esto vendría de una consulta COUNT)
    const totalCount = data.length // Esto es una simplificación

    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    })
  } catch (error) {
    console.error("Error in data API route:", error)
    return NextResponse.json({ error: "Error al obtener los datos de la tabla" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, params } = body

    // Validar los datos de entrada
    if (!query) {
      return NextResponse.json({ error: "Se requiere una consulta SQL" }, { status: 400 })
    }

    // Ejecutar la consulta SQL
    const result = await dataService.executeQuery(query, params || [])

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Error in data API route:", error)
    return NextResponse.json({ error: "Error al ejecutar la consulta SQL" }, { status: 500 })
  }
}
