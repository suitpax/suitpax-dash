"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline"
import { Search, Filter, Plus, MessageCircle, Users } from "lucide-react"

interface Agent {
  id: string
  name: string
  description: string
  avatar: string
  status: "online" | "busy" | "offline"
  capabilities: string[]
  conversations: number
  lastActive: string
  category: "travel" | "finance" | "general"
}

const agents: Agent[] = [
  {
    id: "1",
    name: "Travel Assistant",
    description: "Especialista en reservas de vuelos, hoteles y gestión de viajes corporativos",
    avatar: "/images/ai-agent-avatar.jpeg",
    status: "online",
    capabilities: ["Reservas", "Políticas", "Gastos"],
    conversations: 156,
    lastActive: "Ahora",
    category: "travel",
  },
  {
    id: "2",
    name: "Finance Bot",
    description: "Experto en análisis financiero, presupuestos y reportes de gastos",
    avatar: "/images/ai-assistant-avatar.png",
    status: "online",
    capabilities: ["Análisis", "Reportes", "Presupuestos"],
    conversations: 89,
    lastActive: "2 min",
    category: "finance",
  },
  {
    id: "3",
    name: "General Assistant",
    description: "Asistente general para consultas diversas y soporte administrativo",
    avatar: "/ai-agents/agent-3.jpeg",
    status: "busy",
    capabilities: ["Consultas", "Soporte", "Documentos"],
    conversations: 234,
    lastActive: "5 min",
    category: "general",
  },
]

export default function AIAgentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || agent.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: Agent["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: Agent["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircleIcon className="h-4 w-4 text-green-400" />
      case "busy":
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-400" />
      case "offline":
        return <ClockIcon className="h-4 w-4 text-gray-400" />
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="h-full flex bg-black">
      {/* Agents List */}
      <div
        className={`${selectedAgent ? "hidden lg:block lg:w-96" : "w-full lg:w-96"} border-r border-white/10 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-white">AI Agents</h1>
              <p className="text-sm text-white/60">Gestiona tus asistentes inteligentes</p>
            </div>
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <Plus className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar agentes..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {[
              { key: "all", label: "Todos", icon: Users },
              { key: "travel", label: "Viajes", icon: SparklesIcon },
              { key: "finance", label: "Finanzas", icon: ChatBubbleLeftRightIcon },
              { key: "general", label: "General", icon: UserGroupIcon },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  selectedCategory === key
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-3 w-3" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Agents List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
          <div className="p-2 space-y-2">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedAgent?.id === agent.id ? "bg-white/10 ring-1 ring-white/20" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Image
                      src={agent.avatar || "/placeholder.svg"}
                      alt={agent.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${getStatusColor(agent.status)}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-white truncate">{agent.name}</h3>
                      {getStatusIcon(agent.status)}
                    </div>

                    <p className="text-xs text-white/60 line-clamp-2 mb-2">{agent.description}</p>

                    <div className="flex items-center justify-between text-xs text-white/50">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{agent.conversations}</span>
                      </div>
                      <span>{agent.lastActive}</span>
                    </div>

                    <div className="flex gap-1 mt-2">
                      {agent.capabilities.slice(0, 2).map((capability) => (
                        <span
                          key={capability}
                          className="px-2 py-0.5 text-[10px] bg-white/10 text-white/70 rounded-full"
                        >
                          {capability}
                        </span>
                      ))}
                      {agent.capabilities.length > 2 && (
                        <span className="px-2 py-0.5 text-[10px] bg-white/10 text-white/70 rounded-full">
                          +{agent.capabilities.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className={`${selectedAgent ? "flex-1" : "hidden lg:flex lg:flex-1"} flex flex-col`}>
        {selectedAgent ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  ←
                </button>
                <div className="relative">
                  <Image
                    src={selectedAgent.avatar || "/placeholder.svg"}
                    alt={selectedAgent.name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-black ${getStatusColor(selectedAgent.status)}`}
                  />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-white">{selectedAgent.name}</h2>
                  <p className="text-xs text-white/60 capitalize">{selectedAgent.status}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <Filter className="h-4 w-4 text-white/70" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 p-4">
              <div className="space-y-4">
                {/* Welcome Message */}
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md">
                    <div className="bg-white/5 rounded-lg rounded-tl-none p-3">
                      <p className="text-sm text-white">
                        ¡Hola! Soy {selectedAgent.name}. {selectedAgent.description}
                      </p>
                    </div>
                    <p className="text-xs text-white/40 mt-1 ml-3">Ahora</p>
                  </div>
                </div>

                {/* Capabilities */}
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md">
                    <div className="bg-white/5 rounded-lg rounded-tl-none p-3">
                      <p className="text-sm text-white mb-2">Mis especialidades incluyen:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedAgent.capabilities.map((capability) => (
                          <span key={capability} className="px-2 py-1 text-xs bg-white/10 text-white/80 rounded-full">
                            {capability}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-white/40 mt-1 ml-3">Ahora</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Escribe un mensaje a ${selectedAgent.name}...`}
                  className="w-full pl-4 pr-12 py-3 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors">
                  <MessageCircle className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-white/50" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Selecciona un AI Agent</h3>
              <p className="text-white/60 text-sm">
                Elige un agente de la lista para comenzar una conversación y obtener asistencia especializada.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
