"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  PiCreditCard,
  PiTrendUp,
  PiTrendDown,
  PiWarning,
  PiCheckCircle,
  PiPlus,
  PiCalendar,
  PiTarget,
  PiWallet,
} from "react-icons/pi"

export default function BudgetsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const budgets = [
    {
      id: "b1",
      department: "Sales",
      allocated: 45000,
      spent: 38200,
      remaining: 6800,
      utilization: 85,
      status: "on-track",
      period: "Q4 2024",
      lastUpdated: "2 hours ago",
    },
    {
      id: "b2",
      department: "Marketing",
      allocated: 32000,
      spent: 34100,
      remaining: -2100,
      utilization: 107,
      status: "over-budget",
      period: "Q4 2024",
      lastUpdated: "1 day ago",
    },
    {
      id: "b3",
      department: "Engineering",
      allocated: 28000,
      spent: 19500,
      remaining: 8500,
      utilization: 70,
      status: "under-budget",
      period: "Q4 2024",
      lastUpdated: "3 hours ago",
    },
    {
      id: "b4",
      department: "Operations",
      allocated: 25000,
      spent: 24200,
      remaining: 800,
      utilization: 97,
      status: "at-risk",
      period: "Q4 2024",
      lastUpdated: "5 hours ago",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on-track":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-light">
            <PiCheckCircle className="h-3 w-3 mr-1" />
            On Track
          </Badge>
        )
      case "at-risk":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 font-light">
            <PiWarning className="h-3 w-3 mr-1" />
            At Risk
          </Badge>
        )
      case "over-budget":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-light">
            <PiTrendUp className="h-3 w-3 mr-1" />
            Over Budget
          </Badge>
        )
      case "under-budget":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-light">
            <PiTrendDown className="h-3 w-3 mr-1" />
            Under Budget
          </Badge>
        )
      default:
        return <Badge className="bg-white/10 text-white/70 border-white/20 font-light">{status}</Badge>
    }
  }

  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const totalRemaining = totalAllocated - totalSpent

  return (
    <div className="min-h-screen bg-background text-foreground p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tighter">Budget Management</h1>
            <p className="text-muted-foreground text-sm font-light">Track and manage travel budgets</p>
          </div>
          <Button className="font-light">
            <PiPlus className="h-4 w-4 mr-2" />
            Create Budget
          </Button>
        </div>

        {/* Empty State */}
        {budgets.length === 0 ? (
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="font-light tracking-tighter text-lg">Travel Budgets</CardTitle>
            </CardHeader>
            <CardContent className="py-8">
              <div className="text-center">
                <PiWallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No budgets created yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first budget to start tracking travel expenses.
                </p>
                <Button>
                  <PiPlus className="h-4 w-4 mr-2" />
                  Create Budget
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Period Selector */}
            <div className="flex gap-2">
              {["month", "quarter", "year"].map((period) => (
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
                  <PiCalendar className="h-4 w-4 mr-2" />
                  {period}
                </Button>
              ))}
            </div>

            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <PiTarget className="h-5 w-5 text-blue-400" />
                    <span className="text-xs text-blue-400 font-light">Allocated</span>
                  </div>
                  <div>
                    <p className="text-2xl font-light text-white mb-1">${totalAllocated.toLocaleString()}</p>
                    <p className="text-xs text-white/50 font-light">Total Budget</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <PiCreditCard className="h-5 w-5 text-orange-400" />
                    <span className="text-xs text-orange-400 font-light">
                      {((totalSpent / totalAllocated) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-light text-white mb-1">${totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-white/50 font-light">Total Spent</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    {totalRemaining >= 0 ? (
                      <PiTrendDown className="h-5 w-5 text-green-400" />
                    ) : (
                      <PiTrendUp className="h-5 w-5 text-red-400" />
                    )}
                    <span className={`text-xs font-light ${totalRemaining >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {totalRemaining >= 0 ? "Remaining" : "Over"}
                    </span>
                  </div>
                  <div>
                    <p className={`text-2xl font-light mb-1 ${totalRemaining >= 0 ? "text-white" : "text-red-400"}`}>
                      ${Math.abs(totalRemaining).toLocaleString()}
                    </p>
                    <p className="text-xs text-white/50 font-light">Budget Balance</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Department Budgets */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="py-3">
                <CardTitle className="text-white font-light tracking-tighter text-lg">Department Budgets</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="space-y-4">
                  {budgets.map((budget) => (
                    <div
                      key={budget.id}
                      className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-light text-white text-lg">{budget.department}</h3>
                          {getStatusBadge(budget.status)}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white/70 font-light">{budget.period}</p>
                          <p className="text-xs text-white/50 font-light">Updated {budget.lastUpdated}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-white/50 font-light mb-1">Allocated</p>
                          <p className="text-lg font-light text-white">${budget.allocated.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/50 font-light mb-1">Spent</p>
                          <p className="text-lg font-light text-white">${budget.spent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/50 font-light mb-1">Remaining</p>
                          <p className={`text-lg font-light ${budget.remaining >= 0 ? "text-white" : "text-red-400"}`}>
                            ${Math.abs(budget.remaining).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/50 font-light mb-1">Utilization</p>
                          <p
                            className={`text-lg font-light ${budget.utilization <= 100 ? "text-white" : "text-red-400"}`}
                          >
                            {budget.utilization}%
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-white/70">
                          <span className="font-light">Budget Utilization</span>
                          <span className="font-light">{budget.utilization}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              budget.utilization <= 80
                                ? "bg-green-400"
                                : budget.utilization <= 95
                                  ? "bg-yellow-400"
                                  : "bg-red-400"
                            }`}
                            style={{ width: `${Math.min(budget.utilization, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
