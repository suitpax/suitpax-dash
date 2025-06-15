import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

// REAL Suitpax system prompt - ONLY actual project features
const SUITPAX_SYSTEM_PROMPT = `You are Suitpax AI, the intelligent travel assistant for the Suitpax platform created by Alberto and Alexis.

LANGUAGE DETECTION & RESPONSE:
- Automatically detect the user's language from their message
- Respond in the same language the user is using
- Default to English if language is unclear
- Supported languages: English, Spanish, French, German, Italian, Portuguese

IMPORTANT: You ONLY know about features that actually exist in this Suitpax project. Never invent or assume functionality.

REAL AVAILABLE PAGES & FEATURES:
✅ Dashboard - Main overview with stats and quick actions
✅ Flights - Flight search page (uses Duffel API integration)
✅ Hotels - Hotel booking page with search functionality  
✅ Trains - Train booking interface
✅ Transfers - Ground transportation booking
✅ Expenses - Expense tracking and management
✅ Tasks - Task management system (starts empty)
✅ Team Management - Team member management (starts empty)
✅ Mails - Email integration with Nylas
✅ Meetings - Calendar and meeting management
✅ Events - Event planning and management
✅ Analytics - Travel analytics and reporting (starts with no data)
✅ Reports - Report generation system (starts empty)
✅ Vendors - Vendor management (starts empty)
✅ Budgets - Budget tracking (starts at 0)
✅ Forecasting - Travel forecasting tools
✅ Goals - Goal setting and tracking
✅ Compliance - Travel policy compliance
✅ Sustainability - Carbon footprint tracking
✅ Smart Bank - Financial intelligence
✅ Suitpax AI - This chat interface
✅ AI Agents - Specialized AI assistants
✅ AI Chat Examples - Example conversations
✅ Plans - Subscription plans page
✅ Profile - User profile management
✅ Settings - Account settings
✅ Onboarding - User setup process
✅ Travel Policy - Company travel policies

REAL INTEGRATIONS:
✅ Duffel API - For real flight data and booking
✅ Nylas API - For email and calendar integration
✅ Google Maps - For location services
✅ Anthropic Claude - For AI responses (this conversation)
✅ Neon Database - For data storage
✅ Supabase - For additional data services

REAL PRICING PLANS (Updated):
✅ Free: €0/month - 5,000 AI tokens/month, 10 AI travel searches, up to 5 team members, basic features
✅ Basic: €49/month (€39 annually) - 15,000 AI tokens/month, 30 AI travel searches, up to 15 team members, priority support
✅ Pro: €89/month (€71 annually) - 25,000 AI tokens/month, 50 AI travel searches, up to 25 team members, advanced features
✅ Enterprise: Custom pricing - Unlimited AI tokens, unlimited searches, unlimited team members, full feature suite

WHAT I CANNOT DO:
❌ Provide fake flight prices or schedules
❌ Invent hotel availability or rates
❌ Create fake booking confirmations
❌ Give incorrect company information
❌ Pretend features exist that don't
❌ Provide mock travel data
❌ Make actual bookings (direct users to appropriate pages)

WHAT I CAN DO:
✅ Guide users to the correct pages
✅ Explain how to use existing features
✅ Help with navigation and onboarding
✅ Answer questions about real functionality
✅ Assist with account setup
✅ Explain pricing plans accurately
✅ Direct to appropriate integrations
✅ Help with expense management
✅ Assist with team management
✅ Provide travel policy guidance

RESPONSE STYLE:
- Detect and respond in user's language
- Be honest about current capabilities
- Direct users to real features
- Keep responses concise and helpful
- If something doesn't exist yet, say so clearly
- Focus on what actually works
- Mention Alberto and Alexis when relevant
- Professional but friendly tone

THINKING MODE:
When thinking mode is enabled, show reasoning process using <Thinking> tags before final response.

Remember: Only provide information about features that actually exist in this Suitpax project. Never create fake data or examples.`

// Language detection helper
function detectLanguage(text: string): string {
  const lowerText = text.toLowerCase()

  // Spanish indicators
  if (
    lowerText.includes("hola") ||
    lowerText.includes("gracias") ||
    lowerText.includes("por favor") ||
    lowerText.includes("¿") ||
    lowerText.includes("¡") ||
    lowerText.includes("español")
  ) {
    return "Spanish"
  }

  // French indicators
  if (
    lowerText.includes("bonjour") ||
    lowerText.includes("merci") ||
    lowerText.includes("s'il vous plaît") ||
    lowerText.includes("français") ||
    lowerText.includes("où") ||
    lowerText.includes("être")
  ) {
    return "French"
  }

  // German indicators
  if (
    lowerText.includes("hallo") ||
    lowerText.includes("danke") ||
    lowerText.includes("bitte") ||
    lowerText.includes("deutsch") ||
    lowerText.includes("wie") ||
    lowerText.includes("ist")
  ) {
    return "German"
  }

  // Italian indicators
  if (
    lowerText.includes("ciao") ||
    lowerText.includes("grazie") ||
    lowerText.includes("prego") ||
    lowerText.includes("italiano") ||
    lowerText.includes("dove") ||
    lowerText.includes("essere")
  ) {
    return "Italian"
  }

  // Portuguese indicators
  if (
    lowerText.includes("olá") ||
    lowerText.includes("obrigado") ||
    lowerText.includes("por favor") ||
    lowerText.includes("português") ||
    lowerText.includes("onde") ||
    lowerText.includes("ser")
  ) {
    return "Portuguese"
  }

  // Default to English
  return "English"
}

export async function POST(request: NextRequest) {
  try {
    const { message, thinkingMode = false, conversationId, userProfile, plan = "free" } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Detect user language
    const detectedLanguage = detectLanguage(message)

    let enhancedPrompt = message

    // Add user context if available
    if (userProfile && userProfile.name) {
      enhancedPrompt = `User ${userProfile.name} (${plan} plan) asks: ${message}`
    } else {
      enhancedPrompt = `User (${plan} plan) asks: ${message}`
    }

    // Add language context
    enhancedPrompt += `\n\nDetected language: ${detectedLanguage}. Please respond in ${detectedLanguage}.`

    // Add thinking mode instruction
    if (thinkingMode) {
      enhancedPrompt += `\n\nTHINKING MODE: Show your reasoning process using <Thinking> tags before your final response.`
    }

    // Generate response with Claude 3.7 (using the latest available model)
    const { text } = await generateText({
      model: anthropic("claude-3-7-sonnet-20250219"), // Updated to Claude 3.7
      system: SUITPAX_SYSTEM_PROMPT,
      prompt: enhancedPrompt,
      temperature: thinkingMode ? 0.3 : 0.7,
      maxTokens: thinkingMode ? 800 : 500,
    })

    // Extract thinking process if present
    let thinking = ""
    let response = text

    if (thinkingMode && text.includes("<Thinking>")) {
      const thinkingMatch = text.match(/<Thinking>(.*?)<\/Thinking>/s)
      if (thinkingMatch) {
        thinking = thinkingMatch[1].trim()
        response = text.replace(/<Thinking>.*?<\/Thinking>/s, "").trim()
      }
    }

    // Calculate tokens
    const tokens = Math.ceil(text.length / 4)

    return NextResponse.json({
      response: response,
      thinking: thinking || undefined,
      tokens,
      conversationId,
      timestamp: new Date().toISOString(),
      model: "claude-3-7-sonnet-20250219", // Updated model name
      detectedLanguage,
      plan,
      accuracy: "real-features-only",
    })
  } catch (error) {
    console.error("Error in chat API:", error)

    // Error response in multiple languages
    const errorResponses = {
      English: "I'm having a technical issue. Please try again in a moment!",
      Spanish: "Estoy teniendo un problema técnico. ¡Por favor intenta de nuevo en un momento!",
      French: "J'ai un problème technique. Veuillez réessayer dans un moment!",
      German: "Ich habe ein technisches Problem. Bitte versuchen Sie es in einem Moment noch einmal!",
      Italian: "Ho un problema tecnico. Per favore riprova tra un momento!",
      Portuguese: "Estou tendo um problema técnico. Por favor, tente novamente em um momento!",
    }

    return NextResponse.json(
      {
        error: errorResponses.English,
        errorTranslations: errorResponses,
      },
      { status: 500 },
    )
  }
}
