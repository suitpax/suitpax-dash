"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { getRandomPromptsFromAll, getRandomPrompts, promptCategories } from "@/data/prompts"
import {
  BriefcaseIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  TruckIcon,
  ArrowRightIcon,
  XMarkIcon,
  ChevronRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline"

// Icon map for categories
const categoryIcons = {
  Briefcase: BriefcaseIcon,
  Plane: PaperAirplaneIcon,
  Building: BuildingOfficeIcon,
  Receipt: DocumentTextIcon,
  Car: TruckIcon,
}

// Fallback questions in case no prompts are available
const fallbackQuestions = [
  "How can I book a flight?",
  "What is the baggage policy?",
  "Can I modify my hotel reservation?",
  "How do I report travel expenses?",
  "What documents do I need for international travel?",
]

export default function AiAssistantCard() {
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; id: string; createdAt: Date }[]
  >([])
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load initial suggestions
  useEffect(() => {
    try {
      const randomPrompts = getRandomPromptsFromAll(3)
      setQuickSuggestions(randomPrompts.length > 0 ? randomPrompts : fallbackQuestions.slice(0, 3))
    } catch (error) {
      console.error("Error loading initial suggestions:", error)
      setQuickSuggestions(fallbackQuestions.slice(0, 3))
    }
  }, [])

  // Change suggestions when category changes
  useEffect(() => {
    try {
      if (activeCategory) {
        const categoryPrompts = getRandomPrompts(activeCategory, 5)
        setSuggestions(categoryPrompts.length > 0 ? categoryPrompts : fallbackQuestions)
      } else {
        const randomPrompts = getRandomPromptsFromAll(5)
        setSuggestions(randomPrompts.length > 0 ? randomPrompts : fallbackQuestions)
      }
    } catch (error) {
      console.error("Error loading category suggestions:", error)
      setSuggestions(fallbackQuestions)
    }
  }, [activeCategory])

  // Scroll to the end of messages when a new one is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Automatically adjust textarea height
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [inputValue])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      // Add user message
      const userMessage = { role: "user", content: inputValue, id: Date.now().toString(), createdAt: new Date() }
      setMessages((prev) => [...prev, userMessage])

      // Mostrar indicador de escritura
      setIsTyping(true)

      try {
        // Simular una respuesta después de un breve retraso
        setTimeout(() => {
          // Generar una respuesta simple basada en patrones
          const userMessageLower = inputValue.toLowerCase()
          let responseContent = ""

          // Patrones básicos para respuestas
          if (userMessageLower.includes("flight") || userMessageLower.includes("fly")) {
            responseContent = "I can help you find flights. What's your destination and travel dates?"
          } else if (userMessageLower.includes("hotel") || userMessageLower.includes("stay")) {
            responseContent = "I can help you book a hotel. Where are you planning to stay and for how long?"
          } else if (userMessageLower.includes("car") || userMessageLower.includes("rental")) {
            responseContent = "I can help you rent a car. When and where do you need it?"
          } else if (userMessageLower.includes("train") || userMessageLower.includes("rail")) {
            responseContent = "I can help you book train tickets. What's your departure and destination station?"
          } else if (userMessageLower.includes("hello") || userMessageLower.includes("hi")) {
            responseContent = "Hello! I'm your travel assistant. How can I help you today?"
          } else if (userMessageLower.includes("thank")) {
            responseContent = "You're welcome! Is there anything else I can help you with?"
          } else {
            responseContent =
              "I'm your travel assistant. I can help with flights, hotels, car rentals, and train bookings. What do you need assistance with?"
          }

          // Añadir respuesta de la IA
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: responseContent,
              id: Date.now().toString(),
              createdAt: new Date(),
            },
          ])

          // Generar nuevas sugerencias rápidas
          try {
            const randomPrompts = getRandomPromptsFromAll(3)
            setQuickSuggestions(randomPrompts.length > 0 ? randomPrompts : fallbackQuestions.slice(0, 3))
          } catch (error) {
            console.error("Error loading new quick suggestions:", error)
            setQuickSuggestions(fallbackQuestions.slice(0, 3))
          }

          setIsTyping(false)
        }, 1000)
      } catch (error) {
        console.error("Error al obtener respuesta de la IA:", error)
        // Añadir mensaje de error
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo.",
            id: Date.now().toString(),
            createdAt: new Date(),
          },
        ])
        setIsTyping(false)
      }

      setInputValue("")
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleQuickSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    // Send automatically
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    }, 100)
  }

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div
      className={`bg-black rounded-xl border border-white/10 shadow-sm transition-all duration-300 overflow-hidden ${
        isExpanded ? "h-[500px]" : "h-auto"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center">
          <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
            <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
          </div>
          <div>
            <h3 className="font-medium text-white text-sm">AI Agent</h3>
            <p className="text-xs text-white/70">Powered by Suitpax Intelligence</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          {isExpanded ? <XMarkIcon className="h-3.5 w-3.5" /> : <ChevronRightIcon className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Conversation area (visible when expanded) */}
      {isExpanded && (
        <div className="h-[320px] overflow-y-auto p-3 bg-black/30">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-white/5 p-2.5 rounded-full mb-2.5">
                <SparklesIcon className="h-5 w-5 text-white/70" />
              </div>
              <h4 className="font-medium text-white mb-1.5 text-sm">How can I help you today?</h4>
              <p className="text-xs text-white/70 max-w-md">
                Ask me about flight bookings, hotels, travel policies, or any questions related to business travel.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-xl p-2.5 ${
                      message.role === "user"
                        ? "bg-white/10 text-white rounded-tr-none"
                        : "bg-white/5 text-white/70 rounded-tl-none"
                    }`}
                  >
                    <p className="text-xs">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 text-white/70 rounded-xl rounded-tl-none max-w-[80%] p-2.5">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      )}

      {/* Quick suggestions */}
      <div className="px-3 py-2 flex flex-wrap gap-1.5">
        {quickSuggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleQuickSuggestionClick(suggestion)}
            className="inline-flex items-center rounded-xl bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-white hover:bg-white/10 transition-colors"
          >
            {suggestion.length > 30 ? suggestion.substring(0, 30) + "..." : suggestion}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-white/10">
        {isExpanded && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {promptCategories.map((category) => {
              const Icon = categoryIcons[category.icon as keyof typeof categoryIcons]
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`inline-flex items-center rounded-xl px-2.5 py-1 text-xs transition-colors ${
                    activeCategory === category.id
                      ? "bg-white/10 text-white"
                      : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {category.name}
                </button>
              )
            })}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-start">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask your travel assistant..."
              className={`w-full py-1.5 px-2.5 pr-8 bg-white/5 border ${
                isFocused ? "border-white/20" : "border-white/10"
              } rounded-xl focus:outline-none text-xs text-white min-h-[32px] max-h-[100px] resize-none`}
              rows={1}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-xl transition-colors duration-200 ${
                inputValue.trim()
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-white/5 text-white/30 cursor-not-allowed"
              }`}
            >
              <ArrowRightIcon className="h-3 w-3" />
            </button>
          </div>
        </form>

        {/* Category suggestions (visible when expanded and focused) */}
        {isExpanded && isFocused && activeCategory && suggestions.length > 0 && (
          <div className="mt-2 bg-black/95 rounded-xl border border-white/10 shadow-sm overflow-hidden">
            <ul className="max-h-[150px] overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-2.5 py-1.5 text-xs hover:bg-white/5 cursor-pointer text-white/70"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
