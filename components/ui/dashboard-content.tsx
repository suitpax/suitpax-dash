"use client"

import type React from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  WalletIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  BellIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline"
import { SiAnthropic } from "react-icons/si"
import { Mic, Send } from "lucide-react"
import Image from "next/image"
import { useState, useRef } from "react"
import type { Message } from "@/lib/ai/anthropic-service"

export default function DashboardContent() {
  const [inputValue, setInputValue] = useState("")
  const [showMiniChat, setShowMiniChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sample data for examples
  const upcomingTrips = [
    {
      id: "trip1",
      destination: "New York",
      dates: "May 15-18, 2025",
      purpose: "Client Meeting",
      status: "Confirmed",
    },
    {
      id: "trip2",
      destination: "London",
      dates: "June 10-15, 2025",
      purpose: "Conference",
      status: "Pending Approval",
    },
  ]

  const recentExpenses = [
    {
      id: "exp1",
      title: "Hotel Marriott",
      amount: 450.75,
      date: "Apr 28, 2025",
      category: "Accommodation",
    },
    {
      id: "exp2",
      title: "Taxi from Airport",
      amount: 65.2,
      date: "Apr 27, 2025",
      category: "Transportation",
    },
    {
      id: "exp3",
      title: "Business Dinner",
      amount: 120.5,
      date: "Apr 26, 2025",
      category: "Meals",
    },
  ]

  const teamActivity = [
    {
      id: "activity1",
      user: {
        name: "Alex Johnson",
      },
      action: "booked a flight to San Francisco",
      time: "2 hours ago",
      company: "Anthropic",
      teamName: "Research",
    },
    {
      id: "activity2",
      user: {
        name: "Sarah Miller",
      },
      action: "submitted an expense report for $1,250.75",
      time: "Yesterday",
      company: "Anthropic",
      teamName: "Engineering",
    },
    {
      id: "activity3",
      user: {
        name: "Michael Chen",
      },
      action: "updated the travel policy for international trips",
      time: "2 days ago",
      company: "Anthropic",
      teamName: "Legal",
    },
    {
      id: "activity4",
      user: {
        name: "Zoe Williams",
      },
      action: "booked a hotel in Tokyo for the AI Summit",
      time: "3 days ago",
      company: "Anthropic",
      teamName: "Product",
    },
    {
      id: "activity5",
      user: {
        name: "Emma Clarke",
      },
      action: "requested approval for a business trip to Berlin",
      time: "4 days ago",
      company: "Anthropic",
      teamName: "Marketing",
    },
  ]

  const handleInputClick = () => {
    setShowMiniChat(true)
  }

  const handleCloseMiniChat = () => {
    setShowMiniChat(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isTyping) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      createdAt: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      // Llamar a la API real de Anthropic
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          systemPrompt:
            "You are Suitpax AI, a helpful assistant for business travel management. Help users plan trips, find flights and hotels, manage expenses, and navigate travel policies. Be concise but informative. Provide specific details when possible.",
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      // Añadir respuesta de la IA
      setMessages((prev) => [
        ...prev,
        {
          ...data.response,
          createdAt: new Date(data.response.createdAt),
        },
      ])
    } catch (error) {
      console.error("Error al obtener respuesta de la IA:", error)
      // Añadir mensaje de error
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
    }
  }

  return (
    <div className="space-y-5">
      {/* Enhanced Chicago trip notification banner */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10"></div>

        <div className="flex flex-col md:flex-row items-center gap-5">
          <div className="flex items-center justify-center p-3 bg-white/5 rounded-xl">
            <SiAnthropic className="h-10 w-10 text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                <BellIcon className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Trip Alert</span>
              </div>
              <div className="inline-flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
                <span className="text-xs font-medium text-white/70">Anthropic</span>
                <span className="text-xs text-white/50">•</span>
                <span className="text-xs text-white/70">AI Engineer</span>
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-medium tracking-tighter text-white mb-1.5">
              Your business trip to Chicago starts today!
            </h1>

            <div className="flex flex-wrap gap-3 mb-3">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                <CalendarIcon className="h-4 w-4 text-white/70" />
                <span className="text-xs font-medium text-white/70">April 23-26, 2025</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                <BuildingOfficeIcon className="h-4 w-4 text-white/70" />
                <span className="text-xs font-medium text-white/70">Hilton Chicago</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                <PaperAirplaneIcon className="h-4 w-4 text-white/70" />
                <span className="text-xs font-medium text-white/70">Flight UA2478 at 2:30 PM</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/flights"
                className="px-3 py-1.5 bg-white/10 text-white rounded-xl text-xs font-medium hover:bg-white/20 transition-colors"
              >
                View Itinerary
              </Link>
              <button className="px-3 py-1.5 bg-transparent text-white rounded-xl text-xs font-medium border border-white/10 hover:bg-white/5 transition-colors">
                Check In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Input */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 shadow-sm">
        {!showMiniChat ? (
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250405-WA0006.jpg-ssy02udC7rU3LK1do6bZYdDCxA1Z2R.jpeg"
                alt="AI Assistant"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Ask me anything about your business travel..."
                className="w-full pl-4 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                onClick={handleInputClick}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Mic className="h-4 w-4 text-white/50 hover:text-white cursor-pointer" />
              </div>
            </div>
            <Link
              href="/ai-assistant"
              className="px-3 py-1.5 bg-white/10 text-white rounded-xl text-xs font-medium hover:bg-white/20 transition-colors"
            >
              Open Chat
            </Link>
          </div>
        ) : (
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 shadow-sm overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <div className="flex items-center">
                <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250405-WA0006.jpg-ssy02udC7rU3LK1do6bZYdDCxA1Z2R.jpeg"
                    alt="AI Assistant"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">Suitpax AI</h3>
                  <p className="text-xs text-white/70">Business Travel Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleCloseMiniChat} className="p-1.5 rounded-lg hover:bg-white/5 text-white/70">
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="max-h-[300px] overflow-y-auto p-3 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-6">
                  <div className="bg-white/5 p-2 rounded-full inline-flex mb-3">
                    <SiAnthropic className="h-6 w-6 text-white/70" />
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1">How can I help with your travel plans?</h4>
                  <p className="text-xs text-white/70 max-w-md mx-auto">
                    Ask me about booking flights, finding hotels, or managing your travel expenses.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    {message.role === "assistant" && (
                      <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250405-WA0006.jpg-ssy02udC7rU3LK1do6bZYdDCxA1Z2R.jpeg"
                          alt="AI"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-xl p-3 ${
                        message.role === "user"
                          ? "bg-white/10 text-white rounded-tr-none"
                          : "bg-white/5 text-white/70 rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250405-WA0006.jpg-ssy02udC7rU3LK1do6bZYdDCxA1Z2R.jpeg"
                      alt="AI"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-white/5 text-white/70 rounded-xl rounded-tl-none max-w-[80%] p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-white/30 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white/30 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="w-full pl-3 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                />
                <div className="absolute right-3 flex items-center gap-2">
                  <Mic className="h-4 w-4 text-white/50 hover:text-white cursor-pointer" />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className={`p-1.5 rounded-full ${
                      inputValue.trim() && !isTyping
                        ? "bg-white/10 text-white hover:bg-white/20"
                        : "bg-transparent text-white/30 cursor-not-allowed"
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="p-2 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs text-white/50">Powered by Anthropic</span>
              <Link href="/ai-assistant" className="text-xs text-white/70 hover:text-white flex items-center">
                Open full chat <ArrowRightIcon className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Anthropic User Dashboard Example */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/5 rounded-xl">
            <SiAnthropic className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-medium tracking-tighter text-white">Anthropic Dashboard</h2>
            <p className="text-xs text-white/70">Welcome back, Claude</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white">Active Projects</h3>
              <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-white/70">12</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Claude 3 Opus</span>
                <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Claude 3 Sonnet</span>
                <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Claude 3 Haiku</span>
                <span className="text-xs bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded-full">In Review</span>
              </div>
            </div>
          </div>

          <div className="border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white">Upcoming Meetings</h3>
              <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-white/70">3</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">AI Safety Summit</span>
                <span className="text-xs text-white/50">Today, 3:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Product Review</span>
                <span className="text-xs text-white/50">Tomorrow, 10:00 AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Team Sync</span>
                <span className="text-xs text-white/50">Friday, 2:00 PM</span>
              </div>
            </div>
          </div>

          <div className="border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white">Travel Budget</h3>
              <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-white/70">$15,000</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Used</span>
                <span className="text-xs text-white/70">$8,750 (58%)</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-white h-1.5 rounded-full" style={{ width: "58%" }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Remaining</span>
                <span className="text-xs text-white/70">$6,250</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="#"
            className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-white"
          >
            View Full Dashboard
            <ArrowRightIcon className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Example cards with data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <DashboardCard
          icon={<PaperAirplaneIcon className="h-4 w-4 text-white" />}
          title="Flight Bookings"
          description="3 upcoming flights"
          stats="$2,450 spent this month"
          actionLink="/flights"
          actionText="Book Flight"
        />
        <DashboardCard
          icon={<BuildingOfficeIcon className="h-4 w-4 text-white" />}
          title="Hotel Stays"
          description="5 nights booked"
          stats="$1,200 spent this month"
          actionLink="/hotels"
          actionText="Book Hotel"
        />
        <DashboardCard
          icon={<WalletIcon className="h-4 w-4 text-white" />}
          title="Travel Budget"
          description="$5,000 monthly limit"
          stats="$3,650 spent (73%)"
          actionLink="#"
          actionText="Manage Budget"
        />
        <DashboardCard
          icon={<ClockIcon className="h-4 w-4 text-white" />}
          title="Time Saved"
          description="12 hours this month"
          stats="45% more efficient"
          actionLink="#"
          actionText="View Analytics"
        />
      </div>

      {/* Upcoming trips section with examples */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-medium tracking-tighter text-white">Upcoming Trips</h2>
          <Link
            href="/flights"
            className="text-xs font-medium text-white hover:underline flex items-center gap-1 px-3 py-1.5 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
          >
            Book a trip
            <ArrowRightIcon className="h-3 w-3" />
          </Link>
        </div>

        {upcomingTrips.length > 0 ? (
          <div className="space-y-3">
            {upcomingTrips.map((trip) => (
              <div
                key={trip.id}
                className="border border-white/10 bg-white/5 rounded-xl p-3 hover:border-white/20 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-white/50" />
                      <h3 className="font-medium text-white">{trip.destination}</h3>
                    </div>
                    <div className="mt-1 ml-6 space-y-1">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-3.5 w-3.5 text-white/50" />
                        <span className="text-xs text-white/70">{trip.dates}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BriefcaseIcon className="h-3.5 w-3.5 text-white/50" />
                        <span className="text-xs text-white/70">{trip.purpose}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        trip.status === "Confirmed"
                          ? "bg-emerald-900/30 text-emerald-400"
                          : "bg-amber-900/30 text-amber-400"
                      }`}
                    >
                      {trip.status}
                    </span>
                    <button className="mt-2 text-xs text-white/70 hover:text-white transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-white/5 p-3 rounded-full mb-3">
              <CalendarIcon className="h-6 w-6 text-white/50" />
            </div>
            <h3 className="text-base font-medium text-white mb-1.5">No upcoming trips</h3>
            <p className="text-sm text-white/70 max-w-md mb-4">
              You don't have any upcoming business trips scheduled. Start planning your next journey.
            </p>
            <Link
              href="/flights"
              className="px-3 py-1.5 bg-white/10 text-white rounded-xl text-xs font-medium hover:bg-white/20 transition-colors"
            >
              Book Your First Trip
            </Link>
          </div>
        )}
      </div>

      {/* Enhanced Team Activity section with Simple Icons */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium tracking-tighter text-white">Team Activity</h2>
            <span className="bg-white/10 text-xs font-medium px-2 py-0.5 rounded-full text-white/70">5 new</span>
          </div>
          <button className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-white">
            View All
            <ArrowRightIcon className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-4">
          {teamActivity.map((activity) => (
            <div
              key={activity.id}
              className="border border-white/10 bg-white/5 rounded-xl p-4 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/5 rounded-xl">
                  <CompanyIcon company={activity.company} />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium text-white">{activity.user.name}</span>
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
                      <span className="text-xs font-medium text-white/70">{activity.company}</span>
                      <span className="text-xs text-white/50">•</span>
                      <span className="text-xs text-white/70">{activity.teamName}</span>
                    </div>
                  </div>

                  <p className="text-sm text-white/70 mb-1.5">{activity.action}</p>

                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="h-3 w-3 text-white/50" />
                    <span className="text-xs text-white/50">{activity.time}</span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <button className="text-xs text-white/70 hover:text-white transition-colors">Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent expenses section with examples */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-medium tracking-tighter text-white">Recent Expenses</h2>
          <Link
            href="/expenses"
            className="text-xs font-medium text-white hover:underline flex items-center gap-1 px-3 py-1.5 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
          >
            View All
            <ArrowRightIcon className="h-3 w-3" />
          </Link>
        </div>

        {recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="border border-white/10 bg-white/5 rounded-xl p-3 hover:border-white/20 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <CreditCardIcon className="h-4 w-4 text-white/70" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{expense.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <ClockIcon className="h-3 w-3 text-white/50" />
                        <span className="text-xs text-white/70">{expense.date}</span>
                        <span className="text-xs bg-white/5 px-1.5 py-0.5 rounded-full text-white/70">
                          {expense.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-white">${expense.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center mt-2">
              <Link href="/expenses" className="text-xs font-medium text-white/70 hover:text-white transition-colors">
                View all expenses
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-white/5 p-3 rounded-full mb-3">
              <WalletIcon className="h-6 w-6 text-white/50" />
            </div>
            <h3 className="text-base font-medium text-white mb-1.5">No expenses yet</h3>
            <p className="text-sm text-white/70 max-w-md mb-4">
              You haven't recorded any expenses yet. Add your first expense to start tracking.
            </p>
            <Link
              href="/expenses"
              className="px-3 py-1.5 bg-white/10 text-white rounded-xl text-xs font-medium hover:bg-white/20 transition-colors"
            >
              Add Your First Expense
            </Link>
          </div>
        )}
      </div>

      {/* Getting started steps */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-5 shadow-sm">
        <h2 className="text-base font-medium tracking-tighter text-white mb-4">Getting Started</h2>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 border border-white/10 bg-white/5 rounded-xl">
            <div className="flex-shrink-0 w-6 h-6 bg-white/10 text-white rounded-full flex items-center justify-center font-medium text-xs">
              1
            </div>
            <div>
              <h3 className="font-medium text-white text-sm mb-1">Complete your company profile</h3>
              <p className="text-xs text-white/70 mb-1.5">Add your company details and travel preferences</p>
              <Link
                href="/onboarding"
                className="text-xs font-medium text-white hover:underline flex items-center gap-1 w-fit px-2.5 py-1 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              >
                Complete profile
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 border border-white/10 bg-white/5 rounded-xl">
            <div className="flex-shrink-0 w-6 h-6 bg-white/10 text-white rounded-full flex items-center justify-center font-medium text-xs">
              2
            </div>
            <div>
              <h3 className="font-medium text-white text-sm mb-1">Set up travel policies</h3>
              <p className="text-xs text-white/70 mb-1.5">
                Define your company's travel guidelines and approval workflows
              </p>
              <Link
                href="/travel-policy"
                className="text-xs font-medium text-white hover:underline flex items-center gap-1 w-fit px-2.5 py-1 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              >
                Set up policies
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 border border-white/10 bg-white/5 rounded-xl">
            <div className="flex-shrink-0 w-6 h-6 bg-white/10 text-white rounded-full flex items-center justify-center font-medium text-xs">
              3
            </div>
            <div>
              <h3 className="font-medium text-white text-sm mb-1">Book your first business trip</h3>
              <p className="text-xs text-white/70 mb-1.5">Search and book flights, hotels, and transportation</p>
              <Link
                href="/flights"
                className="text-xs font-medium text-white hover:underline flex items-center gap-1 w-fit px-2.5 py-1 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              >
                Book a trip
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 border border-white/10 bg-white/5 rounded-xl">
            <div className="flex-shrink-0 w-6 h-6 bg-white/10 text-white rounded-full flex items-center justify-center font-medium text-xs">
              4
            </div>
            <div>
              <h3 className="font-medium text-white text-sm mb-1">Connect your bank account</h3>
              <p className="text-xs text-white/70 mb-1.5">Link your business accounts for automatic expense tracking</p>
              <Link
                href="/smart-bank"
                className="text-xs font-medium text-white hover:underline flex items-center gap-1 w-fit px-2.5 py-1 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              >
                Connect bank
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DashboardCardProps {
  icon: React.ReactNode
  title: string
  description: string
  stats: string
  actionLink: string
  actionText: string
}

function DashboardCard({ icon, title, description, stats, actionLink, actionText }: DashboardCardProps) {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="p-1.5 rounded-lg bg-white/5">{icon}</div>
      </div>
      <h3 className="text-sm font-medium text-white mb-1">{title}</h3>
      <p className="text-xs text-white/50 mb-1">{description}</p>
      <p className="text-xs font-medium text-white mb-2">{stats}</p>
      <Link
        href={actionLink}
        className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-white"
      >
        {actionText}
        <ArrowRightIcon className="h-3 w-3" />
      </Link>
    </div>
  )
}

interface CompanyIconProps {
  company: "Anthropic" | "OpenAI" | "Google" | string
}

function CompanyIcon({ company }: CompanyIconProps) {
  return <SiAnthropic className="h-5 w-5 text-white" />
}
