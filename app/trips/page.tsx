"use client"
import Image from "next/image"
import Link from "next/link"
import { Home, Search, Briefcase, HelpCircle } from "lucide-react"

export default function TripsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f7]">
      {/* Header */}
      <header className="p-6">
        <h1 className="text-2xl font-bold text-black">Your trips</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-24">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="relative w-48 h-48 mb-6">
            <Image
              src="/placeholder.svg?height=192&width=192&query=empty state illustration for no trips"
              alt="No trips"
              width={192}
              height={192}
              className="object-contain"
            />
          </div>

          <h2 className="text-xl font-bold mb-2">No trips yet</h2>

          <p className="text-gray-600 mb-8">When you book a trip, it will appear here</p>

          <Link
            href="/flights"
            className="block w-full max-w-xs bg-black text-white py-4 rounded-lg text-center font-medium"
          >
            Book your first trip
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex flex-col items-center text-gray-500">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link href="/flights" className="flex flex-col items-center text-gray-500">
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Book</span>
          </Link>

          <Link href="/trips" className="flex flex-col items-center text-black">
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
