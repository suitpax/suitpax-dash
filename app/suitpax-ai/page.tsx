"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TypingEffect } from "@/components/ui/typing-effect"
import { useSpeechRecognition } from "@/lib/hooks/use-speech-recognition"
import { PiPaperclip, PiMicrophone, PiMicrophoneSlash, PiGear, PiPlus, PiArrowRight, PiStop } from "react-icons/pi"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
  tokens?: number
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  hasGreeted?: boolean
}

const suggestedQueries = [
  "Find flights to London",
  "Hotel recommendations in Tokyo",
  "Calculate travel expenses",
  "Best time to visit Paris",
  "Create travel itinerary",
  "Expense policy guidelines",
  "Airport lounge access",
  "Currency exchange rates",
]

const aiAgents = [
  { id: 1, name: "Travel Agent", avatar: "/images/ai-agents/agent-1.jpg", specialty: "Flight & Hotel Booking" },
  { id: 2, name: "Expense Agent", avatar: "/images/ai-agents/agent-2.jpg", specialty: "Expense Management" },
  { id: 3, name: "Policy Agent", avatar: "/images/ai-agents/agent-3.jpg", specialty: "Travel Policies" },
  { id: 4, name: "Support Agent", avatar: "/images/ai-agents/agent-4.jpg", specialty: "General Support" },
]

// Enhanced AI response system
const generateEnhancedResponse = (userInput: string, conversationHistory: Message[]): string => {
  const input = userInput.toLowerCase()

  // Check if asking for a list
  if (input.includes("list") || input.includes("show me") || input.includes("give me")) {
    if (input.includes("flight") || input.includes("airline")) {
      return `Here are the top airlines for business travel:

1. **Emirates** - Premium service, excellent lounges
2. **Singapore Airlines** - Award-winning service, modern fleet  
3. **Qatar Airways** - Luxury experience, global network
4. **Lufthansa** - Reliable European carrier, good business class
5. **American Airlines** - Extensive US network, solid rewards program

Would you like me to search for specific routes or compare prices?`
    }

    if (input.includes("hotel") || input.includes("accommodation")) {
      return `Top business hotel chains worldwide:

1. **Marriott International** - Extensive global presence, excellent rewards
2. **Hilton Hotels** - Premium locations, consistent quality
3. **Hyatt Hotels** - Boutique experience, personalized service
4. **InterContinental** - Luxury properties, business amenities
5. **Accor Hotels** - European focus, diverse portfolio

Need help finding hotels in a specific city?`
    }
  }

  // Expense calculations
  if (input.includes("calculate") || input.includes("cost") || input.includes("price")) {
    return `I can help you calculate travel expenses! Here's what I can analyze:

• **Flight costs** - Compare airlines and routes
• **Hotel rates** - Find best deals by location  
• **Per diem calculations** - Based on destination
• **Currency conversions** - Real-time exchange rates
• **Total trip budget** - Comprehensive cost breakdown

What specific calculation do you need?`
  }

  // Travel recommendations
  if (input.includes("recommend") || input.includes("suggest") || input.includes("best")) {
    if (input.includes("destination") || input.includes("place") || input.includes("city")) {
      return `Based on current business travel trends, here are top destinations:

**Europe:** London, Paris, Frankfurt, Amsterdam, Zurich
**Asia:** Singapore, Tokyo, Hong Kong, Seoul, Dubai  
**Americas:** New York, San Francisco, Toronto, São Paulo

Each offers excellent business infrastructure, connectivity, and professional services. What type of business are you traveling for?`
    }
  }

  // Funny responses
  if (input.includes("joke") || input.includes("funny") || input.includes("laugh")) {
    return `Why did the business traveler bring a ladder to the airport? Because they heard the prices were through the roof! 😄

But seriously, at Suitpax - the next gen traveltech startup - we're working to bring those prices back down to earth with smart booking algorithms and AI-powered deals.`
  }

  // Singing about Suitpax
  if (input.includes("sing") || input.includes("song") || input.includes("music")) {
    return `🎵 *Suitpax, Suitpax, the future is here,*
*Next gen traveltech, crystal clear,*
*Book your flights with AI so smart,*
*Business travel reimagined from the start!* 🎵

That's our unofficial anthem! Suitpax is revolutionizing how companies manage business travel through intelligent automation.`
  }

  // Code requests
  if (
    input.includes("code") ||
    input.includes("typescript") ||
    input.includes("javascript") ||
    input.includes("react")
  ) {
    return `I can help with frontend code! Here's a TypeScript React component example:

\`\`\`typescript
interface TravelBookingProps {
  destination: string;
  dates: {
    departure: Date;
    return: Date;
  };
}

const TravelBooking: React.FC<TravelBookingProps> = ({ destination, dates }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBooking = async () => {
    setIsLoading(true);
    // Booking logic here
    setIsLoading(false);
  };
  
  return (
    <div className="bg-black text-white p-4 rounded-lg">
      <h2>Book Travel to {destination}</h2>
      <button 
        onClick={handleBooking}
        disabled={isLoading}
        className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded"
      >
        {isLoading ? 'Booking...' : 'Book Now'}
      </button>
    </div>
  );
};
\`\`\`

Need help with a specific implementation?`
  }

  // Default enhanced response
  return `I'm here to help with your business travel needs! As part of Suitpax, the next gen traveltech startup, I can assist with flight bookings, hotel reservations, expense calculations, travel policy guidance, and much more.

What would you like to explore today?`
}

export default function SuitpaxAIPage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isTypingResponse, setIsTypingResponse] = useState(false)
  const [tokenCount, setTokenCount] = useState(0)
  const [tokenLimit] = useState(2000) // Based on Pro plan
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported } =
    useSpeechRecognition()

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  // Initialize with empty conversation (no greeting)
  useEffect(() => {
    const newConversation: Conversation = {
      id: "initial",
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      hasGreeted: false,
    }
    setConversations([newConversation])
    setActiveConversation(newConversation)
  }, [])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConversation?.messages])

  const stopTyping = () => {
    setIsTypingResponse(false)
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !activeConversation || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      tokens: Math.ceil(input.trim().length / 4), // Rough token estimation
    }

    // Update conversation with user message
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, userMessage],
      title:
        activeConversation.title === "New Chat"
          ? input.trim().substring(0, 30) + (input.trim().length > 30 ? "..." : "")
          : activeConversation.title,
    }

    setActiveConversation(updatedConversation)
    setConversations((prev) => prev.map((conv) => (conv.id === activeConversation.id ? updatedConversation : conv)))
    setInput("")
    resetTranscript()
    setIsLoading(true)
    setIsTypingResponse(true)

    // Update token count
    setTokenCount((prev) => prev + userMessage.tokens!)

    try {
      // Generate enhanced response
      const responseContent = generateEnhancedResponse(userMessage.content, activeConversation.messages)

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      if (!isTypingResponse) return // User stopped the response

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        isTyping: true,
        tokens: Math.ceil(responseContent.length / 4),
      }

      // Update conversation with assistant response
      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
        hasGreeted: true,
      }

      setActiveConversation(finalConversation)
      setConversations((prev) => prev.map((conv) => (conv.id === activeConversation.id ? finalConversation : conv)))

      // Update token count
      setTokenCount((prev) => prev + assistantMessage.tokens!)
    } catch (error) {
      console.error("Error getting AI response:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again or contact our support team.",
        timestamp: new Date(),
        isTyping: true,
        tokens: 20,
      }

      const errorConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, errorMessage],
      }

      setActiveConversation(errorConversation)
      setConversations((prev) => prev.map((conv) => (conv.id === activeConversation.id ? errorConversation : conv)))
    } finally {
      setIsLoading(false)
      setIsTypingResponse(false)
    }
  }

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      hasGreeted: false,
    }
    setConversations((prev) => [newConversation, ...prev])
    setActiveConversation(newConversation)
  }

  const handleSuggestedQuery = (query: string) => {
    setInput(query)
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      resetTranscript()
      setInput("")
      startListening()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
              <Image src="/images/ai-agent-avatar.jpeg" alt="Suitpax AI" fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-white tracking-tight">Suitpax AI</h1>
              <p className="text-xs text-white/60 font-light">Next Gen Travel Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-white/50 mr-2">
              {tokenCount}/{tokenLimit} tokens
            </div>
            <Button
              onClick={createNewConversation}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-white rounded-xl h-9 px-3 font-light transition-all duration-200"
            >
              <PiPlus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            <Button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-white rounded-xl h-9 w-9 p-0 transition-all duration-200">
              <PiGear className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* AI Agents Row */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <span className="text-sm text-white/50 font-light whitespace-nowrap mr-2">Specialized Agents:</span>
            <div className="flex space-x-2">
              {aiAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center space-x-2 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-lg px-3 py-2 cursor-pointer transition-all duration-200 whitespace-nowrap min-w-fit"
                >
                  <div className="relative h-5 w-5 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={agent.avatar || "/placeholder.svg"} alt={agent.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{agent.name}</p>
                    <p className="text-[10px] text-white/50 font-light truncate">{agent.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Empty state */}
          {(!activeConversation?.messages || activeConversation.messages.length === 0) && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-serif tracking-tighter text-white/80 mb-4">Try Suitpax AI</h2>
                <p className="text-white/50 text-sm">Ask me anything about business travel, expenses, or bookings</p>
              </div>
            </div>
          )}

          {activeConversation?.messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                {message.role === "assistant" && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="relative h-6 w-6 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                      <Image src="/images/ai-agent-avatar.jpeg" alt="AI" fill className="object-cover" />
                    </div>
                    <Badge className="bg-white/10 text-white/70 text-xs rounded-full border-white/20">Suitpax AI</Badge>
                  </div>
                )}
                <div
                  className={`rounded-xl py-3 px-4 ${
                    message.role === "user"
                      ? "bg-white/10 text-white rounded-tr-none border border-white/20"
                      : "bg-white/5 text-white rounded-tl-none border border-white/10"
                  }`}
                >
                  <div className="text-sm leading-relaxed font-light">
                    {message.isTyping && message.role === "assistant" ? (
                      <TypingEffect text={message.content} speed={20} />
                    ) : (
                      message.content.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < message.content.split("\n").length - 1 && <br />}
                        </span>
                      ))
                    )}
                  </div>
                  <div className="mt-2 text-xs text-white/40 font-light flex justify-between">
                    <span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {message.tokens && <span>{message.tokens} tokens</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="relative h-6 w-6 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                    <Image src="/images/ai-agent-avatar.jpeg" alt="AI" fill className="object-cover" />
                  </div>
                  <Badge className="bg-white/10 text-white/70 text-xs rounded-full border-white/20">Suitpax AI</Badge>
                  <Button
                    onClick={stopTyping}
                    size="sm"
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 h-6 px-2 rounded-full text-xs"
                  >
                    <PiStop className="h-3 w-3 mr-1" />
                    Stop
                  </Button>
                </div>
                <div className="bg-white/5 rounded-xl rounded-tl-none py-3 px-4 border border-white/10">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries */}
        {(!activeConversation?.messages || activeConversation.messages.length === 0) && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.slice(0, 4).map((query, index) => (
                <Badge
                  key={index}
                  onClick={() => handleSuggestedQuery(query)}
                  className="bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer rounded-full text-xs px-3 py-1.5 font-light transition-all duration-200"
                >
                  {query}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="p-4 border-t border-white/10">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Input
                id="main-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={isListening ? "Listening..." : "Try ask anything..."}
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl pl-4 pr-24 py-4 h-14 focus:ring-1 focus:ring-white/20 text-sm font-light transition-all duration-200 hover:bg-white/10 sm:placeholder:text-sm placeholder:text-xs"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  className="bg-white/5 hover:bg-white/15 border border-white/10 h-8 w-8 p-0 rounded-full transition-all duration-200"
                >
                  <PiPaperclip className="h-4 w-4 text-white/70" />
                </Button>
                {isSupported && (
                  <Button
                    type="button"
                    onClick={toggleListening}
                    size="sm"
                    className={`h-8 w-8 p-0 rounded-full transition-all duration-200 border ${
                      isListening
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30"
                        : "bg-white/5 hover:bg-white/15 border-white/10 text-white/70"
                    }`}
                  >
                    {isListening ? <PiMicrophoneSlash className="h-4 w-4" /> : <PiMicrophone className="h-4 w-4" />}
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 h-8 w-8 p-0 rounded-full transition-all duration-200 border border-white/20"
                >
                  <PiArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
        </div>
      </div>
    </div>
  )
}
