import { type NextRequest, NextResponse } from "next/server"
import { generateChatCompletion } from "@/lib/ai/anthropic-service"

export async function POST(req: NextRequest) {
  try {
    const { messages, model, temperature, maxTokens, systemPrompt } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required and must be an array" }, { status: 400 })
    }

    const response = await generateChatCompletion({
      messages,
      model,
      temperature,
      maxTokens,
      systemPrompt,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in AI route:", error)
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 })
  }
}
