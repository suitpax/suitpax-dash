"use client"

import { useState } from "react"
import { Layout } from "@/components/ui/layout"
import type { FormValues } from "@/lib/form-schema"
import ChatForm from "@/components/ui/chat-form"
import ChatMessage from "@/components/ui/chat-message"
import { EnvelopeIcon, InboxIcon, PaperAirplaneIcon, TrashIcon, StarIcon } from "@heroicons/react/24/outline"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type Email = {
  id: string
  from: string
  subject: string
  preview: string
  date: string
  isRead: boolean
  isStarred: boolean
}

export default function MailsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I can help you manage your emails. You can ask me to compose, search, or organize your messages.",
    },
  ])
  const [selectedFolder, setSelectedFolder] = useState("inbox")

  const [emails] = useState<Email[]>([
    {
      id: "1",
      from: "Travel Coordinator",
      subject: "Flight confirmation for NYC trip",
      preview: "Your flight to New York has been confirmed for March 15th...",
      date: "2 hours ago",
      isRead: false,
      isStarred: true,
    },
    {
      id: "2",
      from: "Hotel Marriott",
      subject: "Booking confirmation #MR2024",
      preview: "Thank you for choosing Marriott. Your reservation is confirmed...",
      date: "5 hours ago",
      isRead: true,
      isStarred: false,
    },
    {
      id: "3",
      from: "Finance Team",
      subject: "Expense report approved",
      preview: "Your expense report for February has been approved...",
      date: "Yesterday",
      isRead: true,
      isStarred: false,
    },
  ])

  async function handleSubmit(values: FormValues) {
    if (!values.prompt) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: values.prompt,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'll help you with that email task. What specific action would you like me to take?",
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const folders = [
    { id: "inbox", name: "Inbox", icon: InboxIcon, count: 3 },
    { id: "sent", name: "Sent", icon: PaperAirplaneIcon, count: 0 },
    { id: "starred", name: "Starred", icon: StarIcon, count: 1 },
    { id: "trash", name: "Trash", icon: TrashIcon, count: 0 },
  ]

  return (
    <Layout>
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 p-3">
          <button className="w-full mb-3 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center">
            <EnvelopeIcon className="h-4 w-4 mr-2" />
            Compose
          </button>

          <div className="space-y-0.5">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  selectedFolder === folder.id
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center">
                  <folder.icon className="h-4 w-4 mr-2" />
                  <span className="text-xs">{folder.name}</span>
                </div>
                {folder.count > 0 && (
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">{folder.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Email List */}
        <div className="w-96 border-r border-white/10 overflow-y-auto">
          {emails.map((email) => (
            <div
              key={email.id}
              className={`p-3 border-b border-white/10 hover:bg-white/5 cursor-pointer ${
                !email.isRead ? "bg-white/5" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className={`text-sm ${!email.isRead ? "text-white font-medium" : "text-white/70"}`}>
                  {email.from}
                </h4>
                <span className="text-[10px] text-white/50">{email.date}</span>
              </div>
              <h5 className={`text-xs mb-1 ${!email.isRead ? "text-white" : "text-white/70"}`}>{email.subject}</h5>
              <p className="text-xs text-white/50 truncate">{email.preview}</p>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
                  <img src="/ai-agents/agent-3.jpeg" alt="AI Assistant" className="h-8 w-8 object-cover" />
                </div>
                <div className="bg-black border border-white/10 p-2 rounded-xl max-w-[70%]">
                  <div className="flex space-x-1.5">
                    <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></div>
                    <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse delay-100"></div>
                    <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/10">
            <ChatForm isLoading={isLoading} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
