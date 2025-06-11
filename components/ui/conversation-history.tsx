"use client"
import type { Conversation } from "@/lib/ai-agents/agent-service"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare } from "lucide-react"

interface ConversationHistoryProps {
  conversations: Conversation[]
  onSelectConversation: (conversation: Conversation) => void
  activeConversationId?: string
}

export default function ConversationHistory({
  conversations,
  onSelectConversation,
  activeConversationId,
}: ConversationHistoryProps) {
  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">No conversation history yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-gray-500 px-2">Recent Conversations</h3>
      <div className="space-y-1">
        {conversations.map((conversation) => {
          // Get the last message for preview
          const lastMessage = conversation.messages[conversation.messages.length - 1]

          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`w-full text-left p-2 rounded-lg transition-colors ${
                activeConversationId === conversation.id ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-medium text-gray-700 truncate">{conversation.title}</h4>
                  <p className="text-[10px] text-gray-500 truncate">{lastMessage?.content}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
