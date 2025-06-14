import { type NextRequest, NextResponse } from "next/server"
import { Anthropic } from "@anthropic-ai/sdk"
import { suitpaxKnowledge, getPersonalizedGreeting, getContextualResponse } from "@/data/suitpax-knowledge"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [], userProfile } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get contextual information for response style
    const context = getContextualResponse(message, conversationHistory, userProfile)

    // Build comprehensive system prompt with Suitpax knowledge
    const systemPrompt = `You are the Suitpax AI Agent, an intelligent assistant for the Suitpax business travel platform.

COMPANY INFORMATION:
- Name: ${suitpaxKnowledge.company.name}
- Mission: ${suitpaxKnowledge.company.mission}
- Website: ${suitpaxKnowledge.company.website}

CONTACT INFORMATION:
- AI Support: ${suitpaxKnowledge.contact.emails.ai}
- General Contact: ${suitpaxKnowledge.contact.emails.general}
- Social Media: ${Object.entries(suitpaxKnowledge.contact.socialMedia)
      .map(([platform, handle]) => `${platform}: ${handle}`)
      .join(", ")}

PRICING PLANS:
${Object.entries(suitpaxKnowledge.pricing)
  .map(([key, plan]) => `- ${plan.name}: ${plan.price} ${plan.billing} - ${plan.description}`)
  .join("\n")}

USER CONTEXT:
${
  userProfile
    ? `
- Name: ${userProfile.name || "Not provided"}
- Company: ${userProfile.company || "Not provided"}
- Role: ${userProfile.role || "traveler"}
- Plan: ${userProfile.subscription?.plan || "free"}
- Department: ${userProfile.department || "Not specified"}
`
    : "User not registered yet"
}

PLATFORM FEATURES:
${Object.entries(suitpaxKnowledge.features)
  .map(([key, feature]) => `- ${feature.name}: ${feature.description}`)
  .join("\n")}

RESPONSE GUIDELINES:
- ${
      context.personalizeGreeting && userProfile?.name
        ? `Address the user by name (${userProfile.name}) and reference their company (${userProfile.company}) when relevant`
        : "Use a friendly, professional tone"
    }
- Be concise and helpful (2-3 sentences max unless complex explanation needed)
- ${context.shouldIntroduce ? "Introduce yourself as the Suitpax AI Agent" : "Continue the conversation naturally"}
- Provide personalized recommendations based on user role and company
- Reference specific Suitpax features when relevant
- When discussing pricing, use the exact prices: Free ($0), Starter ($29/month), Pro ($74/month or $51/month annually), Enterprise (custom pricing)
- For support, direct users to ai@suitpax.com or hello@suitpax.com
- Mention social media handles when relevant

PERSONALITY:
- Professional business travel expert with personal touch
- Knowledgeable about all Suitpax features and pricing
- Remembers user details and provides personalized service
- Helpful and solution-oriented
- Adaptive communication style based on user role

USER ROLE SPECIFIC GUIDANCE:
${userProfile?.role === "manager" ? "- Focus on team management features, analytics, and approval workflows" : ""}
${userProfile?.role === "admin" ? "- Emphasize administrative features, user management, and integrations" : ""}
${userProfile?.role === "finance" ? "- Highlight expense management, reporting, and budget control features" : ""}

Remember: You represent Suitpax and should demonstrate deep knowledge of the platform while providing personalized, helpful service based on the user's profile and needs.`

    // Generate personalized greeting if needed
    let personalizedGreeting = ""
    if (context.personalizeGreeting && userProfile) {
      const timeOfDay = new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"
      personalizedGreeting = getPersonalizedGreeting(userProfile.name, userProfile.company, timeOfDay)
    }

    // Prepare conversation history for Claude
    const messages = [
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ]

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 400,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages,
    })

    const assistantMessage = response.content[0]
    if (assistantMessage.type !== "text") {
      throw new Error("Unexpected response type from Claude")
    }

    // Use personalized greeting for first interaction or fallback to AI response
    const finalMessage =
      context.personalizeGreeting && personalizedGreeting ? personalizedGreeting : assistantMessage.text

    return NextResponse.json({
      success: true,
      message: finalMessage,
      conversationId: Date.now().toString(),
      userRecognized: !!userProfile?.name,
    })
  } catch (error) {
    console.error("Chat API Error:", error)

    // Personalized fallback response
    const { userProfile } = (await request.json()) || {}
    const fallbackResponses = userProfile?.name
      ? [
          `Hello ${userProfile.name}! I'm your Suitpax AI Agent. I'm experiencing some technical difficulties, but I'm here to help with your business travel needs.`,
          `Hi ${userProfile.name}! I'm the Suitpax AI Agent for ${userProfile.company || "your company"}. How can I assist you today?`,
        ]
      : [
          "I'm the Suitpax AI Agent, here to help with your business travel needs. What can I assist you with today?",
          "Welcome to Suitpax! I'm your AI assistant, ready to help streamline your business travel.",
        ]

    const fallbackMessage = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]

    return NextResponse.json({
      success: true,
      message: fallbackMessage,
      conversationId: Date.now().toString(),
      fallback: true,
    })
  }
}
