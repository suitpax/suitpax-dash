/**
 * Gestor de Prompts simplificado
 *
 * Este servicio proporciona respuestas predefinidas basadas en patrones
 * sin dependencias externas.
 */

export interface PromptVariables {
  [key: string]: any
  destination?: string
  departureDate?: string
  returnDate?: string
  travelClass?: string
  numberOfTravelers?: number
  budget?: string
  carType?: string
  trainClass?: string
  systemContext?: string
}

export interface Message {
  role: "user" | "assistant" | "system"
  content: string
  id?: string
  createdAt?: Date
}

export interface PromptRequest {
  userMessage: string
  context?: {
    category?: "flights" | "hotels" | "cars" | "trains" | "general"
    variables?: PromptVariables
    previousMessages?: Message[]
  }
}

export interface PromptResponse {
  response: string
  usedInternalSystem: boolean
  category?: string
  confidence?: number
}

export class PromptManager {
  /**
   * Detecta la categoría de la consulta
   */
  private detectCategory(userMessage: string): "flights" | "hotels" | "cars" | "trains" | "general" {
    const lowercaseMessage = userMessage.toLowerCase()

    if (/flight|plane|airport|airline|departure|arrival|boarding/i.test(lowercaseMessage)) {
      return "flights"
    }

    if (/hotel|room|accommodation|stay|check-in|check-out|booking/i.test(lowercaseMessage)) {
      return "hotels"
    }

    if (/car|rental|vehicle|drive|pick-up|drop-off/i.test(lowercaseMessage)) {
      return "cars"
    }

    if (/train|rail|station|track|platform|carriage|seat/i.test(lowercaseMessage)) {
      return "trains"
    }

    return "general"
  }

  /**
   * Extrae variables del mensaje del usuario
   */
  private extractVariables(userMessage: string, previousMessages: Message[] = []): PromptVariables {
    const variables: PromptVariables = {}

    // Extraer destino
    const destinationMatch = userMessage.match(/to\s+([A-Za-z\s]+)[\s.,]/i)
    if (destinationMatch) {
      variables.destination = destinationMatch[1].trim()
    }

    // Extraer fechas
    const departureDateMatch = userMessage.match(
      /(?:from|on|for)\s+(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(?:\w*)(?:\s+\d{4})?)/i,
    )
    if (departureDateMatch) {
      variables.departureDate = departureDateMatch[1]
    }

    const returnDateMatch = userMessage.match(
      /(?:to|until|return(?:ing)?(?:\s+on)?)\s+(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(?:\w*)(?:\s+\d{4})?)/i,
    )
    if (returnDateMatch) {
      variables.returnDate = returnDateMatch[1]
    }

    // Extraer clase de viaje
    if (/business\s+class/i.test(userMessage)) {
      variables.travelClass = "Business"
    } else if (/first\s+class/i.test(userMessage)) {
      variables.travelClass = "First"
    } else if (/premium\s+economy/i.test(userMessage)) {
      variables.travelClass = "Premium Economy"
    } else if (/economy/i.test(userMessage)) {
      variables.travelClass = "Economy"
    }

    // Extraer número de viajeros
    const travelersMatch = userMessage.match(/(\d+)\s+(?:person|people|traveler|travelers|passenger|passengers)/i)
    if (travelersMatch) {
      variables.numberOfTravelers = Number.parseInt(travelersMatch[1])
    }

    // Extraer presupuesto
    const budgetMatch = userMessage.match(/budget\s+(?:of\s+)?(?:\$|€|£)?(\d+(?:,\d+)?(?:\.\d+)?)/i)
    if (budgetMatch) {
      variables.budget = budgetMatch[1]
    }

    // Buscar información en mensajes anteriores
    for (const message of previousMessages) {
      if (message.role === "user") {
        // Si no tenemos destino, buscarlo en mensajes anteriores
        if (!variables.destination) {
          const prevDestinationMatch = message.content.match(/to\s+([A-Za-z\s]+)[\s.,]/i)
          if (prevDestinationMatch) {
            variables.destination = prevDestinationMatch[1].trim()
          }
        }
      }
    }

    return variables
  }

  /**
   * Genera una respuesta basada en el prompt interno
   */
  private generateInternalResponse(request: PromptRequest, category: string, variables: PromptVariables): string {
    // Respuestas simplificadas basadas en la categoría
    switch (category) {
      case "flights":
        return `I can help you find flights${variables.destination ? ` to ${variables.destination}` : ""}. What dates are you looking to travel?`

      case "hotels":
        return `I can help you find hotels${variables.destination ? ` in ${variables.destination}` : ""}. When are you planning to stay?`

      case "cars":
        return `I can help you rent a car${variables.destination ? ` in ${variables.destination}` : ""}. When do you need it?`

      case "trains":
        return `I can help you book train tickets${variables.destination ? ` to ${variables.destination}` : ""}. What date are you looking to travel?`

      case "general":
      default:
        return "I'm your travel assistant. I can help with flights, hotels, car rentals, and train bookings. What do you need assistance with?"
    }
  }

  /**
   * Procesa una solicitud de prompt y genera una respuesta
   */
  async processPrompt(request: PromptRequest): Promise<PromptResponse> {
    const { userMessage, context } = request

    // Detectar categoría
    const category = context?.category || this.detectCategory(userMessage)

    // Extraer variables
    const extractedVariables = this.extractVariables(userMessage, context?.previousMessages)
    const variables = { ...extractedVariables, ...context?.variables }

    // Generar respuesta interna
    const response = this.generateInternalResponse(request, category, variables)

    return {
      response,
      usedInternalSystem: true,
      category,
      confidence: 0.85,
    }
  }
}

// Exportar una instancia del gestor de prompts
export const promptManager = new PromptManager()
