import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

// Enhanced system prompt for Suitpax AI
const SUITPAX_SYSTEM_PROMPT = `You are Suitpax AI, the intelligent travel assistant for Suitpax platform.

CORE IDENTITY:
- You're a knowledgeable, friendly AI that helps with business travel
- You're part of the Suitpax ecosystem - a modern travel management platform
- You provide accurate, helpful responses based on real data when available

CAPABILITIES:
- Flight search and booking assistance
- Hotel reservations help
- Expense tracking guidance
- Travel policy compliance
- Real-time travel insights
- Currency conversions
- Weather and destination information

RESPONSE GUIDELINES:
- Be conversational but professional
- Keep responses concise (2-3 sentences unless detail is requested)
- When users ask about bookings, direct them to the appropriate pages
- Ask clarifying questions when needed
- Focus on being genuinely helpful

PERSONALITY:
- Helpful and efficient
- Curious about travel preferences
- Focused on providing real value
- Professional but approachable

Remember: Always provide helpful guidance and direct users to the right features in Suitpax.`

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, userProfile } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    let enhancedPrompt = message

    // Add user context if available
    if (userProfile && userProfile.name) {
      enhancedPrompt = `User ${userProfile.name} asks: ${message}`
    }

    // Enhanced response generation with Haiku model
    const { text } = await generateText({
      model: anthropic("claude-3-5-haiku-20241022"),
      system: SUITPAX_SYSTEM_PROMPT,
      prompt: enhancedPrompt,
      temperature: 0.7,
      maxTokens: 512,
    })

    // Calculate tokens (rough estimation)
    const tokens = Math.ceil(text.length / 4)

    return NextResponse.json({
      response: text,
      tokens,
      conversationId,
      timestamp: new Date().toISOString(),
      model: "claude-3-5-haiku-20241022",
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: "I'm having a quick technical hiccup. Give me a moment and try again!" },
      { status: 500 },
    )
  }
}
