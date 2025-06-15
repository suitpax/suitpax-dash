"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Bot, Settings, Trash2, Plus, MessageCircle, Brain, CheckCircle, Sparkles, Crown, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { MCPStatusIndicator } from "@/components/ui/mcp-status-indicator"
import { AnimatedChatInput } from "@/components/ui/animated-chat-input"
import { EnhancedChatMessage } from "@/components/ui/enhanced-chat-message"
import { SmartSuggestions } from "@/components/ui/smart-suggestions"
import { QuickActions } from "@/components/ui/quick-actions"
import { ProFeaturesBanner } from "@/components/ui/pro-features-banner"

interface AIAgent {
  id: string
  name: string
  specialty: string
  avatar: string
  description: string
  capabilities: string[]
  status: "online" | "busy" | "offline"
  color: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  agent?: AIAgent
  tokens?: number
  cost?: string
  thinkingMode?: boolean
  actionExecuted?: boolean
  actionResult?: any
  attachments?: string[]
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

const AI_AGENTS: AIAgent[] = [
  {
    id: "travel-expert",
    name: "Travel Expert",
    specialty: "Flight & Hotel Booking",
    avatar: "/images/ai-agents/agent-1.jpg",
    description: "Specialized in finding the best travel deals and managing bookings",
    capabilities: ["Flight Search", "Hotel Booking", "Travel Optimization"],
    status: "online",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "expense-manager",
    name: "Expense Manager",
    specialty: "Financial Operations",
    avatar: "/images/ai-agents/agent-2.jpg",
    description: "Expert in expense tracking and financial reporting",
    capabilities: ["Expense Tracking", "Receipt Processing", "Budget Analysis"],
    status: "online",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "policy-advisor",
    name: "Policy Advisor",
    specialty: "Compliance & Guidelines",
    avatar: "/images/ai-agents/agent-3.jpg",
    description: "Ensures all travel complies with company policies",
    capabilities: ["Policy Compliance", "Approval Workflows", "Risk Assessment"],
    status: "online",
    color: "from-purple-500 to-violet-500",
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    specialty: "Travel Intelligence",
    avatar: "/images/ai-agents/agent-4.jpg",
    description: "Provides insights and analytics on travel patterns",
    capabilities: ["Data Analysis", "Reporting", "Trend Insights"],
    status: "online",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "master-ai",
    name: "Suitpax Master AI",
    specialty: "Universal Intelligence",
    avatar: "/images/ai-agent-avatar.png",
    description: "Advanced AI with access to all capabilities and MCP functions",
    capabilities: ["All Functions", "MCP Integration", "Advanced Analysis"],
    status: "online",
    color: "from-pink-500 via-purple-500 to-indigo-500",
  },
]

export default function SuitpaxAIPage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [thinkingMode, setThinkingMode] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(AI_AGENTS[4]) // Default to Master AI
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro">("pro")
  const [isFocused, setIsFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isPro = currentPlan === "pro"

  // Initialize with welcome conversation
  useEffect(() => {
    const welcomeConversation: Conversation = {
      id: "welcome",
      title: "Suitpax AI",
      messages: [
        {
          id: "welcome-msg",
          role: "assistant",
          content:
            "Hey! I'm your AI travel assistant powered by MCP. I can help you book flights, manage expenses, ensure policy compliance, create tasks automatically, and provide travel insights. What would you like to do today?",
          timestamp: new Date(),
          agent: selectedAgent,
        },
      ],
      createdAt: new Date(),
    }
    setConversations([welcomeConversation])
    setActiveConversation(welcomeConversation)
  }, [selectedAgent])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConversation?.messages])

  const handleSubmit = async (message: string, attachments?: string[]) => {
    if (!message.trim() || !activeConversation || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message.trim(),
      timestamp: new Date(),
      attachments,
    }

    // Update conversation with user message
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, userMessage],
      title:
        activeConversation.title === "Suitpax AI"
          ? message.trim().substring(0, 35) + (message.trim().length > 35 ? "..." : "")
          : activeConversation.title,
    }

    setActiveConversation(updatedConversation)
    setConversations((prev) => prev.map((conv) => (conv.id === activeConversation.id ? updatedConversation : conv)))
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId: activeConversation.id,
          thinkingMode,
          selectedAgent: selectedAgent.id,
          attachments,
          userProfile: {
            name: "Business Traveler",
            plan: currentPlan,
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
        content: data.response || "I'm having trouble processing your request. Please try again.",
        timestamp: new Date(),
        agent: selectedAgent,
        tokens: data.tokens,
        cost: data.cost,
        thinkingMode: data.thinkingMode,
        actionExecuted: data.actionExecuted,
        actionResult: data.actionResult,
      }

      // Update conversation with assistant response
      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
      }

      setActiveConversation(finalConversation)
      setConversations((prev) => prev.map((conv) => (conv.id === activeConversation.id ? finalConversation : conv)))
    } catch (error) {
      console.error("Error getting AI response:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm experiencing technical difficulties. Please try again or contact support.",
        timestamp: new Date(),
        agent: selectedAgent,
      }

      const errorConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, errorMessage],
      }

      setActiveConversation(errorConversation)
      setConversations((prev) => prev.map((conv) => (conv.id === activeConversation.id ? errorConversation : conv)))
    } finally {
      setIsLoading(false)
    }
  }

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [
        {
          id: "new-welcome",
          role: "assistant",
          content: "Hey! I'm ready to help with your business travel needs. What can I do for you?",
          timestamp: new Date(),
          agent: selectedAgent,
        },
      ],
      createdAt: new Date(),
    }
    setConversations((prev) => [newConversation, ...prev])
    setActiveConversation(newConversation)
  }

  const selectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation)
  }

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConversations((prev) => prev.filter((conv) => conv.id !== id))
    if (activeConversation?.id === id) {
      const remaining = conversations.filter((conv) => conv.id !== id)
      setActiveConversation(remaining.length > 0 ? remaining[0] : null)
    }
  }

  return (
    <div className="h-full flex bg-black text-white">
      {/* Enhanced Sidebar */}
      <div
        className={`${showSidebar ? "w-80" : "w-0"} transition-all duration-300 border-r border-white/10 flex flex-col overflow-hidden bg-black/95 backdrop-blur-sm`}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center shadow-lg`}
                >
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
              </div>
              <div>
                <h2 className="font-medium text-white">Suitpax AI</h2>
                <p className="text-xs text-white/60">MCP Powered Intelligence</p>
              </div>
            </div>
            <Button
              onClick={createNewConversation}
              size="sm"
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg h-8 w-8 p-0 transition-all hover:scale-105"
            >
              <Plus className="h-4 w-4 text-white" />
            </Button>
          </div>

          {/* MCP Status */}
          <div className="mb-4">
            <MCPStatusIndicator />
          </div>

          {/* AI Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white/80">Deep Analysis</span>
              </div>
              <Switch
                checked={thinkingMode}
                onCheckedChange={setThinkingMode}
                className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-white/20"
              />
            </div>
          </div>
        </div>

        {/* AI Agents Section */}
        <div className="p-3 border-b border-white/10">
          <h3 className="text-sm font-medium text-white/80 mb-3 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
            AI Agents
          </h3>
          <div className="space-y-2">
            {AI_AGENTS.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedAgent.id === agent.id
                    ? `bg-gradient-to-r ${agent.color.replace("from-", "from-").replace("to-", "to-")}/20 border border-white/30`
                    : "bg-white/5 hover:bg-white/10 border border-white/10"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={agent.avatar || "/placeholder.svg"}
                      alt={agent.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black ${
                        agent.status === "online"
                          ? "bg-green-500"
                          : agent.status === "busy"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{agent.name}</p>
                    <p className="text-xs text-white/60 truncate">{agent.specialty}</p>
                  </div>
                  {selectedAgent.id === agent.id && <CheckCircle className="h-4 w-4 text-green-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            <h3 className="text-sm font-medium text-white/60 mb-2 px-2">Recent Conversations</h3>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => selectConversation(conversation)}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeConversation?.id === conversation.id
                    ? "bg-gradient-to-r from-white/15 to-white/5 border border-white/20"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <MessageCircle className="h-3 w-3 text-white/50 flex-shrink-0" />
                    <span className="text-sm font-medium text-white truncate">{conversation.title}</span>
                  </div>
                  <p className="text-xs text-white/50">{conversation.messages.length} messages</p>
                </div>
                <Button
                  onClick={(e) => deleteConversation(conversation.id, e)}
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 bg-transparent hover:bg-red-500/20 h-6 w-6 p-0 rounded-full transition-all"
                >
                  <Trash2 className="h-3 w-3 text-red-400" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Chat Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-black to-black/90 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowSidebar(!showSidebar)}
                size="sm"
                className="lg:hidden bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg h-8 w-8 p-0"
              >
                <Menu className="h-4 w-4 text-white" />
              </Button>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center`}
                >
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="font-medium text-white">Suitpax AI - MCP Powered</h1>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-xs text-white/60">{selectedAgent.name} Active</p>
                    </div>
                    {thinkingMode && (
                      <Badge className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                        <Brain className="h-3 w-3 mr-1" />
                        Deep Mode
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 text-xs px-3 py-1 rounded-full border border-green-500/30">
                <Crown className="h-3 w-3 mr-1" />
                Pro Plan
              </Badge>
              <Button
                size="sm"
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg h-8 w-8 p-0 transition-all hover:scale-105"
              >
                <Settings className="h-4 w-4 text-white/70" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-black/20">
          {activeConversation?.messages.length === 1 && (
            <div className="space-y-6">
              <QuickActions onActionClick={handleSubmit} isPro={isPro} />
              <SmartSuggestions isPro={isPro} onSuggestionClick={handleSubmit} userLocation="Madrid" />
              <ProFeaturesBanner isPro={isPro} onUpgradeClick={() => {}} />
            </div>
          )}

          {activeConversation?.messages.map((message) => (
            <EnhancedChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={selectedAgent.avatar || "/images/ai-agent-avatar.png"}
                    alt={selectedAgent.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-xs text-white/60">{selectedAgent.name}</span>
                  {thinkingMode && (
                    <Badge className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                      <Brain className="h-3 w-3 mr-1" />
                      Analyzing...
                    </Badge>
                  )}
                </div>
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg rounded-tl-none p-4 border border-white/10">
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

        {/* Enhanced Chat Input */}
        <div className="p-4 border-t border-white/10 bg-gradient-to-r from-black/50 to-black/30 backdrop-blur-sm">
          <AnimatedChatInput
            onSubmit={handleSubmit}
            isLoading={isLoading}
            placeholder={`Ask ${selectedAgent.name} to help with your business travel...`}
            selectedAgent={selectedAgent}
          />
        </div>
      </div>
    </div>
  )
}
