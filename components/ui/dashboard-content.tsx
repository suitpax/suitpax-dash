import type React from "react"
import Link from "next/link"
import AiAssistantCard from "./ai-assistant-card"
import {
  ArrowRightIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  MapPinIcon,
  CreditCardIcon,
  BellIcon,
} from "@heroicons/react/24/outline"
import { CalendarDays } from "lucide-react"
import TravelBookingWidget from "./travel-booking-widget"

export default function DashboardContent() {
  return (
    <div className="space-y-5">
      {/* Travel Booking Widget */}
      <TravelBookingWidget />

      {/* AI Assistant Card */}
      <AiAssistantCard />

      {/* Trip Alert */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 to-orange-500/50"></div>
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="flex items-center justify-center p-3 bg-white/5 rounded-xl">
            <BellIcon className="h-6 w-6 text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-white">Trip Alert</span>
              </div>
            </div>

            <h3 className="text-lg font-medium tracking-tighter text-white mb-1.5">
              Your business trip to Chicago starts today!
            </h3>

            <div className="flex flex-wrap gap-3 mb-3">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                <CalendarIcon className="h-4 w-4 text-white/70" />
                <span className="text-xs font-medium text-white/70">April 23-26, 2025</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                <BuildingOfficeIcon className="h-4 w-4 text-white/70" />
                <span className="text-xs font-medium text-white/70">Hilton Chicago</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                <PaperAirplaneIcon className="h-4 w-4 text-white/70" />
                <span className="text-xs font-medium text-white/70">Flight UA2478 at 2:30 PM</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/flights"
                className="px-3 py-1.5 bg-white/10 text-white rounded-xl text-xs font-medium hover:bg-white/20 transition-colors"
              >
                View Itinerary
              </Link>
              <button className="px-3 py-1.5 bg-transparent text-white rounded-xl text-xs font-medium border border-white/10 hover:bg-white/5 transition-colors">
                Check In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <QuickAccessCard
          title="Upcoming Trips"
          icon={<MapPinIcon className="h-5 w-5" />}
          items={[
            { label: "Chicago Business Meeting", date: "Today - Apr 26" },
            { label: "London Conference", date: "Jun 10-15" },
          ]}
          actionLabel="View All Trips"
          actionLink="/trips"
        />

        <QuickAccessCard
          title="Recent Expenses"
          icon={<CreditCardIcon className="h-5 w-5" />}
          items={[
            { label: "Hotel Marriott", date: "$450.75" },
            { label: "Taxi from Airport", date: "$65.20" },
          ]}
          actionLabel="View All Expenses"
          actionLink="/expenses"
        />

        <QuickAccessCard
          title="Upcoming Events"
          icon={<CalendarDays className="h-5 w-5" />}
          items={[
            { label: "AI Safety Summit", date: "Today, 3:00 PM" },
            { label: "Product Review", date: "Tomorrow, 10:00 AM" },
          ]}
          actionLabel="View Calendar"
          actionLink="/events"
        />
      </div>

      {/* Getting Started Steps */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-5 shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500/50 to-teal-500/50"></div>
        <h2 className="text-base font-medium tracking-tighter text-white mb-4">Getting Started</h2>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 border border-white/10 bg-white/5 rounded-xl">
            <div className="flex-shrink-0 w-6 h-6 bg-white/10 text-white rounded-full flex items-center justify-center font-medium text-xs">
              1
            </div>
            <div>
              <h3 className="font-medium text-white text-sm mb-1">Complete your company profile</h3>
              <p className="text-xs text-white/70 mb-1.5">Add your company details and travel preferences</p>
              <Link
                href="/onboarding"
                className="text-xs font-medium text-white hover:underline flex items-center gap-1 w-fit px-2.5 py-1 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              >
                Complete profile
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 border border-white/10 bg-white/5 rounded-xl">
            <div className="flex-shrink-0 w-6 h-6 bg-white/10 text-white rounded-full flex items-center justify-center font-medium text-xs">
              2
            </div>
            <div>
              <h3 className="font-medium text-white text-sm mb-1">Set up travel policies</h3>
              <p className="text-xs text-white/70 mb-1.5">
                Define your company's travel guidelines and approval workflows
              </p>
              <Link
                href="/travel-policy"
                className="text-xs font-medium text-white hover:underline flex items-center gap-1 w-fit px-2.5 py-1 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              >
                Set up policies
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 border border-white/10 bg-white/5 rounded-xl">
            <div className="flex-shrink-0 w-6 h-6 bg-white/10 text-white rounded-full flex items-center justify-center font-medium text-xs">
              3
            </div>
            <div>
              <h3 className="font-medium text-white text-sm mb-1">Connect your bank account</h3>
              <p className="text-xs text-white/70 mb-1.5">Link your business accounts for automatic expense tracking</p>
              <Link
                href="/smart-bank"
                className="text-xs font-medium text-white hover:underline flex items-center gap-1 w-fit px-2.5 py-1 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              >
                Connect bank
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface TravelOptionProps {
  href: string
  icon: React.ReactNode
  label: string
}

function TravelOption({ href, icon, label }: TravelOptionProps) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors min-w-[120px] flex-shrink-0"
    >
      <div className="text-white">{icon}</div>
      <span className="text-sm font-medium text-white">{label}</span>
    </Link>
  )
}

interface QuickAccessCardProps {
  title: string
  icon: React.ReactNode
  items: { label: string; date: string }[]
  actionLabel: string
  actionLink: string
}

function QuickAccessCard({ title, icon, items, actionLabel, actionLink }: QuickAccessCardProps) {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
        <h3 className="text-sm font-medium text-white">{title}</h3>
      </div>

      <div className="space-y-2 mb-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
            <span className="text-xs text-white">{item.label}</span>
            <span className="text-xs text-white/70">{item.date}</span>
          </div>
        ))}
      </div>

      <Link
        href={actionLink}
        className="text-xs font-medium flex items-center justify-center gap-1 w-full px-3 py-2 bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-white"
      >
        {actionLabel}
        <ArrowRightIcon className="h-3 w-3" />
      </Link>
    </div>
  )
}
