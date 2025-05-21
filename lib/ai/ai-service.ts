import type { Message, AIServiceResponse } from "./message-types"

// Sistema interno de prompts
const internalPrompts = {
  flights: {
    search: "I can help you search for flights. What's your departure city, destination, and travel dates?",
    booking: "I've found several flight options for you. Would you like to proceed with booking?",
    confirmation: "Your flight has been booked successfully! Here are your booking details:",
  },
  hotels: {
    search: "I can help you find hotels. Where are you planning to stay and for what dates?",
    booking: "Here are some hotel options based on your preferences. Would you like to book any of these?",
    confirmation: "Your hotel reservation has been confirmed! Here are your booking details:",
  },
  cars: {
    search: "I can help you find rental cars. Where and when do you need a car?",
    booking: "Here are some car rental options. Would you like to proceed with booking?",
    confirmation: "Your car rental has been confirmed! Here are your booking details:",
  },
  trains: {
    search: "I can help you search for train tickets. What's your departure station, destination, and travel date?",
    booking: "Here are the available train options. Would you like to book any of these?",
    confirmation: "Your train ticket has been booked! Here are your booking details:",
  },
  general: {
    greeting: "Hello! I'm your Suitpax AI assistant. How can I help with your business travel today?",
    help: "I can help with booking flights, hotels, cars, and trains, as well as managing your travel expenses and itineraries.",
    fallback: "I'm not sure I understand. Could you please rephrase your question?",
  },
}

// Función para determinar la intención del usuario
function determineIntent(message: string): { category: string; intent: string } {
  const lowerMessage = message.toLowerCase()

  // Detectar categoría
  let category = "general"
  if (lowerMessage.includes("flight") || lowerMessage.includes("fly") || lowerMessage.includes("plane")) {
    category = "flights"
  } else if (lowerMessage.includes("hotel") || lowerMessage.includes("stay") || lowerMessage.includes("room")) {
    category = "hotels"
  } else if (lowerMessage.includes("car") || lowerMessage.includes("rental") || lowerMessage.includes("drive")) {
    category = "cars"
  } else if (lowerMessage.includes("train") || lowerMessage.includes("rail")) {
    category = "trains"
  }

  // Detectar intención
  let intent = "search"
  if (lowerMessage.includes("book") || lowerMessage.includes("reserve")) {
    intent = "booking"
  } else if (lowerMessage.includes("confirm") || lowerMessage.includes("complete")) {
    intent = "confirmation"
  } else if (category === "general") {
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      intent = "greeting"
    } else if (lowerMessage.includes("help") || lowerMessage.includes("can you")) {
      intent = "help"
    } else {
      intent = "fallback"
    }
  }

  return { category, intent }
}

// Función para generar una respuesta basada en la intención
function generateResponse(userMessage: string, conversationHistory: Message[]): Message {
  const { category, intent } = determineIntent(userMessage)

  // Obtener la respuesta del sistema de prompts
  let responseContent = internalPrompts[category][intent] || internalPrompts.general.fallback

  // Personalizar la respuesta si es necesario
  if (category === "flights" && intent === "search") {
    // Extraer posibles ciudades de origen y destino
    const fromMatch = userMessage.match(/from\s+([a-zA-Z\s]+?)(?:\s+to|\s+with|\s+on|\s+for|\s+$)/i)
    const toMatch = userMessage.match(/to\s+([a-zA-Z\s]+?)(?:\s+with|\s+on|\s+for|\s+$)/i)

    if (fromMatch && toMatch) {
      const origin = fromMatch[1].trim()
      const destination = toMatch[1].trim()
      responseContent = `I can help you find flights from ${origin} to ${destination}. When are you planning to travel?`
    }
  }

  return {
    id: Date.now().toString(),
    role: "assistant",
    content: responseContent,
    createdAt: new Date(),
  }
}

// Servicio de IA principal
export async function processMessage(messages: Message[], systemPrompt?: string): Promise<AIServiceResponse> {
  // Obtener el último mensaje del usuario
  const userMessage = messages.filter((m) => m.role === "user").pop()

  if (!userMessage) {
    return {
      response: {
        id: Date.now().toString(),
        role: "assistant",
        content: internalPrompts.general.greeting,
        createdAt: new Date(),
      },
    }
  }

  // Generar respuesta usando el sistema interno
  const response = generateResponse(userMessage.content, messages)

  // Simular uso de tokens
  const usage = {
    promptTokens: Math.floor(messages.reduce((acc, m) => acc + m.content.length / 4, 0)),
    completionTokens: Math.floor(response.content.length / 4),
    totalTokens: 0,
  }
  usage.totalTokens = usage.promptTokens + usage.completionTokens

  return {
    response,
    usage,
  }
}
