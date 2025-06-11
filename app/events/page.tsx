"use client"

import { Layout } from "@/components/ui/layout"
import { CalendarDays, MapPin, Users, Ticket } from "lucide-react"

export default function EventsPage() {
  const events = [
    {
      id: 1,
      name: "Tech Summit 2024",
      date: "March 20-22, 2024",
      location: "San Francisco, CA",
      type: "Conference",
      attendees: 2500,
      status: "registered",
      ticketType: "VIP Pass",
    },
    {
      id: 2,
      name: "Business Networking Dinner",
      date: "March 25, 2024",
      location: "New York, NY",
      type: "Networking",
      attendees: 150,
      status: "pending",
      ticketType: "Standard",
    },
  ]

  return (
    <Layout>
      <div className="p-3">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white mb-2">Events</h1>
          <p className="text-white/70 text-sm">Discover and register for business events</p>
        </div>

        <div className="grid gap-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white/5 rounded-lg border border-white/10 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-medium text-lg">{event.name}</h3>
                  <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded-full">{event.type}</span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    event.status === "registered"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {event.status}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center text-sm text-white/70">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {event.date}
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <Users className="h-4 w-4 mr-2" />
                  {event.attendees} expected attendees
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <Ticket className="h-4 w-4 mr-2" />
                  {event.ticketType}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-1.5 bg-white/10 text-white text-xs rounded-lg hover:bg-white/20 transition-colors">
                  View Details
                </button>
                {event.status === "pending" && (
                  <button className="flex-1 py-1.5 bg-white/10 text-white text-xs rounded-lg hover:bg-white/20 transition-colors">
                    Complete Registration
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center">
          <CalendarDays className="h-4 w-4 mr-2" />
          Browse More Events
        </button>
      </div>
    </Layout>
  )
}
