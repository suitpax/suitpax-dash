"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ArrowRightIcon } from "lucide-react"

interface AIQuickInputProps {
  placeholder?: string
  onSubmit?: (message: string) => void
  className?: string
}

export default function AIQuickInput({
  placeholder = "Quick AI query...",
  onSubmit,
  className = "",
}: AIQuickInputProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)

    try {
      if (onSubmit) {
        onSubmit(input.trim())
      } else {
        // Default behavior - call AI API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input.trim(),
            isPro: true,
            plan: "business",
            conversationId: `quick-${Date.now()}`,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          // You could show a toast or notification with the response
          console.log("AI Response:", data.response)
        }
      }

      setInput("")
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`bg-white/5 rounded-lg border border-white/10 p-2 ${className}`}>
      <div className="flex items-center mb-2">
        <div className="relative h-5 w-5 rounded-full overflow-hidden mr-2">
          <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
        </div>
        <span className="text-xs font-light text-white">Suitpax AI</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full pl-3 pr-8 py-1.5 text-xs bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30 disabled:opacity-50 font-light"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white disabled:opacity-50"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <div className="w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin" />
            ) : (
              <ArrowRightIcon className="h-3 w-3" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
