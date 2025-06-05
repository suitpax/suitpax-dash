"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, TrendingUp, AlertTriangle, DollarSign, Calendar, Download, Filter, CheckCircle } from "lucide-react"

export default function BudgetTrackingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-quarter")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const budgetData = {
    overallBudget: {
      allocated: 500000,
      spent: 342500,
      remaining: 157500,
      utilizationRate: 68.5,
      projectedSpend: 485000,
    },
    departmentBudgets: [
      {
        department: "Engineering",
        allocated: 150000,
        spent: 102000,
        remaining: 48000,
        utilization: 68,
        status: "on-track",
        variance: 2.5,
      },
      {
        department: "Sales",
        allocated: 200000,
        spent: 165000,
        remaining: 35000,
        utilization: 82.5,
        status: "warning",
        variance: 12.5,
      },
      {
        department: "Marketing",
        allocated: 100000,
        spent: 55000,
        remaining: 45000,
        utilization: 55,
        status: "under",
        variance: -15,
      },
      {
        department: "Operations",
        allocated: 50000,
        spent: 20500,
        remaining: 29500,
        utilization: 41,
        status: "under",
        variance: -24,
      },
    ],
    monthlyTracking: [
      { month: "Jan", budgeted: 125000, actual: 118000, variance: -7000 },
      { month: "Feb", budgeted: 125000, actual: 142000, variance: 17000 },
      { month: "Mar", budgeted: 125000, actual: 138000, variance: 13000 },
      { month: "Apr", budgeted: 125000, actual: 105000, variance: -20000 },
    ],
    alerts: [
      {
        type: "warning",
        message: "Sales department is 82% through budget with 2 months remaining",
        department: "Sales",
        severity: "high",
      },
      {
        type: "info",
        message: "Marketing department is significantly under budget",
        department: "Marketing",
        severity: "low",
      },
      {
        type: "success",
        message: "Engineering department maintaining healthy spending rate",
        department: "Engineering",
        severity: "low",
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "text-emerald-400"
      case "warning":
        return "text-amber-400"
      case "over":
        return "text-red-400"
      case "under":
        return "text-blue-400"
      default:
        return "text-white/70"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-track":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
      case "over":
        return <AlertTriangle className="h-4 w-4" />
      case "under":
        return <TrendingUp className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-medium tracking-tighter text-white">Budget Tracking</h1>
              <p className="text-sm text-white/70 mt-1">Monitor budget utilization and variance across departments</p>
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

        {/* Period and Department Selectors */}
        <div className="bg-black rounded-lg border border-white/10 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-white/70 py-1.5">Period:</span>
              {["current-quarter", "current-year", "last-quarter", "custom"].map((period) => (
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
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-white/70 py-1.5">Department:</span>
              {["all", "engineering", "sales", "marketing", "operations"].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedDepartment === dept
                      ? "bg-white/10 text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overall Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Target className="h-4 w-4 text-white/70" />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70">Total Allocated</p>
                <p className="text-xl font-bold text-white">${budgetData.overallBudget.allocated.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white/5 rounded-lg">
                  <DollarSign className="h-4 w-4 text-white/70" />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70">Total Spent</p>
                <p className="text-xl font-bold text-white">${budgetData.overallBudget.spent.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white/5 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white/70" />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70">Remaining</p>
                <p className="text-xl font-bold text-white">${budgetData.overallBudget.remaining.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white/5 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-white/70" />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70">Utilization</p>
                <p className="text-xl font-bold text-white">{budgetData.overallBudget.utilizationRate}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Calendar className="h-4 w-4 text-white/70" />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70">Projected</p>
                <p className="text-xl font-bold text-white">
                  ${budgetData.overallBudget.projectedSpend.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Alerts */}
        <Card className="bg-black rounded-lg border border-white/10 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium tracking-tighter text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Budget Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {budgetData.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    alert.type === "warning"
                      ? "bg-amber-500/10 border-amber-500/20"
                      : alert.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/20"
                        : "bg-blue-500/10 border-blue-500/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          alert.type === "warning"
                            ? "bg-amber-400"
                            : alert.type === "success"
                              ? "bg-emerald-400"
                              : "bg-blue-400"
                        }`}
                      />
                      <span className="text-sm text-white">{alert.message}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50">{alert.department}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          alert.severity === "high" ? "bg-red-500/20 text-red-400" : "bg-white/5 text-white/70"
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Department Budget Breakdown */}
          <Card className="bg-black rounded-lg border border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tighter text-white">Department Budgets</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {budgetData.departmentBudgets.map((dept, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white">{dept.department}</h4>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(dept.status)}
                          <span className={`text-sm ${getStatusColor(dept.status)}`}>
                            {dept.status.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">{dept.utilization}%</div>
                        <div className={`text-xs ${dept.variance > 0 ? "text-red-400" : "text-emerald-400"}`}>
                          {dept.variance > 0 ? "+" : ""}
                          {dept.variance}%
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Allocated:</span>
                        <span className="text-white">${dept.allocated.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Spent:</span>
                        <span className="text-white">${dept.spent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Remaining:</span>
                        <span className="text-white">${dept.remaining.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${
                            dept.utilization > 85
                              ? "bg-red-400"
                              : dept.utilization > 70
                                ? "bg-amber-400"
                                : "bg-emerald-400"
                          }`}
                          style={{ width: `${dept.utilization}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Tracking */}
          <Card className="bg-black rounded-lg border border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tighter text-white">Monthly Tracking</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-48 flex items-end justify-between gap-2 mb-4">
                {budgetData.monthlyTracking.map((month, index) => {
                  const maxAmount = Math.max(...budgetData.monthlyTracking.flatMap((m) => [m.budgeted, m.actual]))
                  const budgetedHeight = (month.budgeted / maxAmount) * 100
                  const actualHeight = (month.actual / maxAmount) * 100
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-1">
                        <div
                          className="flex-1 bg-white/20 rounded-t"
                          style={{ height: `${budgetedHeight}%` }}
                          title={`Budgeted: $${month.budgeted.toLocaleString()}`}
                        />
                        <div
                          className={`flex-1 rounded-t ${month.variance > 0 ? "bg-red-400" : "bg-emerald-400"}`}
                          style={{ height: `${actualHeight}%` }}
                          title={`Actual: $${month.actual.toLocaleString()}`}
                        />
                      </div>
                      <span className="text-xs text-white/50 mt-2">{month.month}</span>
                    </div>
                  )
                })}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-white/20 rounded"></div>
                  <span className="text-white/70">Budgeted</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-emerald-400 rounded"></div>
                  <span className="text-white/70">Actual (Under)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-red-400 rounded"></div>
                  <span className="text-white/70">Actual (Over)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Forecast */}
        <Card className="bg-black rounded-lg border border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium tracking-tighter text-white">Budget Forecast</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-white">On Track</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400 mb-1">
                  {budgetData.departmentBudgets.filter((d) => d.status === "on-track").length}
                </div>
                <div className="text-xs text-white/50">departments</div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium text-white">At Risk</span>
                </div>
                <div className="text-2xl font-bold text-amber-400 mb-1">
                  {budgetData.departmentBudgets.filter((d) => d.status === "warning").length}
                </div>
                <div className="text-xs text-white/50">departments</div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">Under Budget</span>
                </div>
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {budgetData.departmentBudgets.filter((d) => d.status === "under").length}
                </div>
                <div className="text-xs text-white/50">departments</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
