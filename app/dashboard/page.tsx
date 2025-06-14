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
  TrainIcon,
  CalendarIcon,
  UsersIcon,
  BellIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  MapPinIcon,
  ClockIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
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

  // User data - this would come from user context/auth
  const userName = "Alex" // This would be dynamic
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
          userName: userName,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I'm here to help with your travel needs!",
        timestamp: new Date(),
        isTyping: true,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm experiencing some technical difficulties. Please try again!",
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
        {/* Personalized Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-2">
            Hey{userName ? `, ${userName}` : ""}
          </h1>
          <p className="text-white/70 font-medium text-lg">Ready for your next business adventure?</p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
          <Link
            href="/flights"
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm font-medium transition-all duration-200"
          >
            <PaperAirplaneIcon className="h-4 w-4 mr-2" />
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
            <TrainIcon className="h-3 w-3 mr-1.5" />
            Trains
          </Link>
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
            href="/meetings"
            className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-light transition-all duration-200"
          >
            <CalendarIcon className="h-3 w-3 mr-1.5" />
            Calendar
          </Link>
          <Link
            href="/team-management"
            className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-light transition-all duration-200"
          >
            <UsersIcon className="h-3 w-3 mr-1.5" />
            Team
          </Link>
        </div>

        {/* Enhanced AI Chat Section */}
        <div
          className={`bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl backdrop-blur-xl transition-all duration-300 ${
            isChatExpanded ? "p-8" : "p-6"
          } shadow-2xl`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-medium text-white">Suitpax AI</h2>
              <p className="text-white/60 font-light">Your intelligent travel companion</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                <span className="text-xs text-green-400 font-light">● Online</span>
              </div>
              <ShieldCheckIcon className="h-5 w-5 text-white/50" />
            </div>
          </div>

          {/* Messages */}
          {isChatExpanded && messages.length > 0 && (
            <div className="mb-6 max-h-96 overflow-y-auto space-y-4 bg-black/30 rounded-2xl p-5 border border-white/5 backdrop-blur-sm">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                    {message.role === "user" && (
                      <div className="flex items-center justify-end space-x-2 mb-2">
                        <span className="text-xs text-white/50 font-light">You</span>
                        <div className="relative h-6 w-6 rounded-lg overflow-hidden">
                          <Image src={userAvatar || "/placeholder.svg"} alt="You" fill className="object-cover" />
                        </div>
                      </div>
                    )}
                    {message.role === "assistant" && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">S</span>
                        </div>
                        <span className="text-xs text-white/50 font-light">Suitpax AI</span>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl py-3 px-4 ${
                        message.role === "user"
                          ? "bg-white text-black rounded-tr-none"
                          : "bg-white/10 text-white rounded-tl-none border border-white/10 backdrop-blur-sm"
                      }`}
                    >
                      <div className="text-sm leading-relaxed font-light">
                        {message.isTyping && message.role === "assistant" ? (
                          <TypingEffect text={message.content} speed={30} />
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
                  <div className="max-w-[85%]">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">S</span>
                      </div>
                      <span className="text-xs text-white/50 font-light">Suitpax AI</span>
                    </div>
                    <div className="bg-white/10 rounded-2xl rounded-tl-none py-3 px-4 border border-white/10 backdrop-blur-sm">
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

          {/* Enhanced Chat Input */}
          <form onSubmit={handleChatSubmit} className="relative">
            <div className="relative">
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 flex items-center">
                <div className="relative h-8 w-8 rounded-xl overflow-hidden mr-3 ring-2 ring-white/10">
                  <Image src={userAvatar || "/placeholder.svg"} alt="You" fill className="object-cover" />
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
                className="w-full pl-20 pr-16 py-5 text-base bg-white/8 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 text-white placeholder:text-white/40 disabled:opacity-50 font-light transition-all duration-200 backdrop-blur-sm"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white disabled:opacity-50 transition-colors rounded-xl hover:bg-white/10 disabled:hover:bg-transparent"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Enhanced Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Travel Management */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-medium text-white mb-4">Travel Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/flights"
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <PaperAirplaneIcon className="h-6 w-6 text-blue-400" />
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
                  </div>
                  <h3 className="font-medium text-white mb-1">Flight Booking</h3>
                  <p className="text-white/60 text-sm font-light">Real-time search & booking</p>
                </Link>

                <Link
                  href="/hotels"
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <BuildingOfficeIcon className="h-6 w-6 text-green-400" />
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
                  </div>
                  <h3 className="font-medium text-white mb-1">Hotel Booking</h3>
                  <p className="text-white/60 text-sm font-light">Business accommodations</p>
                </Link>

                <Link
                  href="/trains"
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <TrainIcon className="h-6 w-6 text-purple-400" />
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
                  </div>
                  <h3 className="font-medium text-white mb-1">Train Booking</h3>
                  <p className="text-white/60 text-sm font-light">European rail network</p>
                </Link>

                <Link
                  href="/transfers"
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <MapPinIcon className="h-6 w-6 text-orange-400" />
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
                  </div>
                  <h3 className="font-medium text-white mb-1">Transfers</h3>
                  <p className="text-white/60 text-sm font-light">Airport & city transfers</p>
                </Link>
              </div>
            </div>

            {/* Financial Management */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-medium text-white mb-4">Financial Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/expenses"
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <ReceiptPercentIcon className="h-6 w-6 text-red-400" />
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
                  </div>
                  <h3 className="font-medium text-white mb-1">Expenses</h3>
                  <p className="text-white/60 text-sm font-light">Track & manage</p>
                </Link>

                <Link
                  href="/smart-bank"
                  className="p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <CreditCardIcon className="h-6 w-6 text-blue-400" />
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-blue-300 group-hover:text-blue-100 transition-colors" />
                  </div>
                  <h3 className="font-medium text-white mb-1">Bank Connect</h3>
                  <p className="text-blue-300 text-sm font-light">Sync accounts</p>
                </Link>

                <Link
                  href="/expenses"
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <TrendingUpIcon className="h-6 w-6 text-green-400" />
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
                  </div>
                  <h3 className="font-medium text-white mb-1">Analytics</h3>
                  <p className="text-white/60 text-sm font-light">Spending insights</p>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-medium text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <PaperAirplaneIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Flight to London booked</p>
                      <p className="text-white/60 text-xs">British Airways • Dec 20, 2024</p>
                    </div>
                  </div>
                  <span className="text-white/70 text-sm font-light">$1,250</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <BuildingOfficeIcon className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Hotel reservation confirmed</p>
                      <p className="text-white/60 text-xs">Marriott London • 3 nights</p>
                    </div>
                  </div>
                  <span className="text-white/70 text-sm font-light">$450</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <ReceiptPercentIcon className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Expense report submitted</p>
                      <p className="text-white/60 text-xs">Business dinner • Dec 18</p>
                    </div>
                  </div>
                  <span className="text-green-400 text-sm font-light">Approved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Info & Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/smart-bank"
                  className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <BanknotesIcon className="h-5 w-5 text-blue-400" />
                    <span className="text-white font-medium text-sm">Connect Your Bank</span>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
                </Link>
                <Link
                  href="/expenses"
                  className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <PlusIcon className="h-5 w-5 text-green-400" />
                    <span className="text-white font-medium text-sm">Add Expense</span>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
                </Link>
                <Link
                  href="/team-management"
                  className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <UsersIcon className="h-5 w-5 text-purple-400" />
                    <span className="text-white font-medium text-sm">Invite Team</span>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
                </Link>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Today's Schedule</h2>
                <Link href="/meetings" className="text-xs text-white/70 hover:text-white font-light">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <ClockIcon className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">Team Meeting</span>
                  </div>
                  <p className="text-xs text-white/60">10:00 AM - 11:00 AM</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <ClockIcon className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-white">Client Call</span>
                  </div>
                  <p className="text-xs text-white/60">2:00 PM - 3:00 PM</p>
                </div>
              </div>
            </div>

            {/* Expense Overview */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Expense Overview</h2>
                <Link href="/expenses" className="text-xs text-white/70 hover:text-white font-light">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">This Month</span>
                  <span className="text-white font-medium">$3,250</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Pending Approval</span>
                  <span className="text-yellow-400 font-medium">$450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Budget Remaining</span>
                  <span className="text-green-400 font-medium">$1,750</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Notifications</h2>
                <BellIcon className="h-5 w-5 text-white/50" />
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-sm text-blue-300 font-medium">Flight Reminder</p>
                  <p className="text-xs text-white/60">Check-in opens in 24 hours</p>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <p className="text-sm text-green-300 font-medium">Expense Approved</p>
                  <p className="text-xs text-white/60">Hotel expense has been approved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
