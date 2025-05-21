import { NextResponse } from "next/server"
import { processMessage } from "@/lib/ai/ai-service"
import type { Message } from "@/lib/ai/message-types"

export async function POST(request: Request) {
  try {
    const { messages, systemPrompt } = await request.json()

    // Validar la entrada
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request: messages must be an array" }, { status: 400 })
    }

    // Convertir las fechas de string a Date
    const formattedMessages: Message[] = messages.map((message: any) => ({
      ...message,
      createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
    }))

    // Procesar el mensaje con el servicio interno
    const result = await processMessage(formattedMessages, systemPrompt)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing AI request:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}
