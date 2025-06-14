import { MCPServer, MCPTool, MCPResource, type ToolResult } from "@modelcontextprotocol/sdk"
import { generateId } from "../utils"

// Tipos para las herramientas de Suitpax
export interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass?: "economy" | "premium_economy" | "business" | "first"
  directOnly?: boolean
  maxPrice?: number
}

export interface HotelSearchParams {
  location: string
  checkIn: string
  checkOut: string
  guests: number
  starRating?: number
  maxPrice?: number
  amenities?: string[]
}

export interface ExpenseProcessParams {
  receiptImage: string
  userId: string
  category?: string
  description?: string
}

export interface EmailParams {
  to: string
  subject: string
  body: string
  template?: string
  attachments?: string[]
}

export interface CalendarEventParams {
  title: string
  startTime: string
  endTime: string
  attendees?: string[]
  location?: string
  description?: string
}

// Servidor MCP principal de Suitpax
export class SuitpaxMCPServer {
  private server: MCPServer
  private tools: MCPTool[]
  private resources: MCPResource[]

  constructor() {
    this.server = new MCPServer({
      name: "Suitpax AI Assistant",
      version: "1.0.0",
      description: "Advanced corporate travel and productivity AI assistant with executable workflows",
    })

    this.tools = this.initializeTools()
    this.resources = this.initializeResources()
    this.registerToolsAndResources()
  }

  private initializeTools(): MCPTool[] {
    return [
      // 🛫 HERRAMIENTA: Búsqueda y reserva de vuelos
      new MCPTool({
        name: "searchAndBookFlights",
        description: "Search for flights and optionally book them with real-time pricing and availability",
        parameters: {
          type: "object",
          properties: {
            origin: { type: "string", description: "Origin airport code or city name" },
            destination: { type: "string", description: "Destination airport code or city name" },
            departureDate: { type: "string", description: "Departure date (YYYY-MM-DD)" },
            returnDate: { type: "string", description: "Return date (YYYY-MM-DD) for round trip" },
            passengers: { type: "number", description: "Number of passengers", default: 1 },
            cabinClass: {
              type: "string",
              enum: ["economy", "premium_economy", "business", "first"],
              default: "economy",
            },
            directOnly: { type: "boolean", description: "Search only direct flights", default: false },
            maxPrice: { type: "number", description: "Maximum price per person" },
            autoBook: { type: "boolean", description: "Automatically book the best option", default: false },
          },
          required: ["origin", "destination", "departureDate"],
        },
        handler: async (params: FlightSearchParams & { autoBook?: boolean }) => {
          console.log("🛫 Executing flight search and booking:", params)

          // Simular búsqueda real de vuelos
          const flights = await this.searchFlights(params)

          if (params.autoBook && flights.length > 0) {
            const booking = await this.bookFlight(flights[0])
            return {
              action: "flight_booked",
              booking,
              flights,
              message: `✅ Vuelo reservado automáticamente: ${booking.airline} ${booking.flightNumber}`,
            }
          }

          return {
            action: "flights_found",
            flights,
            count: flights.length,
            message: `🔍 Encontrados ${flights.length} vuelos. ¿Quieres que reserve alguno?`,
          }
        },
      }),

      // 🏨 HERRAMIENTA: Búsqueda y reserva de hoteles
      new MCPTool({
        name: "searchAndBookHotels",
        description: "Search for hotels and optionally book them with corporate rates",
        parameters: {
          type: "object",
          properties: {
            location: { type: "string", description: "Hotel location (city, address, landmark)" },
            checkIn: { type: "string", description: "Check-in date (YYYY-MM-DD)" },
            checkOut: { type: "string", description: "Check-out date (YYYY-MM-DD)" },
            guests: { type: "number", description: "Number of guests", default: 1 },
            starRating: { type: "number", description: "Minimum star rating (1-5)" },
            maxPrice: { type: "number", description: "Maximum price per night" },
            amenities: {
              type: "array",
              items: { type: "string" },
              description: "Required amenities (wifi, gym, pool, business_center, etc.)",
            },
            autoBook: { type: "boolean", description: "Automatically book the best option", default: false },
          },
          required: ["location", "checkIn", "checkOut"],
        },
        handler: async (params: HotelSearchParams & { autoBook?: boolean }) => {
          console.log("🏨 Executing hotel search and booking:", params)

          const hotels = await this.searchHotels(params)

          if (params.autoBook && hotels.length > 0) {
            const booking = await this.bookHotel(hotels[0])
            return {
              action: "hotel_booked",
              booking,
              hotels,
              message: `✅ Hotel reservado automáticamente: ${booking.name}`,
            }
          }

          return {
            action: "hotels_found",
            hotels,
            count: hotels.length,
            message: `🔍 Encontrados ${hotels.length} hoteles. ¿Quieres que reserve alguno?`,
          }
        },
      }),

      // 💰 HERRAMIENTA: Procesamiento automático de gastos
      new MCPTool({
        name: "processExpenseReceipt",
        description: "Process expense receipts using OCR, categorize, and submit for approval",
        parameters: {
          type: "object",
          properties: {
            receiptImage: { type: "string", description: "Base64 encoded receipt image or file path" },
            userId: { type: "string", description: "User ID for expense submission" },
            category: { type: "string", description: "Expense category override" },
            description: { type: "string", description: "Additional description" },
            autoSubmit: { type: "boolean", description: "Automatically submit for approval", default: true },
          },
          required: ["receiptImage", "userId"],
        },
        handler: async (params: ExpenseProcessParams & { autoSubmit?: boolean }) => {
          console.log("💰 Processing expense receipt:", params)

          // Simular OCR y procesamiento
          const expenseData = await this.processReceiptOCR(params.receiptImage)
          const categorizedExpense = await this.categorizeExpense(expenseData, params.category)

          if (params.autoSubmit) {
            const submission = await this.submitExpense(categorizedExpense, params.userId)
            return {
              action: "expense_submitted",
              expense: categorizedExpense,
              submission,
              message: `✅ Gasto procesado y enviado para aprobación: €${categorizedExpense.amount}`,
            }
          }

          return {
            action: "expense_processed",
            expense: categorizedExpense,
            message: `📄 Gasto procesado: €${categorizedExpense.amount} - ${categorizedExpense.category}`,
          }
        },
      }),

      // 📧 HERRAMIENTA: Envío inteligente de emails
      new MCPTool({
        name: "sendIntelligentEmail",
        description: "Send emails with smart templates and travel context",
        parameters: {
          type: "object",
          properties: {
            to: { type: "string", description: "Recipient email address" },
            subject: { type: "string", description: "Email subject" },
            body: { type: "string", description: "Email body content" },
            template: {
              type: "string",
              enum: ["travel_approval", "itinerary", "expense_report", "meeting_invite", "custom"],
              description: "Email template to use",
            },
            travelContext: {
              type: "object",
              description: "Travel context for smart content generation",
            },
            attachments: {
              type: "array",
              items: { type: "string" },
              description: "File attachments",
            },
          },
          required: ["to", "subject"],
        },
        handler: async (params: EmailParams & { travelContext?: any }) => {
          console.log("📧 Sending intelligent email:", params)

          const email = await this.generateSmartEmail(params)
          const result = await this.sendEmail(email)

          return {
            action: "email_sent",
            email,
            result,
            message: `✅ Email enviado a ${params.to}: ${params.subject}`,
          }
        },
      }),

      // 📅 HERRAMIENTA: Gestión de calendario
      new MCPTool({
        name: "manageCalendarEvent",
        description: "Create, update, or delete calendar events with travel integration",
        parameters: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["create", "update", "delete", "find_slots"],
              description: "Calendar action to perform",
            },
            title: { type: "string", description: "Event title" },
            startTime: { type: "string", description: "Start time (ISO 8601)" },
            endTime: { type: "string", description: "End time (ISO 8601)" },
            attendees: {
              type: "array",
              items: { type: "string" },
              description: "Attendee email addresses",
            },
            location: { type: "string", description: "Event location" },
            description: { type: "string", description: "Event description" },
            travelTime: { type: "boolean", description: "Include travel time buffers", default: true },
          },
          required: ["action"],
        },
        handler: async (params: CalendarEventParams & { action: string; travelTime?: boolean }) => {
          console.log("📅 Managing calendar event:", params)

          let result
          switch (params.action) {
            case "create":
              result = await this.createCalendarEvent(params)
              break
            case "update":
              result = await this.updateCalendarEvent(params)
              break
            case "delete":
              result = await this.deleteCalendarEvent(params)
              break
            case "find_slots":
              result = await this.findAvailableSlots(params)
              break
            default:
              throw new Error(`Unknown calendar action: ${params.action}`)
          }

          return {
            action: `calendar_${params.action}`,
            result,
            message: `✅ Calendario actualizado: ${params.action}`,
          }
        },
      }),

      // 🤖 HERRAMIENTA: Workflow automático completo
      new MCPTool({
        name: "executeCompleteWorkflow",
        description: "Execute complete travel workflows (search + book + calendar + email + expenses)",
        parameters: {
          type: "object",
          properties: {
            workflowType: {
              type: "string",
              enum: ["complete_trip", "expense_cycle", "meeting_setup", "team_travel"],
              description: "Type of workflow to execute",
            },
            tripDetails: {
              type: "object",
              description: "Complete trip details for booking",
            },
            notifications: {
              type: "boolean",
              description: "Send notifications and updates",
              default: true,
            },
            autoApproval: {
              type: "boolean",
              description: "Request automatic approvals where possible",
              default: false,
            },
          },
          required: ["workflowType"],
        },
        handler: async (params: {
          workflowType: string
          tripDetails?: any
          notifications?: boolean
          autoApproval?: boolean
        }) => {
          console.log("🤖 Executing complete workflow:", params)

          const workflow = await this.executeWorkflow(params)

          return {
            action: "workflow_completed",
            workflow,
            steps: workflow.steps,
            message: `✅ Workflow completado: ${params.workflowType}`,
          }
        },
      }),

      // 📊 HERRAMIENTA: Analytics y reportes en tiempo real
      new MCPTool({
        name: "generateAnalyticsReport",
        description: "Generate real-time analytics and insights reports",
        parameters: {
          type: "object",
          properties: {
            reportType: {
              type: "string",
              enum: ["expense_analysis", "travel_patterns", "cost_optimization", "compliance_check"],
              description: "Type of report to generate",
            },
            timeframe: {
              type: "string",
              enum: ["week", "month", "quarter", "year"],
              description: "Time period for analysis",
              default: "month",
            },
            userId: { type: "string", description: "User ID for personalized reports" },
            companyId: { type: "string", description: "Company ID for company-wide reports" },
          },
          required: ["reportType"],
        },
        handler: async (params: {
          reportType: string
          timeframe?: string
          userId?: string
          companyId?: string
        }) => {
          console.log("📊 Generating analytics report:", params)

          const report = await this.generateReport(params)

          return {
            action: "report_generated",
            report,
            insights: report.insights,
            recommendations: report.recommendations,
            message: `📊 Reporte generado: ${params.reportType}`,
          }
        },
      }),
    ]
  }

  private initializeResources(): MCPResource[] {
    return [
      // Recurso: Base de datos de políticas de viaje
      new MCPResource({
        name: "travel_policies",
        description: "Corporate travel policies and compliance rules",
        content: `# Políticas de Viaje Corporativo Suitpax

## Políticas de Vuelos
- Clase económica para vuelos < 6 horas
- Clase business para vuelos > 6 horas
- Reserva mínima 14 días antes
- Aerolíneas preferidas: Iberia, British Airways, Lufthansa

## Políticas de Hoteles
- Máximo €300/noche en ciudades principales
- Máximo €200/noche en otras ciudades
- Cadenas preferidas: Marriott, Hilton, NH Collection

## Políticas de Gastos
- Comidas: €75/día (nacional), €100/día (internacional)
- Transporte: Preferir transporte público
- Entretenimiento: Requiere pre-aprobación

## Flujos de Aprobación
- < €500: Aprobación automática
- €500-€2000: Aprobación de manager
- > €2000: Aprobación de director`,
      }),

      // Recurso: Templates de email inteligentes
      new MCPResource({
        name: "email_templates",
        description: "Smart email templates with dynamic content",
        content: `# Templates de Email Inteligentes

## Solicitud de Aprobación de Viaje
Asunto: Solicitud de Viaje: {destination} - {dates}
Cuerpo:
Estimado/a {manager_name},

Solicito aprobación para viaje de negocios:
- Destino: {destination}
- Fechas: {start_date} - {end_date}
- Propósito: {purpose}
- Costo estimado: €{estimated_cost}

Detalles del itinerario:
{itinerary_details}

Saludos,
{user_name}

## Confirmación de Itinerario
Asunto: Itinerario Confirmado - {destination}
Cuerpo:
Tu viaje a {destination} está confirmado:

VUELOS:
{flight_details}

HOTEL:
{hotel_details}

IMPORTANTE:
- Check-in online 24h antes
- Llega al aeropuerto 2h antes
- Documentación requerida: {documents}

¡Buen viaje!
Equipo Suitpax`,
      }),

      // Recurso: Base de conocimiento de destinos
      new MCPResource({
        name: "destination_intelligence",
        description: "Comprehensive destination information and business insights",
        content: `# Inteligencia de Destinos

## Madrid
- Aeropuerto: MAD (Barajas)
- Distrito de negocios: Azca, Cuatro Torres
- Hoteles recomendados: NH Collection Eurobuilding, Marriott Auditorium
- Transporte: Metro, taxi, Uber
- Clima: Continental, veranos calurosos
- Moneda: EUR
- Idioma: Español
- Zona horaria: CET (UTC+1)

## Londres
- Aeropuerto: LHR (Heathrow), LGW (Gatwick)
- Distrito de negocios: City, Canary Wharf
- Hoteles recomendados: Marriott County Hall, Hilton London Tower Bridge
- Transporte: Underground, taxi, Uber
- Clima: Oceánico, lluvia frecuente
- Moneda: GBP
- Idioma: Inglés
- Zona horaria: GMT (UTC+0)

## París
- Aeropuerto: CDG (Charles de Gaulle), ORY (Orly)
- Distrito de negocios: La Défense, Opéra
- Hoteles recomendados: Marriott Champs-Élysées, Hilton Arc de Triomphe
- Transporte: Métro, taxi, Uber
- Clima: Oceánico, inviernos suaves
- Moneda: EUR
- Idioma: Francés
- Zona horaria: CET (UTC+1)`,
      }),
    ]
  }

  private registerToolsAndResources(): void {
    // Registrar todas las herramientas
    this.tools.forEach((tool) => {
      this.server.registerTool(tool)
    })

    // Registrar todos los recursos
    this.resources.forEach((resource) => {
      this.server.registerResource(resource)
    })
  }

  // Métodos de implementación de las herramientas

  private async searchFlights(params: FlightSearchParams) {
    // Simular búsqueda real de vuelos
    return [
      {
        id: generateId(),
        airline: "Iberia",
        flightNumber: "IB3201",
        origin: params.origin,
        destination: params.destination,
        departureTime: "2024-02-15T08:30:00Z",
        arrivalTime: "2024-02-15T10:45:00Z",
        duration: "2h 15m",
        stops: 0,
        price: 245,
        cabinClass: params.cabinClass || "economy",
        available: true,
      },
      {
        id: generateId(),
        airline: "British Airways",
        flightNumber: "BA461",
        origin: params.origin,
        destination: params.destination,
        departureTime: "2024-02-15T14:20:00Z",
        arrivalTime: "2024-02-15T16:35:00Z",
        duration: "2h 15m",
        stops: 0,
        price: 289,
        cabinClass: params.cabinClass || "economy",
        available: true,
      },
    ]
  }

  private async bookFlight(flight: any) {
    return {
      bookingId: generateId(),
      confirmationCode: "ABC123",
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      status: "confirmed",
      bookedAt: new Date().toISOString(),
    }
  }

  private async searchHotels(params: HotelSearchParams) {
    return [
      {
        id: generateId(),
        name: "NH Collection Madrid Eurobuilding",
        chain: "NH Collection",
        address: "Calle de Padre Damián 23, Madrid",
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        price: 185,
        starRating: 4,
        amenities: ["WiFi", "Gym", "Business Center", "Restaurant"],
        available: true,
      },
      {
        id: generateId(),
        name: "Marriott Madrid Auditorium",
        chain: "Marriott",
        address: "Avenida de Aragón 400, Madrid",
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        price: 220,
        starRating: 4.5,
        amenities: ["WiFi", "Pool", "Gym", "Spa", "Business Center"],
        available: true,
      },
    ]
  }

  private async bookHotel(hotel: any) {
    return {
      bookingId: generateId(),
      confirmationCode: "HTL456",
      name: hotel.name,
      status: "confirmed",
      bookedAt: new Date().toISOString(),
    }
  }

  private async processReceiptOCR(receiptImage: string) {
    // Simular OCR processing
    return {
      amount: 45.67,
      currency: "EUR",
      date: "2024-02-14",
      merchant: "Restaurant El Cid",
      category: "meals",
      items: ["Menú ejecutivo", "Agua mineral", "Café"],
    }
  }

  private async categorizeExpense(expenseData: any, categoryOverride?: string) {
    return {
      ...expenseData,
      category: categoryOverride || expenseData.category,
      subcategory: "business_meal",
      taxDeductible: true,
      policyCompliant: true,
    }
  }

  private async submitExpense(expense: any, userId: string) {
    return {
      submissionId: generateId(),
      status: "pending_approval",
      submittedAt: new Date().toISOString(),
      approver: "manager@company.com",
    }
  }

  private async generateSmartEmail(params: EmailParams & { travelContext?: any }) {
    return {
      id: generateId(),
      to: params.to,
      subject: params.subject,
      body: params.body,
      template: params.template,
      generatedAt: new Date().toISOString(),
    }
  }

  private async sendEmail(email: any) {
    return {
      messageId: generateId(),
      status: "sent",
      sentAt: new Date().toISOString(),
    }
  }

  private async createCalendarEvent(params: CalendarEventParams) {
    return {
      eventId: generateId(),
      title: params.title,
      startTime: params.startTime,
      endTime: params.endTime,
      status: "created",
    }
  }

  private async updateCalendarEvent(params: any) {
    return { eventId: "existing-id", status: "updated" }
  }

  private async deleteCalendarEvent(params: any) {
    return { eventId: "existing-id", status: "deleted" }
  }

  private async findAvailableSlots(params: any) {
    return {
      slots: [
        { start: "2024-02-15T09:00:00Z", end: "2024-02-15T10:00:00Z" },
        { start: "2024-02-15T14:00:00Z", end: "2024-02-15T15:00:00Z" },
      ],
    }
  }

  private async executeWorkflow(params: any) {
    return {
      workflowId: generateId(),
      type: params.workflowType,
      status: "completed",
      steps: [
        { step: "search_flights", status: "completed", result: "3 flights found" },
        { step: "book_flight", status: "completed", result: "Flight booked" },
        { step: "search_hotels", status: "completed", result: "2 hotels found" },
        { step: "book_hotel", status: "completed", result: "Hotel booked" },
        { step: "create_calendar", status: "completed", result: "Calendar updated" },
        { step: "send_notifications", status: "completed", result: "Emails sent" },
      ],
      completedAt: new Date().toISOString(),
    }
  }

  private async generateReport(params: any) {
    return {
      reportId: generateId(),
      type: params.reportType,
      timeframe: params.timeframe,
      data: {
        totalExpenses: 15680,
        tripCount: 12,
        averageCost: 1306,
        topDestinations: ["Madrid", "Londres", "París"],
      },
      insights: [
        "Gastos 15% por debajo del presupuesto",
        "Ahorro de €2,340 usando tarifas corporativas",
        "98% cumplimiento de políticas",
      ],
      recommendations: [
        "Reservar vuelos con 21+ días de antelación",
        "Considerar tarifas corporativas en Hilton para Londres",
        "Consolidar proveedores de alquiler de coches",
      ],
      generatedAt: new Date().toISOString(),
    }
  }

  // Métodos públicos para iniciar/detener el servidor
  public async start(port = 3100): Promise<void> {
    try {
      await this.server.listen(port)
      console.log(`🚀 Suitpax MCP Server running on port ${port}`)
    } catch (error) {
      console.error("❌ Failed to start MCP server:", error)
      throw error
    }
  }

  public async stop(): Promise<void> {
    try {
      await this.server.close()
      console.log("🛑 Suitpax MCP Server stopped")
    } catch (error) {
      console.error("❌ Failed to stop MCP server:", error)
      throw error
    }
  }

  // Método para ejecutar herramientas directamente
  public async executeTool(toolName: string, params: any): Promise<ToolResult> {
    return await this.server.executeTool(toolName, params)
  }
}

// Exportar instancia singleton
export const suitpaxMCPServer = new SuitpaxMCPServer()
