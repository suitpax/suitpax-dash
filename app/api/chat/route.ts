import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

// Enhanced Suitpax AI System (Simplified without MCP/Supabase)
const SUITPAX_MASTER_PROMPT = `You are Suitpax AI, the world's most powerful business travel intelligence system created by Alberto (Founder & CEO).

🏢 SUITPAX COMPANY:
- Founded by: Alberto (Founder & CEO)
- Mission: AI-powered business travel revolution
- Domain: app.suitpax.com (authenticated users)
- Status: Leading global business travel platform

💰 REAL SUITPAX PRICING (3 PLANS ONLY):
✅ Free: €0/month - Basic features, limited queries
✅ Pro: €74/month (€51/month annually with 20% discount) - Advanced features
✅ Enterprise: Custom pricing - Unlimited everything, dedicated support

🎯 CORE CAPABILITIES:
- Flight booking and management
- Hotel reservations
- Expense tracking and reporting
- Travel policy compliance
- Real-time travel insights
- Multi-language support
- Smart recommendations

🌍 MULTI-LANGUAGE SUPPORT:
- English, Spanish, Chinese, Portuguese, Russian, Swedish, French, German
- Auto-detect user language and respond accordingly

🎯 RESPONSE PROTOCOL:
1. **Detect Language**: Auto-detect from user input
2. **Provide Solutions**: Offer actionable travel solutions
3. **Guide Navigation**: Direct users to relevant pages
4. **Be Proactive**: Suggest related actions

RESPONSE STYLE:
- Keep under 80 words unless analysis requested
- Use bullet points for clarity
- Provide direct links to dashboard pages
- Be solution-oriented with immediate guidance
- Professional yet friendly

PERSONALITY:
- Start with "Hey" in user's language
- Professional yet friendly
- Confident about capabilities
- Proactive with intelligent suggestions
- Modern and efficient

DOMAIN AWARENESS:
- Users are on app.suitpax.com
- Provide direct navigation after suggestions
- Focus on business travel solutions

Remember: You are the intelligent assistant that helps users navigate and optimize their business travel experience.`

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, userProfile, plan = "free", thinkingMode = false } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Detect language automatically
    const detectedLanguage = detectLanguage(message)

    // Enhanced prompt with user context
    const enhancedPrompt = `${message}

USER CONTEXT:
- Plan: ${plan}
- Detected Language: ${detectedLanguage}
- Domain: app.suitpax.com
- Thinking Mode: ${thinkingMode ? "ON" : "OFF"}

${userProfile?.name ? `Name: ${userProfile.name}` : ""}
${userProfile?.company ? `Company: ${userProfile.company}` : ""}

Respond in ${detectedLanguage} language. Provide helpful travel guidance and direct users to relevant pages.`

    // Generate response
    const { text } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: SUITPAX_MASTER_PROMPT,
      prompt: enhancedPrompt,
      temperature: 1.0,
      maxTokens: thinkingMode ? 1000 : 400,
    })

    return NextResponse.json({
      response: text,
      conversationId,
      timestamp: new Date().toISOString(),
      model: "claude-3-5-sonnet-20241022",
      detectedLanguage,
      plan,
      domain: "app.suitpax.com",
      capabilities: [
        "flight_booking",
        "hotel_reservations",
        "expense_tracking",
        "travel_insights",
        "policy_compliance",
        "multi_language_support",
      ],
    })
  } catch (error) {
    console.error("Suitpax AI Error:", error)
    return NextResponse.json(
      {
        response: "Hey, I'm experiencing technical difficulties. Please try again in a moment!",
        error: "Technical issue",
      },
      { status: 500 },
    )
  }
}

// Language detection function
function detectLanguage(text: string): string {
  const languagePatterns = {
    Spanish: /\b(hola|crear|añadir|necesito|quiero|gracias|por favor|vuelo|hotel|viaje)\b/i,
    Chinese: /[\u4e00-\u9fff]/,
    Portuguese: /\b(olá|criar|adicionar|preciso|quero|obrigado|por favor|voo|hotel|viagem)\b/i,
    Russian: /[а-яё]/i,
    Swedish: /\b(hej|skapa|lägga till|behöver|vill|tack|snälla|flyg|hotell|resa)\b/i,
    French: /\b(bonjour|créer|ajouter|besoin|veux|merci|s'il vous plaît|vol|hôtel|voyage)\b/i,
    German: /\b(hallo|erstellen|hinzufügen|brauche|möchte|danke|bitte|flug|hotel|reise)\b/i,
  }

  for (const [language, pattern] of Object.entries(languagePatterns)) {
    if (pattern.test(text)) {
      return language
    }
  }

  return "English"
}
