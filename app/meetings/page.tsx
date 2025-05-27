"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon, PlusIcon, VideoCameraIcon } from "@heroicons/react/24/outline"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import Image from "next/image"

export default function MeetingsPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"day" | "week" | "month">("week")

  // Sample meetings data
  const meetings = [
    {
      id: "meeting-1",
      title: "Team Sync",
      description: "Weekly team sync meeting to discuss progress and blockers",
      date: "2025-05-15",
      startTime: "09:00",
      endTime: "10:00",
      location: "Conference Room A",
      isVirtual: true,
      meetingLink: "https://meet.google.com/abc-defg-hij",
      attendees: [
        { name: "Carlos Rodríguez", avatar: "/images/user-avatar.jpg" },
        { name: "Genevieve McLean", avatar: "/images/team/genevieve-mclean.jpeg" },
        { name: "Orlando Diggs", avatar: "/images/team/orlando-diggs.jpeg" },
        { name: "Isla Allison", avatar: "/images/team/isla-allison.jpeg" },
      ],
    },
    {
      id: "meeting-2",
      title: "Client Presentation",
      description: "Presentation of the new travel management platform to Acme Corp",
      date: "2025-05-15",
      startTime: "11:30",
      endTime: "12:30",
      location: "Acme Corp HQ, New York",
      isVirtual: false,
      attendees: [
        { name: "Carlos Rodríguez", avatar: "/images/user-avatar.jpg" },
        { name: "Lyle Kauffman", avatar: "/images/team/lyle-kauffman.jpeg" },
        { name: "Cohen Lozano", avatar: "/images/team/cohen-lozano.jpeg" },
      ],
    },
    {
      id: "meeting-3",
      title: "Travel Policy Review",
      description: "Quarterly review of company travel policies and compliance",
      date: "2025-05-16",
      startTime: "14:00",
      endTime: "15:30",
      location: "Conference Room B",
      isVirtual: true,
      meetingLink: "https://zoom.us/j/123456789",
      attendees: [
        { name: "Carlos Rodríguez", avatar: "/images/user-avatar.jpg" },
        { name: "Ammar Foley", avatar: "/images/team/ammar-foley.jpeg" },
        { name: "Isobel Fuller", avatar: "/images/team/isobel-fuller.jpeg" },
        { name: "Scott Clayton", avatar: "/images/team/scott-clayton.jpeg" },
      ],
    },
  ]

  // Helper function to format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  }

  // Navigate to previous/next day/week/month
  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (view === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (view === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header específico de Meetings */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Meetings</h1>
              <p className="text-sm text-white/70 mt-1">Schedule and manage your business meetings</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors whitespace-nowrap">
              <PlusIcon className="h-4 w-4 mr-2" />
              Schedule Meeting
            </button>
          </div>
        </div>

        {/* Calendar navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={navigatePrevious}
              className="p-1.5 rounded-lg hover:bg-white/5 text-white/70 transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-medium text-white">{formatDate(currentDate)}</h2>
            <button
              onClick={navigateNext}
              className="p-1.5 rounded-lg hover:bg-white/5 text-white/70 transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setView("day")}
              className={`px-3 py-1 text-sm rounded-lg ${
                view === "day" ? "bg-white/10 text-white" : "text-white/70 hover:text-white"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-3 py-1 text-sm rounded-lg ${
                view === "week" ? "bg-white/10 text-white" : "text-white/70 hover:text-white"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView("month")}
              className={`px-3 py-1 text-sm rounded-lg ${
                view === "month" ? "bg-white/10 text-white" : "text-white/70 hover:text-white"
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Meetings list */}
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all"
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">{meeting.title}</h3>
                    <p className="text-white/70 text-sm">{meeting.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg">
                      Join Meeting
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/70 transition-colors">
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-white/50" />
                    <span className="text-white/70 text-sm">{meeting.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-white/50" />
                    <span className="text-white/70 text-sm">
                      {meeting.startTime} - {meeting.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {meeting.isVirtual ? (
                      <VideoCameraIcon className="h-4 w-4 text-white/50" />
                    ) : (
                      <MapPinIcon className="h-4 w-4 text-white/50" />
                    )}
                    <span className="text-white/70 text-sm">{meeting.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-white/50" />
                    <span className="text-white/70 text-sm">{meeting.attendees.length} attendees</span>
                  </div>
                  <div className="flex -space-x-2">
                    {meeting.attendees.slice(0, 4).map((attendee, index) => (
                      <div key={index} className="relative h-8 w-8 rounded-full overflow-hidden border border-white/10">
                        <Image
                          src={attendee.avatar || "/placeholder.svg"}
                          alt={attendee.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {meeting.attendees.length > 4 && (
                      <div className="relative h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white border border-white/10">
                        +{meeting.attendees.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
