import { Badge } from "@/components/ui/badge"
import { CheckCircle, Brain, Paperclip } from "lucide-react"
import { TypingEffect } from "@/components/ui/typing-effect"

interface AIAgent {
  id: string
  name: string
  specialty: string
  avatar: string
  color: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  agent?: AIAgent
  tokens?: number
  cost?: string
  thinkingMode?: boolean
  actionExecuted?: boolean
  actionResult?: any
  attachments?: string[]
}

interface EnhancedChatMessageProps {
  message: Message
}

export function EnhancedChatMessage({ message }: EnhancedChatMessageProps) {
  const formatMessageContent = (content: string) => {
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}>
        {message.role === "assistant" && (
          <div className="flex items-center space-x-2 mb-2">
            <div className="relative">
              <img
                src={message.agent?.avatar || "/images/ai-agent-avatar.png"}
                alt={message.agent?.name || "AI"}
                className="w-5 h-5 rounded-full object-cover"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-black"></div>
            </div>
            <span className="text-xs text-white/60">
              {message.agent?.name || "Suitpax AI"}
              {message.agent?.specialty && <span className="text-white/40"> • {message.agent.specialty}</span>}
            </span>
            {message.tokens && (
              <Badge className="bg-white/10 text-white/50 text-xs px-2 py-0.5 rounded-full border border-white/20">
                {message.tokens}t
              </Badge>
            )}
            {message.actionExecuted && (
              <Badge className="bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded-full">
                <CheckCircle className="h-3 w-3 mr-1" />
                Action
              </Badge>
            )}
            {message.thinkingMode && (
              <Badge className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                <Brain className="h-3 w-3 mr-1" />
                Deep
              </Badge>
            )}
          </div>
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {message.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded-lg text-xs text-white/70"
              >
                <Paperclip className="h-3 w-3" />
                <span>{attachment}</span>
              </div>
            ))}
          </div>
        )}

        <div
          className={`rounded-lg p-4 backdrop-blur-sm transition-all duration-200 ${
            message.role === "user"
              ? "bg-gradient-to-br from-white to-white/90 text-black rounded-tr-none shadow-lg"
              : "bg-gradient-to-br from-white/10 to-white/5 text-white rounded-tl-none border border-white/10"
          }`}
        >
          <div className="text-sm leading-relaxed">
            {message.role === "assistant" ? (
              <TypingEffect text={message.content} speed={35} />
            ) : (
              formatMessageContent(message.content)
            )}
          </div>
          <div className="mt-2 text-xs opacity-70 flex items-center justify-between">
            <span>
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <div className="flex items-center space-x-2">
              {message.cost && <span className="text-green-400">€{message.cost}</span>}
              {message.actionResult && (
                <span className="text-green-400 text-xs">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  {message.actionResult.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
