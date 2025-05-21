"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { getRandomPromptsFromAll, getRandomPrompts } from "@/data/prompts"
import {
  BriefcaseIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  TruckIcon,
} from "@heroicons/react/24/outline"
import { enhancedAiService } from "@/lib/ai/ai-service-enhanced"
import { Send, Mic } from "lucide-react"

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
  const [isRecording, setIsRecording] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

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
    // Solo hacer scroll si el usuario está cerca del final
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }
    }
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
        // Preparar mensajes para la API
        const apiMessages = [...messages, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
          id: msg.id,
          createdAt: msg.createdAt || new Date(),
        }))

        // Llamar a la API de IA mejorada (que usa el sistema interno)
        const response = await enhancedAiService.generateResponse({
          messages: apiMessages,
          useInternalSystem: true,
        })

        // Añadir respuesta de la IA
        if (response.response) {
          setMessages((prev) => [...prev, response.response])
        }

        // Generar nuevas sugerencias rápidas
        try {
          const randomPrompts = getRandomPromptsFromAll(3)
          setQuickSuggestions(randomPrompts.length > 0 ? randomPrompts : fallbackQuestions.slice(0, 3))
        } catch (error) {
          console.error("Error loading new quick suggestions:", error)
          setQuickSuggestions(fallbackQuestions.slice(0, 3))
        }
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
      } finally {
        setIsTyping(false)
        setInputValue("")
      }
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

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
          <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
        </div>

        <div className="flex-1">
          <div className="mb-2">
            <h3 className="text-base font-medium text-white">Suitpax AI Assistant</h3>
            <p className="text-xs text-white/70">How can I help with your travel plans today?</p>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about business travel..."
              className="w-full pl-4 pr-20 py-3 text-sm bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
            />

            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-1.5 rounded-full ${
                  isRecording ? "bg-red-500/20 text-red-400" : "hover:bg-white/10 text-white/70"
                }`}
              >
                <Mic className="h-4 w-4" />
              </button>

              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`p-1.5 rounded-full ${
                  inputValue.trim() ? "bg-white/10 text-white hover:bg-white/20" : "text-white/30 cursor-not-allowed"
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2 mt-3">
            <SuggestionChip label="Book a flight to New York" />
            <SuggestionChip label="Find hotels in San Francisco" />
            <SuggestionChip label="What's my travel budget?" />
            <SuggestionChip label="Expense policy for meals" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SuggestionChip({ label }: { label: string }) {
  return (
    <button className="px-3 py-1.5 bg-white/5 text-white/70 rounded-full text-xs hover:bg-white/10 hover:text-white transition-colors">
      {label}
    </button>
  )
}
