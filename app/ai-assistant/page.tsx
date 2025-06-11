"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Layout from "@/components/ui/layout"
import Image from "next/image"
import { getRandomPromptsFromAll, getRandomPrompts, promptCategories } from "@/data/prompts"
import {
  BriefcaseIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  ReceiptRefundIcon,
  TruckIcon,
  ArrowRightIcon,
  SparklesIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline"
import VoiceRecognition from "@/components/ui/voice-recognition"

// Mapa de iconos para las categorías
const categoryIcons = {
  Briefcase: BriefcaseIcon,
  Plane: PaperAirplaneIcon,
  Building: BuildingOfficeIcon,
  Receipt: ReceiptRefundIcon,
  Car: TruckIcon,
}

export default function AiAssistantPage() {
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([])
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Cargar sugerencias iniciales
  useEffect(() => {
    setQuickSuggestions(getRandomPromptsFromAll(5))
  }, [])

  // Cambiar sugerencias cuando cambia la categoría
  useEffect(() => {
    if (activeCategory) {
      setSuggestions(getRandomPrompts(activeCategory, 8))
    } else {
      setSuggestions(getRandomPromptsFromAll(8))
    }
  }, [activeCategory])

  // Scroll al final de los mensajes cuando se añade uno nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Ajustar altura del textarea automáticamente
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [inputValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      // Añadir mensaje del usuario
      setMessages((prev) => [...prev, { role: "user", content: inputValue }])

      // Simular respuesta de la IA
      setIsTyping(true)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Here's information about "${inputValue}". Do you need more details or have another question?`,
          },
        ])
        setIsTyping(false)

        // Generar nuevas sugerencias rápidas
        setQuickSuggestions(getRandomPromptsFromAll(5))
      }, 1500)

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
    // Enviar automáticamente
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

  // Manejar la transcripción de voz
  const handleVoiceTranscript = (text: string) => {
    setInputValue((prev) => prev + text)
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
            <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-medium tracking-tighter text-black">Travel Assistant</h1>
            <p className="text-gray-600">Your AI-powered business travel companion</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar with categories and suggestions */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-black p-4 shadow-sm sticky top-4">
              <h2 className="font-medium text-black mb-3">Categories</h2>
              <div className="space-y-2 mb-6">
                {promptCategories.map((category) => {
                  const Icon = categoryIcons[category.icon as keyof typeof categoryIcons]
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full flex items-center px-3 py-1.5 rounded-xl transition-colors ${
                        activeCategory === category.id
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 mr-2" />
                      {category.name}
                    </button>
                  )
                })}
              </div>

              <h2 className="font-medium text-black mb-3">Popular Questions</h2>
              <div className="space-y-2">
                {suggestions.slice(0, 5).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-2 text-xs text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main chat area */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl border border-black shadow-sm overflow-hidden flex flex-col h-[calc(100vh-180px)]">
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <SparklesIcon className="h-8 w-8 text-gray-600" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-800 mb-2">How can I help you today?</h2>
                    <p className="text-gray-600 max-w-md mb-6">
                      Ask me about flight bookings, hotels, travel policies, or any questions related to business
                      travel.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {quickSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickSuggestionClick(suggestion)}
                          className="inline-flex items-center rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          {suggestion.length > 30 ? suggestion.substring(0, 30) + "..." : suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        {message.role === "assistant" && (
                          <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                            <Image src="/images/ai-agent-avatar.jpeg" alt="AI" fill className="object-cover" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-xl p-3 ${
                            message.role === "user"
                              ? "bg-black text-white rounded-tr-none"
                              : "bg-gray-200 text-gray-800 rounded-tl-none"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                          <Image src="/images/ai-agent-avatar.jpeg" alt="AI" fill className="object-cover" />
                        </div>
                        <div className="bg-gray-200 text-gray-800 rounded-xl rounded-tl-none max-w-[80%] p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
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

              {/* Quick suggestions */}
              {messages.length > 0 && (
                <div className="px-4 py-3 flex flex-wrap gap-2 border-t border-gray-200">
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSuggestionClick(suggestion)}
                      className="inline-flex items-center rounded-xl bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {suggestion.length > 40 ? suggestion.substring(0, 40) + "..." : suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Input area */}
              <div className="p-4 border-t border-gray-200">
                <div className="mb-2 flex items-center">
                  <LightBulbIcon className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-xs text-gray-500">Try using voice input or type your question</span>
                </div>

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
                      className={`w-full py-2 px-3 pr-16 bg-white border ${
                        isFocused ? "border-black" : "border-gray-300"
                      } rounded-xl focus:outline-none text-xs text-black min-h-[40px] max-h-[120px] resize-none`}
                      rows={1}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <VoiceRecognition
                        onTranscript={handleVoiceTranscript}
                        buttonSize="sm"
                        className="hover:bg-gray-200"
                      />
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
