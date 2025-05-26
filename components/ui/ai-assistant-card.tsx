"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { getRandomPromptsFromAll } from "@/data/prompts"
import { enhancedAiService } from "@/lib/ai/ai-service-enhanced"
import { Send } from "lucide-react"

const fallbackQuestions = [
  "How can I book a flight?",
  "What is the baggage policy?",
  "Can I modify my hotel reservation?",
  "How do I report travel expenses?",
  "What documents do I need for international travel?",
]

export default function AiAssistantCard() {
  const [inputValue, setInputValue] = useState("")
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([])
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; id: string; createdAt: Date }[]
  >([])
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Load initial suggestions
  useEffect(() => {
    try {
      const randomPrompts = getRandomPromptsFromAll(4)
      setQuickSuggestions(randomPrompts.length > 0 ? randomPrompts : fallbackQuestions.slice(0, 4))
    } catch (error) {
      console.error("Error loading initial suggestions:", error)
      setQuickSuggestions(fallbackQuestions.slice(0, 4))
    }
  }, [])

  // Scroll to the end of messages when a new one is added
  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      const userMessage = { role: "user", content: inputValue, id: Date.now().toString(), createdAt: new Date() }
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

        try {
          const randomPrompts = getRandomPromptsFromAll(4)
          setQuickSuggestions(randomPrompts.length > 0 ? randomPrompts : fallbackQuestions.slice(0, 4))
        } catch (error) {
          console.error("Error loading new quick suggestions:", error)
          setQuickSuggestions(fallbackQuestions.slice(0, 4))
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
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    }, 100)
  }

  return (
    <div className="bg-black border border-white/10 rounded-lg p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
          <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
        </div>

        <div className="flex-1">
          <div className="mb-2">
            <h3 className="text-sm font-medium text-white">Suitpax AI Assistant</h3>
            <p className="text-xs text-white/70">How can I help with your travel plans today?</p>
          </div>

          {/* Chat Messages */}
          {messages.length > 0 && (
            <div
              ref={chatContainerRef}
              className="max-h-48 overflow-y-auto mb-3 space-y-2 border border-white/10 rounded-lg p-2 bg-black/30"
            >
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-2 text-xs ${
                      message.role === "user"
                        ? "bg-white/10 text-white rounded-tr-none"
                        : "bg-white/5 text-white/70 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 text-white/70 rounded-lg rounded-tl-none max-w-[80%] p-2">
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

          <form onSubmit={handleSubmit} className="relative mb-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about business travel..."
              className="w-full pl-3 pr-10 py-2 text-xs bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
            />

            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                inputValue.trim() ? "bg-white/10 text-white hover:bg-white/20" : "text-white/30 cursor-not-allowed"
              }`}
            >
              <Send className="h-3 w-3" />
            </button>
          </form>

          <div className="flex flex-wrap gap-1">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-2 py-1 bg-white/5 text-white/70 rounded-lg text-xs hover:bg-white/10 hover:text-white transition-colors border border-white/10"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
