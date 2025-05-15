"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Paperclip, Mic, ChevronDown, ChevronUp, Settings } from "lucide-react"
import Image from "next/image"
import type { Message } from "@/lib/ai/anthropic-service"
import { GlowBorder } from "./glow-border"

interface AIChatProps {
  initialMessages?: Message[]
  onSendMessage?: (message: string) => Promise<void>
  isProcessing?: boolean
  systemPrompt?: string
  onSystemPromptChange?: (prompt: string) => void
  availableTables?: Array<{ name: string; columns: Array<{ name: string; type: string }> }>
  onSelectTable?: (tableName: string) => void
}

export default function AIChat({
  initialMessages = [],
  onSendMessage,
  isProcessing: externalIsProcessing,
  systemPrompt = "You are Suitpax AI, a helpful assistant for business travel management. Help users plan trips, find flights and hotels, manage expenses, and navigate travel policies.",
  onSystemPromptChange,
  availableTables = [],
  onSelectTable,
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [localSystemPrompt, setLocalSystemPrompt] = useState(systemPrompt)
  const [showTables, setShowTables] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Actualizar mensajes cuando cambian las props
  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement
      if (container) {
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 150
        if (isAtBottom) {
          requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "end",
            })
          })
        }
      }
    }
  }, [messagesEndRef])

  // Scroll al final de los mensajes cuando se añade uno nuevo
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Manejar el envío de mensajes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || (externalIsProcessing !== undefined ? externalIsProcessing : isProcessing)) return

    // Añadir mensaje del usuario a la interfaz
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    if (onSendMessage) {
      // Si se proporciona onSendMessage, usarlo
      await onSendMessage(input)
    } else {
      // Si no, manejar la llamada a la API internamente
      setIsProcessing(true)

      try {
        // Llamar a la API de Anthropic
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            systemPrompt: localSystemPrompt,
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
            content: "I'm sorry, I encountered an error while processing your request. Please try again.",
            id: Date.now().toString(),
            createdAt: new Date(),
          },
        ])
      } finally {
        setIsProcessing(false)
      }
    }
  }

  // Manejar cambios en el prompt del sistema
  const handleSystemPromptChange = () => {
    if (onSystemPromptChange) {
      onSystemPromptChange(localSystemPrompt)
    }
  }

  // Manejar la subida de archivos
  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Procesar archivos subidos
  const processFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // En una implementación real, aquí se procesarían los archivos
    // Por ahora, solo añadimos un mensaje mencionando los archivos
    const fileNames = Array.from(files)
      .map((file) => file.name)
      .join(", ")

    const fileMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `He subido los siguientes archivos: ${fileNames}`,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, fileMessage])

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

  // Seleccionar una tabla
  const handleSelectTable = (tableName: string) => {
    if (onSelectTable) {
      onSelectTable(tableName)
    }
    setShowTables(false)
  }

  const currentIsProcessing = externalIsProcessing !== undefined ? externalIsProcessing : isProcessing

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
            <p className="text-xs text-white/70">Asistente de viajes de negocios</p>
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
            onClick={() => setShowTables(!showTables)}
            className="p-1.5 rounded-lg hover:bg-white/5"
            aria-label="Tables"
          >
            {showTables ? (
              <ChevronUp className="h-4 w-4 text-white/50" />
            ) : (
              <ChevronDown className="h-4 w-4 text-white/50" />
            )}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-white/10 p-3 bg-black/30">
          <h3 className="text-xs font-medium mb-2 text-white">Configuración del asistente</h3>
          <div className="space-y-2">
            <div>
              <label htmlFor="systemPrompt" className="block text-xs text-white/50 mb-1">
                Prompt del sistema
              </label>
              <textarea
                id="systemPrompt"
                value={localSystemPrompt}
                onChange={(e) => setLocalSystemPrompt(e.target.value)}
                onBlur={handleSystemPromptChange}
                rows={3}
                className="w-full px-2 py-1 text-xs border border-white/10 rounded-md bg-white/5 text-white"
                placeholder="Instrucciones para el asistente..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Tables Dropdown */}
      {showTables && (
        <div className="border-b border-white/10 max-h-60 overflow-y-auto bg-black/30">
          <div className="p-2">
            <h3 className="text-xs font-medium px-3 py-2 text-white">Tablas disponibles</h3>
            {availableTables.map((table) => (
              <div
                key={table.name}
                onClick={() => handleSelectTable(table.name)}
                className="flex items-center px-3 py-2 text-xs rounded-lg cursor-pointer hover:bg-white/5 text-white"
              >
                <span className="truncate">{table.name}</span>
                <span className="text-white/50 ml-2 text-[10px]">({table.columns.length} columnas)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/30">
        {messages.map((message) => (
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
        {currentIsProcessing && (
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
                placeholder="Pregunta a tu asistente de viajes..."
                className="w-full pl-3 pr-20 py-3 bg-black border-0 rounded-xl focus:outline-none focus:ring-0 text-white"
                disabled={currentIsProcessing}
              />
            </GlowBorder>
          </div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={handleFileUpload}
              className="p-1.5 rounded-full hover:bg-white/5"
              aria-label="Adjuntar archivo"
              disabled={currentIsProcessing}
            >
              <Paperclip className="h-4 w-4 text-white/50" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-white/5"
              aria-label="Entrada de voz"
              disabled={currentIsProcessing}
            >
              <Mic className="h-4 w-4 text-white/50" />
            </button>
            <button
              type="submit"
              disabled={!input.trim() || currentIsProcessing}
              className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10"
              aria-label="Enviar mensaje"
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
