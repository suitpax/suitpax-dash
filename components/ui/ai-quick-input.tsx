"use client"

import type React from "react"

import { useState } from "react"
import { SparklesIcon, ArrowRightIcon } from "@heroicons/react/24/outline"

interface AIQuickInputProps {
  placeholder?: string
  onSubmit?: (message: string) => void
}

function AIQuickInput({ placeholder = "Ask AI anything...", onSubmit }: AIQuickInputProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput("")
    setIsLoading(true)

    try {
      if (onSubmit) {
        onSubmit(message)
      } else {
        // Default behavior - call chat API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            isPro: false,
            plan: "free",
            userId: "quick-input-user",
            conversationId: `quick-${Date.now()}`,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          // You could show a toast notification here with the response
          console.log("AI Response:", data.response)
        }
      }
    } catch (error) {
      console.error("AI Quick Input error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-2">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <SparklesIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full pl-10 pr-12 py-2 text-sm bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30 disabled:opacity-50"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-white/50 hover:text-white disabled:opacity-50 transition-colors"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border border-white/30 border-t-white/70 rounded-full animate-spin" />
            ) : (
              <ArrowRightIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

// Export both named and default
export { AIQuickInput }
export default AIQuickInput
