"use client"
import Link from "next/link"
import { Home, Search, Briefcase, HelpCircle, MessageCircle, Phone, FileText } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f7]">
      {/* Header */}
      <header className="p-6">
        <h1 className="text-2xl font-bold text-black">Help & Support</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-24">
        <div className="space-y-4">
          <Link href="/help/chat" className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-[#f2f2f0] flex items-center justify-center mr-4">
              <MessageCircle className="h-5 w-5 text-black" />
            </div>
            <div>
              <h2 className="font-medium text-black">Chat with support</h2>
              <p className="text-sm text-gray-500">Get help from our support team</p>
            </div>
          </Link>

          <Link href="/help/call" className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-[#f2f2f0] flex items-center justify-center mr-4">
              <Phone className="h-5 w-5 text-black" />
            </div>
            <div>
              <h2 className="font-medium text-black">Call support</h2>
              <p className="text-sm text-gray-500">Speak directly with an agent</p>
            </div>
          </Link>

          <Link href="/help/faq" className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-[#f2f2f0] flex items-center justify-center mr-4">
              <FileText className="h-5 w-5 text-black" />
            </div>
            <div>
              <h2 className="font-medium text-black">FAQs</h2>
              <p className="text-sm text-gray-500">Browse common questions</p>
            </div>
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

          <Link href="/trips" className="flex flex-col items-center text-gray-500">
            <Briefcase className="h-6 w-6" />
            <span className="text-xs mt-1">Trips</span>
          </Link>

          <Link href="/help" className="flex flex-col items-center text-black">
            <HelpCircle className="h-6 w-6" />
            <span className="text-xs mt-1">Help</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
