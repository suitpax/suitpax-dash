"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  PlusIcon,
  CreditCardIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  BoltIcon,
  ChartBarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline"
import { TypingEffect } from "@/components/ui/typing-effect"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

export default function DashboardPage() {
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // User avatar - this would come from user context/auth
  const userAvatar =
    "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsLoading(true)
    setIsChatExpanded(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          isPro: true,
          plan: "business",
          conversationId: "dashboard-chat",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I apologize, but I'm having trouble processing your request right now.",
        timestamp: new Date(),
        isTyping: true,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again or contact support.",
        timestamp: new Date(),
        isTyping: true,
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputFocus = () => {
    setIsChatExpanded(true)
  }

  const handleInputBlur = () => {
    if (messages.length === 0) {
      setIsChatExpanded(false)
    }
  }

  return (
    <div className="min-h-screen bg-black p-3 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tighter text-white mb-2">Dashboard</h1>
              <p className="text-white/70 font-light">
                Welcome to Suitpax! Start by booking your first trip or connecting your bank account.
              </p>
            </div>

            {/* Quick Action Badges - Smaller Style */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/expenses"
                className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-light transition-all duration-200"
              >
                <PlusIcon className="h-3 w-3 mr-1.5" />
                Add Expense
              </Link>
              <Link
                href="/smart-bank"
                className="inline-flex items-center px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-full text-blue-300 hover:text-blue-200 text-xs font-light transition-all duration-200"
              >
                <CreditCardIcon className="h-3 w-3 mr-1.5" />
                Connect Bank
              </Link>
              <Link
                href="/flights"
                className="inline-flex items-center px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-xs font-medium transition-all duration-200"
              >
                <PaperAirplaneIcon className="h-3 w-3 mr-1.5" />
                Book Flight
              </Link>
              <Link
                href="/hotels"
                className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-light transition-all duration-200"
              >
                <BuildingOfficeIcon className="h-3 w-3 mr-1.5" />
                Hotels
              </Link>
              <Link
                href="/trains"
                className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-light transition-all duration-200"
              >
                <BoltIcon className="h-3 w-3 mr-1.5" />
                Trains
              </Link>
            </div>
          </div>
        </header>

        {/* AI Chat Section - More Prominent */}
        <div
          className={`bg-gradient-to-br from-white/8 to-white/4 border border-white/20 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
            isChatExpanded ? "p-6" : "p-5"
          } shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-2 ring-white/10">
                <Image src="/images/ai-agent-avatar.jpeg" alt="Suitpax AI" fill className="object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-light text-white">Suitpax AI Assistant</h2>
                <p className="text-sm text-white/60 font-light">Your intelligent travel companion</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
              <span className="text-xs text-green-400 font-light">● Online</span>
            </div>
          </div>

          {/* Messages */}
          {isChatExpanded && messages.length > 0 && (
            <div className="mb-6 max-h-80 overflow-y-auto space-y-4 bg-black/20 rounded-xl p-4 border border-white/5">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                    {message.role === "user" && (
                      <div className="flex items-center justify-end space-x-2 mb-2">
                        <span className="text-xs text-white/50 font-light">You</span>
                        <div className="relative h-5 w-5 rounded-lg overflow-hidden">
                          <Image src={userAvatar || "/placeholder.svg"} alt="You" fill className="object-cover" />
                        </div>
                      </div>
                    )}
                    {message.role === "assistant" && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="relative h-5 w-5 rounded-lg overflow-hidden">
                          <Image src="/images/ai-agent-avatar.jpeg" alt="AI" fill className="object-cover" />
                        </div>
                        <span className="text-xs text-white/50 font-light">Suitpax AI</span>
                      </div>
                    )}
                    <div
                      className={`rounded-xl py-3 px-4 ${
                        message.role === "user"
                          ? "bg-white text-black rounded-tr-none"
                          : "bg-white/8 text-white rounded-tl-none border border-white/10"
                      }`}
                    >
                      <div className="text-sm leading-relaxed font-light">
                        {message.isTyping && message.role === "assistant" ? (
                          <TypingEffect text={message.content} speed={25} />
                        ) : (
                          message.content
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%]">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="relative h-5 w-5 rounded-lg overflow-hidden">
                        <Image src="/images/ai-agent-avatar.jpeg" alt="AI" fill className="object-cover" />
                      </div>
                      <span className="text-xs text-white/50 font-light">Suitpax AI</span>
                    </div>
                    <div className="bg-white/8 rounded-xl rounded-tl-none py-3 px-4 border border-white/10">
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
          )}

          {/* Chat Input */}
          <form onSubmit={handleChatSubmit} className="relative">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                <div className="relative h-7 w-7 rounded-xl overflow-hidden mr-3 ring-1 ring-white/10">
                  <Image
                    src={isChatExpanded ? userAvatar : "/images/ai-agent-avatar.jpeg"}
                    alt={isChatExpanded ? "You" : "AI Assistant"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Ask Suitpax AI anything about your travel needs..."
                disabled={isLoading}
                className="w-full pl-16 pr-14 py-4 text-sm bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 text-white placeholder:text-white/40 disabled:opacity-50 font-light transition-all duration-200"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 text-white/50 hover:text-white disabled:opacity-50 transition-colors rounded-xl hover:bg-white/10 disabled:hover:bg-transparent"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Recent Activity - Empty State */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-light text-white mb-4">Recent Bookings</h2>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center">
                <PaperAirplaneIcon className="h-8 w-8 text-white/30" />
              </div>
              <h3 className="text-white/70 font-light mb-2">No bookings yet</h3>
              <p className="text-white/50 text-sm font-light mb-4">
                Start your journey by booking your first flight or hotel
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  href="/flights"
                  className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm font-light transition-all duration-200"
                >
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Book Flight
                </Link>
                <Link
                  href="/hotels"
                  className="inline-flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 hover:text-white text-sm font-light transition-all duration-200"
                >
                  <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                  Book Hotel
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-light text-white mb-4">Travel Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <PaperAirplaneIcon className="h-4 w-4 text-blue-400" />
                </div>
                <p className="text-2xl font-light text-white">0</p>
                <p className="text-white/60 text-sm font-light">Trips this year</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="w-8 h-8 mx-auto mb-2 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-2xl font-light text-white">$0</p>
                <p className="text-white/60 text-sm font-light">Total expenses</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="w-8 h-8 mx-auto mb-2 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="h-4 w-4 text-purple-400" />
                </div>
                <p className="text-2xl font-light text-white">0</p>
                <p className="text-white/60 text-sm font-light">Countries visited</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="w-8 h-8 mx-auto mb-2 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-4 w-4 text-orange-400" />
                </div>
                <p className="text-2xl font-light text-white">0%</p>
                <p className="text-white/60 text-sm font-light">On-time rate</p>
              </div>
            </div>

            {/* Getting Started Tips */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <h3 className="text-blue-300 font-light mb-2 text-sm">Getting Started</h3>
              <ul className="text-white/70 text-xs font-light space-y-1">
                <li>• Connect your bank account for automatic expense tracking</li>
                <li>• Book your first business trip to see stats</li>
                <li>• Upload receipts to track expenses</li>
                <li>• Invite team members to collaborate</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
