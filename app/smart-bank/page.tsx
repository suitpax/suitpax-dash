"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Settings, ArrowRight, CreditCard, TrendingUp, DollarSign, Building2, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface BankAccount {
  id: string
  name: string
  type: "checking" | "savings" | "credit"
  balance: number
  currency: string
  bank: string
  accountNumber: string
}

interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  category: string
  status: "completed" | "pending"
}

const suggestedQueries = [
  "Show my account balance",
  "Recent transactions",
  "Transfer money",
  "Set up automatic savings",
  "Expense categories",
  "Monthly spending report",
  "Investment opportunities",
  "Budget recommendations",
]

const smartFeatures = [
  { id: 1, name: "Smart Budgeting", icon: TrendingUp, description: "AI-powered budget optimization" },
  { id: 2, name: "Expense Tracking", icon: DollarSign, description: "Automatic expense categorization" },
  { id: 3, name: "Fraud Protection", icon: Shield, description: "Real-time fraud detection" },
  { id: 4, name: "Investment Insights", icon: Zap, description: "Personalized investment advice" },
]

export default function SmartBankPage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content:
        "Hey, Try ask anything to Smart Bank Agent. I can help you manage your accounts, track expenses, analyze spending patterns, and provide financial insights. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const accounts: BankAccount[] = [
    {
      id: "acc1",
      name: "Business Checking",
      type: "checking",
      balance: 45230.75,
      currency: "USD",
      bank: "Chase",
      accountNumber: "****4567",
    },
    {
      id: "acc2",
      name: "Business Savings",
      type: "savings",
      balance: 125000.0,
      currency: "USD",
      bank: "Chase",
      accountNumber: "****8901",
    },
    {
      id: "acc3",
      name: "Corporate Card",
      type: "credit",
      balance: -3240.5,
      currency: "USD",
      bank: "American Express",
      accountNumber: "****3456",
    },
  ]

  const recentTransactions: Transaction[] = [
    {
      id: "tx1",
      description: "Hotel Marriott - Business Trip",
      amount: -450.75,
      date: "2024-12-15",
      category: "Travel",
      status: "completed",
    },
    {
      id: "tx2",
      description: "Client Payment - Acme Corp",
      amount: 5000.0,
      date: "2024-12-14",
      category: "Income",
      status: "completed",
    },
    {
      id: "tx3",
      description: "Office Supplies - Staples",
      amount: -125.3,
      date: "2024-12-13",
      category: "Office",
      status: "pending",
    },
  ]

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call AI API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          isPro: true,
          plan: "business",
          conversationId: "smart-bank",
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

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm sorry, I encountered an error while processing your request. Please try again or contact support if the issue persists.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuery = (query: string) => {
    setInput(query)
  }

  const formatMessageContent = (content: string) => {
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto h-screen flex">
        {/* Left Panel - Banking Overview */}
        <div className="w-1/3 border-r border-white/10 p-4 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-green-500/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-light text-white tracking-tight">Smart Bank</h1>
                <p className="text-xs text-white/60 font-light">AI Financial Assistant</p>
              </div>
            </div>
            <Button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl h-9 w-9 p-0">
              <Settings className="h-4 w-4 text-white/70" />
            </Button>
          </div>

          {/* Account Overview */}
          <div className="space-y-4 mb-6">
            <h2 className="text-sm font-medium text-white/90">Your Accounts</h2>
            {accounts.map((account) => (
              <Card key={account.id} className="bg-white/5 border-white/10 hover:bg-white/8 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-white/70" />
                      <span className="text-sm font-medium text-white">{account.name}</span>
                    </div>
                    <Badge className="bg-white/10 text-white/70 text-xs">{account.type}</Badge>
                  </div>
                  <div className="text-lg font-semibold text-white mb-1">{formatCurrency(account.balance)}</div>
                  <div className="text-xs text-white/50">
                    {account.bank} • {account.accountNumber}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Transactions */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-white/90">Recent Transactions</h2>
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm text-white font-medium">{transaction.description}</span>
                  <span
                    className={`text-sm font-semibold ${transaction.amount > 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/50">{transaction.date}</span>
                  <Badge
                    className={`text-xs ${transaction.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - AI Chat */}
        <div className="flex-1 flex flex-col">
          {/* Smart Features Row */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3 overflow-x-auto">
              <span className="text-sm text-white/70 font-light whitespace-nowrap">Smart Features:</span>
              {smartFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 cursor-pointer transition-all duration-200 whitespace-nowrap"
                >
                  <feature.icon className="h-4 w-4 text-white/70" />
                  <div>
                    <p className="text-xs font-light text-white">{feature.name}</p>
                    <p className="text-[10px] text-white/50 font-light">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="relative h-6 w-6 rounded-lg overflow-hidden bg-green-500/20 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-green-400" />
                      </div>
                      <span className="text-xs text-white/50 font-light">Smart Bank AI</span>
                    </div>
                  )}
                  <div
                    className={`rounded-xl py-3 px-4 ${
                      message.role === "user"
                        ? "bg-white text-black rounded-tr-none"
                        : "bg-white/5 text-white rounded-tl-none border border-white/10"
                    }`}
                  >
                    <div className="text-sm leading-relaxed font-light">{formatMessageContent(message.content)}</div>
                    <div className="mt-2 text-xs opacity-70 font-light">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="relative h-6 w-6 rounded-lg overflow-hidden bg-green-500/20 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-green-400" />
                    </div>
                    <span className="text-xs text-white/50 font-light">Smart Bank AI</span>
                  </div>
                  <div className="bg-white/5 rounded-xl rounded-tl-none py-3 px-4 border border-white/10">
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

          {/* Suggested Queries */}
          {messages.length === 1 && (
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.slice(0, 4).map((query, index) => (
                  <Badge
                    key={index}
                    onClick={() => handleSuggestedQuery(query)}
                    className="bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 cursor-pointer rounded-xl text-xs px-3 py-1.5 font-light transition-all duration-200"
                  >
                    {query}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="p-4 border-t border-white/10">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                  <div className="relative h-6 w-6 rounded-lg overflow-hidden bg-green-500/20 flex items-center justify-center mr-2">
                    <Building2 className="h-4 w-4 text-green-400" />
                  </div>
                </div>
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your finances, transactions, or get insights..."
                  disabled={isLoading}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl pl-12 pr-12 py-3 focus:ring-1 focus:ring-white/20 text-sm font-light"
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-black hover:bg-white/90 disabled:opacity-50 h-8 w-8 p-0 rounded-lg"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
