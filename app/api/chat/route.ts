import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

// Language detection helper
function detectLanguage(text: string): string {
  const spanishPatterns =
    /\b(hola|gracias|por favor|buenas|días|cómo|está|soy|tengo|quiero|necesito|viaje|vuelo|hotel)\b/i
  const frenchPatterns = /\b(bonjour|merci|s'il vous plaît|comment|allez|suis|avoir|veux|besoin|voyage|vol|hôtel)\b/i
  const portuguesePatterns = /\b(olá|obrigado|por favor|como|está|sou|tenho|quero|preciso|viagem|voo|hotel)\b/i
  const italianPatterns = /\b(ciao|grazie|per favore|come|stai|sono|ho|voglio|bisogno|viaggio|volo|hotel)\b/i
  const germanPatterns = /\b(hallo|danke|bitte|wie|gehts|bin|habe|will|brauche|reise|flug|hotel)\b/i

  if (spanishPatterns.test(text)) return "Spanish"
  if (frenchPatterns.test(text)) return "French"
  if (portuguesePatterns.test(text)) return "Portuguese"
  if (italianPatterns.test(text)) return "Italian"
  if (germanPatterns.test(text)) return "German"

  return "English"
}

// Enhanced Suitpax AI system prompt with language adaptation
const SUITPAX_SYSTEM_PROMPT = `You are Suitpax AI, the intelligent business travel assistant created by Alberto (Founder & CEO of Suitpax).

LANGUAGE ADAPTATION:
- Automatically detect the user's language and respond in the same language
- Keep responses SHORT (maximum 100 words)
- Use natural, conversational tone
- Be concise but helpful

COMPANY INFORMATION:
- Founder & CEO: Alberto
- Mission: Revolutionizing business travel with AI-powered solutions
- Focus: Corporate travel management, expense optimization, policy compliance

REAL AVAILABLE FEATURES IN SUITPAX:
✅ Dashboard - Comprehensive travel overview with real-time analytics
✅ Flights - Live flight search with Duffel API integration for real pricing
✅ Hotels - Hotel booking with live availability and rates
✅ Trains - European and global train booking system
✅ Transfers - Ground transportation and airport transfers
✅ Expenses - Advanced expense tracking with receipt scanning
✅ Tasks - Project and travel task management
✅ Team Management - Corporate team oversight and permissions
✅ Mails - Nylas-powered email integration for travel communications
✅ Meetings - Calendar sync and meeting scheduling
✅ Events - Corporate event planning and management
✅ Analytics - Deep travel insights and spending analysis
✅ Smart Bank - Financial intelligence and banking integrations
✅ AI Agents - Specialized travel assistants for different needs
✅ Travel Policy - Dynamic policy management and enforcement

RESPONSE GUIDELINES:
- Start with "Hey" in the user's language
- Keep responses under 100 words - BE CONCISE
- Focus on real capabilities only
- Direct users to actual features
- Be friendly but professional
- Ask for user's name if not known

LANGUAGE EXAMPLES:
- English: "Hey! I can help you with..."
- Spanish: "¡Hey! Puedo ayudarte con..."
- French: "Hey! Je peux t'aider avec..."
- Portuguese: "Hey! Posso te ajudar com..."
- German: "Hey! Ich kann dir helfen mit..."
- Italian: "Hey! Posso aiutarti con..."

Remember: Be concise, helpful, and respond in the user's detected language.`

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, userProfile, plan = "free" } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Detect language from user message
    const detectedLanguage = detectLanguage(message)

    let enhancedPrompt = `User message in ${detectedLanguage}: ${message}`

    // Add user context if available
    if (userProfile && userProfile.name) {
      enhancedPrompt = `User ${userProfile.name} asks in ${detectedLanguage}: ${message}`
    }

    // Add plan context
    enhancedPrompt += `\n\nUser's current plan: ${plan}\nPlease respond in ${detectedLanguage} language and keep it SHORT (max 100 words).`

    // Generate response with language-aware system knowledge
    const { text } = await generateText({
      model: anthropic("claude-3-5-haiku-20241022"),
      system: SUITPAX_SYSTEM_PROMPT,
      prompt: enhancedPrompt,
      temperature: 0.3,
      maxTokens: 200, // Reduced for shorter responses
    })

    // Calculate tokens
    const tokens = Math.ceil(text.length / 4)

    return NextResponse.json({
      response: text,
      tokens,
      conversationId,
      timestamp: new Date().toISOString(),
      model: "claude-3-5-haiku-20241022",
      detectedLanguage,
      plan,
    })
  } catch (error) {
    console.error("Error in chat API:", error)

    // Detect language for error message
    const userLanguage = detectLanguage(request.body?.message || "")
    const errorMessages = {
      Spanish: "Hey, tengo dificultades técnicas. ¡Inténtalo de nuevo en un momento!",
      French: "Hey, j'ai des difficultés techniques. Réessayez dans un moment!",
      Portuguese: "Hey, estou com dificuldades técnicas. Tente novamente em um momento!",
      German: "Hey, ich habe technische Schwierigkeiten. Versuche es in einem Moment noch einmal!",
      Italian: "Hey, ho difficoltà tecniche. Riprova tra un momento!",
      English: "Hey, I'm experiencing technical difficulties. Please try again in a moment!",
    }

    return NextResponse.json(
      {
        response: errorMessages[userLanguage as keyof typeof errorMessages] || errorMessages.English,
        error: "Technical issue",
      },
      { status: 500 },
    )
  }
}
