"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MessageSquare, X, Send, Paperclip, ChevronDown, ChevronUp, Plus } from "lucide-react"
import { Badge } from "./badge"
import VoiceRecognition from "./voice-recognition"
import { travelPrompts } from "@/data/travel-prompts"
import { findRelevantResponse } from "@/data/ai-responses"
import { GlowBorder } from "./glow-border"
import { useRouter } from "next/navigation"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  options?: string[]
}

export default function AIAgentChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! I'm your Suitpax AI Agent. How can I help with your business travel needs today?",
      role: "assistant",
      timestamp: new Date(),
      options: [
        "Book a flight from Madrid to London with British Airways",
        "Find hotels near our Chicago office for next week",
        "What's our policy on business class flights?",
        "Arrange transportation for my team in Paris",
      ],
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Generate random suggestions
  useEffect(() => {
    const allPrompts = [
      ...travelPrompts.businessTravelGeneral,
      ...travelPrompts.flightBooking,
      ...travelPrompts.hotelBooking,
      ...travelPrompts.expenseManagement,
      ...travelPrompts.transportationAndLogistics,
    ]
    const shuffled = [...allPrompts].sort(() => 0.5 - Math.random())
    setSuggestions(shuffled.slice(0, 3))
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)
    setShowSuggestions(false)

    // Check for flight booking commands
    const userInput = input.toLowerCase()
    const isFlightBooking =
      (userInput.includes("book") || userInput.includes("reserve")) &&
      userInput.includes("flight") &&
      (userInput.includes("to") || userInput.includes("from"))

    // Find contextual response
    const relevantResponse = findRelevantResponse(input)

    // Simulate AI response with typing delay
    setTimeout(
      () => {
        let responseContent = ""
        let responseOptions: string[] | undefined = undefined

        if (isFlightBooking) {
          // Extract origin and destination from input
          let origin = "Madrid"
          let destination = "London"
          let airline = "British Airways"

          // Try to extract origin
          const fromMatch = userInput.match(/from\s+([a-zA-Z\s]+?)(?:\s+to|\s+with|\s+on|\s+for|\s+$)/i)
          if (fromMatch && fromMatch[1]) {
            origin = fromMatch[1].trim()
            // Capitalize first letter of each word
            origin = origin
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          }

          // Try to extract destination
          const toMatch = userInput.match(/to\s+([a-zA-Z\s]+?)(?:\s+with|\s+on|\s+for|\s+$)/i)
          if (toMatch && toMatch[1]) {
            destination = toMatch[1].trim()
            // Capitalize first letter of each word
            destination = destination
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          }

          // Try to extract airline
          const airlineMatch = userInput.match(/(?:with|on)\s+([a-zA-Z\s]+?)(?:\s+from|\s+to|\s+for|\s+$)/i)
          if (airlineMatch && airlineMatch[1]) {
            airline = airlineMatch[1].trim()
            // Capitalize first letter of each word
            airline = airline
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          }

          const date = new Date()
          date.setDate(date.getDate() + 7) // Default to 1 week from now
          const formattedDate = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

          responseContent = `I've found several flight options from ${origin} to ${destination} with ${airline} for ${formattedDate}:

1. ${airline} ${Math.floor(Math.random() * 1000) + 1000}
   Departure: 08:25 AM
   Arrival: 10:05 AM
   Price: €${Math.floor(Math.random() * 200) + 250}
   
2. ${airline} ${Math.floor(Math.random() * 1000) + 1000}
   Departure: 12:40 PM
   Arrival: 14:20 PM
   Price: €${Math.floor(Math.random() * 200) + 200}
   
3. ${airline} ${Math.floor(Math.random() * 1000) + 1000}
   Departure: 17:15 PM
   Arrival: 18:55 PM
   Price: €${Math.floor(Math.random() * 200) + 300}

Would you like me to book any of these options for you?`

          responseOptions = [
            `Book the morning flight`,
            `Book the afternoon flight`,
            `Book the evening flight`,
            `Show more options`,
          ]
        } else if (relevantResponse) {
          responseContent = relevantResponse.response
          if (relevantResponse.followUp) {
            responseContent += "\n\n" + relevantResponse.followUp
          }
          responseOptions = relevantResponse.options
        } else {
          // Fallback response if no contextual match
          const userInput = input.toLowerCase()

          if (userInput.includes("flight") || userInput.includes("fly")) {
            responseContent = "I can help you find flights! What's your departure city, destination, and travel dates?"
            responseOptions = [
              "Book a flight from Madrid to London",
              "Find flights to New York next week",
              "Compare flight prices to Tokyo",
            ]
          } else if (userInput.includes("hotel") || userInput.includes("stay")) {
            responseContent = "I'd be happy to help you find a hotel! Which city are you visiting and when?"
            responseOptions = [
              "Find hotels in Barcelona",
              "Book a hotel in Paris for next weekend",
              "Show luxury hotels in Rome",
            ]
          } else if (userInput.includes("expense") || userInput.includes("receipt")) {
            responseContent =
              "I can help you manage your travel expenses. Would you like to submit a new expense or review your existing ones?"
            responseOptions = ["Submit a new expense", "Review my expense reports", "Check expense policy"]
          } else if (userInput.includes("policy") || userInput.includes("compliance")) {
            responseContent =
              "Here's a summary of your company's travel policy: Economy class for flights under 6 hours, maximum hotel rates vary by city, and receipts required for expenses over $25."
            responseOptions = ["Show full travel policy", "Check hotel rate limits", "Explain expense requirements"]
          } else if (userInput.includes("car") || userInput.includes("rental")) {
            responseContent =
              "I can help you book a rental car. What dates do you need it for, and where will you be picking it up?"
            responseOptions = ["Book a car in Madrid", "Compare rental prices in London", "Show SUV options in Paris"]
          } else {
            responseContent =
              "I'm here to help with all your business travel needs! I can assist with flights, hotels, car rentals, expense management, and travel policy questions."
            responseOptions = ["Book a flight", "Find a hotel", "Manage expenses", "Check travel policy"]
          }
        }

        const assistantMessage: Message = {
          id: Date.now().toString(),
          content: responseContent,
          role: "assistant",
          timestamp: new Date(),
          options: responseOptions,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsTyping(false)

        // Generate new suggestions after response
        const allPrompts = [
          ...travelPrompts.businessTravelGeneral,
          ...travelPrompts.flightBooking,
          ...travelPrompts.hotelBooking,
          ...travelPrompts.expenseManagement,
          ...travelPrompts.transportationAndLogistics,
        ]
        const shuffled = [...allPrompts].sort(() => 0.5 - Math.random())
        setSuggestions(shuffled.slice(0, 3))
        setShowSuggestions(true)
      },
      1000 + Math.random() * 1500,
    )
  }

  const handleOptionClick = (option: string) => {
    const optionLower = option.toLowerCase()

    if (optionLower.includes("book") && optionLower.includes("flight")) {
      // Simulate booking and redirect to flights page
      setInput(option)
      handleSubmit(new Event("submit") as any)

      // Redirect after a short delay to show the response
      setTimeout(() => {
        router.push("/flights")
      }, 2000)
    } else {
      setInput(option)
      handleSubmit(new Event("submit") as any)
    }
  }

  const handleVoiceTranscript = (text: string) => {
    setInput((prev) => prev + text)
  }

  const toggleChat = () => {
    setIsOpen((prev) => !prev)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    handleSubmit(new Event("submit") as any)
  }

  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white shadow-lg hover:bg-gray-800 transition-colors"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 h-[500px] max-h-[80vh] flex flex-col overflow-hidden"
          >
            <GlowBorder className="h-full flex flex-col">
              {/* Chat header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-medium">
                    AI
                  </div>
                  <div className="ml-2">
                    <h3 className="text-sm font-medium">Suitpax Assistant</h3>
                    <div className="flex items-center">
                      <Badge variant="success" className="mr-1 rounded-xl">
                        Online
                      </Badge>
                      <span className="text-[10px] text-gray-500">Business Travel Expert</span>
                    </div>
                  </div>
                </div>
                <button onClick={toggleChat} className="p-1 rounded-full hover:bg-gray-200" aria-label="Close chat">
                  <X size={16} />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] p-2.5 rounded-xl ${
                        message.role === "user"
                          ? "bg-black text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <p className="text-xs whitespace-pre-line">{message.content}</p>
                      <p className="text-right text-[9px] mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>

                      {/* Response options */}
                      {message.role === "assistant" && message.options && message.options.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleOptionClick(option)}
                              className="text-[10px] py-1 px-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-700 transition-colors flex items-center"
                            >
                              <Plus size={8} className="mr-1" />
                              {option.length > 20 ? option.substring(0, 20) + "..." : option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-xl rounded-tl-none">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {showSuggestions && !isTyping && suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-[10px] py-1.5 px-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-colors"
                      >
                        {suggestion.length > 30 ? suggestion.substring(0, 30) + "..." : suggestion}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowSuggestions(false)}
                      className="text-[10px] py-1.5 px-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-colors"
                    >
                      <ChevronUp size={12} />
                    </button>
                  </div>
                )}

                {!showSuggestions && !isTyping && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowSuggestions(true)}
                      className="text-[10px] py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-colors"
                    >
                      <ChevronDown size={12} />
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <div className="border-t border-gray-200 p-3">
                <form onSubmit={handleSubmit} className="relative">
                  <GlowBorder>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full pl-3 pr-24 py-2 border-0 rounded-xl focus:outline-none focus:ring-0 text-xs"
                    />
                  </GlowBorder>
                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <button type="button" className="p-1.5 rounded-full hover:bg-gray-100" aria-label="Attach file">
                      <Paperclip size={14} className="text-gray-500" />
                    </button>
                    <VoiceRecognition
                      onTranscript={handleVoiceTranscript}
                      buttonSize="sm"
                      className="p-1.5 rounded-full hover:bg-gray-100"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className={`p-1.5 rounded-full ${
                        input.trim() && !isTyping
                          ? "bg-black text-white hover:bg-gray-800"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      aria-label="Send message"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </form>
              </div>
            </GlowBorder>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
