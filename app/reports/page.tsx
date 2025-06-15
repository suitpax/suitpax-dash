"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  PiFileText,
  PiDownload,
  PiCalendar,
  PiFilter,
  PiPlus,
  PiEye,
  PiShare,
  PiClock,
  PiCheckCircle,
} from "react-icons/pi"

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const reports = [
    {
      id: "rpt1",
      name: "Monthly Travel Expense Report",
      type: "Expense",
      period: "December 2024",
      status: "completed",
      generatedDate: "2024-12-15",
      size: "2.4 MB",
      format: "PDF",
      description: "Comprehensive breakdown of all travel expenses for December",
    },
    {
      id: "rpt2",
      name: "Q4 Travel Analytics Dashboard",
      type: "Analytics",
      period: "Q4 2024",
      status: "generating",
      generatedDate: "2024-12-16",
      size: "1.8 MB",
      format: "Excel",
      description: "Quarterly analysis of travel patterns and cost optimization",
    },
    {
      id: "rpt3",
      name: "Policy Compliance Summary",
      type: "Compliance",
      period: "November 2024",
      status: "completed",
      generatedDate: "2024-12-01",
      size: "856 KB",
      format: "PDF",
      description: "Travel policy adherence and exception analysis",
    },
    {
      id: "rpt4",
      name: "Carbon Footprint Assessment",
      type: "Sustainability",
      period: "2024 YTD",
      status: "scheduled",
      generatedDate: "2024-12-20",
      size: "1.2 MB",
      format: "PDF",
      description: "Environmental impact analysis of business travel",
    },
    {
      id: "rpt5",
      name: "Vendor Performance Review",
      type: "Vendor",
      period: "Q4 2024",
      status: "completed",
      generatedDate: "2024-12-10",
      size: "3.1 MB",
      format: "Excel",
      description: "Analysis of travel vendor performance and cost efficiency",
    },
  ]

  const reportTemplates = [
    { name: "Executive Summary", description: "High-level travel metrics for leadership" },
    { name: "Department Breakdown", description: "Travel costs and patterns by department" },
    { name: "Traveler Profile", description: "Individual travel behavior analysis" },
    { name: "Budget vs Actual", description: "Budget performance and variance analysis" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-light">
            <PiCheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "generating":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 font-light">
            <PiClock className="h-3 w-3 mr-1" />
            Generating
          </Badge>
        )
      case "scheduled":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-light">
            <PiCalendar className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        )
      default:
        return <Badge className="bg-white/10 text-white/70 border-white/20 font-light">{status}</Badge>
    }
  }

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === "all" || report.type.toLowerCase() === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-black text-white p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tighter text-white">Reports & Analytics</h1>
            <p className="text-white/70 text-sm font-light">Generate and manage travel reports</p>
          </div>
          <Button className="bg-white text-black hover:bg-white/90 font-light">
            <PiPlus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search reports..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-light"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white font-light"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="expense">Expense</option>
                  <option value="analytics">Analytics</option>
                  <option value="compliance">Compliance</option>
                  <option value="sustainability">Sustainability</option>
                  <option value="vendor">Vendor</option>
                </select>
                <Button
                  variant="outline"
                  className="bg-transparent border-white/20 text-white/70 hover:bg-white/10 font-light"
                >
                  <PiFilter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="py-3">
            <CardTitle className="text-white font-light tracking-tighter text-lg">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <PiFileText className="h-5 w-5 text-white/70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-light text-white">{report.name}</h3>
                          {getStatusBadge(report.status)}
                        </div>
                        <p className="text-sm text-white/70 font-light mb-2">{report.description}</p>
                        <div className="flex items-center gap-4 text-xs text-white/50">
                          <span className="font-light">{report.type}</span>
                          <span className="font-light">{report.period}</span>
                          <span className="font-light">{report.format}</span>
                          <span className="font-light">{report.size}</span>
                          <span className="font-light">Generated: {report.generatedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/50 hover:text-white hover:bg-white/10 p-2"
                        disabled={report.status !== "completed"}
                      >
                        <PiEye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/50 hover:text-white hover:bg-white/10 p-2"
                        disabled={report.status !== "completed"}
                      >
                        <PiDownload className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/50 hover:text-white hover:bg-white/10 p-2"
                        disabled={report.status !== "completed"}
                      >
                        <PiShare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="py-3">
            <CardTitle className="text-white font-light tracking-tighter text-lg">Quick Templates</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTemplates.map((template, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition-colors cursor-pointer"
                >
                  <h3 className="font-light text-white mb-2">{template.name}</h3>
                  <p className="text-sm text-white/70 font-light mb-3">{template.description}</p>
                  <Button size="sm" className="bg-white text-black hover:bg-white/90 font-light">
                    Generate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
