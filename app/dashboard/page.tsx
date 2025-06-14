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
  ChartBarIcon,
  UsersIcon,
  BellIcon,
  CogIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
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
        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-2">Business Dashboard</h1>
          <p className="text-white/70 font-light text-lg">Manage your travel, expenses, and business operations</p>
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

        {/* AI Chat Section - Clean without robot images */}
        <div
          className={`bg-gradient-to-br from-white/8 to-white/4 border border-white/20 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
            isChatExpanded ? "p-6" : "p-5"
          } shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-medium text-white">Suitpax AI Assistant</h2>
              <p className="text-sm text-white/60 font-light">Your intelligent travel companion</p>
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
                        <div className="h-5 w-5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">AI</span>
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
                      <div className="h-5 w-5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">AI</span>
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

          {/* Chat Input - Clean without robot image */}
          <form onSubmit={handleChatSubmit} className="relative">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                <div className="relative h-7 w-7 rounded-xl overflow-hidden mr-3 ring-1 ring-white/10">
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

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Flights & Recommendations */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium text-white">Upcoming Flights & Recommendations</h2>
                <Link href="/flights" className="text-xs text-white/70 hover:text-white font-light">
                  View all flights
                </Link>
              </div>
              <div className="space-y-4">
                {/* Next Flight */}
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=48&width=48&text=NYC"
                          alt="New York"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">NYC → London</h3>
                        <p className="text-xs text-white/60">British Airways BA178</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">Dec 20, 2024</p>
                      <p className="text-xs text-white/60">Departs 8:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4 text-blue-400" />
                      <span className="text-xs text-white/70">7h 15m flight</span>
                    </div>
                    <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                      <span className="text-xs text-green-400">Confirmed</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl transition-all duration-200 cursor-pointer">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="relative h-8 w-8 rounded-lg overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=32&width=32&text=PAR"
                          alt="Paris"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">Paris</h4>
                        <p className="text-xs text-white/60">Recommended for you</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="h-3 w-3 text-yellow-400" />
                        <span className="text-xs text-white/70">Popular destination</span>
                      </div>
                      <span className="text-xs text-white/50">from $450</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl transition-all duration-200 cursor-pointer">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="relative h-8 w-8 rounded-lg overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=32&width=32&text=TOK"
                          alt="Tokyo"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">Tokyo</h4>
                        <p className="text-xs text-white/60">Business hub</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="h-3 w-3 text-blue-400" />
                        <span className="text-xs text-white/70">Direct flights</span>
                      </div>
                      <span className="text-xs text-white/50">from $1,200</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                  <p className="text-white/60 text-sm font-light">Search and book business flights</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="relative h-4 w-4 rounded overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=16&width=16&text=LDN"
                        alt="London"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-4 w-4 rounded overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=16&width=16&text=NYC"
                        alt="New York"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-4 w-4 rounded overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=16&width=16&text=PAR"
                        alt="Paris"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-white/50">+50 destinations</span>
                  </div>
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
                  <p className="text-white/60 text-sm font-light">Find business accommodations</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="relative h-4 w-4 rounded overflow-hidden">
                      <Image src="/images/hotels/marriott-madrid.png" alt="Madrid" fill className="object-cover" />
                    </div>
                    <div className="relative h-4 w-4 rounded overflow-hidden">
                      <Image src="/images/hotels/westin-valencia.png" alt="Valencia" fill className="object-cover" />
                    </div>
                    <div className="relative h-4 w-4 rounded overflow-hidden">
                      <Image
                        src="/images/hotels/nh-collection-barcelona.png"
                        alt="Barcelona"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-white/50">Premium hotels</span>
                  </div>
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
                  <p className="text-white/60 text-sm font-light">Book train tickets</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">High-speed</span>
                    <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">Eco-friendly</span>
                  </div>
                </Link>

                <Link
                  href="/transfers"
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <CogIcon className="h-6 w-6 text-orange-400" />
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
                  </div>
                  <h3 className="font-medium text-white mb-1">Transfers</h3>
                  <p className="text-white/60 text-sm font-light">Airport and city transfers</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">24/7 available</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Financial Management */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-medium text-white mb-4">Financial Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/expenses"
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <ChartBarIcon className="h-6 w-6 text-red-400" />
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
                  </div>
                  <h3 className="font-medium text-white mb-1">Expense Management</h3>
                  <p className="text-white/60 text-sm font-light">Track and manage expenses</p>
                </Link>

                <Link
                  href="/smart-bank"
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <CreditCardIcon className="h-6 w-6 text-blue-400" />
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
                  </div>
                  <h3 className="font-medium text-white mb-1">Bank Connect</h3>
                  <p className="text-white/60 text-sm font-light">Connect your bank accounts</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Calendar & Meetings */}
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
                    <CalendarIcon className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">Team Meeting</span>
                  </div>
                  <p className="text-xs text-white/60">10:00 AM - 11:00 AM</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarIcon className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-white">Client Call</span>
                  </div>
                  <p className="text-xs text-white/60">2:00 PM - 3:00 PM</p>
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
                  <p className="text-xs text-white/60">Your flight to London departs in 2 hours</p>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <p className="text-sm text-green-300 font-medium">Expense Approved</p>
                  <p className="text-xs text-white/60">Your hotel expense has been approved</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-lg font-medium text-white mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">This Month</span>
                  <span className="text-white font-medium">$3,250</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Trips Planned</span>
                  <span className="text-white font-medium">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Team Members</span>
                  <span className="text-white font-medium">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
