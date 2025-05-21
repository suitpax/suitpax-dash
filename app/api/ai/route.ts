import { NextResponse } from "next/server"
import { enhancedAiService } from "@/lib/ai/ai-service-enhanced"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, systemPrompt, stream } = body

    const response = await enhancedAiService.generateResponse({
      messages,
      systemPrompt,
      stream: stream || false,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in AI route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const capabilities = await enhancedAiService.getAICapabilities()
    return NextResponse.json(capabilities)
  } catch (error) {
    console.error("Error fetching AI capabilities:", error)
    return NextResponse.json({ error: "Failed to fetch AI capabilities" }, { status: 500 })
  }
}
