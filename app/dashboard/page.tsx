"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AIQuickInput } from "@/components/ui/ai-quick-input"
import {
  PiAirplane,
  PiBuildings,
  PiCreditCard,
  PiUsers,
  PiMapPin,
  PiClock,
  PiTrendUp,
  PiCurrencyDollar,
  PiLeaf,
  PiArrowRight,
  PiTrain,
} from "react-icons/pi"
import { userProfileService, type UserProfile } from "@/lib/services/user-profile.service"
import Link from "next/link"
import Image from "next/image"

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dashboardType, setDashboardType] = useState<"pro" | "personal">("personal")
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const profile = userProfileService.getUserProfile()
    setUserProfile(profile)

    const savedDashboardType = (localStorage.getItem("dashboardType") as "pro" | "personal") || "personal"
    setDashboardType(savedDashboardType)

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Simulate online status
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      clearInterval(timer)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    const firstName = userProfile?.firstName || "there"

    if (hour < 12) return `Good morning, ${firstName}!`
    if (hour < 18) return `Good afternoon, ${firstName}!`
    return `Good evening, ${firstName}!`
  }

  const stats = [
    {
      title: "Total Trips",
      value: userProfile?.stats?.totalTrips || 12,
      icon: PiMapPin,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Total Spent",
      value: `$${(userProfile?.stats?.totalSpent || 24500).toLocaleString()}`,
      icon: PiCurrencyDollar,
      change: "-8%",
      changeType: "negative" as const,
    },
    {
      title: "Money Saved",
      value: `$${(userProfile?.stats?.savedAmount || 4200).toLocaleString()}`,
      icon: PiTrendUp,
      change: "+15%",
      changeType: "positive" as const,
    },
    {
      title: "Carbon Offset",
      value: `${userProfile?.stats?.carbonOffset || 2.4}t CO₂`,
      icon: PiLeaf,
      change: "+5%",
      changeType: "positive" as const,
    },
  ]

  const upcomingTrips = [
    {
      id: 1,
      destination: "London",
      date: "Dec 20, 2024",
      flight: "BA178",
      status: "confirmed",
      image: "/placeholder.svg?height=32&width=32&text=LDN",
    },
    {
      id: 2,
      destination: "Tokyo",
      date: "Jan 15, 2025",
      flight: "NH110",
      status: "pending",
      image: "/placeholder.svg?height=32&width=32&text=NRT",
    },
  ]

  const recentExpenses = [
    { id: 1, description: "Hotel - Marriott London", amount: 450, date: "Dec 18", status: "approved" },
    { id: 2, description: "Flight - NYC to London", amount: 1200, date: "Dec 17", status: "pending" },
    { id: 3, description: "Dinner - Client Meeting", amount: 85, date: "Dec 16", status: "approved" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header with User Greeting */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* User Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/10 border border-white/20">
                {userProfile?.profileImage ? (
                  <Image
                    src={userProfile.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PiUsers className="h-8 w-8 text-white/50" />
                  </div>
                )}
              </div>
              {/* Online Status Dot - Smaller */}
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${
                  isOnline ? "bg-green-500" : "bg-gray-500"
                }`}
              />
            </div>

            {/* Greeting */}
            <div>
              <h1 className="text-4xl font-light tracking-tight text-white mb-1">{getGreeting()}</h1>
              <p className="text-white/60 font-light text-lg">
                {userProfile?.company
                  ? `Welcome back to your ${userProfile.company} dashboard`
                  : "Ready to plan your next business trip?"}
              </p>
            </div>
          </div>

          {/* Time and Dashboard Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 text-white/50 text-sm font-light">
              <PiClock className="h-4 w-4" />
              <span>{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>

            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => {
                  setDashboardType("personal")
                  localStorage.setItem("dashboardType", "personal")
                }}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 font-light ${
                  dashboardType === "personal"
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => {
                  setDashboardType("pro")
                  localStorage.setItem("dashboardType", "pro")
                }}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 font-light ${
                  dashboardType === "pro"
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Pro
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/flights"
            className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white font-light transition-all duration-200"
          >
            <PiAirplane className="h-5 w-5 mr-3" />
            Book Flight
          </Link>
          <Link
            href="/hotels"
            className="inline-flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/70 hover:text-white font-light transition-all duration-200"
          >
            <PiBuildings className="h-4 w-4 mr-2" />
            Hotels
          </Link>
          <Link
            href="/trains"
            className="inline-flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/70 hover:text-white font-light transition-all duration-200"
          >
            <PiTrain className="h-4 w-4 mr-2" />
            Trains
          </Link>
          <Link
            href="/expenses"
            className="inline-flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/70 hover:text-white font-light transition-all duration-200"
          >
            <PiCreditCard className="h-4 w-4 mr-2" />
            Expenses
          </Link>
          <Link
            href="/smart-bank"
            className="inline-flex items-center px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-2xl text-blue-300 hover:text-blue-200 font-light transition-all duration-200"
          >
            <PiCreditCard className="h-4 w-4 mr-2" />
            Connect Bank
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/5 border-white/10 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="h-8 w-8 text-white/50" />
                  <span
                    className={`text-sm font-light ${
                      stat.changeType === "positive" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-white/60 text-sm font-light mb-1">{stat.title}</p>
                  <p className="text-2xl font-light text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Quick Input */}
        <div className="w-full">
          <AIQuickInput
            placeholder={`Ask Suitpax AI anything, ${userProfile?.firstName || "there"}...`}
            className="w-full"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Trips */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 border-white/10 rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-light text-xl">
                    {dashboardType === "pro" ? "Team Trips" : "Upcoming Trips"}
                  </CardTitle>
                  <Link href="/flights" className="text-sm text-white/60 hover:text-white font-light">
                    View all <PiArrowRight className="h-4 w-4 inline ml-1" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingTrips.map((trip) => (
                  <div key={trip.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="relative h-10 w-10 rounded-xl overflow-hidden">
                          <Image
                            src={trip.image || "/placeholder.svg"}
                            alt={trip.destination}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-white text-lg">{trip.destination}</p>
                          <p className="text-sm text-white/50 font-light">{trip.flight}</p>
                        </div>
                      </div>
                      <Badge
                        className={`font-light rounded-full ${
                          trip.status === "confirmed"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        {trip.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/40 font-light">{trip.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Expenses */}
          <div>
            <Card className="bg-white/5 border-white/10 rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-white font-light text-xl">Recent Expenses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-white">{expense.description}</p>
                      <p className="text-xs text-white/40 font-light">{expense.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">${expense.amount}</p>
                      <Badge
                        className={`text-xs font-light rounded-full ${
                          expense.status === "approved"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
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
        </div>
      </div>
    </div>
  )
}
