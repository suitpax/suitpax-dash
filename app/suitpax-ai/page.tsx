"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Plane, Building2, ArrowUpIcon } from "lucide-react"

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
      icon: Building2,
      title: "Book Hotels",
      query: "Show me hotels in Barcelona for a 3-night business trip",
    },
  ]

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Suitpax AI</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Your intelligent business travel companion powered by advanced AI
          </p>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Agent Selection Sidebar */}
          <div className="md:w-1/4 p-4">
            <div className="bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-2">Select an Agent</h2>
              <ul>
                {aiAgents.map((agent) => (
                  <li
                    key={agent.id}
                    className={`flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-gray-700 cursor-pointer ${
                      selectedAgent.id === agent.id ? "bg-gray-700" : ""
                    }`}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <img src={agent.avatar || "/placeholder.svg"} alt={agent.name} className="w-8 h-8 rounded-full" />
                    <span>{agent.name}</span>
                    {agent.status === "online" && <span className="ml-auto text-green-500">Online</span>}
                    {agent.status === "busy" && <span className="ml-auto text-yellow-500">Busy</span>}
                    {agent.status === "offline" && <span className="ml-auto text-gray-500">Offline</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="md:w-3/4 p-4">
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              {/* Chat Messages */}
              <div className="mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-3 p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-700 text-white ml-auto w-fit max-w-2/3"
                        : "bg-gray-700 mr-auto w-fit max-w-2/3"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-semibold">
                        {message.role === "user" ? "You" : selectedAgent.name}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">{message.timestamp}</span>
                    </div>
                    <p className="text-base whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    {message.isThinking && (
                      <div className="flex items-center">
                        <div className="spinner mr-2"></div>
                        <span className="text-sm text-gray-400">Thinking...</span>
                      </div>
                    )}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-semibold mb-1">Sources:</h4>
                        <ul>
                          {message.sources.map((source, index) => (
                            <li key={index} className="text-sm">
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {source.title} ({source.type})
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-semibold mb-1">Suggestions:</h4>
                        <div className="flex flex-wrap">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2"
                              onClick={() => handleSubmit(suggestion)}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Form */}
              <ChatForm
                onSubmit={handleSubmit}
                inputValue={inputValue}
                setInputValue={setInputValue}
                isLoading={isLoading}
              />

              {/* Quick Suggestions */}
              <div>
                <div className="text-lg font-medium text-white mb-3">Quick Actions</div>
                <div className="flex space-x-4">
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded flex items-center space-x-2"
                      onClick={() => handleSubmit(suggestion.query)}
                    >
                      <suggestion.icon className="h-5 w-5" />
                      <span>{suggestion.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type ChatFormProps = {
  onSubmit: (message: string) => void
  inputValue: string
  setInputValue: (value: string) => void
  isLoading: boolean
}

const ChatForm: React.FC<ChatFormProps> = ({ onSubmit, inputValue, setInputValue, isLoading }) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit(inputValue)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-grow bg-gray-700 text-white rounded-l-md py-2 px-4 focus:outline-none"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none disabled:opacity-50"
        disabled={isLoading}
      >
        <ArrowUpIcon className="h-4 w-4" />
      </button>
    </form>
  )
}
