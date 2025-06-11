import { MCPClient, MCPResource, MCPTool } from "@modelcontextprotocol/sdk"
import { generateId } from "../utils"

// Tipos para el servicio de email
export interface EmailDetails {
  to: string
  subject: string
  body: string
  attachments?: string[]
}

// Tipos para preferencias de viaje
export interface TravelPreferences {
  preferredAirlines?: string[]
  preferredHotels?: string[]
  seatPreference?: "window" | "aisle" | "middle"
  cabinClass?: "economy" | "premium_economy" | "business" | "first"
  mealPreference?: string
  maxBudget?: number
  departureTimePreference?: "morning" | "afternoon" | "evening" | "night"
  returnTimePreference?: "morning" | "afternoon" | "evening" | "night"
  directFlightsOnly?: boolean
  maxLayoverTime?: number
  loyaltyPrograms?: Record<string, string>
}

// Tipos para el análisis de viajes
export interface TravelAnalysis {
  totalTrips: number
  totalSpent: number
  averageTripCost: number
  mostVisitedDestinations: string[]
  preferredAirlines: string[]
  preferredHotels: string[]
  potentialSavings: number
  recommendations: string[]
}

// Clase principal para el servicio de MCP
export class MCPAgentService {
  private client: MCPClient
  private tools: MCPTool[]
  private resources: MCPResource[]

  constructor() {
    // Inicializar el cliente MCP
    this.client = new MCPClient({
      name: "Suitpax Travel Assistant",
      description: "An AI assistant for business travel management",
    })

    // Definir las herramientas (tools) que el agente puede utilizar
    this.tools = this.initializeTools()

    // Definir los recursos que el agente puede acceder
    this.resources = this.initializeResources()

    // Registrar herramientas y recursos con el cliente
    this.registerToolsAndResources()
  }

  // Inicializar las herramientas del agente
  private initializeTools(): MCPTool[] {
    return [
      // Herramienta para buscar vuelos
      new MCPTool({
        name: "searchFlights",
        description: "Search for flights based on origin, destination, dates, and preferences",
        parameters: {
          type: "object",
          properties: {
            origin: { type: "string", description: "Origin airport code or city" },
            destination: { type: "string", description: "Destination airport code or city" },
            departureDate: { type: "string", description: "Departure date in YYYY-MM-DD format" },
            returnDate: { type: "string", description: "Return date in YYYY-MM-DD format" },
            passengers: { type: "number", description: "Number of passengers" },
            preferences: {
              type: "object",
              description: "Travel preferences",
              properties: {
                airlines: { type: "array", items: { type: "string" } },
                cabinClass: { type: "string", enum: ["economy", "premium_economy", "business", "first"] },
                directOnly: { type: "boolean" },
                maxPrice: { type: "number" },
              },
            },
          },
          required: ["origin", "destination", "departureDate"],
        },
        handler: async (params) => {
          // En una implementación real, esto conectaría con una API de búsqueda de vuelos
          console.log("Searching flights with params:", params)
          return {
            flights: [
              {
                id: generateId(),
                airline: "United Airlines",
                flightNumber: "UA123",
                origin: params.origin,
                destination: params.destination,
                departureTime: "2023-06-15T08:00:00Z",
                arrivalTime: "2023-06-15T11:30:00Z",
                duration: "3h 30m",
                stops: 0,
                price: 450,
                cabinClass: params.preferences?.cabinClass || "economy",
              },
              {
                id: generateId(),
                airline: "Delta Airlines",
                flightNumber: "DL456",
                origin: params.origin,
                destination: params.destination,
                departureTime: "2023-06-15T10:15:00Z",
                arrivalTime: "2023-06-15T13:45:00Z",
                duration: "3h 30m",
                stops: 0,
                price: 425,
                cabinClass: params.preferences?.cabinClass || "economy",
              },
            ],
          }
        },
      }),

      // Herramienta para buscar hoteles
      new MCPTool({
        name: "searchHotels",
        description: "Search for hotels based on location, dates, and preferences",
        parameters: {
          type: "object",
          properties: {
            location: { type: "string", description: "Hotel location (city, address, etc.)" },
            checkIn: { type: "string", description: "Check-in date in YYYY-MM-DD format" },
            checkOut: { type: "string", description: "Check-out date in YYYY-MM-DD format" },
            guests: { type: "number", description: "Number of guests" },
            preferences: {
              type: "object",
              description: "Hotel preferences",
              properties: {
                chains: { type: "array", items: { type: "string" } },
                amenities: { type: "array", items: { type: "string" } },
                starRating: { type: "number", minimum: 1, maximum: 5 },
                maxPrice: { type: "number" },
              },
            },
          },
          required: ["location", "checkIn", "checkOut"],
        },
        handler: async (params) => {
          // En una implementación real, esto conectaría con una API de búsqueda de hoteles
          console.log("Searching hotels with params:", params)
          return {
            hotels: [
              {
                id: generateId(),
                name: "Grand Hyatt",
                chain: "Hyatt",
                address: "123 Main St, " + params.location,
                checkIn: params.checkIn,
                checkOut: params.checkOut,
                price: 220,
                starRating: 4.5,
                amenities: ["WiFi", "Pool", "Gym", "Restaurant"],
              },
              {
                id: generateId(),
                name: "Marriott Downtown",
                chain: "Marriott",
                address: "456 Center Ave, " + params.location,
                checkIn: params.checkIn,
                checkOut: params.checkOut,
                price: 195,
                starRating: 4,
                amenities: ["WiFi", "Gym", "Business Center"],
              },
            ],
          }
        },
      }),

      // Herramienta para enviar emails
      new MCPTool({
        name: "sendEmail",
        description: "Send an email to specified recipients",
        parameters: {
          type: "object",
          properties: {
            to: { type: "string", description: "Email recipient(s)" },
            subject: { type: "string", description: "Email subject" },
            body: { type: "string", description: "Email body content" },
            attachments: {
              type: "array",
              description: "Optional file attachments",
              items: { type: "string" },
            },
          },
          required: ["to", "subject", "body"],
        },
        handler: async (params) => {
          // En una implementación real, esto enviaría un email a través de un servicio de email
          console.log("Sending email:", params)
          return {
            success: true,
            messageId: generateId(),
            sentAt: new Date().toISOString(),
          }
        },
      }),

      // Herramienta para analizar preferencias de viaje
      new MCPTool({
        name: "analyzeTravelPreferences",
        description: "Analyze user's travel history to determine preferences",
        parameters: {
          type: "object",
          properties: {
            userId: { type: "string", description: "User ID to analyze" },
            timeframe: {
              type: "string",
              description: "Timeframe to analyze (e.g., '3months', '1year')",
              default: "1year",
            },
          },
          required: ["userId"],
        },
        handler: async (params) => {
          // En una implementación real, esto analizaría datos reales del usuario
          console.log("Analyzing travel preferences for user:", params)
          return {
            preferences: {
              preferredAirlines: ["United Airlines", "Delta"],
              preferredHotels: ["Marriott", "Hilton"],
              seatPreference: "window",
              cabinClass: "economy",
              mealPreference: "vegetarian",
              departureTimePreference: "morning",
              returnTimePreference: "evening",
              directFlightsOnly: true,
              loyaltyPrograms: {
                United: "UA123456",
                Marriott: "MB789012",
              },
            },
          }
        },
      }),

      // Herramienta para generar informes de viaje
      new MCPTool({
        name: "generateTravelReport",
        description: "Generate a comprehensive travel report with analytics and recommendations",
        parameters: {
          type: "object",
          properties: {
            userId: { type: "string", description: "User ID to generate report for" },
            companyId: { type: "string", description: "Company ID to generate report for" },
            startDate: { type: "string", description: "Start date in YYYY-MM-DD format" },
            endDate: { type: "string", description: "End date in YYYY-MM-DD format" },
            reportType: {
              type: "string",
              description: "Type of report to generate",
              enum: ["expense", "savings", "compliance", "comprehensive"],
            },
          },
          required: ["userId", "startDate", "endDate"],
        },
        handler: async (params) => {
          // En una implementación real, esto generaría un informe basado en datos reales
          console.log("Generating travel report:", params)
          return {
            report: {
              id: generateId(),
              title: `Travel Report: ${params.startDate} to ${params.endDate}`,
              generatedAt: new Date().toISOString(),
              summary: {
                totalTrips: 12,
                totalSpent: 15680,
                complianceRate: 94,
                potentialSavings: 2340,
              },
              details: {
                topDestinations: ["New York", "Chicago", "San Francisco"],
                topExpenseCategories: ["Flights", "Hotels", "Meals"],
                complianceIssues: ["2 bookings outside policy timeframe", "1 hotel above rate cap"],
              },
              recommendations: [
                "Book flights 21+ days in advance to save approximately 15%",
                "Consider corporate rate at Hilton for Chicago trips",
                "Consolidate car rental vendors to maximize discounts",
              ],
            },
          }
        },
      }),

      // Herramienta para crear itinerarios
      new MCPTool({
        name: "createItinerary",
        description: "Create a detailed travel itinerary based on booked trips and preferences",
        parameters: {
          type: "object",
          properties: {
            userId: { type: "string", description: "User ID to create itinerary for" },
            tripId: { type: "string", description: "Trip ID to create itinerary for" },
            includeOptions: {
              type: "object",
              description: "Options to include in the itinerary",
              properties: {
                localTransportation: { type: "boolean", default: true },
                meetings: { type: "boolean", default: true },
                meals: { type: "boolean", default: true },
                localAttractions: { type: "boolean", default: false },
              },
            },
          },
          required: ["userId", "tripId"],
        },
        handler: async (params) => {
          // En una implementación real, esto crearía un itinerario basado en datos reales
          console.log("Creating itinerary:", params)
          return {
            itinerary: {
              id: generateId(),
              tripId: params.tripId,
              title: "Business Trip to Chicago",
              dates: {
                start: "2023-07-10",
                end: "2023-07-13",
              },
              segments: [
                {
                  type: "flight",
                  date: "2023-07-10",
                  time: "08:30",
                  details: "UA123 from SFO to ORD",
                  confirmationCode: "ABC123",
                },
                {
                  type: "transportation",
                  date: "2023-07-10",
                  time: "11:45",
                  details: "Taxi from ORD to Marriott Downtown",
                  confirmationCode: null,
                },
                {
                  type: "hotel",
                  date: "2023-07-10",
                  time: "14:00",
                  details: "Check-in at Marriott Downtown Chicago",
                  confirmationCode: "DEF456",
                },
                {
                  type: "meeting",
                  date: "2023-07-11",
                  time: "09:00",
                  details: "Meeting with Acme Corp at 123 Business Ave",
                  duration: "2 hours",
                },
                {
                  type: "flight",
                  date: "2023-07-13",
                  time: "17:30",
                  details: "UA456 from ORD to SFO",
                  confirmationCode: "XYZ789",
                },
              ],
            },
          }
        },
      }),

      // Herramienta para verificar cumplimiento de políticas
      new MCPTool({
        name: "checkPolicyCompliance",
        description: "Check if a travel booking complies with company travel policy",
        parameters: {
          type: "object",
          properties: {
            companyId: { type: "string", description: "Company ID to check policy for" },
            bookingType: {
              type: "string",
              description: "Type of booking to check",
              enum: ["flight", "hotel", "car", "meal", "other"],
            },
            bookingDetails: {
              type: "object",
              description: "Details of the booking to check",
            },
          },
          required: ["companyId", "bookingType", "bookingDetails"],
        },
        handler: async (params) => {
          // En una implementación real, esto verificaría el cumplimiento de políticas reales
          console.log("Checking policy compliance:", params)
          return {
            compliant: true,
            policyReferences: ["Section 3.2: Flight Booking", "Section 5.1: Approval Requirements"],
            warnings: ["Booking is within 14 days of travel - requires manager approval"],
            recommendations: ["Consider alternative dates for better rates"],
          }
        },
      }),
    ]
  }

  // Inicializar los recursos del agente
  private initializeResources(): MCPResource[] {
    return [
      // Recurso para la política de viajes
      new MCPResource({
        name: "travelPolicy",
        description: "Company travel policy document",
        content: `# Suitpax Travel Policy

## 1. General Guidelines
- All business travel must be approved by a manager
- Bookings should be made at least 14 days in advance when possible
- Economy class for flights under 6 hours
- Business class allowed for flights over 6 hours

## 2. Air Travel
- Preferred airlines: United, Delta, American
- Direct flights preferred when difference is less than $200
- Airport lounges allowed for delays over 2 hours

## 3. Accommodations
- Maximum hotel rates by city: NYC ($350), SF ($300), Chicago ($250), Other ($200)
- Preferred hotel chains: Marriott, Hilton, Hyatt
- Room service limited to $50 per day

## 4. Ground Transportation
- Ride sharing services preferred over taxis
- Car rentals: Economy or Compact class only
- Public transportation encouraged where convenient and safe

## 5. Meals & Entertainment
- Maximum per diem: $75 (domestic), $100 (international)
- Client entertainment requires pre-approval
- Alcohol limited to 2 drinks per meal

## 6. Expense Reporting
- All expenses must be submitted within 14 days of return
- Receipts required for all expenses over $25
- Corporate card should be used when possible`,
      }),

      // Recurso para plantillas de email
      new MCPResource({
        name: "emailTemplates",
        description: "Email templates for various travel communications",
        content: `# Travel Email Templates

## Trip Approval Request
Subject: Travel Approval Request: [Destination] - [Dates]
Body:
Dear [Manager],

I am requesting approval for a business trip to [Destination] from [Start Date] to [End Date].

Purpose: [Brief description of purpose]
Estimated cost: $[Amount]
Key meetings: [List of key meetings/events]

Please let me know if you approve this travel request.

Thank you,
[Name]

## Itinerary Confirmation
Subject: Your Upcoming Trip to [Destination]
Body:
Dear [Traveler],

Your trip to [Destination] from [Start Date] to [End Date] has been confirmed. Below is your itinerary:

FLIGHTS:
Outbound: [Airline] [Flight Number] - [Departure Time] to [Arrival Time]
Return: [Airline] [Flight Number] - [Departure Time] to [Arrival Time]

HOTEL:
[Hotel Name]
[Hotel Address]
Confirmation: [Confirmation Number]

TRANSPORTATION:
[Transportation Details]

Please review all details and let us know if you have any questions.

Safe travels,
Suitpax Travel Team

## Policy Exception Notification
Subject: Travel Policy Exception - [Traveler Name]
Body:
Dear [Approver],

A travel booking requiring policy exception approval has been submitted:

Traveler: [Name]
Destination: [Destination]
Dates: [Start Date] to [End Date]
Exception: [Description of exception]
Reason: [Justification]

Please approve or deny this exception at your earliest convenience.

Thank you,
Suitpax Travel Team`,
      }),
    ]
  }

  // Registrar herramientas y recursos con el cliente MCP
  private registerToolsAndResources(): void {
    // Registrar herramientas
    this.tools.forEach((tool) => {
      this.client.registerTool(tool)
    })

    // Registrar recursos
    this.resources.forEach((resource) => {
      this.client.registerResource(resource)
    })
  }

  // Método para iniciar el servidor MCP
  public async startServer(port = 3100): Promise<void> {
    try {
      await this.client.listen(port)
      console.log(`MCP server running on port ${port}`)
    } catch (error) {
      console.error("Failed to start MCP server:", error)
      throw error
    }
  }

  // Método para detener el servidor MCP
  public async stopServer(): Promise<void> {
    try {
      await this.client.close()
      console.log("MCP server stopped")
    } catch (error) {
      console.error("Failed to stop MCP server:", error)
      throw error
    }
  }

  // Método para enviar un email
  public async sendEmail(details: EmailDetails): Promise<boolean> {
    try {
      const result = await this.client.executeTool("sendEmail", {
        to: details.to,
        subject: details.subject,
        body: details.body,
        attachments: details.attachments || [],
      })
      return result.success
    } catch (error) {
      console.error("Failed to send email:", error)
      return false
    }
  }

  // Método para analizar preferencias de viaje
  public async analyzeTravelPreferences(userId: string, timeframe = "1year"): Promise<TravelPreferences> {
    try {
      const result = await this.client.executeTool("analyzeTravelPreferences", {
        userId,
        timeframe,
      })
      return result.preferences
    } catch (error) {
      console.error("Failed to analyze travel preferences:", error)
      throw error
    }
  }

  // Método para generar un informe de viaje
  public async generateTravelReport(
    userId: string,
    startDate: string,
    endDate: string,
    reportType = "comprehensive",
  ): Promise<any> {
    try {
      const result = await this.client.executeTool("generateTravelReport", {
        userId,
        startDate,
        endDate,
        reportType,
      })
      return result.report
    } catch (error) {
      console.error("Failed to generate travel report:", error)
      throw error
    }
  }

  // Método para crear un itinerario
  public async createItinerary(userId: string, tripId: string, options: any = {}): Promise<any> {
    try {
      const result = await this.client.executeTool("createItinerary", {
        userId,
        tripId,
        includeOptions: options,
      })
      return result.itinerary
    } catch (error) {
      console.error("Failed to create itinerary:", error)
      throw error
    }
  }

  // Método para verificar cumplimiento de políticas
  public async checkPolicyCompliance(companyId: string, bookingType: string, bookingDetails: any): Promise<any> {
    try {
      const result = await this.client.executeTool("checkPolicyCompliance", {
        companyId,
        bookingType,
        bookingDetails,
      })
      return result
    } catch (error) {
      console.error("Failed to check policy compliance:", error)
      throw error
    }
  }
}

// Exportar una instancia singleton del servicio
export const mcpAgentService = new MCPAgentService()
