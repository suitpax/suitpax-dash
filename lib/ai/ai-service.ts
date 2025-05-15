/**
 * Servicio de IA simplificado
 *
 * Este servicio proporciona respuestas predefinidas basadas en patrones
 * sin dependencias externas.
 */

// Tipos de mensajes
export interface Message {
  role: "user" | "assistant" | "system"
  content: string
  id?: string
  createdAt?: Date
}

// Interfaz para las opciones de generación de respuestas
export interface AIResponseOptions {
  messages: Message[]
  systemPrompt?: string
  includeTableData?: boolean
  tableName?: string
  searchParams?: {
    column: string
    term: string
  }
  promptId?: string
  stream?: boolean
}

// Clase principal para el servicio de IA
export class AIService {
  // Generar una respuesta de IA
  async generateResponse(options: AIResponseOptions | Message[]) {
    try {
      // Normalizar las opciones
      const normalizedOptions: AIResponseOptions = Array.isArray(options) ? { messages: options } : options

      const messages = normalizedOptions.messages
      const lastMessage = messages[messages.length - 1]

      if (lastMessage && lastMessage.role === "user") {
        // Generar una respuesta simple basada en patrones
        const userMessage = lastMessage.content.toLowerCase()
        let responseContent = ""

        // Patrones básicos para respuestas
        if (userMessage.includes("flight") || userMessage.includes("fly")) {
          responseContent = "I can help you find flights. What's your destination and travel dates?"
        } else if (userMessage.includes("hotel") || userMessage.includes("stay")) {
          responseContent = "I can help you book a hotel. Where are you planning to stay and for how long?"
        } else if (userMessage.includes("car") || userMessage.includes("rental")) {
          responseContent = "I can help you rent a car. When and where do you need it?"
        } else if (userMessage.includes("train") || userMessage.includes("rail")) {
          responseContent = "I can help you book train tickets. What's your departure and destination station?"
        } else if (userMessage.includes("hello") || userMessage.includes("hi")) {
          responseContent = "Hello! I'm your travel assistant. How can I help you today?"
        } else if (userMessage.includes("thank")) {
          responseContent = "You're welcome! Is there anything else I can help you with?"
        } else {
          responseContent =
            "I'm your travel assistant. I can help with flights, hotels, car rentals, and train bookings. What do you need assistance with?"
        }

        // Crear una respuesta en el formato esperado
        const aiResponse = {
          id: `internal-${Date.now()}`,
          content: responseContent,
          role: "assistant" as const,
          createdAt: new Date(),
        }

        return { response: aiResponse }
      }

      // Si no hay mensaje de usuario, devolver un mensaje genérico
      return {
        response: {
          id: `internal-${Date.now()}`,
          content: "How can I assist you with your travel plans today?",
          role: "assistant" as const,
          createdAt: new Date(),
        },
      }
    } catch (error) {
      console.error("Error generating AI response:", error)

      // Crear una respuesta de error
      const errorResponse = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I couldn't process your request. How else can I help you?",
        role: "assistant" as const,
        createdAt: new Date(),
      }

      return { response: errorResponse }
    }
  }

  // Obtener información sobre las capacidades de la IA
  async getAICapabilities() {
    return {
      availableTables: [],
      promptCategories: ["flights", "hotels", "cars", "trains", "general"],
      modelInfo: {
        name: "Suitpax AI",
        provider: "Internal System",
        capabilities: ["Respuestas conversacionales básicas", "Información sobre viajes", "Asistencia con reservas"],
      },
    }
  }
}

// Exportar una instancia del servicio
export const aiService = new AIService()
