"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { getRandomPromptsFromAll, getRandomPrompts, promptCategories } from "@/data/prompts"
import { enhancedAiService } from "@/lib/ai/ai-service-enhanced"
import { Send, Sparkles, MessageCircle, ArrowRight, Zap, Brain, Globe, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

const categoryIcons = {
  Briefcase: Brain,
  Plane: Globe,
  Building: MessageCircle,
  Receipt: Clock,
  Car: Zap,
}

export default function AiAssistantPage() {
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([])
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; id: string; createdAt: Date }[]
  >([])
  const [isTyping, setIsTyping] = useState(false)
  const [showFullChatPrompt, setShowFullChatPrompt] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  // Cargar sugerencias iniciales
  useEffect(() => {
    try {
      const randomPrompts = getRandomPromptsFromAll(6)
      setQuickSuggestions(
        randomPrompts.length > 0
          ? randomPrompts
          : [
              "Book a flight from Madrid to London",
              "Find hotels near our office",
              "What's our travel policy?",
              "Arrange team transportation",
              "Check flight status",
              "Book meeting room",
            ],
      )
    } catch (error) {
      console.error("Error loading suggestions:", error)
    }
  }, [])

  // Cambiar sugerencias cuando cambia la categoría
  useEffect(() => {
    if (activeCategory) {
      try {
        setSuggestions(getRandomPrompts(activeCategory, 8))
      } catch (error) {
        setSuggestions([])
      }
    } else {
      try {
        setSuggestions(getRandomPromptsFromAll(8))
      } catch (error) {
        setSuggestions([])
      }
    }
  }, [activeCategory])

  // Scroll al final de los mensajes
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Mostrar prompt para ir al chat completo cuando hay texto
  useEffect(() => {
    setShowFullChatPrompt(inputValue.trim().length > 0)
  }, [inputValue])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      const userMessage = {
        role: "user" as const,
        content: inputValue,
        id: Date.now().toString(),
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setIsTyping(true)

      try {
        const apiMessages = [...messages, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
          id: msg.id,
          createdAt: msg.createdAt || new Date(),
        }))

        const response = await enhancedAiService.generateResponse({
          messages: apiMessages,
          useInternalSystem: true,
        })

        if (response.response) {
          setMessages((prev) => [...prev, response.response])
        }

        // Generar nuevas sugerencias
        try {
          const randomPrompts = getRandomPromptsFromAll(6)
          setQuickSuggestions(
            randomPrompts.length > 0
              ? randomPrompts
              : [
                  "Book a flight from Madrid to London",
                  "Find hotels near our office",
                  "What's our travel policy?",
                  "Arrange team transportation",
                  "Check flight status",
                  "Book meeting room",
                ],
          )
        } catch (error) {
          console.error("Error loading new suggestions:", error)
        }
      } catch (error) {
        console.error("Error al obtener respuesta de la IA:", error)
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

  const goToFullChat = () => {
    router.push("/ai-agent")
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-3">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
              <Image src="/images/ai-agent-avatar-new.jpg" alt="AI Assistant" fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-white">Suitpax AI Assistant</h1>
              <p className="text-white/70">Your intelligent business travel companion</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar con categorías */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-lg border border-white/10 p-3 sticky top-4">
              <h2 className="font-medium text-white mb-3">Categories</h2>
              <div className="space-y-1 mb-4">
                {promptCategories.map((category) => {
                  const Icon = categoryIcons[category.icon as keyof typeof categoryIcons] || MessageCircle
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  )
                })}
              </div>

              {suggestions.length > 0 && (
                <>
                  <h3 className="font-medium text-white mb-2 text-sm">Popular Questions</h3>
                  <div className="space-y-1">
                    {suggestions.slice(0, 6).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-2 text-xs text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                      >
                        {suggestion.length > 50 ? suggestion.substring(0, 50) + "..." : suggestion}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Área principal de chat */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden flex flex-col h-[calc(100vh-200px)]">
              {/* Mensajes de chat */}
              <div className="flex-1 overflow-y-auto p-3 bg-black/30">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="bg-white/5 p-4 rounded-full mb-4">
                      <Sparkles className="h-8 w-8 text-white/70" />
                    </div>
                    <h2 className="text-xl font-medium text-white mb-2">How can I help you today?</h2>
                    <p className="text-white/70 max-w-md mb-6">
                      Ask me about flight bookings, hotels, travel policies, or any questions related to business
                      travel.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                      {quickSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickSuggestionClick(suggestion)}
                          className="inline-flex items-center rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors border border-white/10"
                        >
                          {suggestion.length > 35 ? suggestion.substring(0, 35) + "..." : suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        {message.role === "assistant" && (
                          <div className="relative h-7 w-7 rounded-full overflow-hidden mr-2 flex-shrink-0 mt-1">
                            <Image src="/images/ai-agent-avatar-new.jpg" alt="AI" fill className="object-cover" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-white/10 text-white rounded-tr-none"
                              : "bg-white/5 text-white/70 rounded-tl-none"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="relative h-7 w-7 rounded-full overflow-hidden mr-2 flex-shrink-0 mt-1">
                          <Image src="/images/ai-agent-avatar-new.jpg" alt="AI" fill className="object-cover" />
                        </div>
                        <div className="bg-white/5 text-white/70 rounded-lg rounded-tl-none max-w-[80%] p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
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

              {/* Sugerencias rápidas cuando hay mensajes */}
              {messages.length > 0 && (
                <div className="px-3 py-2 flex flex-wrap gap-2 border-t border-white/10">
                  {quickSuggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSuggestionClick(suggestion)}
                      className="inline-flex items-center rounded-lg bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors border border-white/10"
                    >
                      {suggestion.length > 30 ? suggestion.substring(0, 30) + "..." : suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Área de input */}
              <div className="p-3 border-t border-white/10">
                {/* Prompt para ir al chat completo */}
                {showFullChatPrompt && (
                  <div className="mb-2">
                    <button
                      onClick={goToFullChat}
                      className="flex items-center text-xs text-white/50 hover:text-white/70 transition-colors"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Go to full chat experience
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="relative">
                  <div className="flex items-start">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0 mt-1">
                      <Image src="/images/ai-agent-avatar-new.jpg" alt="AI" fill className="object-cover" />
                    </div>
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Ask your travel assistant..."
                        className={`w-full py-2 px-3 pr-12 bg-white/5 border ${
                          isFocused ? "border-white/20" : "border-white/10"
                        } rounded-lg focus:outline-none text-sm text-white placeholder:text-white/30 min-h-[40px] max-h-[120px] resize-none`}
                        rows={1}
                      />
                      <button
                        type="submit"
                        disabled={!inputValue.trim() || isTyping}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors duration-200 ${
                          inputValue.trim() && !isTyping
                            ? "bg-white/10 text-white hover:bg-white/20"
                            : "bg-white/5 text-white/30 cursor-not-allowed"
                        }`}
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
