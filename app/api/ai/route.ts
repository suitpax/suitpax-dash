import { NextResponse } from "next/server"
import { anthropicService } from "@/lib/ai/anthropic-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, systemPrompt } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request format. 'messages' array is required." }, { status: 400 })
    }

    const response = await anthropicService.generateResponse({ messages, systemPrompt })

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in AI route:", error)

    // Proporcionar una respuesta de fallback en caso de error
    return NextResponse.json(
      {
        response: {
          id: `error-${Date.now()}`,
          content: "I'm sorry, I encountered an issue processing your request. Please try again later.",
          role: "assistant",
          createdAt: new Date(),
        },
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
