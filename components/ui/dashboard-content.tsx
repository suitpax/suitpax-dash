import type React from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  MapPinIcon,
  CreditCardIcon,
  BellIcon,
} from "@heroicons/react/24/outline"
import AiAssistantCard from "./ai-assistant-card"
import TravelBookingWidget from "./travel-booking-widget"
import UpcomingTrips from "./upcoming-trips"
import TravelBudgets from "./travel-budgets"

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Travel Booking Widget */}
      <div className="bg-black/95 backdrop-blur-sm rounded-lg border border-white/10 p-3">
        <TravelBookingWidget />
      </div>

      {/* AI Assistant Card */}
      <AiAssistantCard />

      {/* Upcoming Trips */}
      <UpcomingTrips />

      {/* Travel Budgets */}
      <TravelBudgets />

      {/* Trip Alert */}
      <div className="bg-black/95 backdrop-blur-sm rounded-lg border border-white/10 p-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg">
            <BellIcon className="h-4 w-4 text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-white bg-white/5 px-2 py-0.5 rounded-full">Trip Alert</span>
            </div>

            <h3 className="text-sm font-medium text-white mb-1">Your business trip to Chicago starts today!</h3>

            <div className="flex flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                <CalendarIcon className="h-3 w-3 text-white/70" />
                <span className="text-xs text-white/70">April 23-26, 2025</span>
              </div>

              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                <BuildingOfficeIcon className="h-3 w-3 text-white/70" />
                <span className="text-xs text-white/70">Hilton Chicago</span>
              </div>

              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                <PaperAirplaneIcon className="h-3 w-3 text-white/70" />
                <span className="text-xs text-white/70">Flight UA2478 at 2:30 PM</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href="/flights"
                className="px-2 py-1 bg-white/10 text-white rounded-lg text-xs hover:bg-white/20 transition-colors"
              >
                View Itinerary
              </Link>
              <button className="px-2 py-1 bg-transparent text-white rounded-lg text-xs border border-white/10 hover:bg-white/5 transition-colors">
                Check In
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access Cards - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <QuickAccessCard
            title="Upcoming Trips"
            icon={<MapPinIcon className="h-4 w-4" />}
            items={[
              { label: "Chicago Business Meeting", date: "Today" },
              { label: "London Conference", date: "Jun 10" },
            ]}
            actionLabel="View All"
            actionLink="/flights"
          />

          <QuickAccessCard
            title="Recent Expenses"
            icon={<CreditCardIcon className="h-4 w-4" />}
            items={[
              { label: "Hotel Marriott", date: "$450.75" },
              { label: "Taxi from Airport", date: "$65.20" },
            ]}
            actionLabel="View All"
            actionLink="/expenses"
          />
        </div>

        {/* Getting Started Steps - Simplified */}
        <div className="bg-black/95 backdrop-blur-sm rounded-lg border border-white/10 p-3">
          <h2 className="text-sm font-medium text-white mb-3">Getting Started</h2>

          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 border border-white/10 bg-white/5 rounded-lg">
              <div className="flex-shrink-0 w-5 h-5 bg-white/10 text-white rounded-full flex items-center justify-center font-medium text-xs">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white text-xs mb-0.5">Complete your profile</h3>
                <p className="text-xs text-white/70 mb-1">Add company details and preferences</p>
                <Link
                  href="/onboarding"
                  className="text-xs font-medium text-white hover:underline flex items-center gap-1 w-fit px-2 py-0.5 bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Complete
                  <ArrowRightIcon className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 border border-white/10 bg-white/5 rounded-lg">
              <div className="flex-shrink-0 w-5 h-5 bg-white/10 text-white rounded-full flex items-center justify-center font-medium text-xs">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white text-xs mb-0.5">Set up travel policies</h3>
                <p className="text-xs text-white/70 mb-1">Define guidelines and workflows</p>
                <Link
                  href="/travel-policy"
                  className="text-xs font-medium text-white hover:underline flex items-center gap-1 w-fit px-2 py-0.5 bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Set up
                  <ArrowRightIcon className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    <div className="bg-black/95 backdrop-blur-sm rounded-lg border border-white/10 p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-white/5 rounded-lg">{icon}</div>
        <h3 className="text-xs font-medium text-white">{title}</h3>
      </div>

      <div className="space-y-1 mb-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-1.5 bg-white/5 rounded-lg">
            <span className="text-xs text-white">{item.label}</span>
            <span className="text-xs text-white/70">{item.date}</span>
          </div>
        ))}
      </div>

      <Link
        href={actionLink}
        className="text-xs font-medium flex items-center justify-center gap-1 w-full px-2 py-1.5 bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-white"
      >
        {actionLabel}
        <ArrowRightIcon className="h-3 w-3" />
      </Link>
    </div>
  )
}
