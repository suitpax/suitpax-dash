"use client"

import { useState, Suspense } from "react"
import { Layout } from "@/components/ui/layout"
import {
  CalendarIcon,
  VideoCameraIcon,
  ClockIcon,
  UserGroupIcon,
  PlusIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"

type Meeting = {
  id: string
  title: string
  time: string
  duration: string
  attendees: number
  type: "video" | "in-person"
  location?: string
  status: "upcoming" | "in-progress" | "completed"
  priority: "high" | "medium" | "low"
}

function MeetingsContent() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isConfigured, setIsConfigured] = useState(false)

  const [meetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Q1 Business Review",
      time: "10:00 AM",
      duration: "1 hour",
      attendees: 8,
      type: "video",
      status: "upcoming",
      priority: "high",
    },
    {
      id: "2",
      title: "Client Presentation - NYC",
      time: "2:00 PM",
      duration: "2 hours",
      attendees: 5,
      type: "in-person",
      location: "Conference Room A",
      status: "upcoming",
      priority: "medium",
    },
    {
      id: "3",
      title: "Team Standup",
      time: "4:30 PM",
      duration: "30 min",
      attendees: 6,
      type: "video",
      status: "completed",
      priority: "low",
    },
  ])

  const filters = [
    { id: "all", name: "All Meetings", count: meetings.length },
    { id: "today", name: "Today", count: meetings.filter((m) => m.status === "upcoming").length },
    { id: "video", name: "Video Calls", count: meetings.filter((m) => m.type === "video").length },
    { id: "in-person", name: "In Person", count: meetings.filter((m) => m.type === "in-person").length },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return "bg-white/10 text-white/70 border-white/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "in-progress":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "completed":
        return "bg-white/10 text-white/50 border-white/20"
      default:
        return "bg-white/10 text-white/70 border-white/20"
    }
  }

  if (!isConfigured) {
    return (
      <Layout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="h-8 w-8 text-white/50" />
            </div>
            <h2 className="text-xl font-medium tracking-tighter text-white mb-2">Set Up Your Meeting Management</h2>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
              Connect your calendar and configure meeting preferences to get started with intelligent meeting
              management.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left">
                <CalendarIcon className="h-6 w-6 text-white/70 mb-2" />
                <h3 className="text-white font-medium text-sm mb-1">Connect Calendar</h3>
                <p className="text-white/50 text-xs">Sync with Google Calendar, Outlook, or other providers</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left">
                <VideoCameraIcon className="h-6 w-6 text-white/70 mb-2" />
                <h3 className="text-white font-medium text-sm mb-1">Video Preferences</h3>
                <p className="text-white/50 text-xs">Set default meeting platforms and room preferences</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setIsConfigured(true)}
                className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
              >
                Connect Google Calendar
              </button>
              <div className="flex items-center justify-center space-x-4 text-xs">
                <button className="text-white/50 hover:text-white/70">Connect Outlook</button>
                <span className="text-white/30">•</span>
                <button className="text-white/50 hover:text-white/70">Other Providers</button>
                <span className="text-white/30">•</span>
                <button onClick={() => setIsConfigured(true)} className="text-white/50 hover:text-white/70">
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium tracking-tighter text-white mb-1">Meetings</h1>
            <p className="text-white/70 text-sm">Manage your meetings and video calls</p>
          </div>
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium flex items-center">
            <PlusIcon className="h-4 w-4 mr-2" />
            Schedule Meeting
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedFilter === filter.id
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {filter.name}
              {filter.count > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-white/10 rounded-full text-[10px]">{filter.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Meetings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {meeting.type === "video" ? (
                    <VideoCameraIcon className="h-4 w-4 text-white/50" />
                  ) : (
                    <MapPinIcon className="h-4 w-4 text-white/50" />
                  )}
                  <Badge className={`text-[10px] px-2 py-0.5 ${getPriorityColor(meeting.priority)}`}>
                    {meeting.priority}
                  </Badge>
                </div>
                <Badge className={`text-[10px] px-2 py-0.5 ${getStatusColor(meeting.status)}`}>{meeting.status}</Badge>
              </div>

              <h3 className="text-white font-medium text-sm mb-2">{meeting.title}</h3>

              <div className="space-y-1.5 text-xs text-white/70">
                <div className="flex items-center">
                  <ClockIcon className="h-3 w-3 mr-1.5" />
                  {meeting.time} • {meeting.duration}
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-3 w-3 mr-1.5" />
                  {meeting.attendees} attendees
                </div>
                {meeting.location && (
                  <div className="flex items-center">
                    <MapPinIcon className="h-3 w-3 mr-1.5" />
                    {meeting.location}
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/50">{meeting.type === "video" ? "Video Call" : "In Person"}</span>
                <button className="text-xs text-white/70 hover:text-white">View Details</button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {meetings.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-white/70 text-sm mb-2">No meetings scheduled</h3>
            <p className="text-white/50 text-xs">Schedule your first meeting to get started</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default function MeetingsPage() {
  return (
    <Suspense
      fallback={
        <Layout>
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-white/5 rounded-lg w-48"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </Layout>
      }
    >
      <MeetingsContent />
    </Suspense>
  )
}
