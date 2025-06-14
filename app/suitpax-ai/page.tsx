"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TypingEffect } from "@/components/ui/typing-effect"
import { useSpeechRecognition } from "@/lib/hooks/use-speech-recognition"
import { PiPaperclip, PiMicrophone, PiMicrophoneSlash, PiGear, PiPlus, PiArrowRight } from "react-icons/pi"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

const suggestedQueries = [
  "Find flights to London",
  "Hotel recommendations in Tokyo",
  "Create travel checklist",
  "Expense policy for meals",
  "Draft approval request",
  "Best time to visit Paris",
  "Corporate travel guidelines",
  "Airport lounge access",
]

const aiAgents = [
  { id: 1, name: "Travel Agent", avatar: "/images/ai-agents/agent-1.jpg", specialty: "Flight & Hotel Booking" },
  { id: 2, name: "Expense Agent", avatar: "/images/ai-agents/agent-2.jpg", specialty: "Expense Management" },
  { id: 3, name: "Policy Agent", avatar: "/images/ai-agents/agent-3.jpg", specialty: "Travel Policies" },
  { id: 4, name: "Support Agent", avatar: "/images/ai-agents/agent-4.jpg", specialty: "General Support" },
]

export default function SuitpaxAIPage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [isFocused, setIsFocused] = useState(false)
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
          content: "Hey, welcome to Suitpax AI. How can I help you today?",
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

    try {
      // Call AI API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
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
        content:
          data.response || "I apologize, but I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date(),
        isTyping: true,
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
          "I'm sorry, I encountered an error while processing your request. Please try again or contact support if the issue persists.",
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
          content: "Hey, welcome to Suitpax AI. How can I help you today?",
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
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
              <Image src="/images/ai-agent-avatar.jpeg" alt="Suitpax AI" fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-white tracking-tight">Suitpax AI</h1>
              <p className="text-xs text-white/60 font-light">Business Travel Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
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
                  <div className="relative h-5 w-5 rounded-md overflow-hidden flex-shrink-0">
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
          {activeConversation?.messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                {message.role === "assistant" && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="relative h-6 w-6 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                      <Image src="/images/ai-agent-avatar.jpeg" alt="AI" fill className="object-cover" />
                    </div>
                    <span className="text-xs text-white/50 font-light">Suitpax AI</span>
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
                  <div className="mt-2 text-xs text-white/40 font-light">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="relative h-6 w-6 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                    <Image src="/images/ai-agent-avatar.jpeg" alt="AI" fill className="object-cover" />
                  </div>
                  <span className="text-xs text-white/50 font-light">Suitpax AI</span>
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
        {activeConversation?.messages.length === 1 && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.slice(0, 4).map((query, index) => (
                <Badge
                  key={index}
                  onClick={() => handleSuggestedQuery(query)}
                  className="bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer rounded-lg text-xs px-3 py-1.5 font-light transition-all duration-200"
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
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                <div className="relative h-7 w-7 rounded-lg overflow-hidden mr-2 bg-white/10 flex items-center justify-center">
                  <Image
                    src={isFocused ? "/images/ai-assistant-avatar.png" : "/images/ai-agent-avatar.jpeg"}
                    alt="AI Assistant"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <Input
                id="main-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={isListening ? "Listening..." : "Ask your AI travel assistant anything..."}
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl pl-12 pr-24 py-4 h-14 focus:ring-1 focus:ring-white/20 text-sm font-light transition-all duration-200 hover:bg-white/10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  className="bg-transparent hover:bg-white/10 h-8 w-8 p-0 rounded-lg transition-all duration-200"
                >
                  <PiPaperclip className="h-4 w-4 text-white/50 hover:text-white/70" />
                </Button>
                {isSupported && (
                  <Button
                    type="button"
                    onClick={toggleListening}
                    size="sm"
                    className={`h-8 w-8 p-0 rounded-lg transition-all duration-200 ${
                      isListening
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        : "bg-transparent hover:bg-white/10"
                    }`}
                  >
                    {isListening ? (
                      <PiMicrophoneSlash className="h-4 w-4" />
                    ) : (
                      <PiMicrophone className="h-4 w-4 text-white/50 hover:text-white/70" />
                    )}
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 h-8 w-8 p-0 rounded-lg transition-all duration-200 border border-white/20"
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
