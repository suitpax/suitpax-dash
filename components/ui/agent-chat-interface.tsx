"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  type AIAgent,
  type Conversation,
  generateAIResponse,
  addMessageToConversation,
  createConversation,
} from "@/lib/ai-agents/agent-service"
import { ArrowRightIcon, Paperclip, Mic, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface AgentChatInterfaceProps {
  agent: AIAgent
  initialConversation?: Conversation
}

export default function AgentChatInterface({ agent, initialConversation }: AgentChatInterfaceProps) {
  const [conversation, setConversation] = useState<Conversation | undefined>(initialConversation)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation?.messages])

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [inputValue])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue("")
    setIsLoading(true)

    try {
      // If no conversation exists, create one
      if (!conversation) {
        const newConversation = createConversation(agent.id, userMessage)
        setConversation(newConversation)
      } else {
        // Add user message to existing conversation
        const updatedConversation = addMessageToConversation(conversation.id, {
          role: "user",
          content: userMessage,
          agentId: agent.id,
        })

        if (updatedConversation) {
          setConversation(updatedConversation)
        }
      }

      // Generate AI response
      const aiResponse = await generateAIResponse(agent.id, userMessage, conversation?.id)

      // Add AI response to conversation
      if (conversation) {
        const finalConversation = addMessageToConversation(conversation.id, {
          role: "assistant",
          content: aiResponse,
          agentId: agent.id,
        })

        if (finalConversation) {
          setConversation(finalConversation)
        }
      } else {
        // If we created a new conversation above
        const newConversation = createConversation(agent.id, userMessage)
        const finalConversation = addMessageToConversation(newConversation.id, {
          role: "assistant",
          content: aiResponse,
          agentId: agent.id,
        })

        if (finalConversation) {
          setConversation(finalConversation)
        }
      }
    } catch (error) {
      console.error("Error in chat:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-t-xl">
        {conversation?.messages && conversation.messages.length > 0 ? (
          <div className="space-y-4">
            {conversation.messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                    <Image src={agent.avatar || "/placeholder.svg"} alt={agent.name} fill className="object-cover" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-xl p-3 ${
                    message.role === "user"
                      ? "bg-black text-white rounded-tr-none"
                      : "bg-gray-200 text-gray-800 rounded-tl-none"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className="mt-1 text-[10px] opacity-70 text-right">
                    {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                  <Image src={agent.avatar || "/placeholder.svg"} alt={agent.name} fill className="object-cover" />
                </div>
                <div className="bg-gray-200 text-gray-800 rounded-xl rounded-tl-none max-w-[80%] p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Image
                src={agent.avatar || "/placeholder.svg"}
                alt={agent.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">{agent.name}</h2>
            <p className="text-gray-600 max-w-md mb-6">{agent.description}</p>
            <div className="text-sm text-gray-500 max-w-md">
              <p>This AI agent can help you with:</p>
              <ul className="mt-2 space-y-1">
                {agent.capabilities.slice(0, 3).map((capability, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-start">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${agent.name} something...`}
              className="w-full py-2 px-3 pr-16 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm text-black min-h-[40px] max-h-[120px] resize-none"
              rows={1}
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                className="p-1.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                disabled={isLoading}
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="p-1.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                disabled={isLoading}
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`p-1.5 rounded-xl transition-colors duration-200 ${
                  inputValue.trim() && !isLoading
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRightIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
