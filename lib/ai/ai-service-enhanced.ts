/**
 * Servicio de IA mejorado con sistema de prompts interno
 *
 * Este servicio utiliza el sistema de prompts interno para responder
 * a consultas comunes sin necesidad de usar servicios externos, reduciendo costes.
 */

import { promptService } from "./prompt-service"
import { dataService } from "./data-service"
import { promptManager, type PromptRequest } from "./prompt-manager"

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
        const promptRequest: PromptRequest = {
          userMessage: lastMessage.content,
          context: {
            previousMessages: options.messages.slice(0, -1),
            useAnthropicFallback: false, // No usar fallback externo
          },
        }

        const internalResponse = await promptManager.processPrompt(promptRequest)

        // Crear una respuesta en el formato esperado
        const aiResponse = {
          id: `internal-${Date.now()}`,
          content: internalResponse.response,
          role: "assistant" as const,
          createdAt: new Date(),
          metadata: {
            source: "internal-system",
            category: internalResponse.category,
            confidence: internalResponse.confidence,
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

      // Obtener categorías de prompts
      const allPrompts = await promptService.getAllPrompts()
      const promptCategories = [...new Set(allPrompts.map((p) => p.category))]

      return {
        availableTables: tableInfo,
        promptCategories,
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
            "Reservas de vuelos, hoteles, coches y trenes",
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
}

// Exportar una instancia del servicio
export const enhancedAiService = new EnhancedAIService()
