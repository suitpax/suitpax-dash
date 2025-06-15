"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react"
import AIQuickInput from "@/components/ui/ai-quick-input"

interface Task {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "todo" | "in-progress" | "completed"
  assignee: string
  dueDate: string
  category: "travel" | "expense" | "meeting" | "general"
}

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Book flight to London",
      description: "Find and book business class flight for client meeting",
      priority: "high",
      status: "todo",
      assignee: "Alberto",
      dueDate: "2024-12-20",
      category: "travel",
    },
    {
      id: "2",
      title: "Submit expense report",
      description: "Upload receipts from NYC business trip",
      priority: "medium",
      status: "in-progress",
      assignee: "Alberto",
      dueDate: "2024-12-18",
      category: "expense",
    },
    {
      id: "3",
      title: "Schedule team meeting",
      description: "Coordinate Q1 planning session with all stakeholders",
      priority: "medium",
      status: "completed",
      assignee: "Sarah",
      dueDate: "2024-12-15",
      category: "meeting",
    },
    {
      id: "4",
      title: "Review hotel bookings",
      description: "Confirm accommodations for upcoming business trips",
      priority: "low",
      status: "todo",
      assignee: "Mike",
      dueDate: "2024-12-22",
      category: "travel",
    },
  ])

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || task.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === "completed" ? "todo" : task.status === "todo" ? "in-progress" : "completed"
          return { ...task, status: newStatus }
        }
        return task
      }),
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-white/10 text-white/70 border-white/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-400" />
      default:
        return <Circle className="h-4 w-4 text-white/50" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "travel":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "expense":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "meeting":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-white/10 text-white/70 border-white/20"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-3">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tighter text-white">Tasks</h1>
            <p className="text-white/70 text-sm font-light">Manage your travel and business tasks</p>
          </div>
          <Button className="bg-white text-black hover:bg-white/90 font-light">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* AI Quick Input */}
        <div className="max-w-md">
          <AIQuickInput placeholder="Ask AI: 'Create a task to book flight to Paris'" />
        </div>

        {/* Filters */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 font-light"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white font-light"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <Button
                  variant="outline"
                  className="bg-transparent border-white/20 text-white/70 hover:bg-white/10 font-light"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Circle className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-lg font-light text-white">{tasks.filter((t) => t.status === "todo").length}</p>
                  <p className="text-xs text-white/50 font-light">To Do</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-lg font-light text-white">
                    {tasks.filter((t) => t.status === "in-progress").length}
                  </p>
                  <p className="text-xs text-white/50 font-light">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-lg font-light text-white">
                    {tasks.filter((t) => t.status === "completed").length}
                  </p>
                  <p className="text-xs text-white/50 font-light">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-lg font-light text-white">{tasks.filter((t) => t.priority === "high").length}</p>
                  <p className="text-xs text-white/50 font-light">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="py-3">
            <CardTitle className="text-white font-light tracking-tighter text-lg">All Tasks</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="mt-1 hover:scale-110 transition-transform"
                      >
                        {getStatusIcon(task.status)}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-light ${task.status === "completed" ? "line-through text-white/50" : "text-white"}`}
                          >
                            {task.title}
                          </h3>
                          <Badge className={`text-xs font-light ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                          <Badge className={`text-xs font-light ${getCategoryColor(task.category)}`}>
                            {task.category}
                          </Badge>
                        </div>

                        <p className="text-sm text-white/70 font-light mb-2">{task.description}</p>

                        <div className="flex items-center gap-4 text-xs text-white/50">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="font-light">{task.assignee}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className="font-light">{task.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/10">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {filteredTasks.length === 0 && (
                <div className="text-center py-8">
                  <Circle className="h-12 w-12 mx-auto text-white/30 mb-3" />
                  <h3 className="text-lg font-light text-white/70 mb-1">No tasks found</h3>
                  <p className="text-white/50 font-light mb-4">Try adjusting your search or filters</p>
                  <Button className="bg-white text-black hover:bg-white/90 font-light">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Task
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
