"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { Calendar, MapPin, Plane, Building, Car, Search, Download } from "lucide-react"

export default function TravelHistoryPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const travelHistory = [
    {
      id: 1,
      type: "flight",
      destination: "New York, NY",
      dates: "Mar 15-18, 2024",
      status: "completed",
      cost: "$1,245",
      bookingRef: "SX-FL-001",
      details: "Business trip - Client meeting",
    },
    {
      id: 2,
      type: "hotel",
      destination: "London, UK",
      dates: "Feb 20-25, 2024",
      status: "completed",
      cost: "$890",
      bookingRef: "SX-HT-002",
      details: "Conference attendance",
    },
    {
      id: 3,
      type: "car",
      destination: "San Francisco, CA",
      dates: "Jan 10-12, 2024",
      status: "completed",
      cost: "$156",
      bookingRef: "SX-CR-003",
      details: "Team meeting",
    },
    {
      id: 4,
      type: "flight",
      destination: "Tokyo, Japan",
      dates: "Jun 5-10, 2024",
      status: "upcoming",
      cost: "$2,100",
      bookingRef: "SX-FL-004",
      details: "Product launch event",
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "flight":
        return Plane
      case "hotel":
        return Building
      case "car":
        return Car
      default:
        return MapPin
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredHistory = filter === "all" ? travelHistory : travelHistory.filter((item) => item.type === filter)

  const searchedHistory = searchQuery
    ? filteredHistory.filter(
        (item) =>
          item.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.details.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : filteredHistory

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-md font-medium text-black">Travel History</h1>
          <button className="px-3 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-black p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search destinations or trip details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  filter === "all" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("flight")}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  filter === "flight" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Flights
              </button>
              <button
                onClick={() => setFilter("hotel")}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  filter === "hotel" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Hotels
              </button>
              <button
                onClick={() => setFilter("car")}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  filter === "car" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cars
              </button>
            </div>
          </div>
        </div>

        {/* Travel History List */}
        <div className="space-y-4">
          {searchedHistory.length > 0 ? (
            searchedHistory.map((trip) => {
              const IconComponent = getIcon(trip.type)
              return (
                <div
                  key={trip.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:border-black transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-black">{trip.destination}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(trip.status)}`}>
                            {trip.status}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          {trip.dates}
                        </div>
                        <p className="text-sm text-gray-600">{trip.details}</p>
                        <p className="text-xs text-gray-500 mt-1">Ref: {trip.bookingRef}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium text-black">{trip.cost}</p>
                      <button className="text-sm text-gray-600 hover:text-black transition-colors mt-2">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="bg-white rounded-xl border border-black p-8 text-center">
              <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-medium text-black mb-2">No travel history found</h2>
              <p className="text-gray-600">
                {searchQuery
                  ? "Try adjusting your search terms or filters."
                  : "Your travel history will appear here once you start booking trips."}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-xl border border-black p-6 shadow-sm mt-6">
          <h2 className="text-lg font-medium text-black mb-4">Travel Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-medium text-black">24</p>
              <p className="text-sm text-gray-600">Total Trips</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-medium text-black">$12,450</p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-medium text-black">8</p>
              <p className="text-sm text-gray-600">Countries Visited</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-medium text-black">$2,100</p>
              <p className="text-sm text-gray-600">Avg Trip Cost</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
