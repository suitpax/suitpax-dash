// Simplified agent service without MCP dependencies
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

export interface EmailDetails {
  to: string
  subject: string
  body: string
  attachments?: string[]
}

// Mock implementation for future MCP integration
export class SuitpaxAgentService {
  constructor() {
    console.log("Suitpax Agent Service initialized (Mock mode)")
  }

  async searchFlights(params: any): Promise<any> {
    // Mock flight search
    return {
      flights: [
        {
          id: "flight-1",
          airline: "Iberia",
          flightNumber: "IB3201",
          origin: params.origin || "MAD",
          destination: params.destination || "LHR",
          departureTime: "2024-03-15T08:00:00Z",
          arrivalTime: "2024-03-15T11:30:00Z",
          duration: "2h 30m",
          stops: 0,
          price: 245,
          cabinClass: params.cabinClass || "economy",
        },
      ],
    }
  }

  async searchHotels(params: any): Promise<any> {
    // Mock hotel search
    return {
      hotels: [
        {
          id: "hotel-1",
          name: "Marriott London",
          chain: "Marriott",
          address: "123 Business District, London",
          checkIn: params.checkIn,
          checkOut: params.checkOut,
          price: 180,
          starRating: 4.5,
          amenities: ["WiFi", "Gym", "Business Center", "Restaurant"],
        },
      ],
    }
  }

  async processExpense(params: any): Promise<any> {
    // Mock expense processing
    return {
      success: true,
      expenseId: "exp-" + Date.now(),
      category: "Travel",
      amount: params.amount || 0,
      status: "processed",
    }
  }

  async sendEmail(details: EmailDetails): Promise<boolean> {
    // Mock email sending
    console.log("Mock email sent:", details)
    return true
  }

  async analyzeTravelPreferences(userId: string): Promise<TravelPreferences> {
    // Mock analysis
    return {
      preferredAirlines: ["Iberia", "British Airways"],
      preferredHotels: ["Marriott", "Hilton"],
      seatPreference: "window",
      cabinClass: "economy",
      departureTimePreference: "morning",
      directFlightsOnly: true,
    }
  }

  async generateTravelReport(userId: string, startDate: string, endDate: string): Promise<any> {
    // Mock report generation
    return {
      report: {
        id: "report-" + Date.now(),
        title: `Travel Report: ${startDate} to ${endDate}`,
        summary: {
          totalTrips: 8,
          totalSpent: 12450,
          complianceRate: 96,
          potentialSavings: 1850,
        },
        recommendations: [
          "Book flights 21+ days in advance for 15% savings",
          "Consider corporate rates at preferred hotels",
          "Optimize travel routes for cost efficiency",
        ],
      },
    }
  }
}

// Export singleton instance
export const suitpaxAgentService = new SuitpaxAgentService()
