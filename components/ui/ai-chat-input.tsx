"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { ArrowRightIcon, LightBulbIcon } from "@heroicons/react/24/outline"
import VoiceRecognition from "./voice-recognition"
import { GlowBorder } from "./glow-border"
import { useRouter } from "next/navigation"

export default function AiChatInput() {
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  // Function to get random suggestions from prompts
  const getRandomSuggestions = (count = 3) => {
    const customPrompts = [
      "Book a flight from Madrid to London with British Airways",
      "Find hotels near our Chicago office for next week",
      "What's our policy on business class flights?",
      "Arrange transportation for my team in Paris",
      "Book a meeting room for tomorrow at 2pm",
      "Find direct flights to Tokyo for next month",
      "What's the baggage allowance for my flight?",
      "Book a car rental in Barcelona",
      "Find restaurants near our New York office",
      "What's the exchange rate for euros to dollars?",
      "Book a flight for my team from Madrid to Berlin",
      "Find the cheapest flights to San Francisco",
      "What's the weather forecast for my trip?",
      "Book a hotel with conference facilities in London",
      "Find train tickets from Paris to Brussels",
    ]

    const shuffled = [...customPrompts].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  useEffect(() => {
    // Generate random suggestions when component mounts
    setSuggestions(getRandomSuggestions())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      console.log("AI Query:", inputValue)

      // Check for flight booking commands
      const userInput = inputValue.toLowerCase()
      const isFlightBooking =
        (userInput.includes("book") || userInput.includes("reserve")) &&
        userInput.includes("flight") &&
        (userInput.includes("to") || userInput.includes("from"))

      // Simulate response
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setInputValue("")

        // If it's a flight booking request, redirect to flights page
        if (isFlightBooking) {
          router.push("/flights")
        }

        // Generate new suggestions after sending a query
        setSuggestions(getRandomSuggestions())
      }, 1500)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    setShowSuggestions(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Handle voice transcription
  const handleVoiceTranscript = (text: string) => {
    setInputValue((prev) => prev + text)
  }

  return (
    <div className="relative">
      {/* Typing indicator */}
      {isTyping && (
        <div className="absolute -top-6 left-0 right-0 bg-white rounded-t-xl border border-gray-200 border-b-0 p-1.5 flex justify-center">
          <div className="flex space-x-1 items-center">
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
            <div
              className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      )}

      {/* Assistant tip */}
      <div className="mb-2 px-1">
        <div className="flex items-center">
          <LightBulbIcon className="h-3 w-3 text-black mr-1.5" />
          <span className="text-[10px] text-gray-600">Ask me anything about business travel</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <GlowBorder>
          <div className={`flex items-center rounded-xl border-0 bg-white transition-colors overflow-hidden`}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => {
                setIsFocused(true)
                setShowSuggestions(true)
              }}
              onBlur={() => {
                setIsFocused(false)
                // Small delay to allow clicking on a suggestion
                setTimeout(() => setShowSuggestions(false), 200)
              }}
              placeholder="Ask your travel assistant..."
              className="w-full py-1.5 px-2.5 bg-transparent border-none focus:outline-none text-xs text-black"
            />

            {/* Action buttons */}
            <div className="flex items-center gap-1 mr-1">
              <VoiceRecognition onTranscript={handleVoiceTranscript} buttonSize="sm" className="hover:bg-gray-200" />

              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className={`p-1.5 rounded-xl transition-colors duration-200 ${
                  inputValue.trim() && !isTyping
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ArrowRightIcon className="h-3 w-3" />
              </button>
            </div>
          </div>
        </GlowBorder>
      </form>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="mt-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden absolute left-0 right-0 z-10">
          <div className="p-1.5 text-[10px] text-gray-500 border-b border-gray-200">Suggested questions</div>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-2.5 py-1.5 text-[10px] hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
