import { generateClaudeResponse, generateClaudeStream, type Message } from "./anthropic-service"
import { promptService } from "./prompt-service"
import { dataService } from "./data-service"

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
  async generateResponse(options: AIResponseOptions) {
    try {
      let finalSystemPrompt = options.systemPrompt || ""

      // Si se especificó un ID de prompt, obtenerlo y usarlo
      if (options.promptId) {
        const prompt = await promptService.getPromptById(options.promptId)
        if (prompt) {
          finalSystemPrompt = prompt.content + "\n\n" + finalSystemPrompt
        }
      }

      // Si se solicitó incluir datos de tablas, obtenerlos
      if (options.includeTableData && options.tableName) {
        let tableData

        if (options.searchParams) {
          // Buscar datos específicos
          tableData = await dataService.searchTableData(
            options.tableName,
            options.searchParams.column,
            options.searchParams.term,
          )
        } else {
          // Obtener todos los datos de la tabla
          tableData = await dataService.getTableData(options.tableName)
        }

        // Añadir los datos al prompt del sistema
        finalSystemPrompt += `\n\nAquí hay datos relevantes de la tabla "${options.tableName}":\n${JSON.stringify(tableData, null, 2)}`
      }

      // Generar la respuesta
      if (options.stream) {
        return generateClaudeStream(options.messages, finalSystemPrompt)
      } else {
        return generateClaudeResponse(options.messages, finalSystemPrompt)
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
          name: "Claude 3 Opus",
          provider: "Anthropic",
          capabilities: [
            "Respuestas conversacionales",
            "Análisis de datos",
            "Generación de contenido",
            "Resumen de información",
            "Traducción",
            "Explicación de conceptos",
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
export const aiService = new AIService()
