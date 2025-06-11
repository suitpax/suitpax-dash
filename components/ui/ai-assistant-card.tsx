"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { SparklesIcon, ArrowRightIcon } from "@heroicons/react/24/outline"

export default function AiAssistantCard() {
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [quickSuggestions] = useState<string[]>(["Book a flight", "Find hotels", "Check expenses"])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: inputValue }])
      setIsTyping(true)

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I can help you with "${inputValue}". What specific details do you need?`,
          },
        ])
        setIsTyping(false)
      }, 1500)

      setInputValue("")
    }
  }

  const handleQuickSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    }, 100)
  }

  return (
    <div className="bg-black rounded-lg border border-white/10 shadow-sm overflow-hidden">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-2 border-b border-white/10">
        <div className="flex items-center">
          <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
            <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
          </div>
          <div>
            <h3 className="font-medium text-white text-xs">AI Agent</h3>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <SparklesIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Conversation area (visible when expanded) */}
      {isExpanded && (
        <div className="h-[200px] overflow-y-auto p-2 bg-black/30">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <SparklesIcon className="h-5 w-5 text-white/50 mb-2" />
              <p className="text-xs text-white/70">How can I help you today?</p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-2 text-xs ${
                      message.role === "user" ? "bg-white/10 text-white" : "bg-white/5 text-white/90"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 text-white/90 rounded-lg p-2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-white/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-white/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      )}

      {/* Quick suggestions */}
      {!isExpanded && (
        <div className="px-2 py-1.5 flex gap-1">
          {quickSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleQuickSuggestionClick(suggestion)}
              className="text-[10px] px-2 py-1 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="p-2 border-t border-white/10">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask anything..."
            className={`w-full py-1.5 px-2 pr-8 bg-white/5 border ${
              isFocused ? "border-white/20" : "border-white/10"
            } rounded-lg focus:outline-none text-xs text-white placeholder:text-white/30 resize-none`}
            rows={1}
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
              inputValue.trim() ? "bg-white/10 text-white hover:bg-white/20" : "bg-transparent text-white/30"
            }`}
          >
            <ArrowRightIcon className="h-3 w-3" />
          </button>
        </form>
      </div>
    </div>
  )
}
