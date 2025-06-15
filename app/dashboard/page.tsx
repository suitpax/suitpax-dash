"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import {
  PlusIcon,
  CreditCardIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ArrowRightIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline"
import { TypingEffect } from "@/components/ui/typing-effect"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface DashboardStats {
  totalTrips: number
  totalExpenses: number
  countriesVisited: number
  onTimeArrivals: number
  pendingTasks: number
  monthlyBudget: number
}

export default function DashboardPage() {
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    totalExpenses: 0,
    countriesVisited: 0,
    onTimeArrivals: 0,
    pendingTasks: 0,
    monthlyBudget: 0,
  })
  const [user, setUser] = useState<any>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Load user and dashboard data
  useEffect(() => {
    loadUserData()
    loadDashboardStats()
  }, [])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadUserData = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) throw error
      setUser(user)
    } catch (error) {
      console.error("Error loading user:", error)
    }
  }

  const loadDashboardStats = async () => {
    try {
      setIsLoadingStats(true)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) return

      // Load tasks count
      const { count: tasksCount } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "pending")

      // Load expenses sum
      const { data: expensesData } = await supabase.from("expenses").select("amount").eq("user_id", user.id)

      const totalExpenses = expensesData?.reduce((sum, expense) => sum + expense.amount, 0) || 0

      setStats({
        totalTrips: 0, // Will be populated as user adds data
        totalExpenses,
        countriesVisited: 0, // Will be calculated from travel history
        onTimeArrivals: 0, // Will be tracked from bookings
        pendingTasks: tasksCount || 0,
        monthlyBudget: 0, // Will be set by user
      })
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
    } finally {
      setIsLoadingStats(false)
    }
  }

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
          plan: user?.user_metadata?.plan || "free",
          conversationId: "dashboard-chat",
          userProfile: {
            name: user?.user_metadata?.name,
            email: user?.email,
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
        content: data.response || "I apologize, but I'm having trouble processing your request right now.",
        timestamp: new Date(),
        isTyping: true,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // If an action was executed, refresh stats
      if (data.actionExecuted) {
        setTimeout(() => {
          loadDashboardStats()
        }, 1000)
      }
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
        {/* Header */}
        <header className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tighter text-white mb-2">
                {user?.user_metadata?.name ? `Welcome back, ${user.user_metadata.name}` : "Dashboard"}
              </h1>
              <p className="text-white/70 font-light">
                {stats.totalTrips === 0 && stats.totalExpenses === 0
                  ? "Let's get started with your business travel management."
                  : "Here's what's happening with your business travel."}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/expenses"
                className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-light transition-all duration-200"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Expense
              </Link>
              <Link
                href="/smart-bank"
                className="inline-flex items-center px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-300 text-sm font-light transition-all duration-200"
              >
                <CreditCardIcon className="h-4 w-4 mr-2" />
                Connect Bank
              </Link>
              <Link
                href="/flights"
                className="inline-flex items-center px-4 py-2 bg-white text-black hover:bg-white/90 rounded-xl text-sm font-medium transition-all duration-200"
              >
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                Book Flight
              </Link>
            </div>
          </div>
        </header>

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
                <p className="text-xs text-white/60 font-light">Hey, I'm Suitpax AI. What's your next trip?</p>
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
                      className={`rounded-full py-3 px-4 ${
                        message.role === "user"
                          ? "bg-white text-black rounded-tr-lg"
                          : "bg-white/5 text-white rounded-tl-lg border border-white/10"
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
                    <div className="bg-white/5 rounded-full rounded-tl-lg py-3 px-4 border border-white/10">
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
              {!isChatExpanded && (
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                  <div className="relative h-6 w-6 rounded-lg overflow-hidden mr-2">
                    <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
                  </div>
                </div>
              )}
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Hey, I'm Suitpax AI. What's your next trip?"
                disabled={isLoading}
                className={`w-full ${isChatExpanded ? "pl-4" : "pl-12"} pr-12 py-3 text-sm bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30 disabled:opacity-50 font-light`}
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

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-light text-white mb-4">Recent Activity</h2>
            {stats.totalTrips === 0 && stats.totalExpenses === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/60 text-sm mb-4">No activity yet</p>
                <p className="text-white/40 text-xs">Start by booking a flight or adding an expense</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <PaperAirplaneIcon className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium text-sm">Recent Bookings</p>
                      <p className="text-white/60 text-xs">Check your travel history</p>
                    </div>
                  </div>
                  <span className="text-white/70 text-sm">{stats.totalTrips}</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-light text-white mb-4">Quick Stats</h2>
            {isLoadingStats ? (
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="h-6 bg-white/10 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-white/5 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-light text-white">{stats.totalTrips}</p>
                  <p className="text-white/60 text-sm font-light">Trips this year</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-light text-white">€{stats.totalExpenses.toFixed(0)}</p>
                  <p className="text-white/60 text-sm font-light">Total expenses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-light text-white">{stats.pendingTasks}</p>
                  <p className="text-white/60 text-sm font-light">Pending tasks</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-light text-white">{stats.countriesVisited}</p>
                  <p className="text-white/60 text-sm font-light">Countries visited</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
