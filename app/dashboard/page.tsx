"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Plane,
  Receipt,
  CreditCard,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  ArrowRight,
  Building2,
  Briefcase,
  Globe,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AIQuickInput from "@/components/ui/ai-quick-input"

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Mock data
  const upcomingTrips = [
    {
      id: 1,
      destination: "New York",
      date: "Dec 15, 2024",
      type: "Business",
      status: "confirmed",
      flight: "AA 1234",
      hotel: "Marriott Times Square",
    },
    {
      id: 2,
      destination: "London",
      date: "Jan 8, 2025",
      type: "Business",
      status: "pending",
      flight: "BA 178",
      hotel: "Hilton Park Lane",
    },
  ]

  const recentExpenses = [
    { id: 1, description: "Business Lunch - Client Meeting", amount: 125.5, date: "Today", status: "pending" },
    { id: 2, description: "Taxi to Airport", amount: 45.0, date: "Yesterday", status: "approved" },
    { id: 3, description: "Hotel Stay - NYC", amount: 320.0, date: "Dec 10", status: "approved" },
  ]

  const upcomingMeetings = [
    { id: 1, title: "Q1 Planning Meeting", time: "10:00 AM", attendees: 5 },
    { id: 2, title: "Client Presentation", time: "2:30 PM", attendees: 3 },
    { id: 3, title: "Team Standup", time: "4:00 PM", attendees: 8 },
  ]

  const travelInsights = {
    totalTrips: 24,
    totalSpent: 15420,
    savedAmount: 2340,
    carbonOffset: 1.2,
  }

  return (
    <div className="min-h-screen bg-black text-white p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white/5 border border-white/10">
              <Image src="/images/ai-agent-avatar.jpeg" alt="User avatar" fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-light tracking-tighter text-white">Welcome back, Alberto</h1>
              <p className="text-white/70 text-sm font-light">Ready to plan your next business trip?</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/flights"
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-white/70 hover:text-white font-light"
            >
              <Plane className="h-3 w-3" />
              Book Flight
            </Link>
            <Link
              href="/expenses"
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-white/70 hover:text-white font-light"
            >
              <Receipt className="h-3 w-3" />
              Add Expense
            </Link>
          </div>
        </div>

        {/* AI Quick Input */}
        <div className="max-w-md">
          <AIQuickInput placeholder="Ask AI: 'Book a flight to London next week'" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="py-3">
                <CardTitle className="text-white font-light tracking-tighter text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Link href="/flights" className="group">
                    <div className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 group-hover:scale-[1.02]">
                      <Plane className="h-6 w-6 text-white/70 mb-2" />
                      <p className="text-sm font-light text-white">Book Flight</p>
                      <p className="text-xs text-white/50 font-light">Find & book flights</p>
                    </div>
                  </Link>

                  <Link href="/hotels" className="group">
                    <div className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 group-hover:scale-[1.02]">
                      <Building2 className="h-6 w-6 text-white/70 mb-2" />
                      <p className="text-sm font-light text-white">Book Hotel</p>
                      <p className="text-xs text-white/50 font-light">Find accommodations</p>
                    </div>
                  </Link>

                  <Link href="/expenses" className="group">
                    <div className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 group-hover:scale-[1.02]">
                      <Receipt className="h-6 w-6 text-white/70 mb-2" />
                      <p className="text-sm font-light text-white">Add Expense</p>
                      <p className="text-xs text-white/50 font-light">Upload receipts</p>
                    </div>
                  </Link>

                  <Link href="/smart-bank" className="group">
                    <div className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 group-hover:scale-[1.02]">
                      <CreditCard className="h-6 w-6 text-white/70 mb-2" />
                      <p className="text-sm font-light text-white">Connect Bank</p>
                      <p className="text-xs text-white/50 font-light">Link accounts</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Trips */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-light tracking-tighter text-lg">Upcoming Trips</CardTitle>
                  <Link href="/flights" className="text-xs text-white/70 hover:text-white font-light">
                    View all <ChevronRight className="h-3 w-3 inline ml-1" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="py-2 space-y-3">
                {upcomingTrips.map((trip) => (
                  <div key={trip.id} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-white/70" />
                        <span className="font-light text-white">{trip.destination}</span>
                      </div>
                      <Badge
                        className={`text-xs font-light ${
                          trip.status === "confirmed"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        {trip.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-white/50 font-light">Date</p>
                        <p className="text-white/70 font-light">{trip.date}</p>
                      </div>
                      <div>
                        <p className="text-white/50 font-light">Flight</p>
                        <p className="text-white/70 font-light">{trip.flight}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-light"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Plan New Trip
                </Button>
              </CardContent>
            </Card>

            {/* Recent Expenses */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-light tracking-tighter text-lg">Recent Expenses</CardTitle>
                  <Link href="/expenses" className="text-xs text-white/70 hover:text-white font-light">
                    View all <ChevronRight className="h-3 w-3 inline ml-1" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="py-2 space-y-3">
                {recentExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Receipt className="h-4 w-4 text-white/70" />
                      </div>
                      <div>
                        <p className="text-sm font-light text-white">{expense.description}</p>
                        <p className="text-xs text-white/50 font-light">{expense.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-light text-white">${expense.amount}</p>
                      <Badge
                        className={`text-xs font-light ${
                          expense.status === "approved"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        {expense.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Today's Calendar */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-light tracking-tighter text-lg">Today's Schedule</CardTitle>
                  <Link href="/meetings" className="text-xs text-white/70 hover:text-white font-light">
                    View calendar
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="py-2 space-y-3">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-3 w-3 text-white/70" />
                      <span className="text-xs font-light text-white/70">{meeting.time}</span>
                    </div>
                    <p className="text-sm font-light text-white mb-1">{meeting.title}</p>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-white/50" />
                      <span className="text-xs text-white/50 font-light">{meeting.attendees} attendees</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Travel Insights */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="py-3">
                <CardTitle className="text-white font-light tracking-tighter text-lg">Travel Insights</CardTitle>
              </CardHeader>
              <CardContent className="py-2 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-center">
                    <Briefcase className="h-5 w-5 text-white/70 mx-auto mb-1" />
                    <p className="text-lg font-light text-white">{travelInsights.totalTrips}</p>
                    <p className="text-xs text-white/50 font-light">Total Trips</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-center">
                    <DollarSign className="h-5 w-5 text-white/70 mx-auto mb-1" />
                    <p className="text-lg font-light text-white">${travelInsights.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-white/50 font-light">Total Spent</p>
                  </div>
                </div>

                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-light text-green-400">Savings This Year</span>
                  </div>
                  <p className="text-xl font-light text-white">${travelInsights.savedAmount.toLocaleString()}</p>
                  <p className="text-xs text-white/50 font-light">15% below budget</p>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-light text-blue-400">Carbon Offset</span>
                  </div>
                  <p className="text-xl font-light text-white">{travelInsights.carbonOffset} tons</p>
                  <p className="text-xs text-white/50 font-light">CO₂ compensated</p>
                </div>
              </CardContent>
            </Card>

            {/* Invite Team Member - Redesigned */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="py-3">
                <CardTitle className="text-white font-light tracking-tighter text-lg">Invite Team Member</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="space-y-3">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-white/70" />
                    </div>
                    <h3 className="font-light text-white mb-2">Expand Your Team</h3>
                    <p className="text-xs text-white/50 font-light mb-4">
                      Invite colleagues to collaborate on travel planning and expense management
                    </p>

                    <div className="space-y-2 mb-4">
                      <input
                        type="email"
                        placeholder="colleague@company.com"
                        className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30 font-light"
                      />
                      <select className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 text-white font-light">
                        <option value="member">Team Member</option>
                        <option value="manager">Travel Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <Button className="w-full bg-white text-black hover:bg-white/90 font-light">
                      <Plus className="h-4 w-4 mr-2" />
                      Send Invitation
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50 font-light">5 team members</span>
                    <Link href="/team-management" className="text-white/70 hover:text-white font-light">
                      Manage team <ArrowRight className="h-3 w-3 inline ml-1" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
