import { type NextRequest, NextResponse } from "next/server"
import { aiService } from "@/lib/ai/ai-service"

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt } = await req.json()

    // Generar respuesta usando el servicio de IA
    const response = await aiService.generateResponse({
      messages,
      systemPrompt,
    })

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in AI API route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
