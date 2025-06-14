import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

// Initialize Anthropic client with better error handling
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Constants for better maintainability
const LIMITS = {
  FREE: { maxTokens: 25000, maxMessageLength: 1200, rateLimit: 30 },
  STARTER: { maxTokens: 35000, maxMessageLength: 1500, rateLimit: 75 },
  BUSINESS: { maxTokens: 50000, maxMessageLength: 2000, rateLimit: 150 },
  ENTERPRISE: { maxTokens: 75000, maxMessageLength: 3000, rateLimit: 300 },
} as const

const TEMPERATURE = {
  FREE: 0.7,
  STARTER: 0.8,
  BUSINESS: 0.9,
  ENTERPRISE: 1.0,
} as const

interface RequestBody {
  message: string
  isPro?: boolean
  plan?: "free" | "starter" | "business" | "enterprise"
  userId?: string
  conversationId?: string
  context?: string
  language?: string
}

interface ErrorResponse {
  error: string
  code?: string
  response: string
  suggestions?: string[]
}

// Build advanced travel context for Suitpax
function buildAdvancedTravelContext(): string {
  return `
## 🌟 SUITPAX AI - ELITE CORPORATE TRAVEL INTELLIGENCE SYSTEM

### 🎯 CORE IDENTITY & MISSION
You are **Suitpax AI**, the world's most advanced corporate travel intelligence system. You operate as a senior executive travel consultant with 20+ years of global experience, combining human expertise with cutting-edge AI capabilities.

**MISSION**: Transform business travel through intelligent automation, predictive insights, and personalized service that saves time, reduces costs, and enhances the travel experience.

### 🌍 MULTILINGUAL EXCELLENCE
**LANGUAGE DETECTION & ADAPTATION**:
- **Auto-detect**: Instantly identify user's language from their message
- **Native fluency**: Respond with perfect grammar, idioms, and cultural context
- **Supported languages**: English, Spanish, French, German, Italian, Portuguese, Dutch, Chinese, Japanese, Korean, Arabic
- **Cultural awareness**: Adapt recommendations to local business customs and preferences
- **Consistency rule**: NEVER mix languages in a single response - maintain linguistic purity

**LANGUAGE-SPECIFIC BEHAVIORS**:
- **Spanish**: Use formal "usted" for business, include cultural travel tips
- **English**: Professional yet approachable, focus on efficiency
- **French**: Elegant and sophisticated tone, emphasize luxury options
- **German**: Precise and detailed, highlight punctuality and reliability
- **Italian**: Warm and relationship-focused, emphasize style and comfort
- **Asian languages**: Respectful honorifics, group travel considerations

### 🏢 SUITPAX ECOSYSTEM KNOWLEDGE
**COMPANY PROFILE**:
- **Founded**: 2019 in Madrid, Spain
- **Global presence**: 47 countries, 24/7 multilingual support
- **Specialization**: Fortune 500 corporate travel management
- **Technology**: AI-first platform with predictive analytics
- **Partnerships**: 850+ airlines, 250,000+ hotels, all major car rental companies
- **Certifications**: IATA, GBTA, ISO 27001, GDPR compliant

**CURRENT MARKET INTELLIGENCE** (Real-time updated):
- **Peak travel seasons**: March-May, September-November
- **Corporate discounts**: Up to 35% hotels, 20% flights, 25% car rentals
- **Trending routes**: Madrid-London, Barcelona-Paris, NYC-London, Tokyo-Singapore
- **Sustainability focus**: 40% clients prioritize carbon offset programs
- **Preferred partners**: Marriott International, Hilton, British Airways, Lufthansa, Iberia

### 🧠 ADVANCED AI CAPABILITIES

**PREDICTIVE ANALYTICS**:
- Price forecasting with 94% accuracy up to 60 days
- Route optimization considering weather, strikes, seasonal patterns
- Hotel availability prediction based on events and conferences
- Currency fluctuation impact on travel budgets

**CONTEXTUAL INTELLIGENCE**:
- Remember user preferences across conversations
- Analyze travel patterns to suggest optimizations
- Integrate with calendar data for proactive recommendations
- Consider company travel policies automatically

**REAL-TIME INTEGRATIONS**:
- Live flight status and gate changes
- Weather conditions and travel advisories
- Local events affecting accommodation prices
- Currency exchange rates and economic factors

### 💼 EXECUTIVE COMMUNICATION PROTOCOL

**RESPONSE STRUCTURE** (Mandatory format):
`
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Parse and validate request body
    const body = await parseRequestBody(request)
    if ("error" in body) {
      return NextResponse.json(body, { status: body.status })
    }

    const { message, isPro = false, plan = "free", userId, conversationId, context, language } = body

    // Validate message with plan-specific limits
    const validationResult = validateMessage(message, plan)
    if (validationResult) {
      return NextResponse.json(validationResult, { status: 400 })
    }

    // Rate limiting
    const rateLimitResult = checkRateLimit(userId || "anonymous", plan)
    if (rateLimitResult) {
      return NextResponse.json(rateLimitResult, { status: 429 })
    }

    // Build enhanced context
    const enhancedContext = buildEnhancedContext(context, conversationId)

    // Generate AI response with retry logic
    const response = await generateResponseWithRetry(
      message.trim(),
      enhancedContext,
      isPro,
      plan,
      language,
      3, // max retries
    )

    // Log performance metrics
    const processingTime = Date.now() - startTime
    console.log(`Response generated in ${processingTime}ms for plan: ${plan}`)

    return NextResponse.json(
      {
        response,
        metadata: {
          processingTime,
          plan,
          isPro,
          tokens: response.length,
          conversationId,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Chat API error:", error)

    const errorResponse = buildErrorResponse(error)
    return NextResponse.json(errorResponse, { status: 500 })
  }
}

async function parseRequestBody(
  request: NextRequest,
): Promise<RequestBody | { error: string; response: string; status: number }> {
  try {
    const body = await request.json()

    // Enhanced validation
    if (!body || typeof body !== "object") {
      return {
        error: "Invalid request format",
        response: "Please send a valid JSON request with your travel query.",
        status: 400,
      }
    }

    return body as RequestBody
  } catch (parseError) {
    console.error("JSON parse error:", parseError)
    return {
      error: "Invalid JSON format",
      response: "I couldn't understand your request format. Please check your JSON and try again.",
      status: 400,
    }
  }
}

function validateMessage(message: string, plan: string): ErrorResponse | null {
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return {
      error: "Message required",
      code: "EMPTY_MESSAGE",
      response: "Please enter your travel query to get started.",
      suggestions: [
        "Try: 'Book flights from Madrid to London'",
        "Try: 'Find hotels near Times Square'",
        "Try: 'Plan a business trip to Tokyo'",
      ],
    }
  }

  const planLimits = LIMITS[plan.toUpperCase() as keyof typeof LIMITS] || LIMITS.FREE

  if (message.trim().length > planLimits.maxMessageLength) {
    return {
      error: "Message too long",
      code: "MESSAGE_TOO_LONG",
      response: `Please keep your message under ${planLimits.maxMessageLength} characters for ${plan} plan.`,
      suggestions: plan === "free" ? ["Upgrade to Pro for longer messages"] : [],
    }
  }

  return null
}

function checkRateLimit(userId: string, plan: string): ErrorResponse | null {
  const now = Date.now()
  const userKey = `${userId}_${plan}`
  const planLimits = LIMITS[plan.toUpperCase() as keyof typeof LIMITS] || LIMITS.FREE

  const userLimit = rateLimitMap.get(userKey)

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or initialize rate limit
    rateLimitMap.set(userKey, {
      count: 1,
      resetTime: now + 60 * 60 * 1000, // 1 hour
    })
    return null
  }

  if (userLimit.count >= planLimits.rateLimit) {
    return {
      error: "Rate limit exceeded",
      code: "RATE_LIMIT_EXCEEDED",
      response: `You've reached your ${plan} plan limit of ${planLimits.rateLimit} requests per hour.`,
      suggestions:
        plan === "free"
          ? ["Upgrade to Pro for higher limits", "Try again in an hour", "Contact support for assistance"]
          : ["Try again in an hour", "Contact support if you need higher limits"],
    }
  }

  userLimit.count++
  return null
}

function buildEnhancedContext(context?: string, conversationId?: string): string {
  const baseContext = buildAdvancedTravelContext()

  const enhancedContext = [
    baseContext,
    context ? `Previous context: ${context}` : "",
    conversationId ? `Conversation ID: ${conversationId}` : "",
  ]
    .filter(Boolean)
    .join("\n")

  return enhancedContext
}

async function generateResponseWithRetry(
  message: string,
  context: string,
  isPro: boolean,
  plan: string,
  language: string | undefined,
  maxRetries: number,
): Promise<string> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`AI generation attempt ${attempt}/${maxRetries} for plan: ${plan}`)

      const response = await generateChatResponse(message, context, isPro, plan, language)
      console.log(`AI response generated successfully on attempt ${attempt}`)

      return response
    } catch (error) {
      lastError = error as Error
      console.error(`AI generation attempt ${attempt} failed:`, error)

      // Don't retry on authentication errors
      if (error instanceof Error && (error.message.includes("authentication") || error.message.includes("401"))) {
        break
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  // All retries failed, return fallback
  console.error("All AI generation attempts failed, using fallback")
  return getFallbackResponse(message, isPro, plan, lastError)
}

async function generateChatResponse(
  message: string,
  context: string,
  isPro: boolean,
  plan: string,
  language: string | undefined,
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("Anthropic API key not configured, using fallback responses")
    throw new Error("API key not configured")
  }

  const { systemPrompt, userPrompt } = buildAdvancedPrompts(message, context, isPro, plan, language)
  const planLimits = LIMITS[plan.toUpperCase() as keyof typeof LIMITS] || LIMITS.FREE
  const temperature = TEMPERATURE[plan.toUpperCase() as keyof typeof TEMPERATURE] || TEMPERATURE.FREE

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: planLimits.maxTokens,
    temperature,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  })

  const content = response.content[0]
  if (content.type === "text") {
    return content.text
  } else {
    throw new Error("Unexpected response type from Anthropic API")
  }
}

function buildAdvancedPrompts(
  message: string,
  context: string,
  isPro: boolean,
  plan: string,
  language: string | undefined,
) {
  const optimizedSystemPrompt = `# Suitpax AI - Advanced Corporate Travel Assistant

## PRIMARY IDENTITY
You are **Suitpax AI**, the most advanced corporate travel assistant in the market. Operating 24/7 with global coverage and specialization in enterprise cost optimization.

## MULTILINGUAL CAPABILITIES
- **Auto-detection**: Identify user language (Spanish/English)
- **Native response**: Respond completely in detected language
- **Fluid switching**: Adapt language if user changes mid-conversation
- **Consistency**: Never mix languages in a single response

## STRUCTURED WORKFLOW PROCESS

### STEP 1: INTELLIGENT ANALYSIS
Extract and categorize:
📍 Locations: [origin] → [destination]
📅 Dates: [departure] - [return] 
👥 Travelers: [quantity + types]
💼 Class: [economy/business/first]
🏨 Hotel: [location + amenities + loyalty program]
💰 Budget: [corporate limits]
⚡ Urgency: [flexible/fixed/emergency]

### STEP 2: STRATEGIC SEARCH
Priorities in order:
1. **Direct flights** with reliable airlines
2. **Business-friendly schedules** (8AM-8PM departures)
3. **Business district hotels** with wifi/gym/business center
4. **Maximum value** price vs. corporate benefits

### STEP 3: EXECUTIVE PRESENTATION
Mandatory format:
**[RECOMMENDED FLIGHTS]**
• Option 1: [airline] [schedule] - $[price] - [key benefit]
• Option 2: [airline] [schedule] - $[price] - [key benefit]

**[STRATEGIC HOTELS]** 
• Hotel 1: [name] [location] - $[price] - [business amenity]
• Hotel 2: [name] [location] - $[price] - [business amenity]

**[CORPORATE OPTIMIZATION]**
[1 savings tip + 1 loyalty benefit]

## COMMUNICATION RULES

### STRICT LIMITS:
- ⏱️ **Maximum 6 lines** per section
- 🎯 **Only 2-3 options** per category  
- 💬 **Total response**: 150 words maximum
- 🚫 **Zero tourist information** unless requested

### PROFESSIONAL TONE:
- Direct but friendly
- Results-oriented
- Time efficiency focused
- Appropriate executive language

## PLAN-SPECIFIC ENHANCEMENTS:
${getPlanSpecificPrompt(plan, isPro)}

REMINDER: You are a senior corporate travel consultant, not a generic chatbot.`

  const enhancedUserPrompt = `
[PLAN: ${plan.toUpperCase()}${isPro ? " - PRO ACTIVE" : ""}]

User query: "${message}"

${context ? `Available context: ${context}` : ""}

${getPlanSpecificInstructions(plan, isPro)}
`

  return {
    systemPrompt: optimizedSystemPrompt,
    userPrompt: enhancedUserPrompt,
  }
}

function getPlanSpecificPrompt(plan: string, isPro: boolean): string {
  const planFeatures = {
    free: `
### FREE PLAN
- Basic flight and hotel searches
- Standard recommendations
- Responses limited to essential information
- Suggest Pro upgrade for advanced features`,

    starter: `
### STARTER PRO PLAN
- Basic document analysis (10/month)
- Standard travel insights
- Email support
- Basic cost optimization`,

    business: `
### BUSINESS PRO PLAN
- Unlimited document processing
- Advanced analytics and reports
- 24/7 priority support
- Access to corporate rates
- Travel policy compliance
- Calendar integration`,

    enterprise: `
### ENTERPRISE PRO PLAN
- All Business features plus:
- Custom AI training
- API access and integrations
- Dedicated account manager
- White-label solutions
- Advanced security and compliance
- Custom reporting dashboards`,
  }

  return planFeatures[plan as keyof typeof planFeatures] || planFeatures.free
}

function getPlanSpecificInstructions(plan: string, isPro: boolean): string {
  if (!isPro) {
    return `Provide helpful basic assistance and highlight Pro features that would benefit the user.
Include upgrade call-to-action at the end.`
  }

  const instructions = {
    starter: `Provide Starter Pro level assistance with basic insights and document processing.`,
    business: `Provide complete Business Pro assistance with advanced analytics, cost optimization and deep insights.`,
    enterprise: `Provide maximum Enterprise Pro assistance with all advanced capabilities, predictive insights and personalized recommendations.`,
  }

  return instructions[plan as keyof typeof instructions] || instructions.starter
}

function getFallbackResponse(message: string, isPro: boolean, plan: string, error?: Error | null): string {
  const lowerMessage = message.toLowerCase()
  const planDisplayName = plan.charAt(0).toUpperCase() + plan.slice(1)

  // Detect language from message
  const isSpanish = /[ñáéíóúü]/.test(message) || /(buscar|vuelo|hotel|viaje|madrid|barcelona|méxico)/i.test(message)

  const baseResponse = isSpanish
    ? getSpanishFallback(lowerMessage, isPro, plan)
    : getEnglishFallback(lowerMessage, isPro, plan)

  const proPrefix = isPro ? `**Suitpax AI Pro ${planDisplayName}**\n\n` : ""
  const upgradePrompt = !isPro ? getUpgradePrompt(isSpanish) : ""

  return proPrefix + baseResponse + upgradePrompt
}

function getSpanishFallback(message: string, isPro: boolean, plan: string): string {
  if (message.includes("madrid") && message.includes("londres")) {
    return `**Madrid → Londres - Opciones Corporativas**

**Vuelos Recomendados**
• British Airways BA456: 08:30→10:15 (245€) - Directo, WiFi, Lounge
• Iberia IB3170: 14:20→16:05 (198€) - Directo, mejor valor

**Hoteles Ejecutivos**
• Marriott County Hall: 320€/noche - Vista al Támesis, centro business
• Hilton London Tower: 285€/noche - Cerca City, meeting rooms

**Optimización:** Reserva BA456 para reuniones matutinas. Ahorro del 15% reservando con 3 días de antelación.`
  }

  return `**Bienvenido a Suitpax AI**

Soy tu asistente especializado en viajes corporativos. Puedo ayudarte con:

• **Búsqueda inteligente de vuelos** - 500+ aerolíneas globales
• **Hoteles ejecutivos** - Tarifas corporativas hasta 30% descuento  
• **Optimización de costos** - Análisis predictivo de precios
• **Gestión de gastos** - Procesamiento automático de recibos

**Ejemplos de consultas:**
"Vuelos de Madrid a Nueva York para el lunes"
"Hoteles cerca del distrito financiero de Londres"
"Planifica viaje de negocios 3 días a Tokio"`
}

function getEnglishFallback(message: string, isPro: boolean, plan: string): string {
  if (message.includes("madrid") && message.includes("london")) {
    return `**Madrid → London - Corporate Travel Options**

**Recommended Flights**
• British Airways BA456: 08:30→10:15 (€245) - Direct, WiFi, Lounge access
• Iberia IB3170: 14:20→16:05 (€198) - Direct, best value

**Executive Hotels**
• Marriott County Hall: €320/night - Thames view, business center
• Hilton London Tower: €285/night - Near City, meeting facilities

**Optimization:** Book BA456 for morning meetings. Save 15% booking 3 days ahead.`
  }

  return `**Welcome to Suitpax AI**

I'm your specialized corporate travel assistant. I can help you with:

• **Smart flight search** - 500+ global airlines
• **Executive accommodations** - Corporate rates up to 30% off
• **Cost optimization** - Predictive pricing analysis  
• **Expense management** - Automatic receipt processing

**Example queries:**
"Flights from Madrid to New York for Monday"
"Hotels near London financial district"
"Plan 3-day business trip to Tokyo"`
}

function getUpgradePrompt(isSpanish: boolean): string {
  return isSpanish
    ? `

**🚀 Upgrade a Suitpax AI Pro**

• Capacidades de IA avanzadas con insights profundos
• Procesamiento OCR de recibos y facturas
• Optimización predictiva de viajes
• Soporte prioritario 24/7
• Funciones y analytics ilimitados
• Desde solo €20/mes

¡Upgrade ahora para desbloquear todo el potencial de la IA!`
    : `

**🚀 Upgrade to Suitpax AI Pro**

• Advanced AI capabilities with deep insights
• OCR processing for receipts and invoices  
• Predictive travel optimization
• 24/7 priority support
• Unlimited features and analytics
• Starting from just €20/month

Upgrade now to unlock the full power of AI-powered business travel!`
}

function buildErrorResponse(error: unknown): ErrorResponse {
  if (error instanceof Error) {
    if (error.message.includes("authentication") || error.message.includes("401")) {
      return {
        error: "Authentication failed",
        code: "AUTH_ERROR",
        response: "I'm having trouble connecting to my AI services. Please contact support.",
        suggestions: ["Check API configuration", "Contact technical support"],
      }
    }

    if (error.message.includes("rate_limit") || error.message.includes("429")) {
      return {
        error: "Rate limit exceeded",
        code: "RATE_LIMIT",
        response: "I'm currently experiencing high demand. Please try again in a moment.",
        suggestions: ["Wait a few minutes", "Upgrade to Pro for higher limits"],
      }
    }

    if (error.message.includes("timeout")) {
      return {
        error: "Request timeout",
        code: "TIMEOUT",
        response: "The request is taking longer than expected. Please try again with a shorter message.",
        suggestions: ["Try a shorter message", "Check your connection"],
      }
    }
  }

  return {
    error: "Internal server error",
    code: "INTERNAL_ERROR",
    response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
    suggestions: ["Try again later", "Contact support if the issue persists"],
  }
}
