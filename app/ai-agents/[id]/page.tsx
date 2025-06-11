"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Layout from "@/components/ui/layout"
import Image from "next/image"
import { getAgentById, getConversations, type AIAgent, type Conversation } from "@/lib/ai-agents/agent-service"
import { ArrowLeft, Settings, MessageSquare, PlusCircle, Zap } from "lucide-react"
import AgentCapabilities from "@/components/ui/agent-capabilities"
import AgentChatInterface from "@/components/ui/agent-chat-interface"
import ConversationHistory from "@/components/ui/conversation-history"

export default function AgentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [agent, setAgent] = useState<AIAgent | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeTab, setActiveTab] = useState<"chat" | "capabilities">("chat")
  const [activeConversation, setActiveConversation] = useState<Conversation | undefined>(undefined)
  const [isNewChat, setIsNewChat] = useState(true)

  useEffect(() => {
    if (params.id) {
      const agentData = getAgentById(params.id as string)
      if (agentData) {
        setAgent(agentData)

        // Get conversations for this agent
        const agentConversations = getConversations(agentData.id)
        setConversations(agentConversations)

        // Set the first conversation as active if it exists
        if (agentConversations.length > 0) {
          setActiveConversation(agentConversations[0])
          setIsNewChat(false)
        }
      }
    }
  }, [params.id])

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation)
    setIsNewChat(false)
  }

  const handleNewChat = () => {
    setActiveConversation(undefined)
    setIsNewChat(true)
  }

  if (!agent) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto p-8 text-center">
          <p>Loading agent details...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => router.push("/ai-agents")}
              className="p-1.5 mr-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-gray-700" />
            </button>
            <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
              <Image src={agent.avatar || "/placeholder.svg"} alt={agent.name} fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tighter text-black">{agent.name}</h1>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium mr-2 ${
                    agent.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {agent.status === "active" ? "Active" : "Inactive"}
                </span>
                <span className="text-xs text-gray-500 capitalize">{agent.type}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push(`/ai-agents/edit/${agent.id}`)}
            className="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Settings className="h-3.5 w-3.5" />
            <span className="text-xs">Configure</span>
          </button>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-gray-200">
                <button
                  onClick={handleNewChat}
                  className="w-full px-3 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="text-xs">New Chat</span>
                </button>
              </div>
              <div className="p-3">
                <ConversationHistory
                  conversations={conversations}
                  onSelectConversation={handleSelectConversation}
                  activeConversationId={activeConversation?.id}
                />
              </div>
            </div>
          </div>

          {/* Main panel */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-180px)]">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`flex items-center px-4 py-2 text-sm font-medium ${
                    activeTab === "chat" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab("capabilities")}
                  className={`flex items-center px-4 py-2 text-sm font-medium ${
                    activeTab === "capabilities"
                      ? "text-black border-b-2 border-black"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Capabilities
                </button>
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-auto">
                {activeTab === "chat" ? (
                  <AgentChatInterface agent={agent} initialConversation={isNewChat ? undefined : activeConversation} />
                ) : (
                  <div className="p-4">
                    <AgentCapabilities agent={agent} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
