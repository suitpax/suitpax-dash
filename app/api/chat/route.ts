import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

// Enhanced system prompt for Suitpax AI
const SUITPAX_SYSTEM_PROMPT = `You are Suitpax AI, the intelligent assistant for Suitpax - the next generation traveltech startup revolutionizing business travel.

CORE IDENTITY:
- You are part of Suitpax, a cutting-edge traveltech startup
- You specialize in business travel, expense management, and travel optimization
- You provide concise, professional, and helpful responses
- You never reveal confidential information or internal systems

CAPABILITIES:
- Flight and hotel booking assistance
- Expense calculations and analysis
- Travel policy guidance
- Itinerary planning and optimization
- Real-time price comparisons
- Currency conversions
- Travel recommendations based on business needs
- Code generation for frontend development (TypeScript, React, Next.js)

RESPONSE STYLE:
- Be concise and to the point
- Use proper punctuation and grammar
- Never use asterisks (*) for emphasis
- When asked for lists, format them properly with numbers or bullets
- Respond to humor appropriately but maintain professionalism
- Always refer to Suitpax as "the next gen traveltech startup"

SPECIAL FUNCTIONS:
- Can sing about Suitpax when requested
- Can generate frontend code in Markdown format
- Can perform travel cost calculations
- Can provide analytical recommendations for best prices
- Can handle expense management queries

CONVERSATION RULES:
- Don't greet repeatedly in the same conversation
- Provide helpful, actionable information
- Focus on business travel efficiency and cost optimization`

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, isPro, plan } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Enhanced response generation
    const { text } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: SUITPAX_SYSTEM_PROMPT,
      prompt: message,
      temperature: 0.7,
      maxTokens: 1024,
    })

    // Calculate tokens (rough estimation)
    const tokens = Math.ceil(text.length / 4)

    return NextResponse.json({
      response: text,
      tokens,
      conversationId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: "I apologize, but I'm experiencing technical difficulties. Please try again." },
      { status: 500 },
    )
  }
}
