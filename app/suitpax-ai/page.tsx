"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Send, Paperclip, Mic, Bot, Settings, Trash2, Plus, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
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

export default function SuitpaxAIPage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
            "Hello! I'm your Suitpax AI travel assistant. I can help you with flight bookings, hotel reservations, expense management, travel policies, and much more. What can I assist you with today?",
          timestamp: new Date(),
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
          content: "Hello! I'm ready to help you with your business travel needs. What would you like to know?",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    }
    setConversations((prev) => [newConversation, ...prev])
    setActiveConversation(newConversation)
  }

  const selectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation)
  }

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConversations((prev) => prev.filter((conv) => conv.id !== id))
    if (activeConversation?.id === id) {
      const remaining = conversations.filter((conv) => conv.id !== id)
      setActiveConversation(remaining.length > 0 ? remaining[0] : null)
    }
  }

  const handleSuggestedQuery = (query: string) => {
    setInput(query)
  }

  const formatMessageContent = (content: string) => {
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className="h-full flex bg-black text-white">
      {/* Sidebar */}
      <div
        className={`${showSidebar ? "w-80" : "w-0"} transition-all duration-300 border-r border-white/10 flex flex-col overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src="/images/ai-agent-avatar.jpeg"
                  alt="Suitpax AI"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
              </div>
              <div>
                <h2 className="font-light text-white">Suitpax AI</h2>
                <p className="text-xs text-white/60 font-light">Business Travel Assistant</p>
              </div>
            </div>
            <Button
              onClick={createNewConversation}
              size="sm"
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          <div className="p-2 space-y-0.5">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => selectConversation(conversation)}
                className={`group flex items-center justify-between py-2 px-2 rounded-lg cursor-pointer transition-all ${
                  activeConversation?.id === conversation.id ? "bg-white/10 border border-white/20" : "hover:bg-white/5"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-0.5">
                    <MessageCircle className="h-3 w-3 text-white/50 flex-shrink-0" />
                    <span className="text-xs font-light text-white truncate">{conversation.title}</span>
                  </div>
                  <p className="text-[10px] text-white/50 font-light">{conversation.messages.length} messages</p>
                </div>
                <Button
                  onClick={(e) => deleteConversation(conversation.id, e)}
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 bg-transparent hover:bg-white/10 h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3 text-white/50" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="py-2 px-2 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowSidebar(!showSidebar)}
              size="sm"
              className="lg:hidden bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg h-8 w-8 p-0"
            >
              <Bot className="h-4 w-4 text-white" />
            </Button>
            <div className="flex items-center space-x-3">
              <Image
                src="/images/ai-agent-avatar.jpeg"
                alt="Suitpax AI"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <div>
                <h1 className="font-light text-white">Suitpax AI Assistant</h1>
                <p className="text-xs text-white/60 font-light">Online • Ready to help</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg h-8 w-8 p-0">
              <Settings className="h-4 w-4 text-white/70" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {activeConversation?.messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                {message.role === "assistant" && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Image
                      src="/images/ai-agent-avatar.jpeg"
                      alt="AI"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="text-xs text-white/50 font-light">Suitpax AI</span>
                  </div>
                )}
                <div
                  className={`rounded-lg py-2 px-2 ${
                    message.role === "user"
                      ? "bg-white text-black rounded-tr-none"
                      : "bg-white/5 text-white rounded-tl-none"
                  }`}
                >
                  <div className="text-xs leading-relaxed font-light">{formatMessageContent(message.content)}</div>
                  <div className="mt-1.5 text-[10px] opacity-70 font-light">
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
                  <Image src="/images/ai-agent-avatar.jpeg" alt="AI" width={20} height={20} className="rounded-full" />
                  <span className="text-xs text-white/50 font-light">Suitpax AI</span>
                </div>
                <div className="bg-white/5 rounded-lg rounded-tl-none py-2 px-2">
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
          <div className="px-2 pb-2">
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.slice(0, 4).map((query, index) => (
                <Badge
                  key={index}
                  onClick={() => handleSuggestedQuery(query)}
                  className="bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 cursor-pointer rounded-full text-[10px] px-2.5 py-0.5 font-light"
                >
                  {query}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="py-2 px-2 border-t border-white/10">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Input
                id="main-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your AI travel assistant anything..."
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-lg pl-3 pr-16 py-2 focus:ring-1 focus:ring-white/20 text-xs font-light"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  className="bg-transparent hover:bg-white/10 h-6 w-6 p-0 rounded-md"
                >
                  <Paperclip className="h-3 w-3 text-white/50" />
                </Button>
                <Button type="button" size="sm" className="bg-transparent hover:bg-white/10 h-6 w-6 p-0 rounded-md">
                  <Mic className="h-3 w-3 text-white/50" />
                </Button>
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="bg-white text-black hover:bg-white/90 disabled:opacity-50 h-6 w-6 p-0 rounded-md"
                >
                  <Send className="h-3 w-3" />
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
