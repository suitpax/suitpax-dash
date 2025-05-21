"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Home, Search, Briefcase, HelpCircle } from "lucide-react"

export default function HomePage() {
  const [userName, setUserName] = useState("Alex")

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f7]">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Hi {userName}</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src="/generic-luggage-logo.png"
              alt="Suitpax Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="w-10 h-10 rounded-full bg-[#c1ff72] flex items-center justify-center text-black font-medium">
            {userName.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-24">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48">
              <Image
                src="/travel-app-illustration.png"
                alt="Travel Illustration"
                width={192}
                height={192}
                className="object-contain"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-3">It all starts here</h2>

          <p className="text-gray-600 text-center mb-6">
            Easily access what you need — from tickets to directions — all on your personalized homepage
          </p>

          <Link href="/flights" className="block w-full bg-black text-white py-4 rounded-lg text-center font-medium">
            Book a trip
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex flex-col items-center text-black">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link href="/flights" className="flex flex-col items-center text-gray-500">
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Book</span>
          </Link>

          <Link href="/trips" className="flex flex-col items-center text-gray-500">
            <Briefcase className="h-6 w-6" />
            <span className="text-xs mt-1">Trips</span>
          </Link>

          <Link href="/help" className="flex flex-col items-center text-gray-500">
            <HelpCircle className="h-6 w-6" />
            <span className="text-xs mt-1">Help</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
