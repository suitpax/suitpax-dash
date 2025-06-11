"use client"

import { useState, useRef, useEffect } from "react"
import ChatForm from "./chat-form"
import ChatMessage from "./chat-message"
import { Badge } from "@/components/ui/badge"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your Suitpax AI assistant. How can I help you with your business travel needs today?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          "I understand you're looking for assistance. As a travel assistant, I can help you with flight bookings, hotel reservations, travel policies, and expense management. What specific information do you need?",
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">Suitpax AI Assistant</h2>
          <Badge variant="outline" className="bg-white/5 text-white/70 border-white/10 text-xs rounded-full px-2">
            Online
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
        {isLoading && (
          <div className="flex items-center space-x-2 text-white/50">
            <div className="animate-bounce h-2 w-2 bg-white/50 rounded-full"></div>
            <div className="animate-bounce h-2 w-2 bg-white/50 rounded-full" style={{ animationDelay: "0.2s" }}></div>
            <div className="animate-bounce h-2 w-2 bg-white/50 rounded-full" style={{ animationDelay: "0.4s" }}></div>
          </div>
        )}
      </div>

      <ChatForm onSendMessage={handleSendMessage} isLoading={isLoading} placeholder="Try ask anything..." />
    </div>
  )
}
