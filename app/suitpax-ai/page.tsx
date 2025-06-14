"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Plane, Building2 } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  isThinking?: boolean
  sources?: { title: string; url: string; type: string }[]
  suggestions?: string[]
  agentId?: string
}

type AIAgent = {
  id: string
  name: string
  avatar: string
  specialty: string
  description: string
  status: "online" | "busy" | "offline"
}

const aiAgents: AIAgent[] = [
  {
    id: "agent-1",
    name: "Alex",
    avatar: "/images/ai-agents/agent-1.jpg",
    specialty: "Flight Booking",
    description: "Expert in finding the best flight deals and managing travel itineraries",
    status: "online",
  },
  {
    id: "agent-2",
    name: "Maya",
    avatar: "/images/ai-agents/agent-2.jpg",
    specialty: "Expense Management",
    description: "Specialized in expense tracking, receipts, and financial reporting",
    status: "online",
  },
  {
    id: "agent-3",
    name: "Sophie",
    avatar: "/images/ai-agents/agent-3.jpg",
    specialty: "Hotel Booking",
    description: "Finds the perfect accommodations for your business trips",
    status: "busy",
  },
  {
    id: "agent-4",
    name: "Emma",
    avatar: "/images/ai-agents/agent-4.jpg",
    specialty: "Travel Policy",
    description: "Ensures compliance with company travel policies and guidelines",
    status: "online",
  },
  {
    id: "agent-5",
    name: "Zoe",
    avatar: "/images/ai-agents/agent-5.jpg",
    specialty: "Analytics",
    description: "Provides insights and analytics on travel spending and patterns",
    status: "offline",
  },
]

export default function SuitpaxAIPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(aiAgents[0])
  const [showAgentSelector, setShowAgentSelector] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(scrollToBottom, [messages])

  const handleSubmit = async (messageContent: string) => {
    if (!messageContent.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Add thinking indicator
    setMessages((prev) => [
      ...prev,
      {
        id: `thinking-${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: "",
        isThinking: true,
        agentId: selectedAgent.id,
      },
    ])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          agentId: selectedAgent.id,
          agentSpecialty: selectedAgent.specialty,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const mockSources = [
        { title: "Suitpax Travel Policy", url: "#", type: "Policy" },
        { title: "Corporate Guidelines", url: "#", type: "Guide" },
        { title: "Expense Rules", url: "#", type: "Documentation" },
      ]

      const mockSuggestions = [
        "What are the booking limits for my role?",
        "How do I submit receipts?",
        "Find flights to London next week",
      ]

      const aiMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response || generateMockResponse(messageContent, selectedAgent),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: mockSources,
        suggestions: mockSuggestions,
        agentId: selectedAgent.id,
      }

      setMessages((prev) => prev.filter((m) => !m.isThinking))
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        content: generateMockResponse(messageContent, selectedAgent),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        agentId: selectedAgent.id,
      }
      setMessages((prev) => prev.filter((m) => !m.isThinking))
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockResponse = (query: string, agent: AIAgent): string => {
    const responses = {
      "Flight Booking": `Hi! I'm ${agent.name}, your flight booking specialist. I can help you find the best flights for your business travel.

**Available Options:**
• Madrid to London: From €180 - Direct flights with BA, Iberia
• Best booking times: Tuesday-Thursday departures
• Corporate rates available with preferred airlines

**Booking Guidelines:**
• Economy for flights under 4 hours
• Business class for 6+ hour flights
• Book 14+ days in advance for better rates

Would you like me to search for specific dates?`,

      "Expense Management": `Hello! I'm ${agent.name}, your expense management expert. Let me help you with your travel expenses.

**Expense Process:**
• Upload receipts within 30 days
• Use Suitpax mobile app for instant capture
• Categories: Travel, Meals, Accommodation, Transport

**Approval Workflow:**
• Under €500: Auto-approved
• €500-€2000: Manager approval
• €2000+: Finance review

**Reimbursement:**
• Processing: 5-7 business days
• Direct deposit to registered account

Need help with a specific expense?`,

      "Hotel Booking": `Hi there! I'm ${agent.name}, and I specialize in finding perfect business accommodations.

**Hotel Recommendations:**
• Business District: €120-200/night
• Preferred Partners: Marriott, Hilton, NH Hotels
• Amenities: WiFi, business center, gym included

**Booking Policy:**
• Maximum €200/night standard travel
• Extended stays (7+ nights) higher limits
• Book through Suitpax for auto expense tracking

Which city are you traveling to?`,

      "Travel Policy": `Hello! I'm ${agent.name}, your travel policy compliance specialist.

**Current Policies:**
• Flight booking: 14 days advance notice preferred
• Hotel limits: €200/night standard, €300/night senior roles
• Meal allowances: €50/day domestic, €75/day international
• Ground transport: Taxi/Uber for airport transfers

**Approval Requirements:**
• Manager approval for trips over €2000
• Finance approval for international travel
• HR notification for extended trips (10+ days)

Need clarification on any specific policy?`,

      Analytics: `Hi! I'm ${agent.name}, your travel analytics specialist.

**Current Insights:**
• Average trip cost: €1,250
• Most popular destinations: London, Paris, Barcelona
• Peak booking months: March, September, November
• Cost savings opportunities: 15% with advance booking

**Available Reports:**
• Monthly spend analysis
• Department comparison
• Policy compliance rates
• Vendor performance metrics

What specific analytics would you like to see?`,
    }

    return responses[agent.specialty as keyof typeof responses] || `Hi! I'm ${agent.name}. How can I help you today?`
  }

  const quickSuggestions = [
    {
      icon: Plane,
      title: "Find Flights",
      query: "Find me flights from Madrid to London for next Tuesday",
    },
    {
      icon: Building2,
      title: "Book Hotels",
      query: "Show me hotels in Barcelona for a 3-night business trip",
    },
    {
