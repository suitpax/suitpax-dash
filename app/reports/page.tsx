"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Eye,
  Share,
  Plus,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
} from "lucide-react"

interface Report {
  id: string
  name: string
  type: "expense" | "travel" | "budget" | "compliance"
  period: string
  createdAt: string
  status: "ready" | "generating" | "scheduled"
  size: string
  format: "PDF" | "Excel" | "CSV"
}

const reports: Report[] = [
  {
    id: "1",
    name: "Monthly Expense Report - March 2024",
    type: "expense",
    period: "March 2024",
    createdAt: "2024-04-01",
    status: "ready",
    size: "2.4 MB",
    format: "PDF",
  },
  {
    id: "2",
    name: "Travel Analytics Q1 2024",
    type: "travel",
    period: "Q1 2024",
    createdAt: "2024-03-31",
    status: "ready",
    size: "1.8 MB",
    format: "Excel",
  },
  {
    id: "3",
    name: "Budget Utilization Report",
    type: "budget",
    period: "Q1 2024",
    createdAt: "2024-03-30",
    status: "generating",
    size: "-",
    format: "PDF",
  },
  {
    id: "4",
    name: "Compliance Audit Report",
    type: "compliance",
    period: "2024",
    createdAt: "2024-03-29",
    status: "ready",
    size: "3.1 MB",
    format: "PDF",
  },
  {
    id: "5",
    name: "Weekly Expense Summary",
    type: "expense",
    period: "Week 13, 2024",
    createdAt: "2024-03-28",
    status: "scheduled",
    size: "-",
    format: "CSV",
  },
]

const reportTemplates = [
  {
    name: "Expense Summary",
    description: "Detailed breakdown of all expenses by category and department",
    icon: BarChart3,
    type: "expense",
  },
  {
    name: "Travel Analytics",
    description: "Comprehensive analysis of travel patterns and costs",
    icon: TrendingUp,
    type: "travel",
  },
  {
    name: "Budget Performance",
    description: "Budget vs actual spending analysis with variance reports",
    icon: PieChart,
    type: "budget",
  },
  {
    name: "Compliance Report",
    description: "Policy compliance status and violation tracking",
    icon: FileText,
    type: "compliance",
  },
]

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "text-emerald-400"
      case "generating":
        return "text-amber-400"
      case "scheduled":
        return "text-blue-400"
      default:
        return "text-white/70"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "expense":
        return "bg-blue-500/20 text-blue-400"
      case "travel":
        return "bg-emerald-500/20 text-emerald-400"
      case "budget":
        return "bg-purple-500/20 text-purple-400"
      case "compliance":
        return "bg-amber-500/20 text-amber-400"
      default:
        return "bg-white/5 text-white/70"
    }
  }

  const filteredReports = selectedType === "all" ? reports : reports.filter((report) => report.type === selectedType)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-medium tracking-tighter text-white">Reports</h1>
              <p className="text-sm text-white/70 mt-1">Generate and manage your financial and travel reports</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/5 flex items-center gap-2"
            >
              <Plus size={14} />
              <span className="text-xs">Create Report</span>
            </Button>
          </div>
        </div>

        {/* Report Templates */}
        <Card className="bg-black rounded-lg border border-white/10 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium tracking-tighter text-white">Quick Reports</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTemplates.map((template, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <template.icon className="h-4 w-4 text-white/70" />
                    </div>
                    <h3 className="text-sm font-medium text-white">{template.name}</h3>
                  </div>
                  <p className="text-xs text-white/70">{template.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="bg-black rounded-lg border border-white/10 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {["all", "expense", "travel", "budget", "compliance"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedType === type ? "bg-white/10 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button className="px-3 py-1.5 rounded-lg border border-white/10 text-white hover:bg-white/5 flex items-center gap-2">
                <Filter size={14} />
                <span className="text-xs">Filter</span>
              </Button>
              <Button className="px-3 py-1.5 rounded-lg border border-white/10 text-white hover:bg-white/5 flex items-center gap-2">
                <Calendar size={14} />
                <span className="text-xs">Date Range</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <Card className="bg-black rounded-lg border border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium tracking-tighter text-white">Generated Reports</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-xs font-medium text-white/70">Report Name</th>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Type</th>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Period</th>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Created</th>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Status</th>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Size</th>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-white/50" />
                          <div>
                            <div className="font-medium text-white text-sm">{report.name}</div>
                            <div className="text-xs text-white/50">{report.format}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getTypeColor(
                            report.type,
                          )}`}
                        >
                          {report.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-white/70">{report.period}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-white/70">{new Date(report.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {report.status === "generating" && <Clock className="h-3 w-3" />}
                          <span className={`text-sm ${getStatusColor(report.status)}`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-white/70">{report.size}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {report.status === "ready" && (
                            <>
                              <Button className="p-1 text-white/50 hover:text-white hover:bg-white/5 rounded">
                                <Eye size={14} />
                              </Button>
                              <Button className="p-1 text-white/50 hover:text-white hover:bg-white/5 rounded">
                                <Download size={14} />
                              </Button>
                              <Button className="p-1 text-white/50 hover:text-white hover:bg-white/5 rounded">
                                <Share size={14} />
                              </Button>
                            </>
                          )}
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
