"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, AlertTriangle, CheckCircle, Plus, Edit, Calendar, Target, PieChart } from "lucide-react"

interface Budget {
  id: string
  name: string
  category: string
  allocated: number
  spent: number
  period: string
  status: "on-track" | "warning" | "over-budget"
  department: string
}

const budgets: Budget[] = [
  {
    id: "1",
    name: "Q1 Travel Budget",
    category: "Travel",
    allocated: 50000,
    spent: 32500,
    period: "Q1 2024",
    status: "on-track",
    department: "Engineering",
  },
  {
    id: "2",
    name: "Sales Conference",
    category: "Events",
    allocated: 25000,
    spent: 23800,
    period: "March 2024",
    status: "warning",
    department: "Sales",
  },
  {
    id: "3",
    name: "Marketing Travel",
    category: "Travel",
    allocated: 15000,
    spent: 16200,
    period: "Q1 2024",
    status: "over-budget",
    department: "Marketing",
  },
  {
    id: "4",
    name: "Training & Development",
    category: "Training",
    allocated: 30000,
    spent: 18500,
    period: "2024",
    status: "on-track",
    department: "HR",
  },
]

export default function BudgetsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("current-quarter")

  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const utilizationRate = (totalSpent / totalAllocated) * 100

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "text-emerald-400"
      case "warning":
        return "text-amber-400"
      case "over-budget":
        return "text-red-400"
      default:
        return "text-white/70"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-track":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "over-budget":
        return <AlertTriangle className="h-4 w-4" />
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
              <h1 className="text-xl sm:text-2xl font-medium tracking-tighter text-white">Budget Management</h1>
              <p className="text-sm text-white/70 mt-1">Track and manage your travel budgets and spending limits</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/5 flex items-center gap-2"
            >
              <Plus size={14} />
              <span className="text-xs">Create Budget</span>
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/70">Total Allocated</p>
                  <p className="text-xl font-bold text-white">${totalAllocated.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <Target className="h-5 w-5 text-white/70" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/70">Total Spent</p>
                  <p className="text-xl font-bold text-white">${totalSpent.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <DollarSign className="h-5 w-5 text-white/70" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/70">Utilization Rate</p>
                  <p className="text-xl font-bold text-white">{utilizationRate.toFixed(1)}%</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <PieChart className="h-5 w-5 text-white/70" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/70">Active Budgets</p>
                  <p className="text-xl font-bold text-white">{budgets.length}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <Calendar className="h-5 w-5 text-white/70" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Period Filter */}
        <div className="bg-black rounded-lg border border-white/10 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
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
        </div>

        {/* Budgets List */}
        <div className="space-y-4">
          {budgets.map((budget) => (
            <Card key={budget.id} className="bg-black rounded-lg border border-white/10">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-medium text-white">{budget.name}</h3>
                      <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-white/70">
                        {budget.category}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-white/70">
                        {budget.department}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <span>Period: {budget.period}</span>
                      <span>
                        Spent: ${budget.spent.toLocaleString()} / ${budget.allocated.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-medium ${getStatusColor(budget.status)}`}>
                          {budget.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                        <span className={getStatusColor(budget.status)}>{getStatusIcon(budget.status)}</span>
                      </div>
                      <div className="w-32 bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            budget.status === "over-budget"
                              ? "bg-red-400"
                              : budget.status === "warning"
                                ? "bg-amber-400"
                                : "bg-emerald-400"
                          }`}
                          style={{
                            width: `${Math.min((budget.spent / budget.allocated) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <Button className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded">
                      <Edit size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
