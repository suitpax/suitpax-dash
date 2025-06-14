"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRightIcon, Mic, MicOff } from "lucide-react"
import { useSpeechRecognition } from "@/lib/hooks/use-speech-recognition"

interface AIQuickInputProps {
  placeholder?: string
  onSubmit?: (message: string) => void
  className?: string
}

function AIQuickInput({ placeholder = "Ask Suitpax AI anything...", onSubmit, className = "" }: AIQuickInputProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported } =
    useSpeechRecognition()

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput("")
    resetTranscript()
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

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      resetTranscript()
      setInput("")
      startListening()
    }
  }

  return (
    <div className={`bg-black border border-white/10 rounded-xl p-3 backdrop-blur-sm ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
            <div className="relative h-6 w-6 rounded-md overflow-hidden mr-2">
              <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
            </div>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : placeholder}
            disabled={isLoading}
            className="w-full pl-12 pr-20 py-2.5 text-sm bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30 disabled:opacity-50 font-light"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {isSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`p-1.5 rounded-lg transition-colors ${
                  isListening
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            )}
            <button
              type="submit"
              className="p-1.5 text-white/50 hover:text-white disabled:opacity-50 transition-colors rounded-lg hover:bg-white/5"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border border-white/30 border-t-white/70 rounded-full animate-spin" />
              ) : (
                <ArrowRightIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

// Export both named and default
export { AIQuickInput }
export default AIQuickInput
