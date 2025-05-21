/**
 * Servicio de IA simplificado
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
}

// Clase principal para el servicio de IA
export class AIService {
  // Generar una respuesta de IA
  async generateResponse(options: AIResponseOptions) {
    try {
      // Usar el sistema interno para todas las consultas
      const lastMessage = options.messages[options.messages.length - 1]

      if (lastMessage && lastMessage.role === "user") {
        // Procesar el mensaje del usuario
        const processedResponse = await this.processUserMessage(lastMessage.content, options.systemPrompt || "")

        // Crear una respuesta en el formato esperado
        const aiResponse: Message = {
          id: `internal-${Date.now()}`,
          content: processedResponse,
          role: "assistant",
          createdAt: new Date(),
        }

        return aiResponse
      }

      // Si no hay mensaje de usuario, devolver respuesta vacía
      return {
        id: `internal-${Date.now()}`,
        content: "No se pudo procesar la solicitud.",
        role: "assistant" as const,
        createdAt: new Date(),
      }
    } catch (error) {
      console.error("Error generating AI response:", error)
      throw error
    }
  }

  // Procesar un mensaje de usuario
  private async processUserMessage(userMessage: string, systemPrompt: string): Promise<string> {
    // Implementación simple para responder a consultas básicas
    const lowerCaseMessage = userMessage.toLowerCase()

    if (lowerCaseMessage.includes("flight") || lowerCaseMessage.includes("vuelo")) {
      return "I can help you book a flight. Where would you like to travel to and from?"
    } else if (lowerCaseMessage.includes("hotel") || lowerCaseMessage.includes("accommodation")) {
      return "I can help you find a hotel. What city will you be staying in?"
    } else if (lowerCaseMessage.includes("policy") || lowerCaseMessage.includes("política")) {
      return "Our travel policy allows business class for flights over 6 hours. Would you like to know more details?"
    } else if (lowerCaseMessage.includes("expense") || lowerCaseMessage.includes("gasto")) {
      return "You can submit your expenses through the Expenses section. Would you like me to guide you through the process?"
    } else if (lowerCaseMessage.includes("train") || lowerCaseMessage.includes("tren")) {
      return "I can help you book a train ticket. What is your departure and arrival station?"
    } else if (lowerCaseMessage.includes("transfer") || lowerCaseMessage.includes("taxi")) {
      return "I can arrange a transfer for you. When and where do you need it?"
    } else if (lowerCaseMessage.includes("event") || lowerCaseMessage.includes("evento")) {
      return "I can help you organize or find business events. What type of event are you interested in?"
    }

    return "I'm here to help with your business travel needs. How can I assist you today?"
  }

  // Obtener datos de ejemplo
  async getTableData(tableName: string, searchParams?: { column: string; term: string }) {
    // Datos de ejemplo para diferentes tablas
    const sampleData: Record<string, any[]> = {
      flights: [
        { id: 1, from: "Madrid", to: "London", date: "2023-06-15", airline: "British Airways", price: 250 },
        { id: 2, from: "Barcelona", to: "Paris", date: "2023-06-20", airline: "Air France", price: 180 },
        { id: 3, from: "Madrid", to: "New York", date: "2023-07-01", airline: "Iberia", price: 650 },
      ],
      hotels: [
        { id: 1, name: "Grand Hyatt", city: "New York", checkIn: "2023-07-01", checkOut: "2023-07-05", price: 320 },
        { id: 2, name: "Ritz Carlton", city: "Paris", checkIn: "2023-06-20", checkOut: "2023-06-25", price: 450 },
        { id: 3, name: "Mandarin Oriental", city: "London", checkIn: "2023-06-15", checkOut: "2023-06-18", price: 380 },
      ],
      expenses: [
        { id: 1, type: "Flight", amount: 250, date: "2023-06-15", status: "Approved" },
        { id: 2, type: "Hotel", amount: 450, date: "2023-06-20", status: "Pending" },
        { id: 3, type: "Meals", amount: 120, date: "2023-06-22", status: "Approved" },
      ],
    }

    // Devolver datos de ejemplo para la tabla solicitada
    return sampleData[tableName] || []
  }

  // Obtener información sobre las tablas disponibles
  async getTableInfo() {
    return [
      {
        name: "flights",
        columns: [
          { name: "id", type: "number" },
          { name: "from", type: "string" },
          { name: "to", type: "string" },
          { name: "date", type: "date" },
          { name: "airline", type: "string" },
          { name: "price", type: "number" },
        ],
      },
      {
        name: "hotels",
        columns: [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
          { name: "city", type: "string" },
          { name: "checkIn", type: "date" },
          { name: "checkOut", type: "date" },
          { name: "price", type: "number" },
        ],
      },
      {
        name: "expenses",
        columns: [
          { name: "id", type: "number" },
          { name: "type", type: "string" },
          { name: "amount", type: "number" },
          { name: "date", type: "date" },
          { name: "status", type: "string" },
        ],
      },
    ]
  }
}

// Exportar una instancia del servicio
export const aiService = new AIService()
