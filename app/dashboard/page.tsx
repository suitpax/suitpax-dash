"use client"
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
import { useUserData, useUserTrips, useUserExpenses, useUserMeetings } from "@/lib/hooks/use-user-data"

export default function Dashboard() {
  const { userData, loading: userLoading, initializeDemoData } = useUserData()
  const { trips, loading: tripsLoading } = useUserTrips(userData?.id)
  const { expenses, loading: expensesLoading } = useUserExpenses(userData?.id)

  // Get today's meetings
  const today = new Date().toISOString().split("T")[0]
  const { meetings, loading: meetingsLoading } = useUserMeetings(userData?.id, today)

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-light">Loading your dashboard...</div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-light">Unable to load user data</div>
      </div>
    )
  }

  // Get recent data
  const upcomingTrips = trips
    .filter((trip) => new Date(trip.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 2)

  const recentExpenses = expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)

  const todayMeetings = meetings.slice(0, 3)

  // Show demo data button if user has no data
  const hasNoData = trips.length === 0 && expenses.length === 0 && meetings.length === 0

  return (
    <div className="min-h-screen bg-black text-white p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white/5 border border-white/10">
              {userData.avatar ? (
                <Image src={userData.avatar || "/placeholder.svg"} alt="User avatar" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white/50" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-light tracking-tighter text-white">
                Hey, {getGreeting()}
                {userData.name ? `, ${userData.name}` : ""}
              </h1>
              <p className="text-white/70 text-sm font-light">Ready to plan your next business trip?</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/flights"
              className="flex items-center gap-2 px-2 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors text-white/70 hover:text-white font-light"
            >
              <Plane className="h-3 w-3" />
              Book Flight
            </Link>
            <Link
              href="/expenses"
              className="flex items-center gap-2 px-2 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors text-white/70 hover:text-white font-light"
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

        {/* Demo Data Button */}
        {hasNoData && (
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-light text-white mb-1">Get Started</h3>
                  <p className="text-sm text-white/70 font-light">Load some sample data to explore Suitpax features</p>
                </div>
                <Button onClick={initializeDemoData} className="bg-blue-500 hover:bg-blue-600 text-white font-light">
                  Load Demo Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                {tripsLoading ? (
                  <div className="text-center py-4">
                    <div className="text-white/50 font-light">Loading trips...</div>
                  </div>
                ) : upcomingTrips.length > 0 ? (
                  upcomingTrips.map((trip) => (
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
                          <p className="text-white/70 font-light">{new Date(trip.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-white/50 font-light">Flight</p>
                          <p className="text-white/70 font-light">{trip.flight?.number || "Not booked"}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Plane className="h-12 w-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/50 font-light mb-2">No upcoming trips</p>
                    <p className="text-xs text-white/30 font-light">Book your first business trip</p>
                  </div>
                )}

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
                {expensesLoading ? (
                  <div className="text-center py-4">
                    <div className="text-white/50 font-light">Loading expenses...</div>
                  </div>
                ) : recentExpenses.length > 0 ? (
                  recentExpenses.map((expense) => (
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
                          <p className="text-xs text-white/50 font-light">
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-light text-white">${expense.amount.toFixed(2)}</p>
                        <Badge
                          className={`text-xs font-light ${
                            expense.status === "approved"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : expense.status === "rejected"
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          }`}
                        >
                          {expense.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/50 font-light mb-2">No expenses yet</p>
                    <p className="text-xs text-white/30 font-light">Add your first expense</p>
                  </div>
                )}
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
                {meetingsLoading ? (
                  <div className="text-center py-4">
                    <div className="text-white/50 font-light">Loading meetings...</div>
                  </div>
                ) : todayMeetings.length > 0 ? (
                  todayMeetings.map((meeting) => (
                    <div key={meeting.id} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-3 w-3 text-white/70" />
                        <span className="text-xs font-light text-white/70">
                          {new Date(meeting.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm font-light text-white mb-1">{meeting.title}</p>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-white/50" />
                        <span className="text-xs text-white/50 font-light">{meeting.attendees} attendees</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/50 font-light mb-2">No meetings today</p>
                    <p className="text-xs text-white/30 font-light">Your schedule is clear</p>
                  </div>
                )}
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
                    <p className="text-lg font-light text-white">{userData.stats.totalTrips}</p>
                    <p className="text-xs text-white/50 font-light">Total Trips</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-center">
                    <DollarSign className="h-5 w-5 text-white/70 mx-auto mb-1" />
                    <p className="text-lg font-light text-white">${userData.stats.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-white/50 font-light">Total Spent</p>
                  </div>
                </div>

                {userData.stats.savedAmount > 0 && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-light text-green-400">Savings This Year</span>
                    </div>
                    <p className="text-xl font-light text-white">${userData.stats.savedAmount.toLocaleString()}</p>
                    <p className="text-xs text-white/50 font-light">15% below budget</p>
                  </div>
                )}

                {userData.stats.carbonOffset > 0 && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-light text-blue-400">Carbon Offset</span>
                    </div>
                    <p className="text-xl font-light text-white">{userData.stats.carbonOffset} tons</p>
                    <p className="text-xs text-white/50 font-light">CO₂ compensated</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invite Team Member */}
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
                    <span className="text-white/50 font-light">0 team members</span>
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
