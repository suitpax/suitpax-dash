"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Send, Paperclip, Mic, Bot, ChevronDown, ChevronUp, Settings, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { GlowBorder } from "./glow-border"
import { useRouter } from "next/navigation"
import type { Message } from "@/lib/ai/anthropic-service"

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

export default function AIAgentInterface() {
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [showConversations, setShowConversations] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  // Configuración del agente
  const [agentSettings, setAgentSettings] = useState({
    model: "claude-3-7-sonnet-20250219",
    temperature: 0.7,
    maxTokens: 4000,
    systemPrompt:
      "You are Suitpax AI, a helpful assistant for business travel management. Help users plan trips, find flights and hotels, manage expenses, and navigate travel policies.",
  })

  // Inicializar con una conversación vacía
  useEffect(() => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hello! I'm your Suitpax AI travel assistant. How can I help you with your business travel needs today?",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    }
    setConversations([newConversation])
    setActiveConversation(newConversation)
  }, [])

  // Scroll al final de los mensajes cuando se añade uno nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConversation?.messages])

  // Manejar el envío de mensajes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !activeConversation) return

    // Añadir mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      createdAt: new Date(),
    }

    // Actualizar la conversación con el mensaje del usuario
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, userMessage],
    }
    setActiveConversation(updatedConversation)
    setConversations((prev) => prev.map((conv) => (conv.id === activeConversation.id ? updatedConversation : conv)))
    setInput("")
    setIsProcessing(true)

    try {
      // Llamar a la API de Anthropic
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedConversation.messages,
          systemPrompt: agentSettings.systemPrompt,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      // Añadir respuesta de la IA
      const assistantMessage: Message = {
        ...data.response,
        createdAt: new Date(data.response.createdAt),
      }

      // Actualizar la conversación con la respuesta del asistente
      const conversationWithResponse = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
        title:
          updatedConversation.title === "New Conversation"
            ? userMessage.content.substring(0, 30) + (userMessage.content.length > 30 ? "..." : "")
            : updatedConversation.title,
      }
      setActiveConversation(conversationWithResponse)
      setConversations((prev) =>
        prev.map((conv) => (conv.id === activeConversation.id ? conversationWithResponse : conv)),
      )
    } catch (error) {
      console.error("Error processing message:", error)

      // Añadir mensaje de error
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        createdAt: new Date(),
      }

      // Actualizar la conversación con el mensaje de error
      const conversationWithError = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, errorMessage],
      }
      setActiveConversation(conversationWithError)
      setConversations((prev) => prev.map((conv) => (conv.id === activeConversation.id ? conversationWithError : conv)))
    } finally {
      setIsProcessing(false)
    }
  }

  // Crear una nueva conversación
  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hello! I'm your Suitpax AI travel assistant. How can I help you with your business travel needs today?",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    }
    setConversations((prev) => [newConversation, ...prev])
    setActiveConversation(newConversation)
    setShowConversations(false)
  }

  // Seleccionar una conversación existente
  const selectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation)
    setShowConversations(false)
  }

  // Eliminar una conversación
  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConversations((prev) => prev.filter((conv) => conv.id !== id))
    if (activeConversation?.id === id) {
      const remaining = conversations.filter((conv) => conv.id !== id)
      setActiveConversation(remaining.length > 0 ? remaining[0] : null)
    }
  }

  // Manejar la subida de archivos
  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Procesar archivos subidos
  const processFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !activeConversation) return

    // En una implementación real, aquí se procesarían los archivos
    // Por ahora, solo añadimos un mensaje mencionando los archivos
    const fileNames = Array.from(files)
      .map((file) => file.name)
      .join(", ")
    const fileMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `I've uploaded the following files: ${fileNames}`,
      createdAt: new Date(),
    }

    // Actualizar la conversación con el mensaje de archivos
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, fileMessage],
    }
    setActiveConversation(updatedConversation)
    setConversations((prev) => prev.map((conv) => (conv.id === activeConversation.id ? updatedConversation : conv)))

    // Resetear el input de archivos
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Formatear el contenido del mensaje con saltos de línea
  const formatMessageContent = (content: string) => {
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className="flex flex-col h-full bg-black rounded-xl border border-white/10 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center">
          <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250405-WA0006.jpg-ssy02udC7rU3LK1do6bZYdDCxA1Z2R.jpeg"
              alt="AI Assistant"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-medium text-sm text-white">Suitpax AI</h2>
            <p className="text-xs text-white/70">Business Travel Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded-lg hover:bg-white/5"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4 text-white/50" />
          </button>
          <button
            onClick={() => setShowConversations(!showConversations)}
            className="p-1.5 rounded-lg hover:bg-white/5"
            aria-label="Conversations"
          >
            {showConversations ? (
              <ChevronUp className="h-4 w-4 text-white/50" />
            ) : (
              <ChevronDown className="h-4 w-4 text-white/50" />
            )}
          </button>
        </div>
      </div>

      {/* Conversations Dropdown */}
      {showConversations && (
        <div className="border-b border-white/10 max-h-60 overflow-y-auto bg-black/30">
          <div className="p-2">
            <button
              onClick={createNewConversation}
              className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/5 flex items-center text-white"
            >
              <Bot className="h-4 w-4 mr-2 text-white/50" />
              New conversation
            </button>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => selectConversation(conversation)}
                className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg cursor-pointer ${
                  activeConversation?.id === conversation.id ? "bg-white/10" : "hover:bg-white/5"
                } text-white`}
              >
                <div className="truncate flex-1">
                  <span className="font-medium">{conversation.title}</span>
                  <span className="text-white/50 ml-2">{formatDate(conversation.createdAt)}</span>
                </div>
                <button
                  onClick={(e) => deleteConversation(conversation.id, e)}
                  className="p-1 rounded-full hover:bg-white/10"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="h-3 w-3 text-white/50" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-white/10 p-3 bg-black/30">
          <h3 className="text-xs font-medium mb-2 text-white">Agent Settings</h3>
          <div className="space-y-2">
            <div>
              <label htmlFor="model" className="block text-xs text-white/50 mb-1">
                Model
              </label>
              <select
                id="model"
                value={agentSettings.model}
                onChange={(e) => setAgentSettings({ ...agentSettings, model: e.target.value })}
                className="w-full px-2 py-1 text-xs border border-white/10 rounded-md bg-white/5 text-white"
              >
                <option value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet</option>
                <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</option>
                <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              </select>
            </div>
            <div>
              <label htmlFor="temperature" className="block text-xs text-white/50 mb-1">
                Temperature: {agentSettings.temperature}
              </label>
              <input
                id="temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={agentSettings.temperature}
                onChange={(e) => setAgentSettings({ ...agentSettings, temperature: Number.parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="systemPrompt" className="block text-xs text-white/50 mb-1">
                System Prompt
              </label>
              <textarea
                id="systemPrompt"
                value={agentSettings.systemPrompt}
                onChange={(e) => setAgentSettings({ ...agentSettings, systemPrompt: e.target.value })}
                rows={3}
                className="w-full px-2 py-1 text-xs border border-white/10 rounded-md bg-white/5 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/30">
        {activeConversation?.messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-xl p-3 ${
                message.role === "user" ? "bg-white/10 text-white" : "bg-white/5 text-white/70"
              }`}
            >
              <div className="text-xs">{formatMessageContent(message.content)}</div>
              <div className="mt-1 text-[10px] text-right opacity-70">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-xl p-3 bg-white/5 text-white/70">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-white/30 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-white/30 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-white/30 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-3">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <GlowBorder>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your AI travel agent..."
                className="w-full pl-3 pr-20 py-3 bg-black border-0 rounded-xl focus:outline-none focus:ring-0 text-white"
              />
            </GlowBorder>
          </div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={handleFileUpload}
              className="p-1.5 rounded-full hover:bg-white/5"
              aria-label="Attach file"
            >
              <Paperclip className="h-4 w-4 text-white/50" />
            </button>
            <button type="button" className="p-1.5 rounded-full hover:bg-white/5" aria-label="Voice input">
              <Mic className="h-4 w-4 text-white/50" />
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
        <input type="file" ref={fileInputRef} onChange={processFiles} className="hidden" multiple />
      </div>
    </div>
  )
}
