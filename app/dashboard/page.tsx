"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ArrowRightIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline"
import { TypingEffect } from "@/components/ui/typing-effect"
import DashboardHeader from "@/components/ui/dashboard-header"

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
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Enhanced Header */}
        <DashboardHeader />

        {/* AI Chat Section */}
        <div
          className={`bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
            isChatExpanded ? "p-6" : "p-4"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative h-8 w-8 rounded-lg overflow-hidden">
                <Image src="/images/ai-agent-avatar.jpeg" alt="Suitpax AI" fill className="object-cover" />
              </div>
              <div>
                <h2 className="text-lg font-light text-white">Suitpax AI Assistant</h2>
                <p className="text-xs text-white/60 font-light">Ask me anything about your travel needs</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          {isChatExpanded && messages.length > 0 && (
            <div className="mb-4 max-h-60 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                    {message.role === "assistant" && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="relative h-5 w-5 rounded-lg overflow-hidden">
                          <Image src="/images/ai-agent-avatar.jpeg" alt="AI" fill className="object-cover" />
                        </div>
                        <span className="text-xs text-white/50 font-light">Suitpax AI</span>
                      </div>
                    )}
                    <div
                      className={`rounded-xl py-2 px-3 ${
                        message.role === "user"
                          ? "bg-white text-black rounded-tr-none"
                          : "bg-white/5 text-white rounded-tl-none border border-white/10"
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
                    <div className="bg-white/5 rounded-xl rounded-tl-none py-2 px-3 border border-white/10">
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
                <div className="relative h-6 w-6 rounded-lg overflow-hidden mr-2">
                  <Image
                    src={isChatExpanded ? "/images/ai-assistant-avatar.png" : "/images/ai-agent-avatar.jpeg"}
                    alt="AI Assistant"
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
                className="w-full pl-12 pr-12 py-3 text-sm bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30 disabled:opacity-50 font-light"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white disabled:opacity-50 transition-colors rounded-lg hover:bg-white/5"
              >
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/flights"
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <PaperAirplaneIcon className="h-8 w-8 text-white/70 group-hover:text-white transition-colors" />
              <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
            </div>
            <h3 className="font-medium text-white mb-1">Book Flights</h3>
            <p className="text-white/60 text-sm font-light">Find and book business flights</p>
          </Link>

          <Link
            href="/hotels"
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <BuildingOfficeIcon className="h-8 w-8 text-white/70 group-hover:text-white transition-colors" />
              <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
            </div>
            <h3 className="font-medium text-white mb-1">Hotels</h3>
            <p className="text-white/60 text-sm font-light">Reserve business accommodations</p>
          </Link>

          <Link
            href="/expenses"
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <ChartBarIcon className="h-8 w-8 text-white/70 group-hover:text-white transition-colors" />
              <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
            </div>
            <h3 className="font-medium text-white mb-1">Expenses</h3>
            <p className="text-white/60 text-sm font-light">Track and manage expenses</p>
          </Link>

          <Link
            href="/smart-bank"
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <BanknotesIcon className="h-8 w-8 text-white/70 group-hover:text-white transition-colors" />
              <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
            </div>
            <h3 className="font-medium text-white mb-1">Connect Bank</h3>
            <p className="text-white/60 text-sm font-light">Sync your financial accounts</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-light text-white mb-4">Recent Bookings</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <PaperAirplaneIcon className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium text-sm">NYC → London</p>
                    <p className="text-white/60 text-xs">British Airways • Dec 20</p>
                  </div>
                </div>
                <span className="text-white/70 text-sm">$1,250</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium text-sm">Marriott London</p>
                    <p className="text-white/60 text-xs">3 nights • Dec 20-23</p>
                  </div>
                </div>
                <span className="text-white/70 text-sm">$450</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-light text-white mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-light text-white">12</p>
                <p className="text-white/60 text-sm font-light">Trips this year</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-light text-white">$8,450</p>
                <p className="text-white/60 text-sm font-light">Total expenses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-light text-white">5</p>
                <p className="text-white/60 text-sm font-light">Countries visited</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-light text-white">98%</p>
                <p className="text-white/60 text-sm font-light">On-time arrivals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
