// Tipos para los agentes de IA
export interface AIAgent {
  id: string
  name: string
  description: string
  type: "flight" | "hotel" | "transport" | "expense" | "itinerary" | "general"
  avatar: string
  status: "active" | "inactive"
  tokensUsed: number
  lastUsed: string
  capabilities: string[]
  contextWindow: number
  model: string
  temperature: number
  systemPrompt: string
  knowledgeCutoff: string
}

// Tipos para las conversaciones
export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  agentId: string
}

export interface Conversation {
  id: string
  title: string
  agentId: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

// Datos de ejemplo para los agentes
export const defaultAgents: AIAgent[] = [
  {
    id: "1",
    name: "FlightFinder Pro",
    description: "Specialized in finding the best flight deals and optimizing travel routes.",
    type: "flight",
    avatar: "/images/ai-agent-avatar.jpeg",
    status: "active",
    tokensUsed: 12450,
    lastUsed: new Date().toISOString(),
    capabilities: [
      "Flight search and comparison",
      "Price tracking and alerts",
      "Route optimization",
      "Airline policy information",
      "Airport information",
    ],
    contextWindow: 16000,
    model: "gpt-4",
    temperature: 0.7,
    systemPrompt:
      "You are FlightFinder Pro, an AI assistant specialized in finding and booking flights. You help users find the best flight deals, compare options, and understand airline policies. Always prioritize the user's preferences for price, time, comfort, and airline loyalty programs.",
    knowledgeCutoff: "April 2023",
  },
  {
    id: "2",
    name: "HotelHunter",
    description: "Finds accommodations that match your preferences and budget constraints.",
    type: "hotel",
    avatar: "/images/hotel-agent-avatar.png",
    status: "active",
    tokensUsed: 8320,
    lastUsed: new Date().toISOString(),
    capabilities: [
      "Hotel search and comparison",
      "Amenity filtering",
      "Location analysis",
      "Price negotiation tips",
      "Loyalty program optimization",
    ],
    contextWindow: 16000,
    model: "gpt-4",
    temperature: 0.7,
    systemPrompt:
      "You are HotelHunter, an AI assistant specialized in finding and booking accommodations. You help users find hotels, apartments, and other lodging that match their preferences for location, price, amenities, and loyalty programs. Prioritize value and user satisfaction in your recommendations.",
    knowledgeCutoff: "April 2023",
  },
  {
    id: "3",
    name: "TransportTracker",
    description: "Manages ground transportation options and provides real-time updates.",
    type: "transport",
    avatar: "/images/transport-agent-avatar.png",
    status: "inactive",
    tokensUsed: 5670,
    lastUsed: new Date().toISOString(),
    capabilities: [
      "Ground transportation options",
      "Ride service comparison",
      "Public transit navigation",
      "Car rental assistance",
      "Transportation policy compliance",
    ],
    contextWindow: 8000,
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    systemPrompt:
      "You are TransportTracker, an AI assistant specialized in ground transportation. You help users navigate transportation options including taxis, ride-sharing services, public transit, and car rentals. Focus on efficiency, cost-effectiveness, and compliance with company transportation policies.",
    knowledgeCutoff: "April 2023",
  },
  {
    id: "4",
    name: "ExpenseExpert",
    description: "Helps categorize and optimize travel expenses for better budget management.",
    type: "expense",
    avatar: "/images/expense-agent-avatar.png",
    status: "active",
    tokensUsed: 7890,
    lastUsed: new Date().toISOString(),
    capabilities: [
      "Expense categorization",
      "Receipt analysis",
      "Policy compliance checking",
      "Budget optimization",
      "Reimbursement assistance",
    ],
    contextWindow: 8000,
    model: "gpt-3.5-turbo",
    temperature: 0.3,
    systemPrompt:
      "You are ExpenseExpert, an AI assistant specialized in managing travel expenses. You help users categorize expenses, ensure compliance with company policies, optimize budgets, and navigate the reimbursement process. Be precise and thorough in your assistance.",
    knowledgeCutoff: "April 2023",
  },
  {
    id: "5",
    name: "ItineraryIQ",
    description: "Creates optimized travel itineraries based on your preferences and constraints.",
    type: "itinerary",
    avatar: "/images/itinerary-agent-avatar.png",
    status: "active",
    tokensUsed: 15780,
    lastUsed: new Date().toISOString(),
    capabilities: [
      "Itinerary creation and optimization",
      "Schedule management",
      "Meeting coordination",
      "Local recommendations",
      "Travel time estimation",
    ],
    contextWindow: 16000,
    model: "gpt-4",
    temperature: 0.8,
    systemPrompt:
      "You are ItineraryIQ, an AI assistant specialized in creating and managing travel itineraries. You help users plan efficient business trips, balancing meetings, travel time, and personal preferences. Consider factors like jet lag, local customs, and business priorities in your recommendations.",
    knowledgeCutoff: "April 2023",
  },
]

// Datos de ejemplo para las conversaciones
export const sampleConversations: Conversation[] = [
  {
    id: "conv1",
    title: "Flight to New York next week",
    agentId: "1",
    messages: [
      {
        id: "msg1",
        role: "user",
        content: "I need to find a flight from San Francisco to New York next Tuesday, returning Friday.",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        agentId: "1",
      },
      {
        id: "msg2",
        role: "assistant",
        content:
          "I'll help you find flights from San Francisco to New York for next Tuesday with a return on Friday. Do you have any preferences for departure times or airlines?",
        timestamp: new Date(Date.now() - 86390000).toISOString(),
        agentId: "1",
      },
      {
        id: "msg3",
        role: "user",
        content: "I prefer morning departures and I have status with United Airlines.",
        timestamp: new Date(Date.now() - 86380000).toISOString(),
        agentId: "1",
      },
      {
        id: "msg4",
        role: "assistant",
        content:
          "Great! Looking at United Airlines morning flights for next Tuesday (June 4) from SFO to NYC:\n\n**Outbound Options:**\n- UA336: SFO 7:00 AM → JFK 3:30 PM (nonstop, 6h30m)\n- UA2104: SFO 8:15 AM → EWR 4:45 PM (nonstop, 6h30m)\n\n**Return Options for Friday (June 7):**\n- UA1404: JFK 8:30 AM → SFO 12:10 PM (nonstop, 6h40m)\n- UA275: EWR 9:00 AM → SFO 12:25 PM (nonstop, 6h25m)\n\nThe current best fare I'm seeing is approximately $650 round trip in Economy or $1,450 in Economy Plus. Would you like me to provide more details on any of these options?",
        timestamp: new Date(Date.now() - 86370000).toISOString(),
        agentId: "1",
      },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86370000).toISOString(),
  },
  {
    id: "conv2",
    title: "Hotel in Chicago downtown",
    agentId: "2",
    messages: [
      {
        id: "msg5",
        role: "user",
        content: "I need a hotel in downtown Chicago for next month, July 15-18.",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        agentId: "2",
      },
      {
        id: "msg6",
        role: "assistant",
        content:
          "I'll help you find a hotel in downtown Chicago for July 15-18. Do you have any specific requirements or preferences regarding budget, amenities, or hotel chains?",
        timestamp: new Date(Date.now() - 172790000).toISOString(),
        agentId: "2",
      },
      {
        id: "msg7",
        role: "user",
        content: "I'd like something under $300 per night with a gym. I have Marriott Bonvoy status if that helps.",
        timestamp: new Date(Date.now() - 172780000).toISOString(),
        agentId: "2",
      },
      {
        id: "msg8",
        role: "assistant",
        content:
          "Great! With your Marriott Bonvoy status, I've found several excellent options in downtown Chicago for July 15-18:\n\n1. **Chicago Marriott Downtown Magnificent Mile**\n   - Rate: $289/night\n   - Location: 540 North Michigan Avenue (heart of downtown)\n   - Amenities: 24/7 fitness center, on-site dining, business center\n   - Bonvoy benefits: Room upgrade (subject to availability), late checkout, points\n\n2. **AC Hotel Chicago Downtown**\n   - Rate: $249/night\n   - Location: 630 North Rush Street (near Magnificent Mile)\n   - Amenities: Modern fitness center, AC Kitchen for breakfast\n   - Bonvoy benefits: Apply as above\n\n3. **Aloft Chicago Downtown River North**\n   - Rate: $229/night\n   - Location: 515 North Clark Street (trendy River North area)\n   - Amenities: 24/7 gym, WXYZ bar, grab-and-go options\n   - Bonvoy benefits: Apply as above\n\nAll options are within your budget and include fitness facilities. Would you like more details about any of these properties?",
        timestamp: new Date(Date.now() - 172770000).toISOString(),
        agentId: "2",
      },
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172770000).toISOString(),
  },
]

// Funciones para manejar los agentes
export const getAgents = (): AIAgent[] => {
  // En una implementación real, esto podría obtener datos de una API o base de datos
  return defaultAgents
}

export const getAgentById = (id: string): AIAgent | undefined => {
  return defaultAgents.find((agent) => agent.id === id)
}

export const getConversations = (agentId?: string): Conversation[] => {
  if (agentId) {
    return sampleConversations.filter((conv) => conv.agentId === agentId)
  }
  return sampleConversations
}

export const getConversationById = (id: string): Conversation | undefined => {
  return sampleConversations.find((conv) => conv.id === id)
}

// Simulación de respuesta de IA
export const generateAIResponse = async (
  agentId: string,
  message: string,
  conversationId?: string,
): Promise<string> => {
  // En una implementación real, esto llamaría a una API de IA como OpenAI
  const agent = getAgentById(agentId)

  // Simular tiempo de respuesta
  await new Promise((resolve) => setTimeout(resolve, 1500))

  if (!agent) {
    return "I'm sorry, but I couldn't process your request. Please try again later."
  }

  // Respuestas simuladas basadas en el tipo de agente
  switch (agent.type) {
    case "flight":
      return `I can help you find flights based on your request: "${message}". Would you like me to search for specific dates, destinations, or airlines?`
    case "hotel":
      return `I can help you find accommodations based on your request: "${message}". Would you like me to search for specific locations, dates, or amenities?`
    case "transport":
      return `I can help you with transportation options based on your request: "${message}". Would you like information on taxis, ride-sharing, public transit, or car rentals?`
    case "expense":
      return `I can help you manage expenses related to: "${message}". Would you like assistance with categorization, policy compliance, or reimbursement procedures?`
    case "itinerary":
      return `I can help you plan your itinerary based on: "${message}". Would you like me to create a schedule, optimize your meetings, or suggest local recommendations?`
    default:
      return `I'm here to assist with your travel needs regarding: "${message}". How can I help you further?`
  }
}

// Funciones para manejar las conversaciones
export const createConversation = (agentId: string, initialMessage: string): Conversation => {
  const agent = getAgentById(agentId)
  if (!agent) {
    throw new Error("Agent not found")
  }

  // En una implementación real, esto crearía una nueva conversación en la base de datos
  const newConversation: Conversation = {
    id: `conv-${Date.now()}`,
    title: initialMessage.length > 30 ? `${initialMessage.substring(0, 30)}...` : initialMessage,
    agentId,
    messages: [
      {
        id: `msg-${Date.now()}`,
        role: "user",
        content: initialMessage,
        timestamp: new Date().toISOString(),
        agentId,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Simular añadir a la lista de conversaciones
  // sampleConversations.push(newConversation);

  return newConversation
}

export const addMessageToConversation = (
  conversationId: string,
  message: Omit<Message, "id" | "timestamp">,
): Conversation | undefined => {
  const conversation = getConversationById(conversationId)
  if (!conversation) {
    return undefined
  }

  // En una implementación real, esto añadiría un mensaje a una conversación existente
  const newMessage: Message = {
    ...message,
    id: `msg-${Date.now()}`,
    timestamp: new Date().toISOString(),
  }

  conversation.messages.push(newMessage)
  conversation.updatedAt = new Date().toISOString()

  return conversation
}
