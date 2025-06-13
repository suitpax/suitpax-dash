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
  Zap,
  Menu,
  X,
  ChevronDown,
  Users,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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
      title: "Track Expenses",
      query: "How do I submit my travel receipts for reimbursement?",
    },
    {
      icon: FileText,
      title: "Travel Policy",
      query: "What are the travel booking policies for my department?",
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      query: "Show me my travel spending report for this quarter",
    },
    {
      icon: MapPin,
      title: "Destinations",
      query: "What are the most popular business travel destinations?",
    },
  ]

  const ChatMessage = ({ message }: { message: Message }) => {
    const isUser = message.role === "user"
    const agent = aiAgents.find((a) => a.id === message.agentId) || selectedAgent

    if (message.isThinking) {
      return (
        <div className="flex items-start space-x-3 sm:space-x-4 animate-fadeIn">
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden border border-white/10">
            <Image
              src={agent.avatar || "/placeholder.svg"}
              alt={agent.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
              <div className="flex items-center space-x-2 text-white/70">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-xs sm:text-sm">{agent.name} is thinking...</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        className={`flex items-start space-x-3 sm:space-x-4 animate-fadeIn ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
      >
        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden border border-white/10">
          {isUser ? (
            <div className="w-full h-full bg-white/10 flex items-center justify-center">
              <span className="text-white font-medium text-xs sm:text-sm">U</span>
            </div>
          ) : (
            <Image
              src={agent.avatar || "/placeholder.svg"}
              alt={agent.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 max-w-full sm:max-w-4xl">
          <div
            className={cn(
              "rounded-xl p-3 sm:p-4 transition-all duration-300",
              isUser ? "bg-white text-black ml-4 sm:ml-12" : "bg-white/5 border border-white/10 text-white/90",
            )}
          >
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
            </div>

            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/20">
                <h4 className="text-xs font-medium text-white/70 mb-2">Sources</h4>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {message.sources.map((source, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-white/5 border-white/20 text-white/80 hover:bg-white/10 cursor-pointer text-xs"
                    >
                      {source.type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <span className="text-xs text-white/50">{message.timestamp}</span>
              {!isUser && (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-white/50 hover:text-white hover:bg-white/10"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-white/50 hover:text-white hover:bg-white/10"
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {message.suggestions && message.suggestions.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-white/60 font-medium">Related questions:</p>
              {message.suggestions.slice(0, 2).map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSubmit(suggestion)}
                  className="block w-full text-left justify-start bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white text-xs py-2 h-auto"
                >
                  <Zap className="h-3 w-3 mr-2 text-white/60 flex-shrink-0" />
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <Image src="/images/suitpax-cloud-logo.webp" alt="Suitpax" width={24} height={24} />
          <h1 className="text-lg font-medium">Suitpax AI</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white/70 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex h-screen lg:h-auto">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col lg:border-r lg:border-white/10 lg:bg-white/5">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3 mb-6">
              <Image src="/images/suitpax-cloud-logo.webp" alt="Suitpax" width={32} height={32} />
              <div>
                <h1 className="text-xl font-medium">Suitpax AI</h1>
                <p className="text-white/60 text-sm">Business Travel Assistant</p>
              </div>
            </div>

            {/* Agent Selector */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowAgentSelector(!showAgentSelector)}
                className="w-full justify-between bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-md overflow-hidden border border-white/10">
                    <Image
                      src={selectedAgent.avatar || "/placeholder.svg"}
                      alt={selectedAgent.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{selectedAgent.name}</div>
                    <div className="text-xs text-white/60">{selectedAgent.specialty}</div>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {showAgentSelector && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-white/10 rounded-lg shadow-xl z-50">
                  {aiAgents.map((agent) => (
                    <Button
                      key={agent.id}
                      variant="ghost"
                      onClick={() => {
                        setSelectedAgent(agent)
                        setShowAgentSelector(false)
                      }}
                      className="w-full justify-start p-3 hover:bg-white/10 rounded-none first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative w-8 h-8 rounded-md overflow-hidden border border-white/10">
                          <Image
                            src={agent.avatar || "/placeholder.svg"}
                            alt={agent.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                          <div
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black",
                              agent.status === "online" && "bg-green-500",
                              agent.status === "busy" && "bg-yellow-500",
                              agent.status === "offline" && "bg-gray-500",
                            )}
                          />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-white">{agent.name}</div>
                          <div className="text-xs text-white/60">{agent.specialty}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Agents Badge */}
            <div className="mt-4">
              <Badge className="bg-white/10 text-white/80 border-white/20">
                <Users className="h-3 w-3 mr-1" />
                {aiAgents.filter((a) => a.status === "online").length} agents online
              </Badge>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-sm font-medium text-white/80 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {quickSuggestions.map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  onClick={() => handleSubmit(suggestion.query)}
                  className="w-full justify-start text-left bg-white/5 hover:bg-white/10 border border-white/10 p-3 h-auto"
                >
                  <suggestion.icon className="h-4 w-4 mr-3 text-white/60 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-white">{suggestion.title}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">AI Agents</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {aiAgents.map((agent) => (
                <Button
                  key={agent.id}
                  variant="ghost"
                  onClick={() => {
                    setSelectedAgent(agent)
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full justify-start p-4 bg-white/5 hover:bg-white/10 border border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden border border-white/10">
                      <Image
                        src={agent.avatar || "/placeholder.svg"}
                        alt={agent.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black",
                          agent.status === "online" && "bg-green-500",
                          agent.status === "busy" && "bg-yellow-500",
                          agent.status === "offline" && "bg-gray-500",
                        )}
                      />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">{agent.name}</div>
                      <div className="text-xs text-white/60">{agent.specialty}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header - Desktop */}
          <div className="hidden lg:flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-md overflow-hidden border border-white/10">
                <Image
                  src={selectedAgent.avatar || "/placeholder.svg"}
                  alt={selectedAgent.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
                <div
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black",
                    selectedAgent.status === "online" && "bg-green-500",
                    selectedAgent.status === "busy" && "bg-yellow-500",
                    selectedAgent.status === "offline" && "bg-gray-500",
                  )}
                />
              </div>
              <div>
                <h2 className="text-lg font-medium">{selectedAgent.name}</h2>
                <p className="text-white/60 text-sm">{selectedAgent.description}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border border-white/10">
                    <Image
                      src={selectedAgent.avatar || "/placeholder.svg"}
                      alt={selectedAgent.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-black rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-medium mb-2">Hi, I'm {selectedAgent.name}</h3>
                  <p className="text-white/70 mb-6 max-w-md">{selectedAgent.description}</p>
                </div>

                {/* Quick Suggestions - Mobile Grid */}
                <div className="lg:hidden grid grid-cols-2 gap-3 w-full max-w-md">
                  {quickSuggestions.slice(0, 4).map((suggestion, idx) => (
                    <Card
                      key={idx}
                      className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer"
                      onClick={() => handleSubmit(suggestion.query)}
                    >
                      <CardContent className="p-3">
                        <suggestion.icon className="h-5 w-5 text-white/60 mb-2" />
                        <h4 className="text-sm font-medium text-white">{suggestion.title}</h4>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Form */}
          <div className="p-4 lg:p-6 border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(inputValue)
              }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Ask ${selectedAgent.name} about ${selectedAgent.specialty.toLowerCase()}...`}
                  className="w-full bg-transparent border-0 text-white placeholder:text-white/50 px-4 sm:px-6 py-3 sm:py-4 pr-24 sm:pr-32 text-sm sm:text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isLoading}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 sm:space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 text-white/50 hover:text-white hover:bg-white/10"
                  >
                    <Paperclip className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 text-white/50 hover:text-white hover:bg-white/10"
                  >
                    <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    type="submit"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 bg-white text-black hover:bg-white/90 rounded-lg"
                    disabled={isLoading || !inputValue.trim()}
                  >
                    {isLoading ? (
                      <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-black/50 border-t-black rounded-full animate-spin" />
                    ) : (
                      <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>

            <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-white/40">
              <span>Powered by Suitpax AI</span>
              <span>•</span>
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
