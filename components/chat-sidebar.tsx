"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Volume2, VolumeX, Sparkles, Maximize2, Minimize2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSpeech } from "@/hooks/use-speech"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Message = {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

type ChatSidebarProps = {
  isCollapsed: boolean
}

// Sample AI responses for different queries
const aiResponses: Record<string, string[]> = {
  default: [
    "I'm your travel assistant. How can I help you today?",
    "Is there anything specific about your business trip you'd like to know?",
    "I can help you find flights, hotels, or answer questions about travel policies.",
  ],
  flight: [
    "I found several flight options to London for your dates. The best option seems to be a direct flight with British Airways departing at 10:30 AM, arriving at 2:45 PM local time. Would you like me to provide more details?",
    "For your trip to New York, I recommend the Delta flight departing at 8:15 AM. It's within your company's budget policy and has the best connection times.",
    "I've checked flights to Tokyo. There's a good option with a layover in Seoul that would save your company about $450 compared to the direct flight. Would you like to see both options?",
  ],
  hotel: [
    "Based on your company's travel policy, I recommend the Hilton Downtown. It's within your budget at $189/night and is just 10 minutes from your meeting location.",
    "I found three hotels near your conference venue that comply with your company's travel policy. The Marriott offers the best combination of price and convenience.",
    "For your stay in Barcelona, I recommend the Hotel Arts. It's approved in your company's preferred hotel program and currently has a corporate rate available.",
  ],
  policy: [
    "According to your company's travel policy, business class is approved for flights over 8 hours. For shorter flights, economy class is the standard.",
    "Your daily meal allowance is $75 for high-cost cities and $60 for other locations. Receipts are required for all meal expenses.",
    "For rental cars, your policy allows for mid-size vehicles. Premium or luxury vehicles require pre-approval from your manager.",
  ],
  expense: [
    "To submit your expense report, you'll need to upload all receipts and categorize each expense. I can help you prepare this if you'd like.",
    "Your recent hotel expense exceeds the policy limit by $35 per night. You'll need manager approval before submitting this expense.",
    "I notice you have 5 pending expenses totaling $1,240 that haven't been submitted yet. Would you like me to help you prepare the expense report?",
  ],
}

const promptSuggestions = [
  "Find flights to London",
  "Hotel options in New York",
  "Explain travel policy",
  "Create expense report",
  "Upcoming trip details",
  "Request approval",
]

export function ChatSidebar({ isCollapsed }: ChatSidebarProps) {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi, I'm your travel assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [expanded, setExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { speak, stop, speaking, supported } = useSpeech()
  const [audioEnabled, setAudioEnabled] = useState(false)

  // Scroll to the end of messages when a new one is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getAIResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase()
    let responseArray = aiResponses.default

    // Check which category the message belongs to
    if (lowerCaseMessage.includes("flight") || lowerCaseMessage.includes("fly") || lowerCaseMessage.includes("plane")) {
      responseArray = aiResponses.flight
    } else if (
      lowerCaseMessage.includes("hotel") ||
      lowerCaseMessage.includes("stay") ||
      lowerCaseMessage.includes("accommodation")
    ) {
      responseArray = aiResponses.hotel
    } else if (
      lowerCaseMessage.includes("policy") ||
      lowerCaseMessage.includes("rule") ||
      lowerCaseMessage.includes("allowed")
    ) {
      responseArray = aiResponses.policy
    } else if (
      lowerCaseMessage.includes("expense") ||
      lowerCaseMessage.includes("receipt") ||
      lowerCaseMessage.includes("cost")
    ) {
      responseArray = aiResponses.expense
    }

    // Return a random response from the appropriate category
    return responseArray[Math.floor(Math.random() * responseArray.length)]
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Simulate typing indicator
    setTimeout(() => {
      // Get appropriate AI response
      const aiResponseText = getAIResponse(inputValue)

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseText,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])

      // If audio is enabled, read the response
      if (audioEnabled) {
        speak(botResponse.content)
      }
    }, 1000)

    setInputValue("")
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const toggleAudio = () => {
    if (speaking) {
      stop()
    }
    setAudioEnabled(!audioEnabled)
  }

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  // If the sidebar is collapsed, show a minimal version
  if (isCollapsed) {
    return (
      <div className="p-2">
        <div className="rounded-xl bg-gray-100 p-2 border border-gray-200 shadow-sm flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white border border-gray-200 shadow-sm mb-2"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
          <div className="w-full">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8 rounded-xl bg-white border border-gray-200 shadow-sm flex justify-center"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`p-2 ${expanded ? "fixed bottom-4 right-4 z-50 w-80" : ""}`}
        initial={expanded ? { opacity: 0, scale: 0.9 } : false}
        animate={expanded ? { opacity: 1, scale: 1 } : false}
        exit={expanded ? { opacity: 0, scale: 0.9 } : false}
      >
        <div className="rounded-xl bg-gray-100 p-3 border border-gray-200 shadow-sm">
          <div className="flex items-center mb-2">
            <Avatar className="h-7 w-7 mr-2">
              <AvatarImage src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">Travel Assistant</span>
            <div className="ml-auto flex items-center space-x-1">
              {supported && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={toggleAudio}
                  title={audioEnabled ? "Disable audio" : "Enable audio"}
                >
                  {audioEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={toggleExpanded}
                title={expanded ? "Minimize" : "Expand"}
              >
                {expanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          {/* Messages area */}
          <div
            className={`bg-white rounded-xl border border-gray-200 shadow-sm mb-2 p-2 overflow-y-auto ${expanded ? "h-[300px]" : "h-[120px]"}`}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 text-xs ${
                  message.isUser ? "ml-auto bg-black text-white" : "mr-auto bg-gray-100"
                } p-2 rounded-xl max-w-[85%] inline-block`}
              >
                {message.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="relative">
            <input
              type="text"
              placeholder="Ask about travel..."
              className="w-full text-xs p-2 pr-8 rounded-xl border border-gray-200 shadow-sm bg-white"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full"
              onClick={handleSendMessage}
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>

          {/* Suggestions */}
          <div className="mt-2 flex flex-wrap gap-1">
            {promptSuggestions.map((suggestion, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-[10px] cursor-pointer bg-white hover:bg-gray-50 border-gray-200 shadow-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
