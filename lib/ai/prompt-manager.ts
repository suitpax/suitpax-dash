import { v4 as uuidv4 } from "uuid"

// Tipos para los prompts
export interface Prompt {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Gestor de Prompts para la IA interna
 *
 * Este servicio se encarga de seleccionar, personalizar y gestionar
 * los prompts internos para reducir el uso de servicios externos.
 */

import { generateInternalPrompt, type PromptVariables } from "./prompts/internal-prompt-system"
import type { Message } from "./ai-service-enhanced"

export interface PromptRequest {
  userMessage: string
  context?: {
    category?: "flights" | "hotels" | "cars" | "trains" | "general"
    variables?: PromptVariables
    previousMessages?: Message[]
    useAnthropicFallback?: boolean
  }
}

export interface PromptResponse {
  response: string
  usedInternalSystem: boolean
  category?: string
  confidence?: number
}

// Servicio para gestionar prompts (sin dependencia de Neon)
export class PromptManager {
  private prompts: Prompt[] = []

  constructor() {
    // Inicializar con algunos prompts de ejemplo
    this.prompts = [
      {
        id: uuidv4(),
        title: "Búsqueda de vuelos",
        content: "Busca vuelos de {origen} a {destino} para {fecha}",
        category: "travel",
        tags: ["vuelos", "búsqueda"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Reserva de hotel",
        content: "Encuentra hoteles en {ciudad} para {fechaEntrada} hasta {fechaSalida}",
        category: "travel",
        tags: ["hoteles", "búsqueda"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  }

  // Obtener todos los prompts
  async getAllPrompts(): Promise<Prompt[]> {
    return this.prompts
  }

  // Obtener prompts por categoría
  async getPromptsByCategory(category: string): Promise<Prompt[]> {
    return this.prompts.filter((p) => p.category === category)
  }

  // Obtener un prompt por ID
  async getPromptById(id: string): Promise<Prompt | null> {
    return this.prompts.find((p) => p.id === id) || null
  }

  // Crear un nuevo prompt
  async createPrompt(promptData: Omit<Prompt, "id" | "createdAt" | "updatedAt">): Promise<Prompt> {
    const newPrompt: Prompt = {
      ...promptData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.prompts.push(newPrompt)
    return newPrompt
  }

  // Actualizar un prompt existente
  async updatePrompt(
    id: string,
    promptData: Partial<Omit<Prompt, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Prompt | null> {
    const index = this.prompts.findIndex((p) => p.id === id)
    if (index === -1) return null

    this.prompts[index] = {
      ...this.prompts[index],
      ...promptData,
      updatedAt: new Date(),
    }

    return this.prompts[index]
  }

  // Eliminar un prompt
  async deletePrompt(id: string): Promise<boolean> {
    const initialLength = this.prompts.length
    this.prompts = this.prompts.filter((p) => p.id !== id)
    return initialLength !== this.prompts.length
  }

  /**
   * Determina si una consulta puede ser respondida por el sistema interno
   */
  private canHandleInternally(request: PromptRequest): boolean {
    // Ahora siempre manejamos internamente
    return true
  }

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

        // Buscar otras variables en mensajes anteriores...
      }
    }

    return variables
  }

  /**
   * Genera una respuesta basada en el prompt interno
   */
  private generateInternalResponse(request: PromptRequest, category: string, variables: PromptVariables): string {
    // Generar el prompt completo con las variables
    const fullPrompt = generateInternalPrompt(variables)

    // En una implementación real, aquí se procesaría el prompt con un modelo de IA local
    // o se utilizaría un sistema de plantillas más sofisticado

    // Por ahora, simulamos una respuesta basada en la categoría
    let response = ""

    switch (category) {
      case "flights":
        if (
          request.userMessage.includes("search") ||
          request.userMessage.includes("find") ||
          request.userMessage.includes("looking for")
        ) {
          response = `I've found several flight options from ${variables.departureDate || "your location"} to ${variables.destination || "your destination"} for ${variables.departureDate || "the requested dates"}.

**Top recommendations based on best value:**

1. **British Airways**: 10:15 AM - 2:30 PM
   - Price: $450
   - Duration: 4h 15m
   - Class: ${variables.travelClass || "Economy"}

2. **Lufthansa**: 12:45 PM - 5:10 PM
   - Price: $425
   - Duration: 4h 25m
   - Class: ${variables.travelClass || "Economy"}

3. **Air France**: 8:30 AM - 12:55 PM
   - Price: $475
   - Duration: 4h 25m
   - Class: ${variables.travelClass || "Economy"}

Would you like to book any of these options or see more alternatives?`
        } else if (request.userMessage.includes("book") || request.userMessage.includes("reserve")) {
          response = `✅ **Flight Booking Confirmed**

Your flight from ${variables.departureDate || "your departure city"} to ${variables.destination || "your destination"} has been booked.

**Booking Details:**
- Confirmation code: BK78945
- Airline: British Airways
- Flight number: BA456
- Date: ${variables.departureDate || "your selected date"}
- Departure: 10:15 AM from London Heathrow
- Arrival: 2:30 PM at Charles de Gaulle
- Class: ${variables.travelClass || "Economy"}
- Passengers: ${variables.numberOfTravelers || "1"}

**Next steps:**
- Your e-ticket has been emailed to you
- Check-in opens 24 hours before departure
- Download the airline app for updates

Need anything else for your trip?`
        } else {
          response = `I'd be happy to help with your flight request. Could you please provide more details about what you're looking for? For example:

- Your departure city
- Your destination
- Travel dates
- Number of travelers
- Preferred class of service

Once you provide these details, I can search for the best flight options for you.`
        }
        break

      case "hotels":
        if (
          request.userMessage.includes("search") ||
          request.userMessage.includes("find") ||
          request.userMessage.includes("looking for")
        ) {
          response = `I've found several hotel options in ${variables.destination || "your destination"} for your stay from ${variables.departureDate || "your check-in date"} to ${variables.returnDate || "your check-out date"}.

**Top recommendations based on best value:**

1. **Grand Hyatt** ⭐⭐⭐⭐
   - Rate: $180 per night (Total: $540)
   - Location: City Center
   - Distance from your meeting location: 0.5 miles
   - Amenities: Free WiFi, Breakfast, Business Center

2. **Marriott Executive** ⭐⭐⭐⭐
   - Rate: $195 per night (Total: $585)
   - Location: Financial District
   - Distance from your meeting location: 0.8 miles
   - Amenities: Free WiFi, Gym, Room Service

3. **Hilton Garden Inn** ⭐⭐⭐
   - Rate: $150 per night (Total: $450)
   - Location: Downtown
   - Distance from your meeting location: 1.2 miles
   - Amenities: Free WiFi, Restaurant, Laundry

Would you like to book any of these options or see more alternatives?`
        } else if (request.userMessage.includes("book") || request.userMessage.includes("reserve")) {
          response = `✅ **Hotel Booking Confirmed**

Your stay at Grand Hyatt in ${variables.destination || "your destination"} has been booked.

**Booking Details:**
- Confirmation code: HB45678
- Check-in: ${variables.departureDate || "your check-in date"} (after 3:00 PM)
- Check-out: ${variables.returnDate || "your check-out date"} (before 12:00 PM)
- Room type: Business King
- Guests: ${variables.numberOfTravelers || "1"}
- Rate: $180 per night (Total: $540)
- Payment: Corporate card ending in 4567
- Cancellation policy: Free cancellation until 24 hours before check-in

**Hotel Information:**
- Address: 123 Main Street, City Center
- Phone: +1 (555) 123-4567
- Amenities: Free WiFi, Breakfast, Business Center
- Check-in instructions: Please present ID and credit card at reception

Need anything else for your trip?`
        } else {
          response = `I'd be happy to help with your hotel request. Could you please provide more details about what you're looking for? For example:

- Your destination
- Check-in and check-out dates
- Number of guests
- Preferred location or area
- Budget range

Once you provide these details, I can search for the best hotel options for you.`
        }
        break

      case "cars":
        if (
          request.userMessage.includes("search") ||
          request.userMessage.includes("find") ||
          request.userMessage.includes("looking for")
        ) {
          response = `I've found several car rental options in ${variables.destination || "your destination"} for your trip from ${variables.departureDate || "your pick-up date"} to ${variables.returnDate || "your drop-off date"}.

**Top recommendations based on best value:**

1. **Midsize Sedan** by Hertz
   - Rate: $45 per day (Total: $135)
   - Pick-up: Airport Terminal
   - Drop-off: Airport Terminal
   - Features: Automatic, A/C, Bluetooth
   - Insurance: Basic included

2. **Compact SUV** by Enterprise
   - Rate: $55 per day (Total: $165)
   - Pick-up: Airport Terminal
   - Drop-off: Airport Terminal
   - Features: Automatic, A/C, GPS
   - Insurance: Basic included

3. **Economy** by Avis
   - Rate: $38 per day (Total: $114)
   - Pick-up: Airport Terminal
   - Drop-off: Airport Terminal
   - Features: Automatic, A/C
   - Insurance: Basic included

Would you like to book any of these options or see more alternatives?`
        } else if (request.userMessage.includes("book") || request.userMessage.includes("reserve")) {
          response = `✅ **Car Rental Booking Confirmed**

Your car rental in ${variables.destination || "your destination"} has been booked.

**Booking Details:**
- Confirmation code: CR34567
- Rental company: Hertz
- Car type: ${variables.carType || "Midsize Sedan"}
- Pick-up: ${variables.departureDate || "your pick-up date"} at 10:00 AM, Airport Terminal
- Drop-off: ${variables.returnDate || "your drop-off date"} at 6:00 PM, Airport Terminal
- Rate: $45 per day (Total: $135)
- Insurance: Basic coverage included
- Payment: Corporate card ending in 4567
- Cancellation policy: Free cancellation up to 24 hours before pick-up

**Pick-up Instructions:**
- Proceed to the Hertz counter in the airport arrivals hall
- Required documents: Driver's license, credit card, booking confirmation

Need anything else for your trip?`
        } else {
          response = `I'd be happy to help with your car rental request. Could you please provide more details about what you're looking for? For example:

- Your destination
- Pick-up and drop-off dates
- Preferred car type
- Pick-up and drop-off locations
- Additional requirements (GPS, child seat, etc.)

Once you provide these details, I can search for the best car rental options for you.`
        }
        break

      case "trains":
        if (
          request.userMessage.includes("search") ||
          request.userMessage.includes("find") ||
          request.userMessage.includes("looking for")
        ) {
          response = `I've found several train options from ${variables.departureDate || "your departure city"} to ${variables.destination || "your destination"} for ${variables.departureDate || "your travel date"}.

**Top recommendations based on schedule and price:**

1. **Eurostar**: Train 9015
   - Departure: 8:30 AM from St. Pancras
   - Arrival: 11:47 AM at Gare du Nord
   - Duration: 2h 17m
   - Class: ${variables.trainClass || "Standard"}
   - Price: $95

2. **Eurostar**: Train 9027
   - Departure: 10:24 AM from St. Pancras
   - Arrival: 1:47 PM at Gare du Nord
   - Duration: 2h 23m
   - Class: ${variables.trainClass || "Standard"}
   - Price: $110

3. **Eurostar**: Train 9033
   - Departure: 12:24 PM from St. Pancras
   - Arrival: 3:47 PM at Gare du Nord
   - Duration: 2h 23m
   - Class: ${variables.trainClass || "Standard"}
   - Price: $85

Would you like to book any of these options or see more alternatives?`
        } else if (request.userMessage.includes("book") || request.userMessage.includes("reserve")) {
          response = `✅ **Train Booking Confirmed**

Your train from ${variables.departureDate || "your departure city"} to ${variables.destination || "your destination"} has been booked.

**Booking Details:**
- Confirmation code: TR23456
- Train company: Eurostar
- Train number: 9015
- Date: ${variables.departureDate || "your travel date"}
- Departure: 8:30 AM from St. Pancras
- Arrival: 11:47 AM at Gare du Nord
- Class: ${variables.trainClass || "Standard"}
- Seat(s): 42A, Window
- Passengers: ${variables.numberOfTravelers || "1"}
- Ticket type: E-ticket

**Next steps:**
- Your e-ticket has been emailed to you
- Arrive at the station at least 30 minutes before departure
- Show your e-ticket on your phone or print it

Need anything else for your trip?`
        } else {
          response = `I'd be happy to help with your train travel request. Could you please provide more details about what you're looking for? For example:

- Your departure city
- Your destination
- Travel date
- Preferred time of day
- Class preference (Standard or First)

Once you provide these details, I can search for the best train options for you.`
        }
        break

      case "general":
      default:
        response = `I'd be happy to help with your travel needs. Could you please provide more details about what you're looking for? I can assist with:

- Flight bookings
- Hotel reservations
- Car rentals
- Train tickets
- Travel policies
- Expense reporting
- Itinerary management
- Visa requirements
- Travel insurance

Let me know what you need, and I'll provide the relevant information.`
        break
    }

    return response
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

// Exportar una instancia del servicio
export const promptManager = new PromptManager()
