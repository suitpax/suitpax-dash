"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PiChartBar, PiTrendUp, PiTrendDown, PiDownload, PiFilter } from "react-icons/pi"

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const metrics = [
    {
      title: "Total Travel Spend",
      value: "$124,580",
      change: "+12.5%",
      trend: "up",
      period: "vs last month",
    },
    {
      title: "Cost per Trip",
      value: "$2,847",
      change: "-8.2%",
      trend: "down",
      period: "vs last month",
    },
    {
      title: "Booking Lead Time",
      value: "14.2 days",
      change: "+2.1%",
      trend: "up",
      period: "average",
    },
    {
      title: "Policy Compliance",
      value: "94.7%",
      change: "+1.8%",
      trend: "up",
      period: "this month",
    },
  ]

  const topDestinations = [
    { city: "New York", trips: 24, spend: "$45,200", savings: "12%" },
    { city: "London", trips: 18, spend: "$38,900", savings: "8%" },
    { city: "Tokyo", trips: 15, spend: "$42,100", savings: "15%" },
    { city: "Paris", trips: 12, spend: "$28,400", savings: "6%" },
    { city: "Singapore", trips: 9, spend: "$31,200", savings: "11%" },
  ]

  const travelPatterns = [
    { category: "Business Meetings", percentage: 45, color: "bg-blue-500" },
    { category: "Conferences", percentage: 28, color: "bg-purple-500" },
    { category: "Training", percentage: 15, color: "bg-green-500" },
    { category: "Client Visits", percentage: 12, color: "bg-orange-500" },
  ]

  return (
    <div className="min-h-screen bg-black text-white p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tighter text-white">Travel Analytics</h1>
            <p className="text-white/70 text-sm font-light">Insights and trends from your travel data</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-transparent border-white/20 text-white/70 hover:bg-white/10 font-light"
            >
              <PiFilter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-white text-black hover:bg-white/90 font-light">
              <PiDownload className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {["week", "month", "quarter", "year"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              onClick={() => setSelectedPeriod(period)}
              className={`capitalize text-sm font-light ${
                selectedPeriod === period
                  ? "bg-white text-black hover:bg-white/90"
                  : "border-white/20 text-white/70 hover:bg-white/10"
              }`}
            >
              {period}
            </Button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <PiChartBar className="h-5 w-5 text-white/50" />
                  <div className="flex items-center gap-1">
                    {metric.trend === "up" ? (
                      <PiTrendUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <PiTrendDown className="h-4 w-4 text-red-400" />
                    )}
                    <span className={`text-xs font-light ${metric.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-light text-white mb-1">{metric.value}</p>
                  <p className="text-xs text-white/50 font-light">{metric.title}</p>
                  <p className="text-xs text-white/40 font-light">{metric.period}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Destinations */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="py-3">
            <CardTitle className="text-white font-light tracking-tighter text-lg">Top Destinations</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-3">
              {topDestinations.map((destination, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-light text-white">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-light text-white">{destination.city}</h3>
                      <p className="text-xs text-white/50 font-light">{destination.trips} trips</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-light text-white">{destination.spend}</p>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs font-light">
                      {destination.savings} saved
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Travel Patterns */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="py-3">
            <CardTitle className="text-white font-light tracking-tighter text-lg">Travel Purpose Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-4">
              {travelPatterns.map((pattern, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-light text-white">{pattern.category}</span>
                    <span className="text-sm font-light text-white/70">{pattern.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`${pattern.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${pattern.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
