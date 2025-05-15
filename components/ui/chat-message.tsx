"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start space-x-2", isUser && "flex-row-reverse space-x-reverse")}>
      {!isUser ? (
        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
          <Image
            src="/images/suitpax-avatar.png"
            alt="Suitpax AI"
            width={32}
            height={32}
            className="h-8 w-8 object-cover"
          />
        </div>
      ) : (
        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
          <span className="text-white text-[10px]">You</span>
        </div>
      )}

      <div
        className={cn(
          "p-2 rounded-xl max-w-[75%]",
          isUser ? "bg-black border border-white/10" : "bg-black border border-white/10",
        )}
      >
        <p className="text-white font-light text-xs">{message.content}</p>
      </div>
    </div>
  )
}
