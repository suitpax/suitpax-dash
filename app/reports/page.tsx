"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PiFileText, PiFunnel, PiPlus } from "react-icons/pi"

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const reports: any[] = []
  const reportTemplates = [
    { name: "Executive Summary", description: "High-level travel metrics for leadership" },
    { name: "Department Breakdown", description: "Travel costs and patterns by department" },
    { name: "Traveler Profile", description: "Individual travel behavior analysis" },
    { name: "Budget vs Actual", description: "Budget performance and variance analysis" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tighter">Reports & Analytics</h1>
            <p className="text-muted-foreground text-sm font-light">Generate and manage travel reports</p>
          </div>
          <Button className="font-light">
            <PiPlus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="py-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search reports..."
                  className="font-light"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 text-sm bg-background border border-input rounded-lg font-light"
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
                <Button variant="outline" className="font-light">
                  <PiFunnel className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="font-light tracking-tighter text-lg">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="text-center">
              <PiFileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No reports generated yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate your first report to see travel insights and analytics.
              </p>
              <Button>
                <PiPlus className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="font-light tracking-tighter text-lg">Quick Templates</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTemplates.map((template, index) => (
                <Card key={index} className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <h3 className="font-light mb-2">{template.name}</h3>
                    <p className="text-sm text-muted-foreground font-light mb-3">{template.description}</p>
                    <Button size="sm" className="font-light">
                      Generate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
