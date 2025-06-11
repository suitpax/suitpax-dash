"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Plane,
  CreditCard,
  BarChart2,
  ClipboardList,
  ArrowRight,
  Calendar,
  Users,
  Building2,
  Sparkles,
  Compass,
  Receipt,
  FileText,
  Settings,
  TrendingUp,
  DollarSign,
  Clock,
  MapPin,
  Plus,
} from "lucide-react"

export default function Dashboard() {
  const [hasData, setHasData] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(
    typeof window !== "undefined" ? localStorage.getItem("onboardingComplete") === "true" : false,
  )

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white">Welcome back, Ana</h1>
            <p className="text-white/70 text-sm md:text-base mt-1">
              Here's what's happening with your business travel today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-white/10 hover:bg-white/20 text-white border-white/10">
              <Plus className="mr-2 h-4 w-4" />
              Quick Book
            </Button>
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Onboarding Card */}
        {!onboardingComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border border-white/10 bg-gradient-to-r from-white/5 to-white/10">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Complete your setup</h3>
                      <p className="text-white/70 text-sm mt-1">
                        Finish setting up your travel preferences to get personalized recommendations
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={60} className="w-32 h-2" />
                        <span className="text-xs text-white/50">60% complete</span>
                      </div>
                    </div>
                  </div>
                  <Button asChild className="bg-white text-black hover:bg-white/90">
                    <Link href="/onboarding">Continue Setup</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Dashboard Content */}
        {!hasData ? <EmptyDashboard /> : <PopulatedDashboard />}
      </div>
    </div>
  )
}

function EmptyDashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                  <Plane className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Book Flight</h3>
                  <p className="text-sm text-white/70">Find and book flights</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                  <Building2 className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Find Hotels</h3>
                  <p className="text-sm text-white/70">Search accommodations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                  <CreditCard className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Add Expense</h3>
                  <p className="text-sm text-white/70">Track your spending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
                  <BarChart2 className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">View Reports</h3>
                  <p className="text-sm text-white/70">Analyze your data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Feature Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-xl text-white">Explore Suitpax Features</CardTitle>
            <CardDescription className="text-white/70">
              Discover powerful tools to streamline your business travel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="travel" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/5">
                <TabsTrigger
                  value="travel"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                >
                  Travel
                </TabsTrigger>
                <TabsTrigger
                  value="expenses"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                >
                  Expenses
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                >
                  AI Tools
                </TabsTrigger>
              </TabsList>

              <TabsContent value="travel" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FeatureCard
                    icon={<Plane className="h-6 w-6" />}
                    title="Smart Booking"
                    description="AI-powered flight and hotel recommendations based on your preferences"
                    badge="Popular"
                  />
                  <FeatureCard
                    icon={<Calendar className="h-6 w-6" />}
                    title="Itinerary Management"
                    description="Organize and share your travel plans with team members"
                  />
                  <FeatureCard
                    icon={<MapPin className="h-6 w-6" />}
                    title="Destination Insights"
                    description="Get local information and travel tips for your destinations"
                  />
                </div>
              </TabsContent>

              <TabsContent value="expenses" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FeatureCard
                    icon={<Receipt className="h-6 w-6" />}
                    title="Receipt Scanning"
                    description="Automatically capture and categorize your expenses"
                    badge="New"
                  />
                  <FeatureCard
                    icon={<CreditCard className="h-6 w-6" />}
                    title="Corporate Cards"
                    description="Manage company credit cards and track spending"
                  />
                  <FeatureCard
                    icon={<FileText className="h-6 w-6" />}
                    title="Expense Reports"
                    description="Generate detailed reports for accounting and reimbursement"
                  />
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FeatureCard
                    icon={<BarChart2 className="h-6 w-6" />}
                    title="Spending Analytics"
                    description="Visualize your travel expenses with interactive charts"
                  />
                  <FeatureCard
                    icon={<TrendingUp className="h-6 w-6" />}
                    title="Cost Optimization"
                    description="Identify opportunities to reduce travel costs"
                    badge="Recommended"
                  />
                  <FeatureCard
                    icon={<Users className="h-6 w-6" />}
                    title="Team Insights"
                    description="Compare travel patterns across your organization"
                  />
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FeatureCard
                    icon={<Sparkles className="h-6 w-6" />}
                    title="Travel Assistant"
                    description="Get personalized recommendations and travel advice"
                    badge="AI"
                  />
                  <FeatureCard
                    icon={<Compass className="h-6 w-6" />}
                    title="Route Optimization"
                    description="Find the most efficient routes for multi-city trips"
                  />
                  <FeatureCard
                    icon={<Clock className="h-6 w-6" />}
                    title="Smart Scheduling"
                    description="Automatically schedule meetings around your travel"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card className="border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                <Sparkles className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">AI Travel Assistant</h3>
                <p className="text-white/70 text-sm">Get intelligent travel recommendations</p>
              </div>
            </div>
            <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <Link href="/ai-agents">
                Explore AI Features <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                <Compass className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Destination Explorer</h3>
                <p className="text-white/70 text-sm">Discover new business travel destinations</p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              <Link href="/destinations">
                Explore Destinations <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function PopulatedDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Upcoming Trips</CardTitle>
            <Plane className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-white/70">Next: London, Jun 15-18</p>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                2 days away
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Pending Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$4,320</div>
            <p className="text-xs text-white/70">12 receipts to review</p>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                Action needed
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Travel Budget</CardTitle>
            <BarChart2 className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$24,500</div>
            <p className="text-xs text-white/70">68% of quarterly budget</p>
            <Progress value={68} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Pending Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">7</div>
            <p className="text-xs text-white/70">3 high priority</p>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                High priority
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  badge,
}: {
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
}) {
  return (
    <Card className="border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">{icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-white text-sm">{title}</h4>
              {badge && (
                <Badge variant="secondary" className="text-xs bg-white/10 text-white/70">
                  {badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-white/70">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
