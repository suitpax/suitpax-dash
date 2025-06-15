import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

// Allowed domains for AI learning and context
const ALLOWED_DOMAINS = [
  "suitpax.com",
  "duffel.com",
  "booking.com",
  "expedia.com",
  "amadeus.com",
  "sabre.com",
  "travelport.com",
  "skyscanner.com",
  "kayak.com",
  "tripadvisor.com",
  "airbnb.com",
  "hotels.com",
  "marriott.com",
  "hilton.com",
  "hyatt.com",
  "accor.com",
  "lufthansa.com",
  "emirates.com",
  "delta.com",
  "united.com",
  "americanexpress.com",
  "visa.com",
  "mastercard.com",
  "concur.com",
  "expensify.com",
  "navan.com",
  "tripactions.com",
  "egencia.com",
  "cwt.com",
  "bcd.com",
  "fcm.travel",
  "iata.org",
  "unwto.org",
  "wttc.org",
  "gbta.org",
  "acte.org",
  "sustainability.com",
  "carbonfund.org",
  "myclimate.org",
  "goldstandard.org",
  "verra.org",
  "cdp.net",
  "sustainabletravel.org",
  "responsibletravel.com",
  "greenkey.global",
  "travelife.info",
  "rainforest-alliance.org",
]

// Enhanced system prompt for Suitpax AI
const SUITPAX_SYSTEM_PROMPT = `You are Suitpax AI, the intelligent travel assistant for Suitpax platform.

CORE IDENTITY:
- You're a knowledgeable, friendly AI that helps with business travel
- You're part of the Suitpax ecosystem - a modern travel management platform
- You have access to real travel data through integrated APIs
- You provide accurate, helpful responses based on actual data

CAPABILITIES & INTEGRATIONS:
- Flight search and booking via Duffel API
- Hotel reservations through integrated systems  
- Expense tracking and management
- Travel policy compliance
- Real-time travel insights
- Currency conversions
- Weather and destination information
- Sustainability metrics

RESPONSE GUIDELINES:
- Be conversational but professional
- Keep responses concise (2-3 sentences unless detail is requested)
- When users ask about flights, hotels, or bookings, explain you'll search real data
- Don't provide fake prices, dates, or availability
- If you need to search for travel options, mention you're checking current data
- Ask clarifying questions when needed (dates, preferences, etc.)

FLIGHT SEARCH PROTOCOL:
When users request flight searches:
1. Ask for missing details (origin, destination, dates, passengers)
2. Explain you're searching real-time data via Duffel
3. Don't invent flight prices or schedules
4. Suggest using the flights page for detailed search

HOTEL SEARCH PROTOCOL:
When users request hotel searches:
1. Ask for location, dates, and preferences
2. Mention you're checking current availability
3. Don't provide fake hotel prices or availability
4. Direct to hotels page for booking

PERSONALITY:
- Helpful and efficient
- Curious about travel preferences
- Focused on providing real value
- Professional but approachable

Remember: Always use real data from our integrated systems. Never invent prices, schedules, or availability.`

// Helper function to detect flight search requests
function isFlightSearchRequest(message: string): boolean {
  const flightKeywords = [
    "flight",
    "flights",
    "fly",
    "book flight",
    "search flight",
    "plane",
    "airline",
    "airport",
    "departure",
    "arrival",
  ]
  const searchKeywords = ["search", "find", "book", "reserve", "look for"]

  const hasFlightKeyword = flightKeywords.some((keyword) => message.toLowerCase().includes(keyword))
  const hasSearchKeyword = searchKeywords.some((keyword) => message.toLowerCase().includes(keyword))

  return hasFlightKeyword && hasSearchKeyword
}

// Helper function to detect hotel search requests
function isHotelSearchRequest(message: string): boolean {
  const hotelKeywords = ["hotel", "hotels", "accommodation", "stay", "room", "booking"]
  const searchKeywords = ["search", "find", "book", "reserve", "look for"]

  const hasHotelKeyword = hotelKeywords.some((keyword) => message.toLowerCase().includes(keyword))
  const hasSearchKeyword = searchKeywords.some((keyword) => message.toLowerCase().includes(keyword))

  return hasHotelKeyword && hasSearchKeyword
}

// Helper function to search flights via Duffel API
async function searchFlights(query: string) {
  try {
    // Extract basic info from query (this is simplified - in production you'd use NLP)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/flights/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        // Add extracted parameters here
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error("Flight search error:", error)
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, userProfile, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    let enhancedPrompt = message
    let searchResults = null

    // Check if this is a flight search request
    if (isFlightSearchRequest(message)) {
      searchResults = await searchFlights(message)
      if (searchResults) {
        enhancedPrompt = `User is asking about flights: "${message}". 
        I have access to real flight data. Here's what I found: ${JSON.stringify(searchResults)}.
        Provide a helpful response based on this real data.`
      } else {
        enhancedPrompt = `User is asking about flights: "${message}". 
        I should search for real flight data but need more details like origin, destination, and dates.
        Ask for the missing information so I can search properly.`
      }
    }

    // Check if this is a hotel search request
    if (isHotelSearchRequest(message)) {
      enhancedPrompt = `User is asking about hotels: "${message}". 
      I need to search real hotel data. Ask for specific location, dates, and preferences 
      so I can provide accurate availability and pricing.`
    }

    // Add user context if available
    if (userProfile && userProfile.name) {
      enhancedPrompt = `User ${userProfile.name} asks: ${enhancedPrompt}`
    }

    // Add conversation context for better responses
    const conversationContext =
      conversationHistory && conversationHistory.length > 0
        ? `Previous conversation context: ${conversationHistory
            .slice(-3)
            .map((msg: any) => `${msg.role}: ${msg.content}`)
            .join("\n")}\n\n`
        : ""

    // Enhanced response generation with Haiku model
    const { text } = await generateText({
      model: anthropic("claude-3-5-haiku-20241022"),
      system: SUITPAX_SYSTEM_PROMPT,
      prompt: `${conversationContext}Current request: ${enhancedPrompt}`,
      temperature: 0.7,
      maxTokens: 512,
    })

    // Calculate tokens (rough estimation)
    const tokens = Math.ceil(text.length / 4)

    return NextResponse.json({
      response: text,
      tokens,
      conversationId,
      timestamp: new Date().toISOString(),
      model: "claude-3-5-haiku-20241022",
      searchResults: searchResults ? "included" : "none",
      allowedDomains: ALLOWED_DOMAINS.length,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: "I'm having a quick technical hiccup. Give me a moment and try again!" },
      { status: 500 },
    )
  }
}
