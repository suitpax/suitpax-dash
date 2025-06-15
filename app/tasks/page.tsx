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
  MoreHorizontal,
  Trash2,
  Edit,
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
  createdAt: string
}

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    category: "general" as const,
    dueDate: "",
    assignee: "You",
  })

  // Start with empty tasks - users will create their own
  const [tasks, setTasks] = useState<Task[]>([])

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

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const addNewTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: "todo",
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
      category: newTask.category,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setTasks([task, ...tasks])
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      category: "general",
      dueDate: "",
      assignee: "You",
    })
    setShowNewTaskForm(false)
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tighter text-white">Task Management</h1>
            <p className="text-white/70 text-sm font-light">Organize and track your travel and business tasks</p>
          </div>
          <Button onClick={() => setShowNewTaskForm(true)} className="bg-white text-black hover:bg-white/90 font-light">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* AI Quick Input */}
        <div className="max-w-md">
          <AIQuickInput placeholder="Ask AI: 'Create a task to book flight to Paris'" />
        </div>

        {/* New Task Form */}
        {showNewTaskForm && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="py-3">
              <CardTitle className="text-white font-light tracking-tighter text-lg">Create New Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/70 text-sm font-light mb-2 block">Title</label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Task title..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-light"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm font-light mb-2 block">Due Date</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="bg-white/5 border-white/10 text-white font-light"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/70 text-sm font-light mb-2 block">Description</label>
                <Input
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-light"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-white/70 text-sm font-light mb-2 block">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-md text-white font-light"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/70 text-sm font-light mb-2 block">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-md text-white font-light"
                  >
                    <option value="travel">Travel</option>
                    <option value="expense">Expense</option>
                    <option value="meeting">Meeting</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/70 text-sm font-light mb-2 block">Assignee</label>
                  <Input
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    placeholder="Assignee..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-light"
                  />
                </div>
              </div>

              <Button onClick={addNewTask} className="w-full bg-green-500 hover:bg-green-500/90 text-white font-light">
                Add Task
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Task List */}
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center justify-between">
            <div className="relative w-full md:w-auto">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-light pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className={filterStatus === "all" ? "bg-white/10" : ""}
                onClick={() => setFilterStatus("all")}
              >
                <Filter className="h-4 w-4 mr-2" />
                All
              </Button>
              <Button
                variant="outline"
                className={filterStatus === "todo" ? "bg-white/10" : ""}
                onClick={() => setFilterStatus("todo")}
              >
                Todo
              </Button>
              <Button
                variant="outline"
                className={filterStatus === "in-progress" ? "bg-white/10" : ""}
                onClick={() => setFilterStatus("in-progress")}
              >
                In Progress
              </Button>
              <Button
                variant="outline"
                className={filterStatus === "completed" ? "bg-white/10" : ""}
                onClick={() => setFilterStatus("completed")}
              >
                Completed
              </Button>
            </div>
          </div>

          {/* Task List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.length === 0 ? (
              <p className="text-white/70">No tasks found.</p>
            ) : (
              filteredTasks.map((task) => (
                <Card key={task.id} className="bg-white/5 border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      {task.title}
                    </CardTitle>
                    <MoreHorizontal className="h-4 w-4 text-white/50 cursor-pointer" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 text-sm">{task.description}</p>
                    <div className="flex items-center justify-between text-xs mt-4">
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      <Badge className={getCategoryColor(task.category)}>{task.category}</Badge>
                    </div>
                    <div className="text-white/50 flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {task.dueDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        {task.assignee}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <Button onClick={() => toggleTaskStatus(task.id)} variant="secondary" size="sm">
                        {task.status === "completed" ? "Mark as Todo" : "Mark as Completed"}
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => deleteTask(task.id)} variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
