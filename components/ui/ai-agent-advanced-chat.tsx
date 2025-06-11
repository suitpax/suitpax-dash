"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, MicOff, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  agentId?: string
}

interface Agent {
  id: string
  name: string
  avatar: string
  specialty: string
  description: string
  color: string
  capabilities: string[]
}

const agents: Agent[] = [
  {
    id: "travel-expert",
    name: "Travel Expert",
    avatar: "/images/ai-assistant-avatar.png",
    specialty: "Travel Planning",
    description: "Especialista en planificación de viajes corporativos y gestión de itinerarios",
    color: "from-blue-500 to-cyan-500",
    capabilities: ["Flight Booking", "Hotel Search", "Itinerary Planning", "Travel Policies"],
  },
  {
    id: "expense-manager",
    name: "Expense Manager",
    avatar: "/images/ai-agent-avatar.png",
    specialty: "Expense Management",
    description: "Experto en gestión de gastos y análisis financiero de viajes",
    color: "from-green-500 to-emerald-500",
    capabilities: ["Expense Tracking", "Budget Analysis", "Receipt Processing", "Financial Reports"],
  },
  {
    id: "policy-advisor",
    name: "Policy Advisor",
    avatar: "/images/team/genevieve-mclean.jpeg",
    specialty: "Policy Compliance",
    description: "Asesor en políticas corporativas y cumplimiento normativo",
    color: "from-purple-500 to-violet-500",
    capabilities: ["Policy Guidance", "Compliance Check", "Risk Assessment", "Documentation"],
  },
]

export default function AIAgentAdvancedChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "¡Hola! Soy tu asistente de viajes corporativos. Selecciona un agente especializado o pregúntame directamente. ¿En qué puedo ayudarte hoy?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
      agentId: selectedAgent?.id,
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
    setIsTyping(true)

    // Simular respuesta del agente
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: selectedAgent
          ? `Como ${selectedAgent.name}, te ayudo con ${inputValue}. Basándome en mi especialidad en ${selectedAgent.specialty}, puedo sugerirte las mejores opciones disponibles.`
          : `Entiendo tu consulta sobre "${inputValue}". Te recomiendo que selecciones un agente especializado para obtener la mejor asistencia personalizada.`,
        isUser: false,
        timestamp: new Date(),
        agentId: selectedAgent?.id,
      }
      setMessages((prev) => [...prev, agentResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleVoiceRecording = () => {
    setIsListening(!isListening)
  }

  return (
    <div className="h-screen bg-black flex flex-col lg:flex-row">
      {/* Agents Sidebar */}
      <div className="w-full lg:w-80 bg-black border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white mb-2">AI Agents</h2>
          <p className="text-sm text-white/70">Selecciona un agente especializado</p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin chat-scroll p-4 space-y-3">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className={`p-4 cursor-pointer transition-all duration-200 border ${
                selectedAgent?.id === agent.id
                  ? "bg-white/10 border-white/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
              onClick={() => setSelectedAgent(agent)}
            >
              <div className="flex items-start gap-3">
                <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${agent.color} p-0.5`}>
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <Image
                      src={agent.avatar || "/placeholder.svg"}
                      alt={agent.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white text-sm">{agent.name}</h3>
                  <p className="text-xs text-white/70 mb-2">{agent.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 2).map((capability) => (
                      <Badge
                        key={capability}
                        variant="secondary"
                        className="text-xs bg-white/10 text-white/80 border-white/20"
                      >
                        {capability}
                      </Badge>
                    ))}
                    {agent.capabilities.length > 2 && (
                      <Badge variant="secondary" className="text-xs bg-white/10 text-white/80 border-white/20">
                        +{agent.capabilities.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-black">
          <div className="flex items-center gap-3">
            {selectedAgent ? (
              <>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedAgent.color} p-0.5`}>
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <Image
                      src={selectedAgent.avatar || "/placeholder.svg"}
                      alt={selectedAgent.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-white">{selectedAgent.name}</h3>
                  <p className="text-sm text-white/70">{selectedAgent.specialty}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white">AI Assistant</h3>
                  <p className="text-sm text-white/70">General Assistant</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin chat-scroll p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.isUser ? "justify-end" : "justify-start"}`}>
              {!message.isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[80%] lg:max-w-[70%] p-3 rounded-lg ${
                  message.isUser ? "bg-white/10 text-white rounded-tr-none" : "bg-white/5 text-white rounded-tl-none"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs text-white/50 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {message.isUser && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/5 p-3 rounded-lg rounded-tl-none">
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

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedAgent ? `Pregunta a ${selectedAgent.name}...` : "Escribe tu mensaje..."}
                className="w-full pl-4 pr-12 py-3 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
              />
              <Button
                onClick={toggleVoiceRecording}
                size="sm"
                variant="ghost"
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 h-auto ${
                  isListening ? "text-red-400 hover:text-red-300" : "text-white/50 hover:text-white/70"
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
