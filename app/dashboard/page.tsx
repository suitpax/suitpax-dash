"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIQuickInput } from "@/components/ui/ai-quick-input"
import {
  Plane,
  Hotel,
  Car,
  CreditCard,
  Users,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  DollarSign,
  Leaf,
  Zap,
  Star,
  ArrowRight,
  Crown,
  Sparkles,
} from "lucide-react"
import { userProfileService, type UserProfile } from "@/lib/services/user-profile.service"
import Link from "next/link"
import Image from "next/image"

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Load user profile
    const profile = userProfileService.getUserProfile()
    setUserProfile(profile)

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    const name = userProfile?.name || "there"

    if (hour < 12) return `Good morning, ${name}!`
    if (hour < 18) return `Good afternoon, ${name}!`
    return `Good evening, ${name}!`
  }

  const quickActions = [
    { icon: Plane, label: "Book Flight", href: "/flights", color: "bg-blue-500/10 text-blue-400" },
    { icon: Hotel, label: "Find Hotel", href: "/hotels", color: "bg-green-500/10 text-green-400" },
    { icon: Zap, label: "Book Train", href: "/trains", color: "bg-purple-500/10 text-purple-400" },
    { icon: Car, label: "Get Transfer", href: "/transfers", color: "bg-orange-500/10 text-orange-400" },
    { icon: CreditCard, label: "Expenses", href: "/expenses", color: "bg-red-500/10 text-red-400" },
    { icon: Users, label: "Team", href: "/team-management", color: "bg-cyan-500/10 text-cyan-400" },
  ]

  const stats = [
    {
      title: "Total Trips",
      value: userProfile?.stats.totalTrips || 0,
      icon: MapPin,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Total Spent",
      value: `$${(userProfile?.stats.totalSpent || 0).toLocaleString()}`,
      icon: DollarSign,
      change: "-8%",
      changeType: "negative" as const,
    },
    {
      title: "Money Saved",
      value: `$${(userProfile?.stats.savedAmount || 0).toLocaleString()}`,
      icon: TrendingUp,
      change: "+15%",
      changeType: "positive" as const,
    },
    {
      title: "Carbon Offset",
      value: `${userProfile?.stats.carbonOffset || 0}t CO₂`,
      icon: Leaf,
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
    <div className="min-h-screen bg-black text-white p-3 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-medium tracking-tight text-white mb-2">Business Dashboard</h1>
          <p className="text-white/70 font-light text-lg">
            {userProfile?.company
              ? `Welcome to your ${userProfile.company} travel dashboard`
              : "Manage your travel, expenses, and business operations"}
          </p>
          {userProfile?.subscription && (
            <Badge variant="outline" className="mt-2 border-white/20 text-white/80">
              {userProfile.subscription.plan.charAt(0).toUpperCase() + userProfile.subscription.plan.slice(1)} Plan
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2 text-white/70">
          <Clock className="h-4 w-4" />
          <span>{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>

      {/* Quick Action Badges */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
        <Link
          href="/flights"
          className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm font-medium transition-all duration-200"
        >
          <Plane className="h-4 w-4 mr-2" />
          Book Flight
        </Link>
        <Link
          href="/hotels"
          className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-light transition-all duration-200"
        >
          <Hotel className="h-3 w-3 mr-1.5" />
          Hotels
        </Link>
        <Link
          href="/trains"
          className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-light transition-all duration-200"
        >
          <Zap className="h-3 w-3 mr-1.5" />
          Trains
        </Link>
        <Link
          href="/expenses"
          className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-light transition-all duration-200"
        >
          <CreditCard className="h-3 w-3 mr-1.5" />
          Add Expense
        </Link>
        <Link
          href="/smart-bank"
          className="inline-flex items-center px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-full text-blue-300 hover:text-blue-200 text-xs font-light transition-all duration-200"
        >
          <CreditCard className="h-3 w-3 mr-1.5" />
          Connect Bank
        </Link>
        <Link
          href="/meetings"
          className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-light transition-all duration-200"
        >
          <Calendar className="h-3 w-3 mr-1.5" />
          Calendar
        </Link>
        <Link
          href="/team-management"
          className="inline-flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-light transition-all duration-200"
        >
          <Users className="h-3 w-3 mr-1.5" />
          Team
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
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
                <CardTitle className="text-white font-medium tracking-tight text-lg">Upcoming Trips</CardTitle>
                <Link href="/flights" className="text-xs text-white/70 hover:text-white font-light">
                  View all <ArrowRight className="h-3 w-3 inline ml-1" />
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
                        <p className="text-xs text-white/60 font-light">{trip.flight}</p>
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
              <CardTitle className="text-white font-medium tracking-tight text-lg">Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent className="py-2 space-y-3">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">{expense.description}</p>
                    <p className="text-xs text-white/50 font-light">{expense.date}</p>
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

          {/* Subscription Upgrade Card */}
          <Card
            className="border-white/10 overflow-hidden"
            style={{
              background: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Syntone%20-%2024.jpg-549Tch5BQgB8ekOp1KhPWKiGALzJRT.jpeg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-black/80 backdrop-blur-sm">
              <CardHeader className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-white font-medium tracking-tight text-lg">Upgrade to Pro</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <div className="space-y-4">
                  <p className="text-white/90 text-sm font-light">
                    Unlock advanced features and get priority support for your business travel needs.
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-400" />
                      <span className="text-xs text-white/80 font-light">Unlimited AI assistance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-xs text-white/80 font-light">Priority booking support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-xs text-white/80 font-light">Advanced analytics</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-medium text-white">$29</span>
                      <span className="text-sm text-white/70 font-light">/month</span>
                    </div>

                    <Link href="/plans">
                      <Button className="w-full bg-white text-black hover:bg-white/90 font-medium rounded-lg transition-all duration-200">
                        Upgrade Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
