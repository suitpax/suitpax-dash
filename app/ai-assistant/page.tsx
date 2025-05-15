"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Send, Mic, X, ChevronRight, Menu } from "lucide-react"
import {
  BriefcaseIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  ReceiptRefundIcon,
  TruckIcon,
  SparklesIcon,
  LightBulbIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  CreditCardIcon,
  UserIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline"
import type { Message } from "@/lib/ai/anthropic-service"

export default function AiAssistantPage() {
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll al final de los mensajes solo cuando es necesario
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      const container = messagesEndRef.current.parentElement
      if (container) {
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 150
        if (isAtBottom) {
          // Usar requestAnimationFrame para asegurar que el DOM se ha actualizado
          requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
          })
        }
      }
    }
  }, [messages])

  // Ajustar altura del textarea automáticamente
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [inputValue])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isTyping) {
      // Añadir mensaje del usuario
      const userMessage: Message = {
        role: "user",
        content: inputValue,
        id: Date.now().toString(),
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setInputValue("")
      setIsTyping(true)

      try {
        // Llamar a la API real de Anthropic
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            systemPrompt:
              "You are Suitpax AI, a helpful assistant for business travel management. Help users plan trips, find flights and hotels, manage expenses, and navigate travel policies. Be concise but informative. Provide specific details when possible.",
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        // Añadir respuesta de la IA
        setMessages((prev) => [
          ...prev,
          {
            ...data.response,
            createdAt: new Date(data.response.createdAt),
          },
        ])
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
      }
    }
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

  // Categorías de IA
  const aiCategories = [
    { id: "businessTravel", name: "Business Travel", icon: BriefcaseIcon },
    { id: "flights", name: "Flights", icon: PaperAirplaneIcon },
    { id: "hotels", name: "Hotels", icon: BuildingOfficeIcon },
    { id: "expenses", name: "Expenses", icon: ReceiptRefundIcon },
    { id: "transportation", name: "Transportation", icon: TruckIcon },
    { id: "analytics", name: "Analytics", icon: ChartBarIcon },
    { id: "policies", name: "Travel Policies", icon: DocumentTextIcon },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`fixed md:relative inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 bg-black border-r border-white/10 w-64 flex-shrink-0`}
        >
          {/* Sidebar Header */}
          <div className="h-14 px-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center">
              <div className="relative h-7 w-7 mr-2 bg-white/10 rounded-full overflow-hidden flex items-center justify-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250405-WA0006.jpg-ssy02udC7rU3LK1do6bZYdDCxA1Z2R.jpeg"
                  alt="AI Assistant"
                  width={28}
                  height={28}
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-sm text-white font-medium">Suitpax AI</h2>
                <p className="text-[10px] text-white/70 font-light">Business Travel AI</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg hover:bg-white/5 text-white/70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="p-3 space-y-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
            {/* AI Capabilities */}
            <div>
              <h3 className="text-[10px] font-medium tracking-tighter uppercase text-white/50 mb-2 px-2">
                AI Capabilities
              </h3>
              <div className="space-y-1">
                {aiCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full flex items-center px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? "bg-white/10 text-white font-medium"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <category.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Conversations */}
            <div>
              <h3 className="text-[10px] font-medium tracking-tighter uppercase text-white/50 mb-2 px-2">
                Recent Conversations
              </h3>
              <div className="space-y-1">
                <button className="w-full flex items-center px-3 py-1.5 text-xs rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                  <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Flight to New York</span>
                </button>
                <button className="w-full flex items-center px-3 py-1.5 text-xs rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                  <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Hotel in Barcelona</span>
                </button>
                <button className="w-full flex items-center px-3 py-1.5 text-xs rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                  <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Expense report help</span>
                </button>
              </div>
            </div>

            {/* Settings */}
            <div>
              <h3 className="text-[10px] font-medium tracking-tighter uppercase text-white/50 mb-2 px-2">Settings</h3>
              <div className="space-y-1">
                <button className="w-full flex items-center px-3 py-1.5 text-xs rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                  <UserIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Profile</span>
                </button>
                <button className="w-full flex items-center px-3 py-1.5 text-xs rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                  <Cog6ToothIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Preferences</span>
                </button>
                <button className="w-full flex items-center px-3 py-1.5 text-xs rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                  <CreditCardIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Billing</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <div className="h-14 border-b border-white/10 flex items-center px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1.5 mr-2 rounded-lg bg-white/5 text-white/70"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center">
              <h1 className="text-lg font-medium text-white">AI Assistant</h1>
              <span className="ml-2 px-2 py-0.5 text-xs bg-white/10 rounded-full text-white/70">
                Powered by Anthropic
              </span>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-white/5 p-4 rounded-full mb-4">
                  <SparklesIcon className="h-8 w-8 text-white/70" />
                </div>
                <h2 className="text-xl font-medium text-white mb-2">How can I help you today?</h2>
                <p className="text-white/70 max-w-md mb-6">
                  Ask me about flight bookings, hotels, travel policies, or any questions related to business travel.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                  <SuggestionCard
                    icon={<PaperAirplaneIcon className="h-5 w-5" />}
                    title="Book a Flight"
                    description="I can help you find and book flights based on your preferences and company policy."
                    onClick={() => setInputValue("I need to book a flight from Madrid to London next week.")}
                  />
                  <SuggestionCard
                    icon={<BuildingOfficeIcon className="h-5 w-5" />}
                    title="Find a Hotel"
                    description="Let me search for hotels that match your needs and comply with your travel policy."
                    onClick={() => setInputValue("I need a hotel in Paris for 3 nights starting June 15th.")}
                  />
                  <SuggestionCard
                    icon={<ReceiptRefundIcon className="h-5 w-5" />}
                    title="Expense Management"
                    description="I can guide you through submitting and tracking your business travel expenses."
                    onClick={() => setInputValue("How do I submit my travel expenses for reimbursement?")}
                  />
                  <SuggestionCard
                    icon={<DocumentTextIcon className="h-5 w-5" />}
                    title="Travel Policy"
                    description="Ask me about your company's travel policies and compliance requirements."
                    onClick={() => setInputValue("What is our company policy on business class flights?")}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    {message.role === "assistant" && (
                      <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250405-WA0006.jpg-ssy02udC7rU3LK1do6bZYdDCxA1Z2R.jpeg"
                          alt="AI"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-xl p-3 ${
                        message.role === "user"
                          ? "bg-white/10 text-white rounded-tr-none"
                          : "bg-white/5 text-white/70 rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div className="mt-1 text-right">
                        <span className="text-[10px] text-white/50">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250405-WA0006.jpg-ssy02udC7rU3LK1do6bZYdDCxA1Z2R.jpeg"
                        alt="AI"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="bg-white/5 text-white/70 rounded-xl rounded-tl-none max-w-[80%] p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-white/30 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-white/30 rounded-full animate-bounce"
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

          {/* Input Area */}
          <div className="p-4 border-t border-white/10">
            <div className="mb-2 flex items-center">
              <LightBulbIcon className="h-4 w-4 text-white/50 mr-2" />
              <span className="text-xs text-white/50">Try using voice input or type your question</span>
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
                  className={`w-full py-2 px-3 pr-16 bg-white/5 border ${
                    isFocused ? "border-white/20" : "border-white/10"
                  } rounded-xl focus:outline-none text-sm text-white min-h-[40px] max-h-[120px] resize-none`}
                  rows={1}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button type="button" className="p-1.5 rounded-xl hover:bg-white/5 text-white/50 hover:text-white/70">
                    <Mic className="h-4 w-4" />
                  </button>
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className={`p-1.5 rounded-xl transition-colors duration-200 ${
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
  )
}

interface SuggestionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}

function SuggestionCard({ icon, title, description, onClick }: SuggestionCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left"
    >
      <div className="p-2 bg-white/10 rounded-lg mb-3">{icon}</div>
      <h3 className="text-sm font-medium text-white mb-1">{title}</h3>
      <p className="text-xs text-white/70 mb-2">{description}</p>
      <div className="flex items-center text-xs text-white/50 mt-auto">
        <span>Try it</span>
        <ChevronRight className="h-3 w-3 ml-1" />
      </div>
    </button>
  )
}
