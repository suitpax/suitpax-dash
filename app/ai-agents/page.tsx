"use client"
import { useState } from "react"
import Image from "next/image"
import { Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

const suggestedQueries = [
  "Find flights to London",
  "Hotel recommendations in Tokyo",
  "Create travel checklist",
  "Expense policy for meals",
  "Draft approval request",
  "Best time to visit Paris",
  "Corporate travel guidelines",
  "Airport lounge access",
]

export default function AIAgentsPage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)

  return (
    <div className="min-h-screen bg-background text-foreground p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">AI Agents</h1>
          <p className="text-muted-foreground text-sm">Manage your AI assistants and conversations</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Image
                src="/images/ai-agent-avatar.jpeg"
                alt="Suitpax AI"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">Suitpax AI</h3>
                <p className="text-xs text-muted-foreground">Travel Assistant</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Your intelligent travel companion for bookings, expenses, and travel planning.
            </p>
            <Button size="sm" className="w-full">
              Start Conversation
            </Button>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Expense AI</h3>
                <p className="text-xs text-muted-foreground">Expense Manager</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Specialized in expense tracking, receipt processing, and financial reporting.
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Coming Soon
            </Button>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Policy AI</h3>
                <p className="text-xs text-muted-foreground">Compliance Assistant</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Helps ensure travel compliance with company policies and regulations.
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Coming Soon
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <h2 className="font-medium mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.slice(0, 4).map((query, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-muted">
                {query}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
