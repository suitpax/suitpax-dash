"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Paperclip, Mic, ChevronDown, ChevronUp, Settings } from "lucide-react"
import Image from "next/image"
import type { Message } from "@/lib/ai/anthropic-service"
import { GlowBorder } from "./glow-border"

interface AIChatProps {
  initialMessages?: Message[]
  onSendMessage: (message: string) => Promise<void>
  isProcessing: boolean
  systemPrompt?: string
  onSystemPromptChange?: (prompt: string) => void
  availableTables?: Array<{ name: string; columns: Array<{ name: string; type: string }> }>
  onSelectTable?: (tableName: string) => void
}

export default function AIChat({
  initialMessages = [],
  onSendMessage,
  isProcessing,
  systemPrompt = "",
  onSystemPromptChange,
  availableTables = [],
  onSelectTable,
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [localSystemPrompt, setLocalSystemPrompt] = useState(systemPrompt)
  const [showTables, setShowTables] = useState(false)

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
    if (!input.trim() || isProcessing) return

    // Añadir mensaje del usuario a la interfaz
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Enviar mensaje al servicio de IA
    await onSendMessage(input)
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

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
            <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
          </div>
          <div>
            <h2 className="font-medium text-sm">Suitpax AI</h2>
            <p className="text-xs text-gray-500">Asistente de viajes de negocios</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4 text-gray-500" />
          </button>
          <button
            onClick={() => setShowTables(!showTables)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="Tables"
          >
            {showTables ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-gray-200 p-3">
          <h3 className="text-xs font-medium mb-2">Configuración del asistente</h3>
          <div className="space-y-2">
            <div>
              <label htmlFor="systemPrompt" className="block text-xs text-gray-500 mb-1">
                Prompt del sistema
              </label>
              <textarea
                id="systemPrompt"
                value={localSystemPrompt}
                onChange={(e) => setLocalSystemPrompt(e.target.value)}
                onBlur={handleSystemPromptChange}
                rows={3}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md"
                placeholder="Instrucciones para el asistente..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Tables Dropdown */}
      {showTables && (
        <div className="border-b border-gray-200 max-h-60 overflow-y-auto">
          <div className="p-2">
            <h3 className="text-xs font-medium px-3 py-2">Tablas disponibles</h3>
            {availableTables.map((table) => (
              <div
                key={table.name}
                onClick={() => handleSelectTable(table.name)}
                className="flex items-center px-3 py-2 text-xs rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <span className="truncate">{table.name}</span>
                <span className="text-gray-500 ml-2 text-[10px]">({table.columns.length} columnas)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-xl p-3 ${
                message.role === "user" ? "bg-black text-white" : "bg-gray-100 text-black"
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
            <div className="max-w-[80%] rounded-xl p-3 bg-gray-100 text-black">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <GlowBorder>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta a tu asistente de viajes..."
                className="w-full pl-3 pr-20 py-3 bg-white border-0 rounded-xl focus:outline-none focus:ring-0"
                disabled={isProcessing}
              />
            </GlowBorder>
          </div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={handleFileUpload}
              className="p-1.5 rounded-full hover:bg-gray-100"
              aria-label="Adjuntar archivo"
              disabled={isProcessing}
            >
              <Paperclip className="h-4 w-4 text-gray-500" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-gray-100"
              aria-label="Entrada de voz"
              disabled={isProcessing}
            >
              <Mic className="h-4 w-4 text-gray-500" />
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="p-1.5 rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-black"
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
