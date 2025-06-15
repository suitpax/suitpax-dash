"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Bot, Settings, Trash2, Plus, MessageCircle, Brain, Zap, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { TypingEffect } from "@/components/ui/typing-effect"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  agent?: {
    name: string
    specialty: string
    avatar: string
  }
  tokens?: number
  cost?: string
  thinkingMode?: boolean
  detectedLanguage?: string
  actionExecuted?: boolean
  actionResult?: any
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

export default function SuitpaxAIPage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [thinkingMode, setThinkingMode] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize with welcome conversation
  useEffect(() => {
    const welcomeConversation: Conversation = {
      id: "welcome",
      title: "Suitpax AI",
      messages: [
        {
          id: "welcome-msg",
          role: "assistant",
          content: "Hey, I'm Suitpax AI. What's your next trip?",
          timestamp: new Date(),
          agent: {
            name: "Suitpax AI",
            specialty: "Advanced Travel Intelligence",
            avatar: "/images/ai-agent-avatar.png",
          },
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

  // Update typing state
  useEffect(() => {
    setIsTyping(input.length > 0)
  }, [input])

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
        activeConversation.title === "Suitpax AI"
          ? input.trim().substring(0, 35) + (input.trim().length > 35 ? "..." : "")
          : activeConversation.title,
    }

    setActiveConversation(updatedConversation)
    setConversations((prev) => prev.map((conv) => (conv.id === activeConversation.id ? updatedConversation : conv)))
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId: activeConversation.id,
          thinkingMode,
          userProfile: {
            name: "Business Traveler",
            plan: "pro",
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I'm having trouble processing your request. Please try again.",
        timestamp: new Date(),
        agent: data.selectedAgent,
        tokens: data.tokens,
        cost: data.cost,
        thinkingMode: data.thinkingMode,
        detectedLanguage: data.detectedLanguage,
        actionExecuted: data.actionExecuted,
        actionResult: data.actionResult,
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
        content: "I'm experiencing technical difficulties. Please try again or contact support.",
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
          content: "Hey, I'm ready to help with your business travel needs. What can I do for you?",
          timestamp: new Date(),
          agent: {
            name: "Suitpax AI",
            specialty: "Advanced Travel Intelligence",
            avatar: "/images/ai-agent-avatar.png",
          },
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
      {/* Enhanced Sidebar with MCP Status */}
      <div
        className={`${showSidebar ? "w-80" : "w-0"} transition-all duration-300 border-r border-white/10 flex flex-col overflow-hidden bg-black/50 backdrop-blur-sm`}
      >
        {/* Sidebar Header with MCP Status */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
              </div>
              <div>
                <h2 className="font-medium text-white">Suitpax AI</h2>
                <p className="text-xs text-white/60">Advanced Travel Intelligence</p>
              </div>
            </div>
            <Button
              onClick={createNewConversation}
              size="sm"
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full h-8 w-8 p-0 transition-all hover:scale-105"
            >
              <Plus className="h-4 w-4 text-white" />
            </Button>
          </div>

          {/* MCP Status Indicator */}
          <div className="mb-4">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-white/80">MCP Status</span>
              </div>
              <Badge className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded-full border border-red-500/30">
                Offline
              </Badge>
            </div>
          </div>

          {/* AI Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white/80">Deep Analysis</span>
              </div>
              <Switch
                checked={thinkingMode}
                onCheckedChange={setThinkingMode}
                className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-white/20"
              />
            </div>

            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-300">Auto Actions</span>
              </div>
              <p className="text-xs text-green-400/70 mt-1">Creates tasks & expenses automatically</p>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          <div className="p-2 space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => selectConversation(conversation)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  activeConversation?.id === conversation.id
                    ? "bg-gradient-to-r from-white/15 to-white/5 border border-white/20 shadow-lg"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <MessageCircle className="h-3 w-3 text-white/50 flex-shrink-0" />
                    <span className="text-sm font-medium text-white truncate">{conversation.title}</span>
                  </div>
                  <p className="text-xs text-white/50">{conversation.messages.length} messages</p>
                </div>
                <Button
                  onClick={(e) => deleteConversation(conversation.id, e)}
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 bg-transparent hover:bg-red-500/20 h-6 w-6 p-0 rounded-full transition-all"
                >
                  <Trash2 className="h-3 w-3 text-red-400" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Chat Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-black to-black/90 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowSidebar(!showSidebar)}
                size="sm"
                className="lg:hidden bg-white/10 hover:bg-white/20 border border-white/20 rounded-full h-8 w-8 p-0"
              >
                <Bot className="h-4 w-4 text-white" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="font-medium text-white">Suitpax AI</h1>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-xs text-white/60">Online • Auto Actions</p>
                    </div>
                    {thinkingMode && (
                      <Badge className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                        <Brain className="h-3 w-3 mr-1" />
                        Deep Mode
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 text-xs px-3 py-1 rounded-full border border-green-500/30">
                <Zap className="h-3 w-3 mr-1" />
                Pro Plan
              </Badge>
              <Button
                size="sm"
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full h-8 w-8 p-0 transition-all hover:scale-105"
              >
                <Settings className="h-4 w-4 text-white/70" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Messages with Action Indicators */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-black/20">
          {activeConversation?.messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                {message.role === "assistant" && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs text-white/60">
                      {message.agent?.name || "Suitpax AI"}
                      {message.agent?.specialty && <span className="text-white/40"> • {message.agent.specialty}</span>}
                    </span>
                    {message.tokens && (
                      <Badge className="bg-white/10 text-white/50 text-xs px-2 py-0.5 rounded-full border border-white/20">
                        {message.tokens}t
                      </Badge>
                    )}
                    {message.detectedLanguage && (
                      <Badge className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                        {message.detectedLanguage.toUpperCase()}
                      </Badge>
                    )}
                    {message.actionExecuted && (
                      <Badge className="bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded-full">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Action
                      </Badge>
                    )}
                  </div>
                )}
                <div
                  className={`rounded-2xl p-4 backdrop-blur-sm transition-all duration-200 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-white to-white/90 text-black rounded-tr-md shadow-lg"
                      : "bg-gradient-to-br from-white/10 to-white/5 text-white rounded-tl-md border border-white/10"
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {message.role === "assistant" ? (
                      <TypingEffect text={message.content} speed={35} />
                    ) : (
                      formatMessageContent(message.content)
                    )}
                  </div>
                  <div className="mt-2 text-xs opacity-70 flex items-center justify-between">
                    <span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <div className="flex items-center space-x-2">
                      {message.cost && <span className="text-green-400">€{message.cost}</span>}
                      {message.actionResult && (
                        <span className="text-green-400 text-xs">
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                          {message.actionResult.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs text-white/60">Suitpax AI</span>
                  {thinkingMode && (
                    <Badge className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                      <Brain className="h-3 w-3 mr-1" />
                      Analyzing...
                    </Badge>
                  )}
                </div>
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl rounded-tl-md p-4 border border-white/10">
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

        {/* Enhanced Chat Input */}
        <div className="p-4 border-t border-white/10 bg-gradient-to-r from-black/50 to-black/30 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <input
                id="main-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ask Suitpax AI to create tasks, expenses, or book travel..."
                disabled={isLoading}
                className={`w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-2xl pl-4 pr-20 py-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm ${
                  isFocused ? "bg-white/15 border-white/30 shadow-lg" : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 h-8 w-8 p-0 rounded-full transition-all hover:scale-105 shadow-lg"
                >
                  <Zap className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
