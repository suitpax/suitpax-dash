"use client"

import { useState } from "react"
import { ExternalLink, Menu } from "lucide-react"
import type { FormValues } from "@/lib/form-schema"
import ChatForm from "./chat-form"
import { useMediaQuery } from "@/hooks/use-media-query"
import Image from "next/image"
import ChatMessage from "./chat-message"
import MobileNavigation from "./mobile-navigation"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export type AISection = "business" | "expenses" | "tasks" | "reporting" | "support"

export default function SuitpaxChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm Zia, your Suitpax business travel and expense management assistant. How can I help optimize your workflow today?",
    },
  ])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<AISection>("business")
  const isMobile = useMediaQuery("(max-width: 768px)")

  async function handleSubmit(values: FormValues) {
    if (!values.prompt) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: values.prompt,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Get responses based on active section
    const responses = getResponsesBySection(activeSection)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const getResponsesBySection = (section: AISection): string[] => {
    // Generic responses for all sections
    return [
      "I understand. How can I assist you further with that?",
      "I'm here to help with your business travel and expense management needs.",
      "Let me know if you need any specific information about that.",
      "I can provide more details if you'd like.",
      "Is there anything else you'd like to know about this topic?",
    ]
  }

  const handleSectionChange = (section: AISection) => {
    setActiveSection(section)
    setMobileMenuOpen(false)

    // Add a welcome message for the new section
    const welcomeMessages: Record<AISection, string> = {
      business: "I can help optimize your business travel arrangements. What trip are you planning?",
      expenses: "Let me help you manage your expenses efficiently. What would you like to do?",
      tasks: "I'll help you stay organized with your travel-related tasks. What do you need to accomplish?",
      reporting:
        "I can generate insightful reports on your travel and expense data. What metrics are you interested in?",
      support: "Need assistance with your business travel or expenses? I'm here to help resolve any issues.",
    }

    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: welcomeMessages[section],
      },
    ])
  }

  const ExternalLinks = () => (
    <div className="flex items-center space-x-6">
      <a
        href="https://suitpax.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-white hover:text-gray-300 transition-colors tracking-normal"
      >
        <span className="mr-1 text-[10px] font-light">Website</span>
        <ExternalLink className="h-2.5 w-2.5" />
      </a>
      <a
        href="https://suitpax.com/upgrade"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-white hover:text-gray-300 transition-colors tracking-normal"
      >
        <span className="mr-1 text-[10px] font-light">Upgrade</span>
        <ExternalLink className="h-2.5 w-2.5" />
      </a>
    </div>
  )

  return (
    <div className="relative h-[100dvh] w-full">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-black bg-radial-gradient"></div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-white/10">
          <div className="flex items-center space-x-3">
            {isMobile && (
              <button onClick={() => setMobileMenuOpen(true)} className="text-white p-1 rounded-md hover:bg-white/10">
                <Menu className="h-4 w-4" />
              </button>
            )}
            <Image src="/images/suitpax-logo.png" alt="Suitpax Logo" width={120} height={30} className="h-6 w-auto" />
            <h1 className="text-sm text-white font-light tracking-wide hidden sm:block">
              The next-gen of business travel & expense management
            </h1>
          </div>

          {/* Links in top right - desktop only */}
          {!isMobile && (
            <div className="pointer-events-auto">
              <ExternalLinks />
            </div>
          )}
        </div>

        {/* Section indicator - mobile only */}
        {isMobile && (
          <div className="px-3 py-1 bg-black/50 border-b border-white/5">
            <p className="text-[10px] font-light text-white/70">
              <span className="text-white">Zia</span> • {getSectionDisplayName(activeSection)}
            </p>
          </div>
        )}

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                <Image
                  src="/images/suitpax-avatar.png"
                  alt="Suitpax AI"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-cover"
                />
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

        {/* Input field at bottom */}
        <div className="p-4 relative">
          <div className="absolute bottom-6 left-0 right-0 mx-4 rounded-xl overflow-hidden shadow-lg">
            <ChatForm isLoading={isLoading} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
    </div>
  )
}

function getSectionDisplayName(section: AISection): string {
  switch (section) {
    case "business":
      return "Business Travel"
    case "expenses":
      return "Expense Management"
    case "tasks":
      return "Task Management"
    case "reporting":
      return "Reporting & Analytics"
    case "support":
      return "Support"
    default:
      return "Business Assistant"
  }
}
