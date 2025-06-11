"use client"

import { Layout } from "@/components/ui/layout"
import { Car, MapPin, Clock, Users } from "lucide-react"

export default function TransfersPage() {
  const transfers = [
    {
      id: 1,
      type: "Airport Transfer",
      from: "JFK Airport",
      to: "Manhattan Hotel",
      date: "March 15, 2024",
      time: "14:30",
      vehicle: "Executive Sedan",
      passengers: 2,
      price: "$85",
      status: "confirmed",
    },
    {
      id: 2,
      type: "City Transfer",
      from: "Hotel Marriott",
      to: "Business Center",
      date: "March 16, 2024",
      time: "09:00",
      vehicle: "Business Van",
      passengers: 4,
      price: "$45",
      status: "pending",
    },
  ]

  return (
    <Layout>
      <div className="p-3">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white mb-2">Transfers</h1>
          <p className="text-white/70 text-sm">Book and manage your ground transportation</p>
        </div>

        <div className="grid gap-3">
          {transfers.map((transfer) => (
            <div key={transfer.id} className="bg-white/5 rounded-lg border border-white/10 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-medium">{transfer.type}</h3>
                  <div className="flex items-center mt-2 space-x-4 text-xs text-white/70">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {transfer.date} at {transfer.time}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {transfer.passengers} passengers
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{transfer.price}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      transfer.status === "confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {transfer.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-white/50 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{transfer.from}</p>
                    <p className="text-xs text-white/50">Pickup location</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-white/50 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{transfer.to}</p>
                    <p className="text-xs text-white/50">Drop-off location</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Car className="h-4 w-4 text-white/50" />
                  <span className="text-xs text-white/70">{transfer.vehicle}</span>
                </div>
                <button className="text-xs text-white/70 hover:text-white transition-colors">View details →</button>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center">
          <Car className="h-4 w-4 mr-2" />
          Book New Transfer
        </button>
      </div>
    </Layout>
  )
}
