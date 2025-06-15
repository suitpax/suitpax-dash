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
  ChartBarIcon,
  ArrowRightIcon,
  BanknotesIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
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

  const quickActions = [
    {
      title: "Book Flights",
      description: "Find and book business flights",
      href: "/flights",
      icon: PaperAirplaneIcon,
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      title: "Hotels",
      description: "Reserve business accommodations",
      href: "/hotels",
      icon: BuildingOfficeIcon,
      color: "bg-green-500/10 text-green-400 border-green-500/20",
    },
    {
      title: "Expenses",
      description: "Track and manage expenses",
      href: "/expenses",
      icon: ChartBarIcon,
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      title: "Connect Bank",
      description: "Sync your financial accounts",
      href: "/smart-bank",
      icon: BanknotesIcon,
      color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    {
      title: "Team",
      description: "Manage team members",
      href: "/team-management",
      icon: UserGroupIcon,
      color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    },
    {
      title: "Calendar",
      description: "Schedule and meetings",
      href: "/meetings",
      icon: CalendarIcon,
      color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "flight",
      title: "NYC → London",
      subtitle: "British Airways • Dec 20",
      amount: "$1,250",
      icon: PaperAirplaneIcon,
      color: "text-blue-400",
    },
    {
      id: 2,
      type: "hotel",
      title: "Marriott London",
      subtitle: "3 nights • Dec 20-23",
      amount: "$450",
      icon: BuildingOfficeIcon,
      color: "text-green-400",
    },
    {
      id: 3,
      type: "expense",
      title: "Client Dinner",
      subtitle: "Morton's Steakhouse",
      amount: "$120",
      icon: DocumentTextIcon,
      color: "text-purple-400",
    },
  ]

  const stats = [
    { label: "Trips this year", value: "12", change: "+2 from last month" },
    { label: "Total expenses", value: "$8,450", change: "+$1,200 this month" },
    { label: "Countries visited", value: "5", change: "2 new destinations" },
    { label: "On-time arrivals", value: "98%", change: "Above average" },
  ]

  return (
    <div className="min-h-screen bg-black p-3 text-white">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-medium tracking-tight text-white mb-2">Dashboard</h1>
              <p className="text-white/70 text-sm">Welcome back! Here's what's happening with your business travel.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/expenses"
                className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all duration-200"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Expense
              </Link>
              <Link
                href="/smart-bank"
                className="inline-flex items-center px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-blue-300 text-sm transition-all duration-200"
              >
                <CreditCardIcon className="h-4 w-4 mr-2" />
                Connect Bank
              </Link>
              <Link
                href="/flights"
                className="inline-flex items-center px-3 py-1.5 bg-white text-black hover:bg-white/90 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                Book Flight
              </Link>
            </div>
          </div>
        </div>

        {/* AI Chat Section */}
        <div
          className={`bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm transition-all duration-300 ${
            isChatExpanded ? "p-4" : "p-3"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="relative h-7 w-7 rounded-lg overflow-hidden">
                <Image src="/images/ai-agent-avatar.jpeg" alt="Suitpax AI" fill className="object-cover" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-white">Suitpax AI Assistant</h2>
                <p className="text-xs text-white/60">Ask me anything about your travel needs</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          {isChatExpanded && messages.length > 0 && (
            <div className="mb-3 max-h-48 overflow-y-auto space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                    {message.role === "assistant" && (
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="relative h-4 w-4 rounded-lg overflow-hidden">
                          <Image src="/images/ai-agent-avatar.jpeg" alt="AI" fill className="object-cover" />
                        </div>
                        <span className="text-xs text-white/50">Suitpax AI</span>
                      </div>
                    )}
                    <div
                      className={`rounded-lg py-2 px-3 text-sm ${
                        message.role === "user"
                          ? "bg-white text-black rounded-tr-none"
                          : "bg-white/5 text-white rounded-tl-none border border-white/10"
                      }`}
                    >
                      {message.isTyping && message.role === "assistant" ? (
                        <TypingEffect text={message.content} speed={25} />
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%]">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="relative h-4 w-4 rounded-lg overflow-hidden">
                        <Image src="/images/ai-agent-avatar.jpeg" alt="AI" fill className="object-cover" />
                      </div>
                      <span className="text-xs text-white/50">Suitpax AI</span>
                    </div>
                    <div className="bg-white/5 rounded-lg rounded-tl-none py-2 px-3 border border-white/10">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"
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
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                <div className="relative h-5 w-5 rounded-lg overflow-hidden mr-2">
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
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-white disabled:opacity-50 transition-colors rounded-lg hover:bg-white/5"
              >
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/8 transition-all duration-200 group"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-2 rounded-lg border ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">{action.title}</h3>
                  <p className="text-xs text-white/60 mt-1">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Activity */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h2 className="text-lg font-medium text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                    <div>
                      <p className="text-white text-sm font-medium">{item.title}</p>
                      <p className="text-white/60 text-xs">{item.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-white/70 text-sm">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h2 className="text-lg font-medium text-white mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-xl font-medium text-white">{stat.value}</p>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                  <p className="text-white/40 text-xs mt-1">{stat.change}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
