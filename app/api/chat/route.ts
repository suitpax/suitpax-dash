import { type NextRequest, NextResponse } from "next/server"
import { anthropic } from "@/lib/anthropic"
import { SUITPAX_MARKETING_GENIUS, PROMOTIONAL_OFFERS, ADDICTION_TRIGGERS } from "@/lib/ai/marketing-expert-prompts"
import { SalesGenius } from "@/lib/ai/sales-psychology"

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, isPro, plan, userContext } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Generate dynamic offer based on context
    const dynamicOffer = SalesGenius.generateOffer(userContext)
    const urgency = SalesGenius.createUrgency()
    const socialProof = SalesGenius.addSocialProof()

    // Enhanced marketing genius system prompt
    const marketingPrompt = `${SUITPAX_MARKETING_GENIUS}

CURRENT DYNAMIC OFFERS:
${Object.entries(PROMOTIONAL_OFFERS)
  .map(([key, offer]) => `${key.toUpperCase()}: ${offer.discount} - ${offer.description} (${offer.urgency})`)
  .join("\n")}

LIVE SOCIAL PROOF: ${socialProof}
CURRENT URGENCY: ${urgency}
SPECIAL OFFER FOR THIS USER: ${dynamicOffer.offer}

RESPONSE STRATEGY:
1. Answer their question with genuine value
2. Bridge naturally to Suitpax benefit
3. Add irresistible offer or incentive
4. Create urgency and FOMO
5. Include clear call-to-action

User's message: "${message}"

Remember: Be helpful first, then irresistibly persuasive. Make them NEED Suitpax!`

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500, // Increased for marketing content
      temperature: 0.9, // Higher for creativity and persuasion
      system: marketingPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    })

    let aiResponse =
      response.content[0]?.type === "text"
        ? response.content[0].text
        : "Great question! Let me show you how Suitpax can transform your business travel experience..."

    // Add dynamic elements to response
    const addictiveElements =
      ADDICTION_TRIGGERS.gamification[Math.floor(Math.random() * ADDICTION_TRIGGERS.gamification.length)]

    // Enhance response with marketing elements
    aiResponse = `${aiResponse}

${addictiveElements}

💡 **Exclusive for you**: ${dynamicOffer.offer}
${urgency}

Ready to join the smart travelers? Let's get you started! 🚀`

    return NextResponse.json({
      response: aiResponse,
      conversationId: conversationId || `conv_${Date.now()}`,
      offer: dynamicOffer,
      socialProof: socialProof,
      urgency: urgency,
      isMarketing: true,
    })
  } catch (error) {
    console.error("Marketing Chat API error:", error)

    // Even error responses should be marketing opportunities
    const fallbackResponse = `Hey! I'm having a quick technical moment, but here's what I can tell you...

🎯 **While I reconnect**: Did you know Suitpax users save 5+ hours per trip and $2,000+ annually?

🎉 **Special offer**: Get 30% off your first booking + 3 months free expense management!
⏰ **Limited time**: Next 48 hours only!

Want to see how we can transform your business travel? Let's chat when I'm back online! 🚀`

    return NextResponse.json({
      response: fallbackResponse,
      isMarketing: true,
      offer: PROMOTIONAL_OFFERS.newUser,
    })
  }
}
