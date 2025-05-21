"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plane, Calendar, ChevronDown, Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function FlightsPage() {
  const [directFlightsOnly, setDirectFlightsOnly] = useState(false)
  const [userName, setUserName] = useState("Alex")

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f7]">
      {/* Header */}
      <header className="p-6 flex items-center">
        <Link href="/" className="mr-4">
          <ArrowLeft className="h-6 w-6 text-black" />
        </Link>
        <h1 className="text-xl font-bold text-center flex-1">Search flights</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-24">
        {/* From */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 flex items-center">
          <Plane className="h-5 w-5 text-gray-500 mr-3 rotate-45" />
          <input
            type="text"
            placeholder="Country, city, or airport"
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>

        {/* To */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 flex items-center">
          <Plane className="h-5 w-5 text-gray-500 mr-3 -rotate-45" />
          <input
            type="text"
            placeholder="Country, city, or airport"
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Depart */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center">
            <Calendar className="h-5 w-5 text-gray-500 mr-3" />
            <span className="text-gray-700">Depart</span>
          </div>

          {/* Return */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center">
            <Plus className="h-5 w-5 text-gray-500 mr-3" />
            <span className="text-gray-700">Return</span>
          </div>
        </div>

        {/* Class */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-gray-700">Economy</span>
          </div>
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </div>

        {/* Traveler */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#c1ff72] flex items-center justify-center text-black font-medium mr-3">
            {userName.substring(0, 1).toUpperCase()}
          </div>
          <span className="text-gray-700">{userName}</span>
        </div>

        {/* Add traveler */}
        <button className="w-full text-center text-black font-medium mb-6">Add traveler</button>

        {/* Direct flights only */}
        <div className="flex items-center justify-between mb-12">
          <span className="text-black font-medium">Direct flights only</span>
          <Switch checked={directFlightsOnly} onCheckedChange={setDirectFlightsOnly} />
        </div>

        {/* Search button */}
        <button className="w-full bg-[#f2f2f0] text-black py-4 rounded-lg text-center font-medium">
          Search flights
        </button>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex flex-col items-center text-gray-500">
            <div className="h-6 w-6 bg-gray-300 rounded-sm"></div>
          </Link>

          <Link href="/" className="flex flex-col items-center text-gray-500">
            <div className="h-6 w-6 bg-gray-400 rounded-full"></div>
          </Link>

          <Link href="/" className="flex flex-col items-center text-gray-500">
            <div className="h-6 w-6 border-l-2 border-gray-400"></div>
          </Link>
        </div>
      </nav>
    </div>
  )
}
