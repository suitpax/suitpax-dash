"use client"

import { useState } from "react"
import { travelPrompts } from "@/data/travel-prompts"

export default function PopularPrompts() {
  const [activeCategory, setActiveCategory] = useState<string>("businessTravelGeneral")

  const categories = {
    businessTravelGeneral: "Business Travel",
    flightBooking: "Flight Booking",
    hotelBooking: "Hotel Booking",
    expenseManagement: "Expense Management",
    transportationAndLogistics: "Transportation",
  }

  return (
    <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
      <h2 className="text-lg font-medium tracking-tighter text-black mb-4">Popular Questions</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
              activeCategory === key ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {travelPrompts[activeCategory as keyof typeof travelPrompts].slice(0, 5).map((prompt, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <p className="text-sm text-gray-800">{prompt}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
