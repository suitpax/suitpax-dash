"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SendIcon, MicIcon } from "lucide-react"

interface ChatFormProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  placeholder?: string
}

export default function ChatForm({
  onSendMessage,
  isLoading = false,
  placeholder = "Try ask anything...",
}: ChatFormProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-2 border-t border-white/10">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || isLoading}
        className={`rounded-full ${
          message.trim() && !isLoading ? "bg-white text-black hover:bg-white/90" : "bg-white/10 text-white/50"
        }`}
      >
        <SendIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        className="rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
      >
        <MicIcon className="h-4 w-4" />
      </Button>
    </form>
  )
}
