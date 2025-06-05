"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react"

export default function ExpenseReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-30-days")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const expenseData = {
    totalExpenses: 67830,
    monthlyChange: 12.5,
    averageExpense: 847,
    expensesByCategory: [
      { category: "Flights", amount: 28500, percentage: 42, change: 8.2 },
      { category: "Hotels", amount: 19200, percentage: 28, change: -3.1 },
      { category: "Meals", amount: 12400, percentage: 18, change: 15.6 },
      { category: "Transportation", amount: 5200, percentage: 8, change: 5.3 },
      { category: "Other", amount: 2530, percentage: 4, change: -2.1 },
    ],
    topSpenders: [
      { name: "John Smith", department: "Engineering", amount: 4200 },
      { name: "Sarah Johnson", department: "Sales", amount: 3800 },
      { name: "Mike Davis", department: "Marketing", amount: 3500 },
      { name: "Lisa Wilson", department: "Operations", amount: 3200 },
      { name: "Tom Brown", department: "Finance", amount: 2900 },
    ],
    monthlyTrend: [
      { month: "Jan", expenses: 52000 },
      { month: "Feb", expenses: 48000 },
      { month: "Mar", expenses: 65000 },
      { month: "Apr", expenses: 58000 },
      { month: "May", expenses: 67830 },
    ],
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-medium tracking-tighter text-white">Expense Reports</h1>
              <p className="text-sm text-white/70 mt-1">Detailed analysis of travel expenses and spending patterns</p>
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white/5 rounded-lg">
                  <DollarSign className="h-4 w-4 text-white/70" />
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />+{expenseData.monthlyChange}%
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70">Total Expenses</p>
                <p className="text-xl font-bold text-white">${expenseData.totalExpenses.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white/5 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-white/70" />
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-400">
                  <ArrowUpRight className="h-3 w-3" />
                  +5.2%
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70">Average Expense</p>
                <p className="text-xl font-bold text-white">${expenseData.averageExpense}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Calendar className="h-4 w-4 text-white/70" />
                </div>
                <div className="flex items-center gap-1 text-xs text-purple-400">
                  <ArrowUpRight className="h-3 w-3" />
                  +8.1%
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70">Monthly Growth</p>
                <p className="text-xl font-bold text-white">+12.5%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white/5 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white/70" />
                </div>
                <div className="flex items-center gap-1 text-xs text-orange-400">
                  <ArrowDownRight className="h-3 w-3" />
                  -2.3%
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70">Cost per Trip</p>
                <p className="text-xl font-bold text-white">$1,247</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Expense Categories */}
          <Card className="bg-black rounded-lg border border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tighter text-white">Expense Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {expenseData.expensesByCategory.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                        }}
                      />
                      <span className="text-sm text-white/70">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">${category.amount.toLocaleString()}</div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-white/50">{category.percentage}%</span>
                        <span className={category.change > 0 ? "text-emerald-400" : "text-red-400"}>
                          {category.change > 0 ? "+" : ""}
                          {category.change}%
                        </span>
                      </div>
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
                {expenseData.monthlyTrend.map((month, index) => {
                  const maxExpense = Math.max(...expenseData.monthlyTrend.map((m) => m.expenses))
                  const height = (month.expenses / maxExpense) * 100
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-white/10 rounded-t hover:bg-white/20 transition-colors cursor-pointer"
                        style={{ height: `${height}%` }}
                        title={`${month.month}: $${month.expenses.toLocaleString()}`}
                      />
                      <span className="text-xs text-white/50 mt-2">{month.month}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Spenders */}
        <Card className="bg-black rounded-lg border border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium tracking-tighter text-white">Top Spenders</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {expenseData.topSpenders.map((spender, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{spender.name}</div>
                      <div className="text-xs text-white/50">{spender.department}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">${spender.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
