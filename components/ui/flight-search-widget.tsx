"use client"

import type React from "react"
import { useState } from "react"
import { Plane, Calendar, Users, ArrowRightLeft, Search } from "lucide-react"

export default function FlightSearchWidget() {
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    departure: "",
    return: "",
    passengers: "1",
    tripType: "roundtrip",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSearchData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle flight search logic here
    console.log("Searching flights:", searchData)
  }

  const swapCities = () => {
    setSearchData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }))
  }

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/5 rounded-xl">
          <Plane className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-medium tracking-tighter text-white">Flight Search</h2>
          <p className="text-xs text-white/70">Find the best corporate travel deals</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        {/* Trip Type */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSearchData((prev) => ({ ...prev, tripType: "roundtrip" }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              searchData.tripType === "roundtrip"
                ? "bg-white/10 text-white"
                : "bg-transparent border border-white/10 text-white/70 hover:bg-white/5"
            }`}
          >
            Round Trip
          </button>
          <button
            type="button"
            onClick={() => setSearchData((prev) => ({ ...prev, tripType: "oneway" }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              searchData.tripType === "oneway"
                ? "bg-white/10 text-white"
                : "bg-transparent border border-white/10 text-white/70 hover:bg-white/5"
            }`}
          >
            One Way
          </button>
        </div>

        {/* From/To Cities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <label className="block text-xs font-medium text-white/70 mb-1">From</label>
            <input
              type="text"
              name="from"
              value={searchData.from}
              onChange={handleInputChange}
              placeholder="Madrid (MAD)"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/50 text-sm"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-white/70 mb-1">To</label>
            <div className="relative">
              <input
                type="text"
                name="to"
                value={searchData.to}
                onChange={handleInputChange}
                placeholder="London (LHR)"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/50 text-sm"
              />
              <button
                type="button"
                onClick={swapCities}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dates and Passengers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Departure</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                type="date"
                name="departure"
                value={searchData.departure}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white text-sm"
              />
            </div>
          </div>

          {searchData.tripType === "roundtrip" && (
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Return</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <input
                  type="date"
                  name="return"
                  value={searchData.return}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <select
                name="passengers"
                value={searchData.passengers}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white text-sm appearance-none"
              >
                <option value="1">1 Passenger</option>
                <option value="2">2 Passengers</option>
                <option value="3">3 Passengers</option>
                <option value="4">4+ Passengers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium text-sm"
        >
          <Search className="h-4 w-4" />
          Search Flights
        </button>
      </form>

      {/* Quick Options */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-white/70 mb-2">Popular Routes</p>
        <div className="flex flex-wrap gap-2">
          {["MAD → LHR", "BCN → CDG", "MAD → JFK", "BCN → FCO"].map((route) => (
            <button
              key={route}
              type="button"
              className="px-2 py-1 text-xs bg-white/5 text-white/70 rounded-md hover:bg-white/10 hover:text-white transition-colors"
              onClick={() => {
                const [from, to] = route.split(" → ")
                setSearchData((prev) => ({ ...prev, from, to }))
              }}
            >
              {route}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
