"use client"

import { useState } from "react"
import Link from "next/link"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { SiAnthropic } from "react-icons/si"
import { PlaneIcon as Airplane, Train, Car, Building, Mic, CalendarDays } from "lucide-react"

export default function TravelBookingWidget() {
  const [activeTab, setActiveTab] = useState("flights")

  const tabs = [
    { id: "flights", label: "Flights", icon: <Airplane className="h-4 w-4" />, href: "/flights" },
    { id: "hotels", label: "Hotels", icon: <Building className="h-4 w-4" />, href: "/hotels" },
    { id: "trains", label: "Trains", icon: <Train className="h-4 w-4" />, href: "/trains" },
    { id: "transfers", label: "Transfers", icon: <Car className="h-4 w-4" />, href: "/transfers" },
    { id: "events", label: "Events", icon: <CalendarDays className="h-4 w-4" />, href: "/events" },
  ]

  const placeholders = {
    flights: "Search for flights (e.g., 'Madrid to London next week')",
    hotels: "Search for hotels (e.g., 'Hotel in Paris for 3 nights')",
    trains: "Search for trains (e.g., 'Train from Madrid to Barcelona')",
    transfers: "Search for transfers (e.g., 'Airport transfer in Tokyo')",
    events: "Search for events (e.g., 'Tech conference in San Francisco')",
  }

  const examples = {
    flights: [
      "Flight to London next week",
      "Business class to New York",
      "Madrid to Paris tomorrow",
      "Return flight to Tokyo in June",
    ],
    hotels: [
      "Hotel in Paris for 3 nights",
      "5-star hotel in Barcelona",
      "Business hotel in Tokyo",
      "Hotel near Times Square",
    ],
    trains: [
      "Train from Madrid to Barcelona",
      "High-speed train to Paris",
      "First class train to Milan",
      "Night train to Vienna",
    ],
    transfers: [
      "Airport transfer in Tokyo",
      "Car service in London",
      "Private driver in Rome",
      "Airport to hotel in Dubai",
    ],
    events: [
      "Tech conference in San Francisco",
      "Business summit in Berlin",
      "Industry expo in Singapore",
      "Networking event in London",
    ],
  }

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50"></div>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-xl">
            <SiAnthropic className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-medium tracking-tighter text-white">Book Your Business Trip</h2>
            <p className="text-xs text-white/70">Let Suitpax AI help you find the best options</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
          <div className="flex bg-white/5 rounded-full p-1 gap-1 w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-medium transition-colors flex-1 ${
                  activeTab === tab.id ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <MagnifyingGlassIcon className="h-5 w-5 text-white/50" />
          </div>
          <input
            type="text"
            placeholder={placeholders[activeTab as keyof typeof placeholders]}
            className="w-full pl-10 pr-12 py-3 text-sm bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 transition-colors">
              <Mic className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Search Examples */}
        <div className="flex flex-wrap gap-2">
          {examples[activeTab as keyof typeof examples].map((example, index) => (
            <div
              key={index}
              className="text-xs bg-white/5 px-3 py-1.5 rounded-full text-white/70 hover:bg-white/10 cursor-pointer transition-colors"
            >
              {example}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Link
          href={tabs.find((tab) => tab.id === activeTab)?.href || "/flights"}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm font-medium transition-colors w-full"
        >
          <span>Search {activeTab}</span>
          <span>{tabs.find((tab) => tab.id === activeTab)?.icon}</span>
        </Link>
      </div>
    </div>
  )
}
