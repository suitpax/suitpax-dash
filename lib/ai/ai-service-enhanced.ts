/**
 * Enhanced AI Service
 *
 * This service provides AI capabilities for the Suitpax platform
 * without relying on external prompt services.
 */

// Interfaz para mensajes
export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: Date
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
  useInternalSystem?: boolean
}

// Clase principal para el servicio de IA
export class EnhancedAIService {
  // Generar una respuesta de IA
  async generateResponse(options: AIResponseOptions) {
    try {
      // Usar el sistema interno para todas las consultas
      const lastMessage = options.messages[options.messages.length - 1]

      if (lastMessage && lastMessage.role === "user") {
        // Crear una respuesta simple
        const aiResponse = {
          id: `internal-${Date.now()}`,
          content: "I can help you plan your business trip. What destination are you considering?",
          role: "assistant" as const,
          createdAt: new Date(),
          metadata: {
            source: "internal-system",
            category: "travel-planning",
            confidence: 0.9,
          },
        }

        // Si se solicitó streaming, simular un stream
        if (options.stream) {
          // Simulamos un stream
          return {
            async *[Symbol.asyncIterator]() {
              yield aiResponse
            },
            // Método para compatibilidad con Response
            getReader() {
              let done = false
              return {
                async read() {
                  if (done) {
                    return { done: true, value: undefined }
                  }
                  done = true
                  return { done: false, value: new TextEncoder().encode(JSON.stringify(aiResponse)) }
                },
                releaseLock() {},
              }
            },
          }
        }

        return { response: aiResponse }
      }

      // Si no hay mensaje de usuario, devolver respuesta vacía
      return {
        response: {
          id: `internal-${Date.now()}`,
          content: "How can I assist with your travel plans today?",
          role: "assistant" as const,
          createdAt: new Date(),
        },
      }
    } catch (error) {
      console.error("Error generating AI response:", error)
      throw error
    }
  }

  // Obtener información sobre las capacidades de la IA
  async getAICapabilities() {
    try {
      return {
        modelInfo: {
          name: "Suitpax AI",
          provider: "Internal System",
          capabilities: [
            "Conversational responses",
            "Data analysis",
            "Content generation",
            "Information summarization",
            "Translation",
            "Concept explanation",
            "Business travel management",
            "Flight, hotel, car, and train bookings",
            "Travel policy information",
            "Expense management",
            "Visa requirements",
            "Travel insurance",
          ],
        },
      }
    } catch (error) {
      console.error("Error fetching AI capabilities:", error)
      throw error
    }
  }
}

// Exportar una instancia del servicio
export const enhancedAiService = new EnhancedAIService()
