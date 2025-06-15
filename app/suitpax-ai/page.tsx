"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Settings, Plus, Brain, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { TypingEffect } from "@/components/ui/typing-effect"
import { useSpeechRecognition } from "@/lib/hooks/use-speech-recognition"
import { AnimatedAIChat } from "@/components/ui/animated-ai-chat"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
  thinking?: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

const suggestedQueries = [
  "How do I search for flights on Suitpax?",
  "What are your pricing plans?",
  "How can I track my travel expenses?",
  "Show me how to manage my team",
  "What integrations do you have?",
  "How do I set up travel policies?",
  "Can you help me with the onboarding process?",
  "What's included in the Pro plan?",
]

const aiAgents = [
  {
    id: 1,
    name: "Travel Expert",
    avatar: "/images/ai-agents/agent-1.jpg",
    specialty: "Flight & Hotel Booking",
    status: "online",
  },
  {
    id: 2,
    name: "Finance AI",
    avatar: "/images/ai-agents/agent-2.jpg",
    specialty: "Expense Management",
    status: "online",
  },
  {
    id: 3,
    name: "Policy Guide",
    avatar: "/images/ai-agents/agent-3.jpg",
    specialty: "Travel Policies",
    status: "online",
  },
  { id: 4, name: "Support Bot", avatar: "/images/ai-agents/agent-4.jpg", specialty: "General Support", status: "busy" },
]

export default function SuitpaxAIPage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [thinkingMode, setThinkingMode] = useState(false)
  const [showThinking, setShowThinking] = useState(false)
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

  // Initialize with welcome conversation
  useEffect(() => {
    const welcomeConversation: Conversation = {
      id: "welcome",
      title: "Welcome Chat",
      messages: [
        {
          id: "welcome-msg",
          role: "assistant",
          content:
            "Hello! I'm Suitpax AI, your intelligent corporate travel assistant created by Alberto and Alexis. I can communicate in multiple languages and will automatically detect and respond in your preferred language. I can help you navigate our platform, understand our features, manage expenses, and optimize your business travel. How can I assist you today?",
          timestamp: new Date(),
          isTyping: true,
        },
      ],
      createdAt: new Date(),
    }
    setConversations([welcomeConversation])
    setActiveConversation(welcomeConversation)
  }, [])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConversation?.messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !activeConversation || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    // Update conversation with user message
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, userMessage],
      title:
        activeConversation.title === "Welcome Chat"
          ? input.trim().substring(0, 30) + (input.trim().length > 30 ? "..." : "")
          : activeConversation.title,
    }

    setActiveConversation(updatedConversation)
    setConversations((prev) => prev.map((conv) => (conv.id === activeConversation.id ? updatedConversation : conv)))
    setInput("")
    resetTranscript()
    setIsLoading(true)
    setShowThinking(thinkingMode)

    try {
      // Call AI API with thinking mode
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          thinkingMode: thinkingMode,
          isPro: true,
          plan: "business",
          conversationId: activeConversation.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Disculpa, estoy teniendo dificultades técnicas. Por favor intenta de nuevo.",
        timestamp: new Date(),
        isTyping: true,
        thinking: data.thinking || undefined,
      }

      // Update conversation with assistant response
      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
      }

      setActiveConversation(finalConversation)
      setConversations((prev) => prev.map((conv) => (conv.id === activeConversation.id ? finalConversation : conv)))
    } catch (error) {
      console.error("Error getting AI response:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Lo siento, he encontrado un error al procesar tu solicitud. Por favor intenta de nuevo o contacta soporte si el problema persiste.",
        timestamp: new Date(),
        isTyping: true,
      }

      const errorConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, errorMessage],
      }

      setActiveConversation(errorConversation)
      setConversations((prev) => prev.map((conv) => (conv.id === activeConversation.id ? errorConversation : conv)))
    } finally {
      setIsLoading(false)
      setShowThinking(false)
    }
  }

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [
        {
          id: "new-welcome",
          role: "assistant",
          content: "Hello! I'm Suitpax AI. How can I help you with your business travel needs?",
          timestamp: new Date(),
          isTyping: true,
        },
      ],
      createdAt: new Date(),
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-5xl mx-auto h-screen flex flex-col">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-0.5">
                <div className="h-full w-full rounded-2xl overflow-hidden">
                  <Image src="/images/ai-agent-avatar.jpeg" alt="Suitpax AI" fill className="object-cover" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div>
              <h1 className="text-2xl font-light text-white tracking-tight">Suitpax AI</h1>
              <p className="text-sm text-white/60 font-light">Tu asistente inteligente de viajes</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Thinking Mode Toggle */}
            <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <Brain className={`h-4 w-4 ${thinkingMode ? "text-purple-400" : "text-white/50"}`} />
              <span className="text-sm font-light">Thinking Mode</span>
              <Switch
                checked={thinkingMode}
                onCheckedChange={setThinkingMode}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>

            <Button
              onClick={createNewConversation}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl h-10 px-4 font-light transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Chat
            </Button>
            <Button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl h-10 w-10 p-0 transition-all duration-200">
              <Settings className="h-4 w-4 text-white/70" />
            </Button>
          </div>
        </div>

        {/* Enhanced AI Agents Row */}
        <div className="p-4 border-b border-white/10 bg-black/10">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <div className="flex items-center space-x-2 text-white/70">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-light whitespace-nowrap">Agentes Especializados:</span>
            </div>
            {aiAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 whitespace-nowrap min-w-fit"
              >
                <div className="relative">
                  <div className="h-8 w-8 rounded-xl overflow-hidden">
                    <Image src={agent.avatar || "/placeholder.svg"} alt={agent.name} fill className="object-cover" />
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border border-black ${
                      agent.status === "online" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  ></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{agent.name}</p>
                  <p className="text-xs text-white/50 font-light">{agent.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeConversation?.messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                {message.role === "assistant" && (
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-8 w-8 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-0.5">
                      <div className="h-full w-full rounded-xl overflow-hidden">
                        <Image src="/images/ai-agent-avatar.jpeg" alt="AI" fill className="object-cover" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white">Suitpax AI</span>
                      {thinkingMode && message.thinking && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                          <Brain className="h-3 w-3 mr-1" />
                          Pensando
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Thinking Process (if enabled and available) */}
                {message.thinking && thinkingMode && (
                  <div className="mb-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-medium text-purple-300">Proceso de Razonamiento</span>
                    </div>
                    <p className="text-sm text-purple-200/80 font-light italic">{message.thinking}</p>
                  </div>
                )}

                <div
                  className={`rounded-2xl py-4 px-5 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-md shadow-lg"
                      : "bg-white/5 text-white rounded-tl-md border border-white/10 backdrop-blur-sm"
                  }`}
                >
                  <div className="text-sm leading-relaxed font-light">
                    {message.isTyping && message.role === "assistant" ? (
                      <TypingEffect text={message.content} speed={25} />
                    ) : (
                      message.content.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < message.content.split("\n").length - 1 && <br />}
                        </span>
                      ))
                    )}
                  </div>
                  <div className="mt-3 text-xs opacity-60 font-light flex items-center justify-between">
                    <span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {message.role === "assistant" && (
                      <div className="flex items-center space-x-1">
                        <Zap className="h-3 w-3" />
                        <span>AI</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Enhanced Loading State */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%]">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-8 w-8 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-0.5">
                    <div className="h-full w-full rounded-xl overflow-hidden">
                      <Image src="/images/ai-agent-avatar.jpeg" alt="AI" fill className="object-cover" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">Suitpax AI</span>
                    {showThinking && (
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs animate-pulse">
                        <Brain className="h-3 w-3 mr-1" />
                        Analizando...
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl rounded-tl-md py-4 px-5 border border-white/10 backdrop-blur-sm">
                  <div className="flex space-x-2">
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

        {/* Enhanced Suggested Queries */}
        {activeConversation?.messages.length === 1 && (
          <div className="px-6 pb-4">
            <div className="mb-3 flex items-center space-x-2 text-white/70">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-light">Sugerencias para empezar:</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {suggestedQueries.slice(0, 8).map((query, index) => (
                <Badge
                  key={index}
                  onClick={() => handleSuggestedQuery(query)}
                  className="bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 cursor-pointer rounded-xl text-xs px-3 py-2 font-light transition-all duration-200 hover:scale-105 text-center"
                >
                  {query}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Chat Input */}
        <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <AnimatedAIChat />
        </div>
      </div>
    </div>
  )
}
