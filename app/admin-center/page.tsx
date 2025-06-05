"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  BarChart3,
  PieChart,
  Filter,
  Download,
} from "lucide-react"

interface CostCenter {
  id: string
  name: string
  code: string
  budget: number
  spent: number
  department: string
  manager: string
  employees: number
  status: "active" | "inactive"
}

const costCenters: CostCenter[] = [
  {
    id: "1",
    name: "Engineering",
    code: "ENG-001",
    budget: 50000,
    spent: 32500,
    department: "Technology",
    manager: "John Smith",
    employees: 25,
    status: "active",
  },
  {
    id: "2",
    name: "Sales",
    code: "SAL-001",
    budget: 75000,
    spent: 45000,
    department: "Sales",
    manager: "Sarah Johnson",
    employees: 18,
    status: "active",
  },
  {
    id: "3",
    name: "Marketing",
    code: "MKT-001",
    budget: 40000,
    spent: 28000,
    department: "Marketing",
    manager: "Mike Davis",
    employees: 12,
    status: "active",
  },
  {
    id: "4",
    name: "HR",
    code: "HR-001",
    budget: 25000,
    spent: 15000,
    department: "Human Resources",
    manager: "Lisa Wilson",
    employees: 8,
    status: "active",
  },
]

export default function AdminCenterPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-month")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const totalBudget = costCenters.reduce((sum, center) => sum + center.budget, 0)
  const totalSpent = costCenters.reduce((sum, center) => sum + center.spent, 0)
  const totalEmployees = costCenters.reduce((sum, center) => sum + center.employees, 0)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-medium tracking-tighter text-white">Admin Center</h1>
              <p className="text-sm text-white/70 mt-1">Manage cost centers, budgets, and financial controls</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/5 flex items-center gap-2"
              >
                <Plus size={14} />
                <span className="text-xs">New Cost Center</span>
              </Button>
              <Button className="px-3 py-1.5 rounded-lg border border-white/10 text-white hover:bg-white/5 flex items-center gap-2">
                <Download size={14} />
                <span className="text-xs">Export</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/70">Total Budget</p>
                  <p className="text-xl font-bold text-white">${totalBudget.toLocaleString()}</p>
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
                  <p className="text-xs font-medium text-white/70">Total Spent</p>
                  <p className="text-xl font-bold text-white">${totalSpent.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white/70" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/70">Cost Centers</p>
                  <p className="text-xl font-bold text-white">{costCenters.length}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <Building2 className="h-5 w-5 text-white/70" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black rounded-lg border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/70">Total Employees</p>
                  <p className="text-xl font-bold text-white">{totalEmployees}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <Users className="h-5 w-5 text-white/70" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-black rounded-lg border border-white/10 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="current-month" className="bg-black text-white">
                  Current Month
                </option>
                <option value="last-month" className="bg-black text-white">
                  Last Month
                </option>
                <option value="quarter" className="bg-black text-white">
                  This Quarter
                </option>
                <option value="year" className="bg-black text-white">
                  This Year
                </option>
              </select>
              <Button className="px-3 py-1.5 rounded-lg border border-white/10 text-white hover:bg-white/5 flex items-center gap-2">
                <Filter size={14} />
                <span className="text-xs">Filter</span>
              </Button>
            </div>
            <div className="flex gap-2">
              <Button className="px-3 py-1.5 rounded-lg border border-white/10 text-white hover:bg-white/5 flex items-center gap-2">
                <BarChart3 size={14} />
                <span className="text-xs">Analytics</span>
              </Button>
              <Button className="px-3 py-1.5 rounded-lg border border-white/10 text-white hover:bg-white/5 flex items-center gap-2">
                <PieChart size={14} />
                <span className="text-xs">Reports</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Cost Centers Table */}
        <Card className="bg-black rounded-lg border border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium tracking-tighter text-white">Cost Centers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-xs font-medium text-white/70">Name</th>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Code</th>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Department</th>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Manager</th>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Budget</th>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Spent</th>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Employees</th>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Status</th>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {costCenters.map((center) => (
                    <tr key={center.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-4">
                        <div className="font-medium text-white text-sm">{center.name}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-white/70">{center.code}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-white/70">{center.department}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-white/70">{center.manager}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-white">${center.budget.toLocaleString()}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-white">${center.spent.toLocaleString()}</span>
                          <div className="w-full bg-white/10 rounded-full h-1 mt-1">
                            <div
                              className="bg-white/70 h-1 rounded-full"
                              style={{ width: `${(center.spent / center.budget) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-white/70">{center.employees}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            center.status === "active" ? "bg-white/10 text-white" : "bg-white/5 text-white/50"
                          }`}
                        >
                          {center.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button className="p-1 text-white/50 hover:text-white hover:bg-white/5 rounded">
                            <Edit size={14} />
                          </Button>
                          <Button className="p-1 text-white/50 hover:text-white hover:bg-white/5 rounded">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
