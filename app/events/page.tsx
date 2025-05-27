"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Layout from "@/components/ui/layout"
import { Calendar, MapPin, Users, Plus, Filter, Search, ChevronDown } from "lucide-react"

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "draft">("upcoming")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const events = [
    {
      id: "event-1",
      title: "Annual Sales Conference 2025",
      description:
        "Join us for our annual sales conference with keynote speakers, workshops, and networking opportunities.",
      startDate: "May 15, 2025",
      endDate: "May 17, 2025",
      location: "Barcelona, Spain",
      venue: "Hotel Arts Barcelona",
      attendees: 120,
      status: "upcoming",
      isPublic: true,
      image: "/conference-networking.png",
    },
    {
      id: "event-2",
      title: "Product Launch: Next Gen Platform",
      description: "Exclusive event for the launch of our next generation platform with demos and Q&A sessions.",
      startDate: "June 10, 2025",
      endDate: "June 10, 2025",
      location: "London, UK",
      venue: "The Shard",
      attendees: 75,
      status: "upcoming",
      isPublic: false,
      image: "/product-launch-event.png",
    },
    {
      id: "event-3",
      title: "Team Building Retreat",
      description: "A three-day retreat focused on team building activities, strategy sessions, and relaxation.",
      startDate: "July 5, 2025",
      endDate: "July 8, 2025",
      location: "Mallorca, Spain",
      venue: "Cap Rocat Resort",
      attendees: 45,
      status: "upcoming",
      isPublic: false,
      image: "/placeholder.svg?height=200&width=400&query=team building retreat at beach resort",
    },
    {
      id: "event-4",
      title: "Customer Appreciation Dinner",
      description: "An evening to thank our top customers with fine dining and entertainment.",
      startDate: "April 20, 2025",
      endDate: "April 20, 2025",
      location: "Paris, France",
      venue: "Le Jules Verne",
      attendees: 30,
      status: "past",
      isPublic: false,
      image: "/placeholder.svg?height=200&width=400&query=elegant dinner event with city views",
    },
    {
      id: "event-5",
      title: "Tech Summit 2025",
      description:
        "Annual technology summit featuring industry leaders, innovative demos, and networking opportunities.",
      startDate: "August 12, 2025",
      endDate: "August 14, 2025",
      location: "Berlin, Germany",
      venue: "Berlin Congress Center",
      attendees: 0,
      status: "draft",
      isPublic: true,
      image: "/placeholder.svg?height=200&width=400&query=tech conference with modern stage setup",
    },
  ]

  const filteredEvents = events.filter((event) => {
    if (activeTab === "upcoming") return event.status === "upcoming"
    if (activeTab === "past") return event.status === "past"
    if (activeTab === "draft") return event.status === "draft"
    return true
  })

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header específico de Events */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Events</h1>
              <p className="text-sm text-white/70 mt-1">Manage your company's events and conferences</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "upcoming" ? "text-white border-b-2 border-white" : "text-white/50 hover:text-white/70"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "past" ? "text-white border-b-2 border-white" : "text-white/50 hover:text-white/70"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past Events
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "draft" ? "text-white border-b-2 border-white" : "text-white/50 hover:text-white/70"
            }`}
            onClick={() => setActiveTab("draft")}
          >
            Draft Events
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white flex items-center">
              <ChevronDown className="h-4 w-4 mr-2" />
              Sort
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id} className="block">
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all">
                <div className="relative h-48 w-full">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  {event.isPublic && (
                    <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                      Public
                    </div>
                  )}
                  {!event.isPublic && (
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                      Private
                    </div>
                  )}
                  {event.status === "draft" && (
                    <div className="absolute top-3 left-3 bg-amber-500/20 text-amber-500 px-2 py-1 rounded text-xs">
                      Draft
                    </div>
                  )}
                  {event.status === "past" && (
                    <div className="absolute top-3 left-3 bg-white/10 text-white/70 px-2 py-1 rounded text-xs">
                      Past
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-white mb-2">{event.title}</h3>
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-white/50 text-xs">
                      <Calendar className="h-3 w-3 mr-2" />
                      {event.startDate === event.endDate ? event.startDate : `${event.startDate} - ${event.endDate}`}
                    </div>
                    <div className="flex items-center text-white/50 text-xs">
                      <MapPin className="h-3 w-3 mr-2" />
                      {event.venue}, {event.location}
                    </div>
                    {event.status !== "draft" && (
                      <div className="flex items-center text-white/50 text-xs">
                        <Users className="h-3 w-3 mr-2" />
                        {event.attendees} attendees
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Create Event Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black/90 border border-white/10 rounded-lg w-full max-w-2xl">
              <div className="p-6 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Create New Event</h2>
                  <button onClick={() => setShowCreateModal(false)} className="text-white/50 hover:text-white">
                    &times;
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Event Title</label>
                  <input
                    type="text"
                    placeholder="Enter event title"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Description</label>
                  <textarea
                    placeholder="Enter event description"
                    rows={3}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">End Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Venue</label>
                  <input
                    type="text"
                    placeholder="Venue name"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="isPublic" className="mr-2" />
                  <label htmlFor="isPublic" className="text-sm text-white">
                    Make this event public
                  </label>
                </div>
              </div>
              <div className="p-6 border-t border-white/10 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-transparent hover:bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white"
                >
                  Create Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
