"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIChat } from "@/components/ui/ai-chat"
import {
  Plane,
  Hotel,
  Train,
  Car,
  CreditCard,
  Users,
  BarChart3,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  DollarSign,
  Leaf,
} from "lucide-react"
import { userProfileService, type UserProfile } from "@/lib/services/user-profile.service"
import Link from "next/link"

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

  const getTimeOfDay = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "morning"
    if (hour < 18) return "afternoon"
    return "evening"
  }

  const quickActions = [
    { icon: Plane, label: "Book Flight", href: "/flights", color: "bg-blue-500/10 text-blue-400" },
    { icon: Hotel, label: "Find Hotel", href: "/hotels", color: "bg-green-500/10 text-green-400" },
    { icon: Train, label: "Book Train", href: "/trains", color: "bg-purple-500/10 text-purple-400" },
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

  return (
    <div className="min-h-screen bg-black text-white p-3 space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">{getGreeting()}</h1>
          <p className="text-white/70 mt-1">
            {userProfile?.company
              ? `Welcome to your ${userProfile.company} travel dashboard`
              : "Welcome to your travel dashboard"}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-black/30 border-white/10">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">{stat.title}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs ${stat.changeType === "positive" ? "text-green-400" : "text-red-400"}`}>
                      {stat.change}
                    </span>
                    <span className="text-white/50 text-xs ml-1">vs last month</span>
                  </div>
                </div>
                <stat.icon className="h-8 w-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/5 p-3">
                  <action.icon className="h-4 w-4 mr-3" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* AI Chat */}
        <div className="lg:col-span-2">
          <AIChat
            className="h-full min-h-[400px]"
            placeholder={`Ask me anything about your travel, ${userProfile?.name || "there"}...`}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userProfile?.stats.totalTrips === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/70 mb-4">No recent activity yet</p>
              <p className="text-white/50 text-sm mb-4">Start by booking your first trip or exploring our features</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link href="/flights">
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/5">
                    Book Flight
                  </Button>
                </Link>
                <Link href="/hotels">
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/5">
                    Find Hotel
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Plane className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Flight to New York</p>
                    <p className="text-white/70 text-sm">Booked 2 days ago</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-green-500/50 text-green-400">
                  Confirmed
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
