import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

// Pricing plans based on suitpax.com/pricing
const PRICING_PLANS = {
  free: {
    name: "Free",
    price: 0,
    features: ["Basic travel search", "Limited AI queries (10/month)", "Standard support"],
    limits: {
      aiQueries: 10,
      bookings: 5,
    },
  },
  starter: {
    name: "Starter",
    price: 29,
    features: ["Unlimited travel search", "AI travel assistant", "Expense tracking", "Email support"],
    limits: {
      aiQueries: 500,
      bookings: 50,
    },
  },
  business: {
    name: "Business",
    price: 99,
    features: [
      "Everything in Starter",
      "Team management",
      "Advanced analytics",
      "Priority support",
      "Custom integrations",
    ],
    limits: {
      aiQueries: 2000,
      bookings: 200,
    },
  },
  enterprise: {
    name: "Enterprise",
    price: 299,
    features: ["Everything in Business", "Unlimited AI queries", "Dedicated support", "Custom workflows", "API access"],
    limits: {
      aiQueries: -1, // unlimited
      bookings: -1, // unlimited
    },
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, isPro = false, plan = "free", conversationId, agentId, agentSpecialty } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get user plan limits
    const userPlan = PRICING_PLANS[plan as keyof typeof PRICING_PLANS] || PRICING_PLANS.free

    // System prompt for Suitpax AI
    const systemPrompt = `You are Suitpax AI, an intelligent business travel assistant. You help users with:

**CORE CAPABILITIES:**
- Flight and hotel bookings
- Expense management and tracking  
- Travel policy compliance
- Itinerary planning and optimization
- Corporate travel guidelines
- Real-time travel updates and alerts

**USER PLAN:** ${userPlan.name} (${userPlan.price === 0 ? "Free" : `$${userPlan.price}/month`})
**PLAN FEATURES:** ${userPlan.features.join(", ")}

**COMMUNICATION STYLE:**
- Professional yet friendly
- Concise and actionable responses
- Focus on business travel efficiency
- Provide specific recommendations
- Always consider cost optimization

**RESPONSE FORMAT:**
- Use clear headings with **bold text**
- Provide bullet points for options
- Include relevant pricing when applicable
- Suggest next steps
- Keep responses under 200 words unless complex queries require more detail

**TRAVEL EXPERTISE:**
- Corporate travel policies and compliance
- Expense reporting and management
- Flight and accommodation booking
- Travel risk management
- Cost optimization strategies
- International travel requirements

Respond as a knowledgeable travel professional who understands business needs and budget constraints.`

    // Generate AI response using Anthropic Claude
    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      system: systemPrompt,
      prompt: message,
      maxTokens: 1000,
      temperature: 0.7,
    })

    return NextResponse.json({
      response: text,
      plan: userPlan.name,
      remainingQueries: userPlan.limits.aiQueries === -1 ? "unlimited" : userPlan.limits.aiQueries,
    })
  } catch (error) {
    console.error("Chat API Error:", error)

    // Fallback response for errors
    const fallbackResponse = `I apologize, but I'm experiencing technical difficulties right now. 

**What I can help you with:**
- Flight and hotel bookings
- Expense management
- Travel policy questions
- Itinerary planning

**Quick Actions:**
- Try rephrasing your question
- Check our help center
- Contact support if the issue persists

Please try again in a moment, or feel free to ask a different question.`

    return NextResponse.json({
      response: fallbackResponse,
      error: "AI service temporarily unavailable",
    })
  }
}
