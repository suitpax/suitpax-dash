"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, Settings } from "lucide-react"
import type { Message } from "@/lib/ai/ai-service"

interface AIChat {
  initialMessages: Message[]
  onSendMessage: (content: string) => void
  isProcessing: boolean
  systemPrompt?: string
  onSystemPromptChange?: (prompt: string) => void
  availableTables?: Array<{ name: string; columns: Array<{ name: string; type: string }> }>
  onSelectTable?: (tableName: string) => void
}

export default function AIChat({
  initialMessages,
  onSendMessage,
  isProcessing,
  systemPrompt = "",
  onSystemPromptChange,
  availableTables = [],
  onSelectTable,
}: AIChat) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [localSystemPrompt, setLocalSystemPrompt] = useState(systemPrompt)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Actualizar mensajes cuando cambian los initialMessages
  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  // Scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Manejar envío de mensaje
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isProcessing) {
      onSendMessage(input)
      setInput("")
    }
  }

  // Manejar cambio de system prompt
  const handleSystemPromptChange = () => {
    if (onSystemPromptChange) {
      onSystemPromptChange(localSystemPrompt)
    }
    setShowSettings(false)
  }

  // Manejar tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Ajustar altura del textarea
  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="font-medium">AI Assistant</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1.5 rounded-lg hover:bg-gray-100"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium mb-2">System Prompt</h3>
          <textarea
            value={localSystemPrompt}
            onChange={(e) => setLocalSystemPrompt(e.target.value)}
            className="w-full p-2 text-xs border border-gray-300 rounded-md mb-2 h-24"
            placeholder="Enter system instructions..."
          />
          <div className="flex justify-between">
            <button
              onClick={() => setShowSettings(false)}
              className="px-3 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSystemPromptChange}
              className="px-3 py-1 text-xs rounded-md bg-black text-white hover:bg-gray-800"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Data Selection */}
      {availableTables.length > 0 && onSelectTable && (
        <div className="p-2 border-b border-gray-200 bg-gray-50 flex items-center">
          <span className="text-xs text-gray-500 mr-2">Data source:</span>
          <select
            onChange={(e) => onSelectTable(e.target.value)}
            className="text-xs border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="">Select a table</option>
            {availableTables.map((table) => (
              <option key={table.name} value={table.name}>
                {table.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} ${
              message.role === "system" ? "opacity-70" : ""
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-black text-white rounded-tr-none"
                  : message.role === "system"
                    ? "bg-gray-200 text-gray-800"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <div className="mt-1 text-right">
                <span className="text-[10px] opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg rounded-tl-none max-w-[80%] p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
        <div className="relative flex items-center">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              adjustTextareaHeight()
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full pl-3 pr-20 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black resize-none min-h-[40px]"
            rows={1}
          />
          <div className="absolute right-2 flex space-x-1">
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-gray-100"
              aria-label="Voice input"
              disabled={isProcessing}
            >
              <Mic className="h-4 w-4 text-gray-500" />
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className={`p-1.5 rounded-full ${
                input.trim() && !isProcessing
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
