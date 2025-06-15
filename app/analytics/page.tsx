"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PiChartBar, PiTrendUp, PiTrendDown, PiDownload, PiFunnel } from "react-icons/pi"

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const metrics = [
    {
      title: "Total Travel Spend",
      value: "$0",
      change: "0%",
      trend: "neutral",
      period: "vs last month",
    },
    {
      title: "Cost per Trip",
      value: "$0",
      change: "0%",
      trend: "neutral",
      period: "vs last month",
    },
    {
      title: "Booking Lead Time",
      value: "0 days",
      change: "0%",
      trend: "neutral",
      period: "average",
    },
    {
      title: "Policy Compliance",
      value: "0%",
      change: "0%",
      trend: "neutral",
      period: "this month",
    },
  ]

  const topDestinations: any[] = []
  const travelPatterns: any[] = []

  return (
    <div className="min-h-screen bg-background text-foreground p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tighter">Travel Analytics</h1>
            <p className="text-muted-foreground text-sm font-light">Insights and trends from your travel data</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-light">
              <PiFunnel className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="font-light">
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
              className="capitalize text-sm font-light"
            >
              {period}
            </Button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <PiChartBar className="h-5 w-5 text-muted-foreground" />
                  <div className="flex items-center gap-1">
                    {metric.trend === "up" ? (
                      <PiTrendUp className="h-4 w-4 text-green-500" />
                    ) : metric.trend === "down" ? (
                      <PiTrendDown className="h-4 w-4 text-red-500" />
                    ) : null}
                    <span className={`text-xs font-light text-muted-foreground`}>{metric.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-light mb-1">{metric.value}</p>
                  <p className="text-xs text-muted-foreground font-light">{metric.title}</p>
                  <p className="text-xs text-muted-foreground font-light">{metric.period}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="font-light tracking-tighter text-lg">Travel Data</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="text-center">
              <PiChartBar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No travel data yet</h3>
              <p className="text-muted-foreground mb-4">Start booking trips to see analytics and insights here.</p>
              <Button>Book Your First Trip</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
