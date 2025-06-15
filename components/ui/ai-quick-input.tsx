"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRightIcon, Mic, MicOff, Crown } from "lucide-react"
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
            plan: "pro",
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
      <div className="flex items-center space-x-2 mb-2">
        <div className="relative h-5 w-5 rounded-md overflow-hidden">
          <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
        </div>
        <span className="text-xs font-medium text-white">Suitpax AI</span>
        <div className="px-2 py-0.5 text-[9px] font-medium bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 rounded-full flex items-center">
          <Crown className="h-2.5 w-2.5 mr-1" />
          Pro
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : placeholder}
            disabled={isLoading}
            className="w-full pl-3 pr-20 py-2.5 text-sm bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30 disabled:opacity-50 font-light"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {isSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`p-1.5 rounded-lg transition-all hover:scale-105 ${
                  isListening ? "bg-red-500 text-white hover:bg-red-600" : "bg-white text-black hover:bg-white/90"
                }`}
              >
                {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
              </button>
            )}
            <button
              type="submit"
              className="p-1.5 bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all rounded-lg hover:scale-105 disabled:hover:scale-100"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <div className="w-3 h-3 border border-black/30 border-t-black/70 rounded-full animate-spin" />
              ) : (
                <ArrowRightIcon className="h-3 w-3" />
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
