"use client"

import { useState } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import AiChatInput from "./ai-chat-input"
import { cn } from "@/lib/utils"

export default function FloatingAiButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-20 right-4 z-50 md:hidden">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-[calc(100vw-2rem)] max-w-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
                <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
              </div>
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">Asistente de Viajes</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <AiChatInput />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "flex items-center justify-center",
            "h-12 w-12 rounded-full",
            "bg-gray-900 dark:bg-gray-200",
            "shadow-lg hover:shadow-xl",
            "transition-all duration-200",
            "border-2 border-white dark:border-gray-800",
          )}
        >
          <div className="relative h-full w-full rounded-full overflow-hidden">
            <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
          </div>
        </button>
      )}
    </div>
  )
}
