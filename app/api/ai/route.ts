import { type NextRequest, NextResponse } from "next/server"
import { enhancedAiService } from "@/lib/ai/ai-service-enhanced"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      messages,
      systemPrompt,
      includeTableData,
      tableName,
      searchParams,
      promptId,
      stream,
      useInternalSystem = true, // Por defecto, usar el sistema interno
    } = body

    // Validar los datos de entrada
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Se requiere un array de mensajes válido" }, { status: 400 })
    }

    // Generar la respuesta con el servicio mejorado
    const response = await enhancedAiService.generateResponse({
      messages,
      systemPrompt,
      includeTableData,
      tableName,
      searchParams,
      promptId,
      stream,
      useInternalSystem,
    })

    // Si es una respuesta en streaming, devolverla directamente
    if (stream) {
      return response
    }

    // Si no, devolver la respuesta como JSON
    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in AI API route:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud de IA" }, { status: 500 })
  }
}
