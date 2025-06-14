"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plane, Building2, User, Send, Mic, Paperclip, Calendar, CreditCard, Settings, Receipt } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  companyName: string
  companyLogo: string | null
  jobTitle: string
  profileImage: string | null
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [searchMode, setSearchMode] = useState<"personal" | "business">("business")
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your Suitpax AI assistant. I can help you with flight bookings, hotel reservations, expense management, and travel planning. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const profile = localStorage.getItem("userProfile")
    if (profile) {
      setUserProfile(JSON.parse(profile))
    }
  }, [])

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput.trim(),
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsLoading(true)

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
          context: `User is ${userProfile?.firstName} ${userProfile?.lastName} from ${userProfile?.companyName}, working as ${userProfile?.jobTitle}. Search mode: ${searchMode}`,
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

      setChatMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm sorry, I encountered an error while processing your request. Please try again or contact support if the issue persists.",
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
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

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {userProfile.profileImage ? (
                <Image
                  src={userProfile.profileImage || "/placeholder.svg"}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="rounded-md object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center">
                  <User className="h-6 w-6 text-white/70" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-medium tracking-tighter text-white">
                Welcome back, {userProfile.firstName}
              </h1>
              <p className="text-white/70">
                {userProfile.jobTitle} at {userProfile.companyName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge className="bg-white/10 text-white border-white/20 rounded-full">Business Account</Badge>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Search Mode Toggle */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Travel Search Mode</h3>
                <p className="text-white/70 text-sm">Choose how you want to search for travel options</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setSearchMode("personal")}
                  variant={searchMode === "personal" ? "default" : "outline"}
                  className={
                    searchMode === "personal" ? "bg-white text-black" : "border-white/20 text-white hover:bg-white/10"
                  }
                >
                  <User className="h-4 w-4 mr-2" />
                  Personal Travel
                </Button>
                <Button
                  onClick={() => setSearchMode("business")}
                  variant={searchMode === "business" ? "default" : "outline"}
                  className={
                    searchMode === "business" ? "bg-white text-black" : "border-white/20 text-white hover:bg-white/10"
                  }
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Business Travel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mini Action Badges */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Link href="/flights">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer">
                      <Plane className="h-4 w-4 text-white/70" />
                      <span className="text-xs text-white/70">Flights</span>
                    </div>
                  </Link>
                  <Link href="/expenses">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer">
                      <Receipt className="h-4 w-4 text-white/70" />
                      <span className="text-xs text-white/70">Expense Management</span>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Finance Section */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg font-medium tracking-tighter">Finance Hub</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-md flex items-center justify-center mr-3">
                        <CreditCard className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white">Connect Bank</h3>
                        <p className="text-xs text-white/50">Link your corporate account</p>
                      </div>
                    </div>
                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-white/10 text-xs">
                      Connect Account
                    </Button>
                  </div>

                  <div className="border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-md flex items-center justify-center mr-3">
                        <Receipt className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white">Upload Receipts</h3>
                        <p className="text-xs text-white/50">Drag & drop your expenses</p>
                      </div>
                    </div>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-white/30 transition-colors cursor-pointer">
                      <input type="file" multiple accept="image/*,.pdf" className="hidden" id="receipt-upload" />
                      <label htmlFor="receipt-upload" className="cursor-pointer">
                        <div className="text-white/50 text-xs">Drop files here or click to upload</div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">Monthly Summary</h4>
                    <Badge className="bg-white/10 text-white border-white/20 text-xs">Current Month</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-medium text-white">$0</p>
                      <p className="text-xs text-white/50">Spent</p>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-white">$2,500</p>
                      <p className="text-xs text-white/50">Budget</p>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-green-400">$2,500</p>
                      <p className="text-xs text-white/50">Remaining</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-white/50">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent travel activity</p>
                    <p className="text-sm">Your bookings and trips will appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Chat Assistant - Redesigned */}
          <div className="space-y-6">
            <Card className="bg-black border border-white/10 h-[400px] flex flex-col overflow-hidden">
              <CardHeader className="pb-3 px-4 pt-4">
                <div className="flex items-center space-x-3">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                    <Image
                      src="/images/ai-agents/agent-1.jpg"
                      alt="Suitpax AI"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-white text-sm font-medium">Suitpax AI</CardTitle>
                    <p className="text-white/50 text-xs">Your travel assistant</p>
                  </div>
                  <div className="ml-auto">
                    <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages - Compact */}
                <div className="flex-1 overflow-y-auto px-4 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                  {chatMessages.slice(-3).map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex-shrink-0 h-6 w-6 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                          <Image
                            src="/images/ai-agents/agent-1.jpg"
                            alt="AI"
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-full px-4 py-2 ${
                          message.role === "user"
                            ? "bg-white text-black text-sm font-medium"
                            : "bg-white/5 text-white text-sm border border-white/10"
                        }`}
                      >
                        <div className="text-xs leading-relaxed">{formatMessageContent(message.content)}</div>
                      </div>
                      {message.role === "user" && (
                        <div className="flex-shrink-0 h-6 w-6 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                          <User className="h-3 w-3 text-white/70" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-start space-x-3 justify-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                        <Image
                          src="/images/ai-agents/agent-1.jpg"
                          alt="AI"
                          width={24}
                          height={24}
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="bg-white/5 rounded-full px-4 py-2 border border-white/10">
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
                  )}
                </div>

                {/* Chat Input - Modern */}
                <div className="p-4 border-t border-white/10">
                  <form onSubmit={handleChatSubmit} className="relative">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask anything about travel..."
                      disabled={isLoading}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pr-24 rounded-full h-10 text-sm focus:ring-1 focus:ring-white/20"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                      <Button
                        type="button"
                        size="sm"
                        className="bg-transparent hover:bg-white/10 h-7 w-7 p-0 rounded-full"
                      >
                        <Paperclip className="h-3 w-3 text-white/50" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="bg-transparent hover:bg-white/10 h-7 w-7 p-0 rounded-full"
                      >
                        <Mic className="h-3 w-3 text-white/50" />
                      </Button>
                      <Button
                        type="submit"
                        disabled={!chatInput.trim() || isLoading}
                        size="sm"
                        className="bg-white text-black hover:bg-white/90 h-7 w-7 p-0 rounded-full disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="w-3 h-3 border border-black/30 border-t-black/70 rounded-full animate-spin" />
                        ) : (
                          <Send className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>

            {/* Quick Suggestions */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h4 className="text-white text-sm font-medium mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-xs text-white/70 hover:text-white hover:bg-white/5 h-8 rounded-full"
                    onClick={() => setChatInput("Find flights from Madrid to Barcelona")}
                  >
                    Find flights from Madrid to Barcelona
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-xs text-white/70 hover:text-white hover:bg-white/5 h-8 rounded-full"
                    onClick={() => setChatInput("Show my expense report")}
                  >
                    Show my expense report
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-xs text-white/70 hover:text-white hover:bg-white/5 h-8 rounded-full"
                    onClick={() => setChatInput("Book a hotel in London")}
                  >
                    Book a hotel in London
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
