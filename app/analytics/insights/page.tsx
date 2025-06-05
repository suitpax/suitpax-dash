"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  Calendar,
  Users,
  Plane,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

export default function TravelInsightsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-90-days")

  const insightsData = {
    travelPatterns: {
      mostPopularDestinations: [
        { city: "London", trips: 45, avgCost: 890, trend: "up" },
        { city: "New York", trips: 38, avgCost: 1240, trend: "stable" },
        { city: "Paris", trips: 32, avgCost: 750, trend: "down" },
        { city: "Tokyo", trips: 28, avgCost: 1680, trend: "up" },
        { city: "Berlin", trips: 24, avgCost: 620, trend: "stable" },
      ],
      seasonalTrends: [
        { quarter: "Q1", trips: 89, cost: 125000 },
        { quarter: "Q2", trips: 142, cost: 198000 },
        { quarter: "Q3", trips: 156, cost: 234000 },
        { quarter: "Q4", trips: 134, cost: 187000 },
      ],
      peakTravelDays: ["Tuesday", "Wednesday", "Thursday"],
      avgAdvanceBooking: 18, // days
    },
    costOptimization: {
      potentialSavings: 45200,
      savingsOpportunities: [
        { type: "Early booking discounts", amount: 18500, impact: "high" },
        { type: "Policy compliance", amount: 12800, impact: "medium" },
        { type: "Preferred suppliers", amount: 8900, impact: "medium" },
        { type: "Route optimization", amount: 5000, impact: "low" },
      ],
    },
    travelCompliance: {
      policyCompliance: 87,
      commonViolations: [
        { violation: "Late booking fees", count: 23, cost: 4600 },
        { violation: "Non-preferred hotels", count: 18, cost: 3200 },
        { violation: "Upgrade without approval", count: 12, cost: 2400 },
      ],
    },
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-medium tracking-tighter text-white">Travel Insights</h1>
              <p className="text-sm text-white/70 mt-1">Discover patterns and opportunities in your travel data</p>
            </div>
            <div className="flex gap-2">
              <Button className="px-3 py-1.5 rounded-lg border border-white/10 text-white hover:bg-white/5 flex items-center gap-2">
                <Filter size={14} />
                <span className="text-xs">Filter</span>
              </Button>
              <Button className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/5 flex items-center gap-2">
                <Download size={14} />
                <span className="text-xs">Export</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-black rounded-lg border border-white/10 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {["last-30-days", "last-90-days", "last-6-months", "this-year"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  selectedPeriod === period ? "bg-white/10 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {period.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Key Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />
                  +12%
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70">Travel Efficiency</p>
                <p className="text-xl font-bold text-white">92%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Clock className="h-4 w-4 text-amber-400" />
                </div>
                <div className="flex items-center gap-1 text-xs text-red-400">
                  <ArrowDownRight className="h-3 w-3" />
                  -3 days
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70">Avg Booking Lead Time</p>
                <p className="text-xl font-bold text-white">{insightsData.travelPatterns.avgAdvanceBooking} days</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />
                  +5%
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70">Policy Compliance</p>
                <p className="text-xl font-bold text-white">{insightsData.travelCompliance.policyCompliance}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-purple-400" />
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />
                  $45K
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70">Potential Savings</p>
                <p className="text-xl font-bold text-white">
                  ${insightsData.costOptimization.potentialSavings.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Popular Destinations */}
          <Card className="bg-black rounded-lg border border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tighter text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Popular Destinations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {insightsData.travelPatterns.mostPopularDestinations.map((destination, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{destination.city}</div>
                        <div className="text-xs text-white/50">{destination.trips} trips</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-white text-sm">${destination.avgCost}</div>
                      <div className="flex items-center gap-1 text-xs">
                        {destination.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-400" />}
                        {destination.trend === "down" && <TrendingDown className="h-3 w-3 text-red-400" />}
                        <span className="text-white/50">avg cost</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Seasonal Trends */}
          <Card className="bg-black rounded-lg border border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tighter text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Seasonal Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-48 flex items-end justify-between gap-2">
                {insightsData.travelPatterns.seasonalTrends.map((quarter, index) => {
                  const maxTrips = Math.max(...insightsData.travelPatterns.seasonalTrends.map((q) => q.trips))
                  const height = (quarter.trips / maxTrips) * 100
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-white/10 rounded-t hover:bg-white/20 transition-colors cursor-pointer"
                        style={{ height: `${height}%` }}
                        title={`${quarter.quarter}: ${quarter.trips} trips, $${quarter.cost.toLocaleString()}`}
                      />
                      <div className="text-center mt-2">
                        <div className="text-xs text-white/50">{quarter.quarter}</div>
                        <div className="text-xs font-medium text-white">{quarter.trips}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Cost Optimization */}
          <Card className="bg-black rounded-lg border border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tighter text-white">
                Cost Optimization Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {insightsData.costOptimization.savingsOpportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          opportunity.impact === "high"
                            ? "bg-red-400"
                            : opportunity.impact === "medium"
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                        }`}
                      />
                      <div>
                        <div className="font-medium text-white text-sm">{opportunity.type}</div>
                        <div className="text-xs text-white/50">{opportunity.impact} impact</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-emerald-400">${opportunity.amount.toLocaleString()}</div>
                      <div className="text-xs text-white/50">potential savings</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Policy Compliance */}
          <Card className="bg-black rounded-lg border border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tighter text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Policy Violations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {insightsData.travelCompliance.commonViolations.map((violation, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium text-white text-sm">{violation.violation}</div>
                      <div className="text-xs text-white/50">{violation.count} occurrences</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-400">${violation.cost.toLocaleString()}</div>
                      <div className="text-xs text-white/50">total cost</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Travel Patterns Summary */}
        <Card className="bg-black rounded-lg border border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium tracking-tighter text-white">Travel Patterns Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">Peak Travel Days</span>
                </div>
                <div className="space-y-1">
                  {insightsData.travelPatterns.peakTravelDays.map((day, index) => (
                    <div key={index} className="text-sm text-white/70">
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Plane className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">Booking Behavior</span>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-white/70">
                    Avg lead time: {insightsData.travelPatterns.avgAdvanceBooking} days
                  </div>
                  <div className="text-sm text-white/70">Last-minute bookings: 23%</div>
                  <div className="text-sm text-white/70">Early bookings: 34%</div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-white">Traveler Insights</span>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-white/70">Active travelers: 89</div>
                  <div className="text-sm text-white/70">Frequent travelers: 23</div>
                  <div className="text-sm text-white/70">New travelers: 12</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
