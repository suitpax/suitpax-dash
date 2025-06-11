"use client"

import type React from "react"

import { useState } from "react"
import { SendIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FormValues {
  prompt: string
}

interface ChatFormProps {
  isLoading: boolean
  onSubmit: (values: FormValues) => void
}

export default function ChatForm({ isLoading, onSubmit }: ChatFormProps) {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isLoading) return

    onSubmit({ prompt })
    setPrompt("")
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center bg-black border border-white/10 rounded-xl overflow-hidden">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Suitpax AI..."
          className="flex-1 bg-transparent border-0 focus:ring-0 text-white text-xs py-3 px-4 placeholder:text-white/50"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className={cn(
            "p-2 mr-1 rounded-lg transition-colors",
            prompt.trim() && !isLoading
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-transparent text-white/30 cursor-not-allowed",
          )}
        >
          <SendIcon className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}
