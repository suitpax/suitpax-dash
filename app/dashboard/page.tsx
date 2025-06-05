"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Airplane, CreditCard, Eye, EyeSlash, Filter, Building, TrendingUp, Download } from "@phosphor-icons/react"

export default function Dashboard() {
  const [hasData, setHasData] = useState(true) // Changed to true to show populated dashboard
  const [onboardingComplete, setOnboardingComplete] = useState(
    typeof window !== "undefined" ? localStorage.getItem("onboardingComplete") === "true" : true,
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header with User Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-medium text-lg">JD</span>
              </div>
              <div>
                <h1 className="text-xl font-medium text-white">John Doe</h1>
                <p className="text-sm text-white/70">Hello, Welcome back!</p>
              </div>
            </div>
            <Button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center gap-2">
              <Download size={16} />
              <span className="text-sm">Export Data</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overview Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Travel Overview */}
              <Card className="bg-black/95 border border-white/10 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-white">Travel Overview</h2>
                    <span className="text-sm text-white/70">June 2024</span>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">12</div>
                      <div className="text-sm text-white/70">Trips</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">8</div>
                      <div className="text-sm text-white/70">Hotels</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">24</div>
                      <div className="text-sm text-white/70">Expenses</div>
                    </div>
                  </div>

                  {/* Calendar */}
                  <TravelCalendar />
                </CardContent>
              </Card>

              {/* Recent Trips */}
              <Card className="bg-black/95 border border-white/10 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Recent Trips</h3>
                    <Button className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded">
                      <Filter size={16} />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <RecentTripItem
                      type="Flight"
                      destination="New York"
                      date="Aug 24, 2024"
                      amount="$1,500.00"
                      status="Completed"
                      method="Corporate Card"
                    />
                    <RecentTripItem
                      type="Hotel"
                      destination="London"
                      date="Aug 20, 2024"
                      amount="$890.00"
                      status="Pending"
                      method="Expense Report"
                    />
                    <RecentTripItem
                      type="Flight"
                      destination="Paris"
                      date="Aug 18, 2024"
                      amount="$750.00"
                      status="Completed"
                      method="Corporate Card"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Travel Budget */}
              <TravelBudgetCard />

              {/* Travel Health */}
              <Card className="bg-black/95 border border-white/10 rounded-xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Travel Health</h3>
                  <div className="bg-white/5 rounded-lg p-4 h-32 flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                      <p className="text-sm text-white/70">Analyzing travel patterns...</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-white/70">
                    <p>
                      Policy compliance: <span className="text-emerald-400">94%</span>
                    </p>
                    <p>
                      Budget efficiency: <span className="text-emerald-400">+12.5%</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-black/95 border border-white/10 rounded-xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button
                      asChild
                      className="w-full bg-white/10 text-white rounded-lg hover:bg-white/20 justify-start"
                    >
                      <Link href="/flights" className="flex items-center gap-3">
                        <Airplane size={16} />
                        <span className="text-sm">Book Flight</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-white/10 text-white rounded-lg hover:bg-white/20 justify-start"
                    >
                      <Link href="/hotels" className="flex items-center gap-3">
                        <Building size={16} />
                        <span className="text-sm">Book Hotel</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-white/10 text-white rounded-lg hover:bg-white/20 justify-start"
                    >
                      <Link href="/expenses" className="flex items-center gap-3">
                        <CreditCard size={16} />
                        <span className="text-sm">Add Expense</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TravelCalendar() {
  const [selectedDate, setSelectedDate] = useState(10)
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1)

  const tripDays = [1, 10, 15, 24] // Days with trips

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center text-xs text-white/50 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDate(day)}
            className={`
              w-8 h-8 rounded-full text-sm transition-colors
              ${
                tripDays.includes(day)
                  ? "bg-orange-500 text-white"
                  : selectedDate === day
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10"
              }
            `}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}

function TravelBudgetCard() {
  const [showBalance, setShowBalance] = useState(false)
  const currentSpent = 15420
  const monthlyBudget = 25000

  return (
    <Card className="bg-black/95 border border-white/10 rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Your Travel Budget</h3>
          <span className="text-sm text-white/70">US Dollar</span>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70">Balance</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 rounded hover:bg-white/5 transition-colors"
            >
              {showBalance ? (
                <EyeSlash size={16} className="text-white/70" />
              ) : (
                <Eye size={16} className="text-white/70" />
              )}
            </button>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {showBalance ? `$${currentSpent.toLocaleString()}` : "••••••"}
          </div>
          <div className="text-sm text-emerald-400">Compared to last month +24.17%</div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/70">Monthly Budget</span>
            <span className="text-sm text-white">${monthlyBudget.toLocaleString()}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 mb-2">
            <div
              className="bg-emerald-400 h-2 rounded-full"
              style={{ width: `${(currentSpent / monthlyBudget) * 100}%` }}
            />
          </div>
          <div className="text-xs text-white/50">
            ${(monthlyBudget - currentSpent).toLocaleString()} remaining this month
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentTripItem({
  type,
  destination,
  date,
  amount,
  status,
  method,
}: {
  type: string
  destination: string
  date: string
  amount: string
  status: string
  method: string
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-emerald-400"
      case "Pending":
        return "text-amber-400"
      case "Cancelled":
        return "text-red-400"
      default:
        return "text-white/70"
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
          {type === "Flight" ? (
            <Airplane size={16} className="text-white/70" />
          ) : (
            <Building size={16} className="text-white/70" />
          )}
        </div>
        <div>
          <div className="font-medium text-white text-sm">{type}</div>
          <div className="text-xs text-white/50">
            {destination} • {date}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium text-white text-sm">{amount}</div>
        <div className="text-xs text-white/50">{method}</div>
      </div>
      <div className={`text-sm ${getStatusColor(status)}`}>{status}</div>
    </div>
  )
}
