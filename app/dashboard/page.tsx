"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIQuickInput } from "@/components/ui/ai-quick-input"
import {
  PiAirplane,
  PiBuildings,
  PiCar,
  PiCreditCard,
  PiUsers,
  PiCalendar,
  PiMapPin,
  PiClock,
  PiTrendUp,
  PiCurrencyDollar,
  PiLeaf,
  PiArrowRight,
  PiSparkle,
  PiTrain,
  PiShield,
  PiLightning,
  PiTarget,
  PiChartBar,
} from "react-icons/pi"
import { userProfileService, type UserProfile } from "@/lib/services/user-profile.service"
import Link from "next/link"
import Image from "next/image"

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dashboardType, setDashboardType] = useState<"pro" | "personal">("personal")

  useEffect(() => {
    const profile = userProfileService.getUserProfile()
    setUserProfile(profile)

    const savedDashboardType = (localStorage.getItem("dashboardType") as "pro" | "personal") || "personal"
    setDashboardType(savedDashboardType)

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const quickActions = [
    { icon: PiAirplane, label: "Book Flight", href: "/flights", color: "bg-blue-500/10 text-blue-400" },
    { icon: PiBuildings, label: "Find Hotel", href: "/hotels", color: "bg-green-500/10 text-green-400" },
    { icon: PiTrain, label: "Book Train", href: "/trains", color: "bg-purple-500/10 text-purple-400" },
    { icon: PiCar, label: "Get Transfer", href: "/transfers", color: "bg-orange-500/10 text-orange-400" },
    { icon: PiCreditCard, label: "Expenses", href: "/expenses", color: "bg-red-500/10 text-red-400" },
    { icon: PiUsers, label: "Team", href: "/team-management", color: "bg-cyan-500/10 text-cyan-400" },
  ]

  const stats = [
    {
      title: "Total Trips",
      value: userProfile?.stats.totalTrips || 0,
      icon: PiMapPin,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Total Spent",
      value: `$${(userProfile?.stats.totalSpent || 0).toLocaleString()}`,
      icon: PiCurrencyDollar,
      change: "-8%",
      changeType: "negative" as const,
    },
    {
      title: "Money Saved",
      value: `$${(userProfile?.stats.savedAmount || 0).toLocaleString()}`,
      icon: PiTrendUp,
      change: "+15%",
      changeType: "positive" as const,
    },
    {
      title: "Carbon Offset",
      value: `${userProfile?.stats.carbonOffset || 0}t CO₂`,
      icon: PiLeaf,
      change: "+5%",
      changeType: "positive" as const,
    },
  ]

  const proStats = [
    {
      title: "Team Members",
      value: "24",
      icon: PiUsers,
      change: "+3",
      changeType: "positive" as const,
    },
    {
      title: "Active Policies",
      value: "8",
      icon: PiShield,
      change: "+2",
      changeType: "positive" as const,
    },
    {
      title: "Approval Rate",
      value: "94%",
      icon: PiTarget,
      change: "+2%",
      changeType: "positive" as const,
    },
    {
      title: "Cost Savings",
      value: "18%",
      icon: PiChartBar,
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

  const displayStats = dashboardType === "pro" ? [...stats, ...proStats] : stats

  return (
    <div className="min-h-screen bg-black text-white p-3 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl lg:text-4xl font-medium tracking-tight text-white">Dashboard</h1>
            <Badge
              variant="outline"
              className={`border-white/20 text-xs font-light ${
                dashboardType === "pro"
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                  : "bg-blue-500/20 text-blue-300 border-blue-500/30"
              }`}
            >
              {dashboardType === "pro" ? "Admin View" : "Employee View"}
            </Badge>
          </div>
          <p className="text-white/70 font-light text-lg">
            {dashboardType === "pro"
              ? "Manage your team's travel operations and policies"
              : userProfile?.company
                ? `Welcome to your ${userProfile.company} travel dashboard`
                : "Manage your travel, expenses, and business operations"}
          </p>
          {userProfile?.subscription && (
            <Badge variant="outline" className="mt-2 border-white/20 text-white/80">
              {userProfile.subscription.plan.charAt(0).toUpperCase() + userProfile.subscription.plan.slice(1)} Plan
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2 text-white/70">
            <PiClock className="h-4 w-4" />
            <span>{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => {
                setDashboardType("personal")
                localStorage.setItem("dashboardType", "personal")
              }}
              className={`px-3 py-1 text-xs rounded-md transition-all duration-200 ${
                dashboardType === "personal"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => {
                setDashboardType("pro")
                localStorage.setItem("dashboardType", "pro")
              }}
              className={`px-3 py-1 text-xs rounded-md transition-all duration-200 ${
                dashboardType === "pro"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Pro
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Badges */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
        <Link
          href="/flights"
          className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm font-medium transition-all duration-200"
        >
          <PiAirplane className="h-4 w-4 mr-2" />
          Book Flight
        </Link>
        <Link
          href="/hotels"
          className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-light transition-all duration-200"
        >
          <PiBuildings className="h-3 w-3 mr-1.5" />
          Hotels
        </Link>
        <Link
          href="/trains"
          className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-light transition-all duration-200"
        >
          <PiTrain className="h-3 w-3 mr-1.5" />
          Trains
        </Link>
        <Link
          href="/expenses"
          className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-light transition-all duration-200"
        >
          <PiCreditCard className="h-3 w-3 mr-1.5" />
          Add Expense
        </Link>
        <Link
          href="/smart-bank"
          className="inline-flex items-center px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-full text-blue-300 hover:text-blue-200 text-xs font-light transition-all duration-200"
        >
          <PiCreditCard className="h-3 w-3 mr-1.5" />
          Connect Bank
        </Link>
        <Link
          href="/meetings"
          className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-light transition-all duration-200"
        >
          <PiCalendar className="h-3 w-3 mr-1.5" />
          Calendar
        </Link>
        <Link
          href="/team-management"
          className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-light transition-all duration-200"
        >
          <PiUsers className="h-3 w-3 mr-1.5" />
          Team
        </Link>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-2 gap-3 ${dashboardType === "pro" ? "lg:grid-cols-4" : "lg:grid-cols-4"}`}>
        {displayStats.map((stat, index) => (
          <Card key={index} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-light">{stat.title}</p>
                  <p className="text-xl font-medium text-white">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs ${stat.changeType === "positive" ? "text-green-400" : "text-red-400"}`}>
                      {stat.change}
                    </span>
                    <span className="text-white/50 text-xs ml-1 font-light">vs last month</span>
                  </div>
                </div>
                <stat.icon className="h-8 w-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Quick Input */}
      <div className="w-full max-w-4xl mx-auto">
        <AIQuickInput
          placeholder={`Ask Suitpax AI anything about your travel, ${userProfile?.name || "there"}...`}
          className="w-full"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Features */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Trips */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-medium tracking-tight text-lg">
                  {dashboardType === "pro" ? "Team Trips" : "Upcoming Trips"}
                </CardTitle>
                <Link href="/flights" className="text-xs text-white/70 hover:text-white font-light">
                  View all <PiArrowRight className="h-3 w-3 inline ml-1" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="py-2 space-y-3">
              {upcomingTrips.map((trip) => (
                <div key={trip.id} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8 rounded-md overflow-hidden">
                        <Image
                          src={trip.image || "/placeholder.svg"}
                          alt={trip.destination}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white">{trip.destination}</p>
                        <p className="text-xs text-white/60 font-light">
                          {dashboardType === "pro" ? `${trip.flight} • John Doe` : trip.flight}
                        </p>
                      </div>
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
                  <p className="text-xs text-white/50 font-light">{trip.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Recent Expenses */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="py-4">
              <CardTitle className="text-white font-medium tracking-tight text-lg">
                {dashboardType === "pro" ? "Team Expenses" : "Recent Expenses"}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 space-y-3">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">{expense.description}</p>
                    <p className="text-xs text-white/50 font-light">
                      {dashboardType === "pro" ? `${expense.date} • Sarah M.` : expense.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">${expense.amount}</p>
                    <Badge
                      className={`text-xs font-light ${
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

          {/* Feature Highlight Card */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <PiSparkle className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm">
                      {dashboardType === "pro" ? "Team Analytics" : "AI Insights"}
                    </h3>
                    <p className="text-xs text-white/60 font-light">
                      {dashboardType === "pro"
                        ? "Monitor team travel patterns and optimize policies"
                        : "Get personalized travel recommendations"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <PiLightning className="h-3 w-3 text-yellow-400" />
                    <span className="text-xs text-white/70 font-light">
                      {dashboardType === "pro" ? "Real-time approvals" : "Smart booking suggestions"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PiTarget className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-white/70 font-light">
                      {dashboardType === "pro" ? "Policy compliance tracking" : "Budget optimization"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PiShield className="h-3 w-3 text-purple-400" />
                    <span className="text-xs text-white/70 font-light">
                      {dashboardType === "pro" ? "Advanced security controls" : "Expense automation"}
                    </span>
                  </div>
                </div>

                <Link href={dashboardType === "pro" ? "/team-management" : "/suitpax-ai"}>
                  <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-light text-sm rounded-lg transition-all duration-200">
                    {dashboardType === "pro" ? "Manage Team" : "Explore AI Features"}
                    <PiArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
