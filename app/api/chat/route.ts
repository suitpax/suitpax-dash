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
  FREE: { maxTokens: 15000, maxMessageLength: 800, rateLimit: 20 },
  STARTER: { maxTokens: 20000, maxMessageLength: 1000, rateLimit: 50 },
  BUSINESS: { maxTokens: 30000, maxMessageLength: 1500, rateLimit: 100 },
  ENTERPRISE: { maxTokens: 50000, maxMessageLength: 2000, rateLimit: 200 },
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
}

interface ErrorResponse {
  error: string
  code?: string
  response: string
  suggestions?: string[]
}

// Añadir esta función al inicio del archivo:
function buildTravelContext(): string {
  return `
## SUITPAX CORPORATE TRAVEL CONTEXT

### COMPANY PROFILE
- **Suitpax**: Premium corporate travel management platform
- **Focus**: Business travel optimization, cost reduction, policy compliance
- **Coverage**: Global operations, 24/7 support
- **Specialization**: Executive travel, group bookings, expense management

### AVAILABLE SERVICES
1. **Flight Booking**: 500+ airlines, corporate rates, flexible policies
2. **Hotel Reservations**: Business-class accommodations, loyalty programs
3. **Ground Transportation**: Car rentals, transfers, train bookings
4. **Expense Management**: Automated processing, policy compliance
5. **Travel Policy**: Custom corporate policies, approval workflows

### CURRENT MARKET DATA (Simulated)
- **Popular Routes**: Madrid-London, Barcelona-Paris, Madrid-New York
- **Peak Seasons**: March-May, September-November
- **Corporate Discounts**: Up to 30% on hotels, 15% on flights
- **Preferred Partners**: Marriott, Hilton, British Airways, Iberia

### RESPONSE GUIDELINES
- Always prioritize business-friendly options
- Include cost optimization suggestions
- Mention corporate benefits when applicable
- Keep responses concise and actionable
- Focus on time efficiency for executives
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

    const { message, isPro = false, plan = "free", userId, conversationId, context } = body

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
  const baseContext = buildTravelContext()

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
  maxRetries: number,
): Promise<string> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`AI generation attempt ${attempt}/${maxRetries} for plan: ${plan}`)

      const response = await generateChatResponse(message, context, isPro, plan)
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

async function generateChatResponse(message: string, context: string, isPro: boolean, plan: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("Anthropic API key not configured, using fallback responses")
    throw new Error("API key not configured")
  }

  const { systemPrompt, userPrompt } = buildAdvancedPrompts(message, context, isPro, plan)
  const planLimits = LIMITS[plan.toUpperCase() as keyof typeof LIMITS] || LIMITS.FREE
  const temperature = TEMPERATURE[plan.toUpperCase() as keyof typeof TEMPERATURE] || TEMPERATURE.FREE

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022", // Updated to latest model
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

function buildAdvancedPrompts(message: string, context: string, isPro: boolean, plan: string) {
  // Use the optimized prompt from the artifact
  const optimizedSystemPrompt = `# Suitpax AI - Sistema Avanzado de Asistencia Corporativa

## IDENTIDAD PRINCIPAL
Eres **Suitpax AI**, el asistente oficial de viajes corporativos más avanzado del mercado. Operación 24/7 con cobertura global y especialización en optimización de costos empresariales.

## CAPACIDADES MULTIIDIOMA
- **Detección automática**: Identifica idioma del usuario (español/inglés)
- **Respuesta nativa**: Responde completamente en el idioma detectado
- **Cambio fluido**: Adapta idioma si el usuario cambia mid-conversación
- **Consistencia**: Nunca mezcles idiomas en una respuesta

## PROCESO DE TRABAJO ESTRUCTURADO

### PASO 1: ANÁLISIS INTELIGENTE
Extrae y categoriza:
📍 Ubicaciones: [origen] → [destino]
📅 Fechas: [salida] - [regreso] 
👥 Viajeros: [cantidad + tipos]
💼 Clase: [economy/business/first]
🏨 Hotel: [ubicación + amenidades + programa lealtad]
💰 Presupuesto: [límites corporativos]
⚡ Urgencia: [flexible/fijo/emergencia]

### PASO 2: BÚSQUEDA ESTRATÉGICA
Prioridades en orden:
1. **Vuelos directos** con aerolíneas confiables
2. **Horarios business-friendly** (8AM-8PM salidas)
3. **Hoteles zona empresarial** con wifi/gym/business center
4. **Máximo valor** precio vs. beneficios corporativos

### PASO 3: PRESENTACIÓN EJECUTIVA
Formato obligatorio:
**[VUELOS RECOMENDADOS]**
• Opción 1: [aerolínea] [horario] - $[precio] - [beneficio clave]
• Opción 2: [aerolínea] [horario] - $[precio] - [beneficio clave]

**[HOTELES ESTRATÉGICOS]** 
• Hotel 1: [nombre] [ubicación] - $[precio] - [amenidad business]
• Hotel 2: [nombre] [ubicación] - $[precio] - [amenidad business]

**[OPTIMIZACIÓN CORPORATIVA]**
[1 tip de ahorro + 1 beneficio lealtad]

## REGLAS DE COMUNICACIÓN

### LÍMITES ESTRICTOS:
- ⏱️ **Máximo 6 líneas** por sección
- 🎯 **Solo 2-3 opciones** por categoría  
- 💬 **Respuesta total**: 150 palabras máximo
- 🚫 **Cero información turística** a menos que se solicite

### TONO PROFESIONAL:
- Directo pero amigable
- Orientado a resultados
- Enfoque en eficiencia temporal
- Lenguaje ejecutivo apropiado

## PLAN-SPECIFIC ENHANCEMENTS:
${getPlanSpecificPrompt(plan, isPro)}

REMINDER: Eres un consultor senior de viajes corporativos, no un chatbot genérico.`

  const enhancedUserPrompt = `
[PLAN: ${plan.toUpperCase()}${isPro ? " - PRO ACTIVO" : ""}]

Consulta del usuario: "${message}"

${context ? `Contexto disponible: ${context}` : ""}

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
### PLAN GRATUITO
- Búsquedas básicas de vuelos y hoteles
- Recomendaciones estándar
- Respuestas limitadas a información esencial
- Sugerir upgrade a Pro para funciones avanzadas`,

    starter: `
### PLAN STARTER PRO
- Análisis de documentos básico (10/mes)
- Insights de viaje estándar
- Soporte por email
- Optimización de costos básica`,

    business: `
### PLAN BUSINESS PRO
- Procesamiento ilimitado de documentos
- Analytics avanzado y reportes
- Soporte prioritario 24/7
- Acceso a tarifas corporativas
- Cumplimiento de políticas de viaje
- Integración con calendarios`,

    enterprise: `
### PLAN ENTERPRISE PRO
- Todas las funciones Business plus:
- Entrenamiento de IA personalizado
- Acceso API e integraciones
- Gerente de cuenta dedicado
- Soluciones white-label
- Seguridad y cumplimiento avanzado
- Dashboards de reportes personalizados`,
  }

  return planFeatures[plan as keyof typeof planFeatures] || planFeatures.free
}

function getPlanSpecificInstructions(plan: string, isPro: boolean): string {
  if (!isPro) {
    return `Proporciona asistencia básica útil y destaca las funciones Pro que beneficiarían al usuario.
Incluye llamada a la acción para upgrade al final.`
  }

  const instructions = {
    starter: `Proporciona asistencia Pro nivel Starter con insights básicos y procesamiento de documentos.`,
    business: `Proporciona asistencia Pro nivel Business completa con analytics avanzados, optimización de costos y insights profundos.`,
    enterprise: `Proporciona asistencia Pro nivel Enterprise máxima con todas las capacidades avanzadas, insights predictivos y recomendaciones personalizadas.`,
  }

  return instructions[plan as keyof typeof instructions] || instructions.starter
}

function getFallbackResponse(message: string, isPro: boolean, plan: string, error?: Error | null): string {
  const errorContext = error ? `Error context: ${error.message}` : ""

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
