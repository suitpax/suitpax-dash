/**
 * Servicio de IA mejorado sin dependencias externas
 *
 * Este servicio utiliza un sistema interno para responder
 * a consultas comunes sin necesidad de usar servicios externos, reduciendo costes.
 */

import { dataService } from "./data-service"

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

// Interfaz para solicitudes de prompt
export interface PromptRequest {
  userMessage: string
  context: {
    previousMessages: Message[]
    useAnthropicFallback: boolean
  }
}

// Clase principal para el servicio de IA
export class EnhancedAIService {
  // Generar una respuesta de IA
  async generateResponse(options: AIResponseOptions) {
    try {
      // Usar el sistema interno para todas las consultas
      const lastMessage = options.messages[options.messages.length - 1]

      if (lastMessage && lastMessage.role === "user") {
        // Procesar el mensaje del usuario
        const promptRequest: PromptRequest = {
          userMessage: lastMessage.content,
          context: {
            previousMessages: options.messages.slice(0, -1),
            useAnthropicFallback: false,
          },
        }

        const processedResponse = await this.processPrompt(promptRequest)

        // Crear una respuesta en el formato esperado
        const aiResponse = {
          id: `internal-${Date.now()}`,
          content: processedResponse.response,
          role: "assistant" as const,
          createdAt: new Date(),
          metadata: {
            source: "internal-system",
            category: processedResponse.category,
            confidence: processedResponse.confidence,
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
          content: "No se pudo procesar la solicitud.",
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
      // Obtener información sobre las tablas disponibles
      const tableInfo = await dataService.getTableInfo()

      return {
        availableTables: tableInfo,
        promptCategories: ["Travel Booking", "Expense Management", "Policy Compliance", "Travel Recommendations"],
        modelInfo: {
          name: "Suitpax AI",
          provider: "Internal System",
          capabilities: [
            "Respuestas conversacionales",
            "Análisis de datos",
            "Generación de contenido",
            "Resumen de información",
            "Traducción",
            "Explicación de conceptos",
            "Gestión de viajes de negocios",
            "Reservas de vuelos, hoteles, transfers y trenes",
            "Información sobre políticas de viaje",
            "Gestión de gastos",
            "Requisitos de visado",
            "Seguros de viaje",
          ],
        },
      }
    } catch (error) {
      console.error("Error fetching AI capabilities:", error)
      throw error
    }
  }

  // Procesar un prompt de usuario
  async processPrompt(request: PromptRequest) {
    // Implementación simple para responder a consultas básicas
    const userMessage = request.userMessage.toLowerCase()

    let response = "I'm here to help with your travel needs. How can I assist you today?"
    let category = "general"
    let confidence = 0.8

    if (userMessage.includes("flight") || userMessage.includes("book flight")) {
      response = "I can help you book a flight. Where would you like to travel to and from?"
      category = "flight_booking"
      confidence = 0.9
    } else if (userMessage.includes("hotel") || userMessage.includes("accommodation")) {
      response = "I can help you find a hotel. What city will you be staying in?"
      category = "hotel_booking"
      confidence = 0.9
    } else if (userMessage.includes("policy") || userMessage.includes("travel policy")) {
      response =
        "Our travel policy allows business class for flights over 6 hours. Would you like to know more details?"
      category = "policy"
      confidence = 0.95
    } else if (userMessage.includes("expense") || userMessage.includes("receipt")) {
      response =
        "You can submit your expenses through the Expenses section. Would you like me to guide you through the process?"
      category = "expenses"
      confidence = 0.9
    }

    return {
      response,
      category,
      confidence,
    }
  }

  // Obtener datos de una tabla
  async getTableData(tableName: string, searchParams?: { column: string; term: string }) {
    return dataService.getTableData(tableName, searchParams)
  }
}

// Exportar una instancia del servicio
export const enhancedAiService = new EnhancedAIService()
