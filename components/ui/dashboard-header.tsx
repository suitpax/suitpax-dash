"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  TrendingUpIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline"

interface UserData {
  name: string
  nextTrip?: {
    destination: string
    date: string
    type: string
  }
  recentExpense?: {
    amount: number
    description: string
    date: string
  }
  monthlyBudget: {
    used: number
    total: number
  }
  totalTrips: number
}

export default function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [greeting, setGreeting] = useState("")

  // Mock user data - in real app this would come from API/database
  const userData: UserData = {
    name: "Alberto",
    nextTrip: {
      destination: "London",
      date: "Dec 20, 2024",
      type: "Business Meeting",
    },
    recentExpense: {
      amount: 45.5,
      description: "Airport taxi",
      date: "2 hours ago",
    },
    monthlyBudget: {
      used: 2450,
      total: 5000,
    },
    totalTrips: 12,
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const hour = currentTime.getHours()
    if (hour < 12) {
      setGreeting("Good morning")
    } else if (hour < 18) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }
  }, [currentTime])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  const budgetPercentage = (userData.monthlyBudget.used / userData.monthlyBudget.total) * 100

  return (
    <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/10 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Greeting Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white">
                  {greeting}, {userData.name}
                </h1>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1.5 text-white/60 text-sm">
                    <ClockIcon className="h-4 w-4" />
                    <span className="font-light">{formatTime(currentTime)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/60 text-sm">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-light">{formatDate(currentTime)}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-white/70 font-light text-sm">Ready to manage your business travel efficiently</p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:min-w-[400px]">
            {/* Next Trip */}
            {userData.nextTrip && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <PaperAirplaneIcon className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-white/50 font-light">Next Trip</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-3 w-3 text-white/40" />
                    <span className="text-white text-sm font-medium">{userData.nextTrip.destination}</span>
                  </div>
                  <p className="text-white/60 text-xs font-light">{userData.nextTrip.date}</p>
                </div>
              </div>
            )}

            {/* Recent Expense */}
            {userData.recentExpense && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCardIcon className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-white/50 font-light">Recent Expense</span>
                </div>
                <div className="space-y-1">
                  <p className="text-white text-sm font-medium">${userData.recentExpense.amount}</p>
                  <p className="text-white/60 text-xs font-light">{userData.recentExpense.description}</p>
                  <p className="text-white/40 text-xs">{userData.recentExpense.date}</p>
                </div>
              </div>
            )}

            {/* Budget Status */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUpIcon className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-white/50 font-light">Monthly Budget</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">
                    ${userData.monthlyBudget.used.toLocaleString()}
                  </span>
                  <Badge
                    className={`text-xs font-light ${
                      budgetPercentage > 80
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : budgetPercentage > 60
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          : "bg-green-500/20 text-green-400 border-green-500/30"
                    }`}
                  >
                    {budgetPercentage.toFixed(0)}%
                  </Badge>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      budgetPercentage > 80 ? "bg-red-400" : budgetPercentage > 60 ? "bg-yellow-400" : "bg-green-400"
                    }`}
                    style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                  />
                </div>
                <p className="text-white/40 text-xs">of ${userData.monthlyBudget.total.toLocaleString()} limit</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
