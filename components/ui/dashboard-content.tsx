import type React from "react"
import Link from "next/link"
import Image from "next/image"
import AiAssistantCard from "./ai-assistant-card"
import {
  ArrowRightIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  WalletIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  BellIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline"
import { SiAnthropic } from "react-icons/si"

export default function DashboardContent() {
  const userName = "Alex" // Normally this would come from a user context or state

  // Sample data for examples
  const upcomingTrips = [
    {
      id: "trip1",
      destination: "New York",
      dates: "May 15-18, 2025",
      purpose: "Client Meeting",
      status: "Confirmed",
    },
    {
      id: "trip2",
      destination: "London",
      dates: "June 10-15, 2025",
      purpose: "Conference",
      status: "Pending Approval",
    },
  ]

  const recentExpenses = [
    {
      id: "exp1",
      title: "Hotel Marriott",
      amount: 450.75,
      date: "Apr 28, 2025",
      category: "Accommodation",
    },
    {
      id: "exp2",
      title: "Taxi from Airport",
      amount: 65.2,
      date: "Apr 27, 2025",
      category: "Transportation",
    },
    {
      id: "exp3",
      title: "Business Dinner",
      amount: 120.5,
      date: "Apr 26, 2025",
      category: "Meals",
    },
  ]

  const teamActivity = [
    {
      id: "activity1",
      user: {
        name: "Alex Johnson",
      },
      action: "booked a flight to San Francisco",
      time: "2 hours ago",
      company: "Anthropic",
      teamName: "Research",
    },
    {
      id: "activity2",
      user: {
        name: "Sarah Miller",
      },
      action: "submitted an expense report for $1,250.75",
      time: "Yesterday",
      company: "Anthropic",
      teamName: "Engineering",
    },
    {
      id: "activity3",
      user: {
        name: "Michael Chen",
      },
      action: "updated the travel policy for international trips",
      time: "2 days ago",
      company: "Anthropic",
      teamName: "Legal",
    },
    {
      id: "activity4",
      user: {
        name: "Zoe Williams",
      },
      action: "booked a hotel in Tokyo for the AI Summit",
      time: "3 days ago",
      company: "Anthropic",
      teamName: "Product",
    },
    {
      id: "activity5",
      user: {
        name: "Emma Clarke",
      },
      action: "requested approval for a business trip to Berlin",
      time: "4 days ago",
      company: "Anthropic",
      teamName: "Marketing",
    },
  ]

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

        <div className="space-y-5">
          {/* Enhanced Chicago trip notification banner */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/10"></div>

            <div className="flex flex-col md:flex-row items-center gap-5">
              <div className="flex items-center justify-center p-3 bg-white/5 rounded-xl">
                <SiAnthropic className="h-10 w-10 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                    <BellIcon className="h-4 w-4 text-white" />
                    <span className="text-sm font-medium text-white">Trip Alert</span>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
                    <span className="text-xs font-medium text-white/70">Anthropic</span>
                    <span className="text-xs text-white/50">•</span>
                    <span className="text-xs text-white/70">AI Engineer</span>
                  </div>
                </div>

                <h1 className="text-xl md:text-2xl font-medium tracking-tighter text-white mb-1.5">
                  Your business trip to Chicago starts today!
                </h1>

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

          {/* AI Assistant Card */}
          <AiAssistantCard />

          {/* Anthropic User Dashboard Example */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/5 rounded-xl">
                <SiAnthropic className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-medium tracking-tighter text-white">Anthropic Dashboard</h2>
                <p className="text-xs text-white/70">Welcome back, Claude</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white">Active Projects</h3>
                  <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-white/70">12</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Claude 3 Opus</span>
                    <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Claude 3 Sonnet</span>
                    <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Claude 3 Haiku</span>
                    <span className="text-xs bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded-full">In Review</span>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white">Upcoming Meetings</h3>
                  <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-white/70">3</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">AI Safety Summit</span>
                    <span className="text-xs text-white/50">Today, 3:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Product Review</span>
                    <span className="text-xs text-white/50">Tomorrow, 10:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Team Sync</span>
                    <span className="text-xs text-white/50">Friday, 2:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white">Travel Budget</h3>
                  <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-white/70">$15,000</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Used</span>
                    <span className="text-xs text-white/70">$8,750 (58%)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div className="bg-white h-1.5 rounded-full" style={{ width: "58%" }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Remaining</span>
                    <span className="text-xs text-white/70">$6,250</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="#"
                className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-white"
              >
                View Full Dashboard
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Example cards with data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <DashboardCard
              icon={<PaperAirplaneIcon className="h-4 w-4 text-white" />}
              title="Flight Bookings"
              description="3 upcoming flights"
              stats="$2,450 spent this month"
              actionLink="/flights"
              actionText="Book Flight"
            />
            <DashboardCard
              icon={<BuildingOfficeIcon className="h-4 w-4 text-white" />}
              title="Hotel Stays"
              description="5 nights booked"
              stats="$1,200 spent this month"
              actionLink="/hotels"
              actionText="Book Hotel"
            />
            <DashboardCard
              icon={<WalletIcon className="h-4 w-4 text-white" />}
              title="Travel Budget"
              description="$5,000 monthly limit"
              stats="$3,650 spent (73%)"
              actionLink="#"
              actionText="Manage Budget"
            />
            <DashboardCard
              icon={<ClockIcon className="h-4 w-4 text-white" />}
              title="Time Saved"
              description="12 hours this month"
              stats="45% more efficient"
              actionLink="#"
              actionText="View Analytics"
            />
          </div>

          {/* Upcoming trips section with examples */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-medium tracking-tighter text-white">Upcoming Trips</h2>
              <Link
                href="/flights"
                className="text-xs font-medium text-white hover:underline flex items-center gap-1 px-3 py-1.5 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              >
                Book a trip
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>

            {upcomingTrips.length > 0 ? (
              <div className="space-y-3">
                {upcomingTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="border border-white/10 bg-white/5 rounded-xl p-3 hover:border-white/20 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4 text-white/50" />
                          <h3 className="font-medium text-white">{trip.destination}</h3>
                        </div>
                        <div className="mt-1 ml-6 space-y-1">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-3.5 w-3.5 text-white/50" />
                            <span className="text-xs text-white/70">{trip.dates}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BriefcaseIcon className="h-3.5 w-3.5 text-white/50" />
                            <span className="text-xs text-white/70">{trip.purpose}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            trip.status === "Confirmed"
                              ? "bg-emerald-900/30 text-emerald-400"
                              : "bg-amber-900/30 text-amber-400"
                          }`}
                        >
                          {trip.status}
                        </span>
                        <button className="mt-2 text-xs text-white/70 hover:text-white transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-white/5 p-3 rounded-full mb-3">
                  <CalendarIcon className="h-6 w-6 text-white/50" />
                </div>
                <h3 className="text-base font-medium text-white mb-1.5">No upcoming trips</h3>
                <p className="text-sm text-white/70 max-w-md mb-4">
                  You don't have any upcoming business trips scheduled. Start planning your next journey.
                </p>
                <Link
                  href="/flights"
                  className="px-3 py-1.5 bg-white/10 text-white rounded-xl text-xs font-medium hover:bg-white/20 transition-colors"
                >
                  Book Your First Trip
                </Link>
              </div>
            )}
          </div>

          {/* Enhanced Team Activity section with Simple Icons */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-medium tracking-tighter text-white">Team Activity</h2>
                <span className="bg-white/10 text-xs font-medium px-2 py-0.5 rounded-full text-white/70">5 new</span>
              </div>
              <button className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-white">
                View All
                <ArrowRightIcon className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-4">
              {teamActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="border border-white/10 bg-white/5 rounded-xl p-4 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/5 rounded-xl">
                      <CompanyIcon company={activity.company} />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-medium text-white">{activity.user.name}</span>
                        <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
                          <span className="text-xs font-medium text-white/70">{activity.company}</span>
                          <span className="text-xs text-white/50">•</span>
                          <span className="text-xs text-white/70">{activity.teamName}</span>
                        </div>
                      </div>

                      <p className="text-sm text-white/70 mb-1.5">{activity.action}</p>

                      <div className="flex items-center gap-1.5">
                        <ClockIcon className="h-3 w-3 text-white/50" />
                        <span className="text-xs text-white/50">{activity.time}</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <button className="text-xs text-white/70 hover:text-white transition-colors">Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent expenses section with examples */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-medium tracking-tighter text-white">Recent Expenses</h2>
              <Link
                href="/expenses"
                className="text-xs font-medium text-white hover:underline flex items-center gap-1 px-3 py-1.5 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              >
                View All
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>

            {recentExpenses.length > 0 ? (
              <div className="space-y-3">
                {recentExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="border border-white/10 bg-white/5 rounded-xl p-3 hover:border-white/20 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg">
                          <CreditCardIcon className="h-4 w-4 text-white/70" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{expense.title}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <ClockIcon className="h-3 w-3 text-white/50" />
                            <span className="text-xs text-white/70">{expense.date}</span>
                            <span className="text-xs bg-white/5 px-1.5 py-0.5 rounded-full text-white/70">
                              {expense.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-white">${expense.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center mt-2">
                  <Link
                    href="/expenses"
                    className="text-xs font-medium text-white/70 hover:text-white transition-colors"
                  >
                    View all expenses
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-white/5 p-3 rounded-full mb-3">
                  <WalletIcon className="h-6 w-6 text-white/50" />
                </div>
                <h3 className="text-base font-medium text-white mb-1.5">No expenses yet</h3>
                <p className="text-sm text-white/70 max-w-md mb-4">
                  You haven't recorded any expenses yet. Add your first expense to start tracking.
                </p>
                <Link
                  href="/expenses"
                  className="px-3 py-1.5 bg-white/10 text-white rounded-xl text-xs font-medium hover:bg-white/20 transition-colors"
                >
                  Add Your First Expense
                </Link>
              </div>
            )}
          </div>

          {/* Getting started steps */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-5 shadow-sm">
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
                  <h3 className="font-medium text-white text-sm mb-1">Book your first business trip</h3>
                  <p className="text-xs text-white/70 mb-1.5">Search and book flights, hotels, and transportation</p>
                  <Link
                    href="/flights"
                    className="text-xs font-medium text-white hover:underline flex items-center gap-1 w-fit px-2.5 py-1 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    Book a trip
                    <ArrowRightIcon className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border border-white/10 bg-white/5 rounded-xl">
                <div className="flex-shrink-0 w-6 h-6 bg-white/10 text-white rounded-full flex items-center justify-center font-medium text-xs">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm mb-1">Connect your bank account</h3>
                  <p className="text-xs text-white/70 mb-1.5">
                    Link your business accounts for automatic expense tracking
                  </p>
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
      </main>
    </div>
  )
}

interface DashboardCardProps {
  icon: React.ReactNode
  title: string
  description: string
  stats: string
  actionLink: string
  actionText: string
}

function DashboardCard({ icon, title, description, stats, actionLink, actionText }: DashboardCardProps) {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="p-1.5 rounded-lg bg-white/5">{icon}</div>
      </div>
      <h3 className="text-sm font-medium text-white mb-1">{title}</h3>
      <p className="text-xs text-white/50 mb-1">{description}</p>
      <p className="text-xs font-medium text-white mb-2">{stats}</p>
      <Link
        href={actionLink}
        className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-white"
      >
        {actionText}
        <ArrowRightIcon className="h-3 w-3" />
      </Link>
    </div>
  )
}

interface CompanyIconProps {
  company: "Anthropic" | "OpenAI" | "Google" | string
}

function CompanyIcon({ company }: CompanyIconProps) {
  return <SiAnthropic className="h-5 w-5 text-white" />
}
