"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-30-days")
  const [selectedMetric, setSelectedMetric] = useState("expenses")

  const metrics = [
    {
      title: "Total Expenses",
      value: "$45,230",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Average Trip Cost",
      value: "$1,847",
      change: "-3.2%",
      trend: "down",
      icon: TrendingDown,
    },
    {
      title: "Monthly Budget Usage",
      value: "68%",
      change: "+5.1%",
      trend: "up",
      icon: PieChart,
    },
    {
      title: "Cost per Employee",
      value: "$2,156",
      change: "+8.7%",
      trend: "up",
      icon: BarChart3,
    },
  ]

  const expenseCategories = [
    { name: "Flights", amount: 18500, percentage: 41 },
    { name: "Hotels", amount: 12300, percentage: 27 },
    { name: "Meals", amount: 8900, percentage: 20 },
    { name: "Transportation", amount: 3200, percentage: 7 },
    { name: "Other", amount: 2330, percentage: 5 },
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-medium tracking-tighter text-white">Analytics</h1>
              <p className="text-sm text-white/70 mt-1">Analyze your travel expenses and spending patterns</p>
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
            {["last-7-days", "last-30-days", "last-90-days", "this-year"].map((period) => (
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

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-black rounded-lg border border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <metric.icon className="h-4 w-4 text-white/70" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      metric.trend === "up" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {metric.change}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-white/70">{metric.title}</p>
                  <p className="text-xl font-bold text-white">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Expense Categories */}
          <Card className="bg-black rounded-lg border border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tighter text-white">Expense Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {expenseCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                        }}
                      />
                      <span className="text-sm text-white/70">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">${category.amount.toLocaleString()}</div>
                      <div className="text-xs text-white/50">{category.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card className="bg-black rounded-lg border border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tighter text-white">Monthly Trend</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-48 flex items-end justify-between gap-2">
                {[65, 78, 52, 89, 67, 94, 73, 85, 69, 91, 76, 88].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-white/10 rounded-t" style={{ height: `${height}%` }} />
                    <span className="text-xs text-white/50 mt-2">
                      {new Date(2024, index).toLocaleDateString("en", { month: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Card className="bg-black rounded-lg border border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium tracking-tighter text-white">Detailed Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Top Destinations</h4>
                <div className="space-y-2">
                  {["New York", "London", "Paris", "Tokyo", "Berlin"].map((city, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-white/70">{city}</span>
                      <span className="text-white">${(Math.random() * 5000 + 1000).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Top Spenders</h4>
                <div className="space-y-2">
                  {["John Smith", "Sarah Johnson", "Mike Davis", "Lisa Wilson", "Tom Brown"].map((name, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-white/70">{name}</span>
                      <span className="text-white">${(Math.random() * 3000 + 500).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Frequent Routes</h4>
                <div className="space-y-2">
                  {["NYC → LAX", "LHR → CDG", "NRT → ICN", "FRA → BCN", "DXB → SIN"].map((route, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-white/70">{route}</span>
                      <span className="text-white">{Math.floor(Math.random() * 20 + 5)} trips</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
