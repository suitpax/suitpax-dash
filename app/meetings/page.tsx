"use client"

import { useState } from "react"
import { Layout } from "@/components/ui/layout"
import type { FormValues } from "@/lib/form-schema"
import ChatForm from "@/components/ui/chat-form"
import ChatMessage from "@/components/ui/chat-message"
import { CalendarIcon, VideoCameraIcon, ClockIcon, UserGroupIcon } from "@heroicons/react/24/outline"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type Meeting = {
  id: string
  title: string
  time: string
  duration: string
  attendees: number
  type: "video" | "in-person"
  location?: string
}

export default function MeetingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "I can help you schedule meetings, find available time slots, or manage your calendar. What would you like to do?",
    },
  ])

  const [meetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Q1 Business Review",
      time: "10:00 AM",
      duration: "1 hour",
      attendees: 8,
      type: "video",
    },
    {
      id: "2",
      title: "Client Presentation - NYC",
      time: "2:00 PM",
      duration: "2 hours",
      attendees: 5,
      type: "in-person",
      location: "Conference Room A",
    },
    {
      id: "3",
      title: "Team Standup",
      time: "4:30 PM",
      duration: "30 min",
      attendees: 6,
      type: "video",
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
        content: "I'll help you manage your meetings. Let me check your calendar and available options.",
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const todayMeetings = meetings
  const upcomingDates = ["Tomorrow", "March 15", "March 16", "March 17"]

  return (
    <Layout>
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Calendar Sidebar */}
        <div className="w-64 border-r border-white/10 p-3">
          <button className="w-full mb-3 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Schedule Meeting
          </button>

          <div className="mb-4">
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Today</h3>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-sm text-white">March 14, 2024</p>
              <p className="text-xs text-white/70">{meetings.length} meetings</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Upcoming</h3>
            <div className="space-y-1">
              {upcomingDates.map((date) => (
                <button
                  key={date}
                  className="w-full text-left px-2 py-1.5 text-xs text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                >
                  {date}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Meeting List */}
        <div className="w-96 border-r border-white/10 overflow-y-auto">
          <div className="p-3 border-b border-white/10">
            <h2 className="text-sm font-medium text-white">Today's Meetings</h2>
          </div>

          {todayMeetings.map((meeting) => (
            <div key={meeting.id} className="p-3 border-b border-white/10 hover:bg-white/5 cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm text-white font-medium">{meeting.title}</h4>
                {meeting.type === "video" ? (
                  <VideoCameraIcon className="h-4 w-4 text-white/50" />
                ) : (
                  <UserGroupIcon className="h-4 w-4 text-white/50" />
                )}
              </div>

              <div className="flex items-center space-x-3 text-xs text-white/70">
                <div className="flex items-center">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  {meeting.time}
                </div>
                <span>•</span>
                <span>{meeting.duration}</span>
                <span>•</span>
                <span>{meeting.attendees} attendees</span>
              </div>

              {meeting.location && <p className="text-xs text-white/50 mt-1">{meeting.location}</p>}
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
