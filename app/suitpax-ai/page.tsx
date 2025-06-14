"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Send,
  Sparkles,
  Plane,
  Building2,
  CreditCard,
  FileText,
  TrendingUp,
  MapPin,
  Mic,
  Paperclip,
  Copy,
  ThumbsUp,
  Menu,
  X,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
      icon: CreditCard,
      title: "Expense Help",
      query: "How do I submit my travel receipts for reimbursement?",
    },
    {
      icon: FileText,
      title: "Travel Policy",
      query: "What are the booking limits for my role level?",
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      query: "Show me my travel spending analysis for this quarter",
    },
    {
      icon: MapPin,
      title: "Destinations",
      query: "What are the most popular business travel destinations?",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white/80" />
                </div>
                <div>
                  <h1 className="text-xl font-light text-white tracking-tight">Suitpax AI</h1>
                  <p className="text-xs text-white/60 font-light">Your Business Travel Assistant</p>
                </div>
              </div>
            </div>

            {/* Agent Selector - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowAgentSelector(!showAgentSelector)}
                  className="flex items-center space-x-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={selectedAgent.avatar || "/placeholder.svg"}
                        alt={selectedAgent.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(selectedAgent.status)} rounded-full border-2 border-black`}
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-light text-white">{selectedAgent.name}</p>
                    <p className="text-xs text-white/60 font-light">{selectedAgent.specialty}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white/60" />
                </button>

                {showAgentSelector && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-black/95 border border-white/10 rounded-lg shadow-xl backdrop-blur-sm z-50">
                    <div className="p-4">
                      <h3 className="text-sm font-light text-white mb-3">Choose Your AI Assistant</h3>
                      <div className="space-y-2">
                        {aiAgents.map((agent) => (
                          <button
                            key={agent.id}
                            onClick={() => {
                              setSelectedAgent(agent)
                              setShowAgentSelector(false)
                            }}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                              selectedAgent.id === agent.id
                                ? "bg-white/10 border border-white/20"
                                : "hover:bg-white/5 border border-transparent"
                            }`}
                          >
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                  src={agent.avatar || "/placeholder.svg"}
                                  alt={agent.name}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div
                                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(agent.status)} rounded-full border-2 border-black`}
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-light text-white">{agent.name}</p>
                              <p className="text-xs text-white/60 font-light">{agent.specialty}</p>
                              <p className="text-xs text-white/50 font-light mt-1">{agent.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Agent Selector */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-white/10 backdrop-blur-sm">
          <div className="p-4 space-y-2">
            {aiAgents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => {
                  setSelectedAgent(agent)
                  setIsMobileMenuOpen(false)
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  selectedAgent.id === agent.id
                    ? "bg-white/10 border border-white/20"
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={agent.avatar || "/placeholder.svg"}
                      alt={agent.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(agent.status)} rounded-full border-2 border-black`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-light text-white">{agent.name}</p>
                  <p className="text-xs text-white/60 font-light">{agent.specialty}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Welcome Section */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <Image
                      src={selectedAgent.avatar || "/placeholder.svg"}
                      alt={selectedAgent.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(selectedAgent.status)} rounded-full border-4 border-black`}
                  />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-serif text-white">Hey, try ask anything</p>
                </div>
              </div>
              <h2 className="text-3xl font-light text-white tracking-tight">Meet {selectedAgent.name}</h2>
              <p className="text-white/70 text-lg font-light max-w-2xl">
                {selectedAgent.description}. I'm here to help you with all your business travel needs.
              </p>
            </div>

            {/* Quick Suggestions */}
            <div className="w-full max-w-4xl">
              <h3 className="text-lg font-light text-white mb-4 text-center">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickSuggestions.map((suggestion, index) => (
                  <Card
                    key={index}
                    className="bg-white/5 border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300 hover:bg-white/10 group"
                    onClick={() => handleSubmit(suggestion.query)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <suggestion.icon className="h-5 w-5 text-white/70" />
                        </div>
                        <div>
                          <h4 className="font-light text-white text-sm">{suggestion.title}</h4>
                          <p className="text-white/60 text-xs font-light mt-1 line-clamp-2">{suggestion.query}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-3xl ${message.role === "user" ? "order-2" : "order-1"}`}>
                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          src={selectedAgent.avatar || "/placeholder.svg"}
                          alt={selectedAgent.name}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-light text-white/70">{selectedAgent.name}</span>
                      <span className="text-xs text-white/50 font-light">{message.timestamp}</span>
                    </div>
                  )}

                  <div
                    className={`rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-white/10 text-white border border-white/20 rounded-tr-none"
                        : "bg-white/5 text-white border border-white/10 rounded-tl-none"
                    }`}
                  >
                    {message.isThinking ? (
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                        <span className="text-white/70 text-sm font-light">Thinking...</span>
                      </div>
                    ) : (
                      <>
                        <div className="prose prose-invert max-w-none">
                          <div className="whitespace-pre-wrap font-light text-white/90">{message.content}</div>
                        </div>

                        {message.sources && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <h4 className="text-sm font-light text-white/80 mb-2">Sources</h4>
                            <div className="flex flex-wrap gap-2">
                              {message.sources.map((source, index) => (
                                <Badge
                                  key={index}
                                  className="bg-white/10 text-white/70 hover:bg-white/20 cursor-pointer text-xs px-2 py-1 rounded-full border border-white/20"
                                >
                                  {source.title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {message.suggestions && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <h4 className="text-sm font-light text-white/80 mb-2">Suggested follow-ups</h4>
                            <div className="space-y-2">
                              {message.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSubmit(suggestion)}
                                  className="block w-full text-left p-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded border border-white/10 hover:border-white/20 transition-all duration-300 font-light"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {message.role === "assistant" && (
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-white/50 hover:text-white/70 transition-colors">
                                <Copy className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-white/50 hover:text-white/70 transition-colors">
                                <ThumbsUp className="h-4 w-4" />
                              </button>
                            </div>
                            <span className="text-xs text-white/50 font-light">{message.timestamp}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-white/50 font-light">{message.timestamp}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Section */}
        <div className="border-t border-white/10 bg-black/95 backdrop-blur-sm p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(inputValue)
            }}
            className="flex items-end space-x-4"
          >
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Ask ${selectedAgent.name} anything about ${selectedAgent.specialty.toLowerCase()}...`}
                className="min-h-[48px] pl-4 pr-20 py-3 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-lg resize-none focus:ring-2 focus:ring-white/20 focus:border-white/20 font-light"
                disabled={isLoading}
              />
              <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                <button
                  type="button"
                  className="p-1.5 text-white/50 hover:text-white/70 transition-colors"
                  disabled={isLoading}
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 text-white/50 hover:text-white/70 transition-colors"
                  disabled={isLoading}
                >
                  <Mic className="h-4 w-4" />
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="h-12 px-6 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-light"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
          <p className="text-xs text-white/50 mt-3 text-center font-light">
            Suitpax AI can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </div>
  )
}
