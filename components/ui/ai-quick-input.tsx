"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRightIcon, Mic, MicOff, Bot, X } from "lucide-react"
import { useSpeechRecognition } from "@/lib/hooks/use-speech-recognition"

interface AIQuickInputProps {
  placeholder?: string
  onSubmit?: (message: string) => void
  className?: string
}

function AIQuickInput({ placeholder = "Ask Suitpax AI anything...", onSubmit, className = "" }: AIQuickInputProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [showResponse, setShowResponse] = useState(false)
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
    setShowResponse(true)
    setResponse("")

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
          setResponse(data.message || data.response || "I'm here to help with your travel needs!")
        } else {
          setResponse("I'm having trouble connecting right now. Please try again or contact support.")
        }
      }
    } catch (error) {
      console.error("AI Quick Input error:", error)
      setResponse("I'm having trouble connecting right now. Please try again or contact support.")
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

  const closeResponse = () => {
    setShowResponse(false)
    setResponse("")
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Input */}
      <div className="bg-black border border-white/10 rounded-xl p-3 backdrop-blur-sm">
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
              className="w-full pl-12 pr-20 py-3 text-sm bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30 disabled:opacity-50 font-light"
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

      {/* Response */}
      {showResponse && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm min-h-[120px] relative">
          <button
            onClick={closeResponse}
            className="absolute top-3 right-3 p-1 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 pt-1">
              <div className="text-white/90 text-sm font-light leading-relaxed">
                {isLoading ? (
                  <div className="flex items-center gap-2">
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
                    <span className="text-white/50">Thinking...</span>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{response}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Export both named and default
export { AIQuickInput }
export default AIQuickInput
