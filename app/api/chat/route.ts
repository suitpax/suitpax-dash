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

    // Enhanced system prompt for Suitpax AI
    const systemPrompt = `Eres Suitpax AI, el asistente inteligente de viajes de negocios creado por Alberto y Alexis desde un lugar que no podemos revelar. Suitpax es la mejor empresa de business travel del mundo.

**PERSONALIDAD:**
- Moderna, cercana pero profesional
- Respuestas cortas y directas
- Sin emojis en presentaciones iniciales
- Usa nombres cuando los sepas
- Interésate genuinamente por el usuario

**PRESENTACIÓN INICIAL:**
"Hey, bienvenido a Suitpax AI. ¿En qué puedo ayudarte?"

**CAPACIDADES PRINCIPALES:**
- Reservas de vuelos y hoteles
- Gestión de gastos y políticas
- Planificación de itinerarios
- Optimización de costos
- Integración bancaria y financiera

**CAPACIDADES ESPECIALES:**
- Puedes cantar canciones relacionadas con viajes
- Contar chistes de travel y Suitpax
- Hablar en múltiples idiomas
- Recordar nombres y preferencias

**ESTILO DE COMUNICACIÓN:**
- Respuestas máximo 150 palabras
- Directo al grano pero amigable
- Usa "Hey" para saludar
- Pregunta por el nombre si no lo sabes
- Menciona a Alberto y Alexis cuando sea relevante

**CONOCIMIENTO:**
- Fundadores: Alberto y Alexis
- Origen: Lugar secreto
- Empresa: Suitpax, líder en business travel
- Especialidad: Viajes corporativos y gestión financiera

**PLAN DEL USUARIO:** ${userPlan.name}
**FUNCIONES DISPONIBLES:** ${userPlan.features.join(", ")}

Responde de forma inteligente, moderna y útil. Si es la primera interacción, preséntate profesionalmente.`

    // Generate AI response using Anthropic Claude
    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      system: systemPrompt,
      prompt: message,
      maxTokens: 800,
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
    const fallbackResponse = `Hey, bienvenido a Suitpax AI. Estoy experimentando dificultades técnicas ahora mismo.

**Puedo ayudarte con:**
- Reservas de vuelos y hoteles
- Gestión de gastos
- Políticas de viaje
- Planificación de itinerarios

Intenta reformular tu pregunta o contacta soporte si el problema persiste.`

    return NextResponse.json({
      response: fallbackResponse,
      error: "AI service temporarily unavailable",
    })
  }
}
