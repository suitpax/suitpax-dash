"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plane, Building2, User, Send, Mic, Paperclip, Calendar, CreditCard, BarChart3, Settings } from "lucide-react"
import Image from "next/image"

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
              <h1 className="text-2xl font-bold">Welcome back, {userProfile.firstName}</h1>
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
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col bg-white/5 hover:bg-white/10 border border-white/10">
                    <Plane className="h-6 w-6 mb-2 text-blue-400" />
                    <span className="text-xs">Book Flight</span>
                  </Button>
                  <Button className="h-20 flex-col bg-white/5 hover:bg-white/10 border border-white/10">
                    <Building2 className="h-6 w-6 mb-2 text-green-400" />
                    <span className="text-xs">Find Hotels</span>
                  </Button>
                  <Button className="h-20 flex-col bg-white/5 hover:bg-white/10 border border-white/10">
                    <CreditCard className="h-6 w-6 mb-2 text-purple-400" />
                    <span className="text-xs">Expenses</span>
                  </Button>
                  <Button className="h-20 flex-col bg-white/5 hover:bg-white/10 border border-white/10">
                    <BarChart3 className="h-6 w-6 mb-2 text-orange-400" />
                    <span className="text-xs">Analytics</span>
                  </Button>
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

          {/* AI Chat Assistant */}
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/images/ai-agents/agent-1.jpg"
                    alt="AI Assistant"
                    width={32}
                    height={32}
                    className="rounded-md"
                  />
                  <div>
                    <CardTitle className="text-white text-sm">Suitpax AI</CardTitle>
                    <p className="text-white/60 text-xs">Your travel assistant</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-white text-black rounded-tr-none"
                            : "bg-white/10 text-white rounded-tl-none"
                        }`}
                      >
                        <div className="text-sm">{formatMessageContent(message.content)}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 rounded-lg rounded-tl-none p-3">
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
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-white/10">
                  <form onSubmit={handleChatSubmit} className="relative">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask your AI assistant anything..."
                      disabled={isLoading}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-20"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                      <Button type="button" size="sm" className="bg-transparent hover:bg-white/10 h-8 w-8 p-0">
                        <Paperclip className="h-4 w-4 text-white/50" />
                      </Button>
                      <Button type="button" size="sm" className="bg-transparent hover:bg-white/10 h-8 w-8 p-0">
                        <Mic className="h-4 w-4 text-white/50" />
                      </Button>
                      <Button
                        type="submit"
                        disabled={!chatInput.trim() || isLoading}
                        size="sm"
                        className="bg-white text-black hover:bg-white/90 h-8 w-8 p-0"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
