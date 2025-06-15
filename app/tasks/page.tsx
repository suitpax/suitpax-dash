"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PiList, PiPlus, PiCheckCircle, PiClock, PiFunnel } from "react-icons/pi"

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const tasks: any[] = []

  return (
    <div className="min-h-screen bg-background text-foreground p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tighter">Task Management</h1>
            <p className="text-muted-foreground text-sm font-light">Organize and track your travel-related tasks</p>
          </div>
          <Button className="font-light">
            <PiPlus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="py-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search tasks..."
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
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <Button variant="outline" className="font-light">
                  <PiFunnel className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <PiList className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-light mb-1">0</p>
                <p className="text-xs text-muted-foreground font-light">Total Tasks</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <PiClock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-light mb-1">0</p>
                <p className="text-xs text-muted-foreground font-light">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <PiCheckCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-light mb-1">0</p>
                <p className="text-xs text-muted-foreground font-light">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-xs">%</span>
              </div>
              <div>
                <p className="text-2xl font-light mb-1">0%</p>
                <p className="text-xs text-muted-foreground font-light">Completion Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="font-light tracking-tighter text-lg">Your Tasks</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="text-center">
              <PiList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first task to start organizing your travel workflow.
              </p>
              <Button>
                <PiPlus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
