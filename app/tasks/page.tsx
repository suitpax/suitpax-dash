"use client"

import type React from "react"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { PlusCircle, Edit2, Trash2, CheckCircle, Circle, Calendar } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: "high" | "medium" | "low"
  status: "pending" | "completed"
  createdAt: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Task, "id" | "createdAt">>({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "medium",
    status: "pending",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingTaskId) {
      // Update existing task
      setTasks((prev) => prev.map((task) => (task.id === editingTaskId ? { ...task, ...formData } : task)))
      setEditingTaskId(null)
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      }
      setTasks((prev) => [...prev, newTask])
    }

    // Reset form
    setFormData({
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "medium",
      status: "pending",
    })
    setIsFormOpen(false)
  }

  const handleEdit = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    })
    setEditingTaskId(task.id)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: task.status === "pending" ? "completed" : "pending" } : task,
      ),
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-white/10 text-white/80 border-white/20"
      case "medium":
        return "bg-white/10 text-white/80 border-white/20"
      case "low":
        return "bg-white/10 text-white/80 border-white/20"
      default:
        return "bg-white/10 text-white/80 border-white/20"
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-light tracking-tighter text-white">Task Management</h1>
          <button
            onClick={() => {
              setIsFormOpen(true)
              setEditingTaskId(null)
              setFormData({
                title: "",
                description: "",
                dueDate: new Date().toISOString().split("T")[0],
                priority: "medium",
                status: "pending",
              })
            }}
            className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/15 flex items-center gap-2 border border-white/10 transition-all duration-300"
          >
            <PlusCircle size={14} className="text-white/70" />
            <span className="text-xs font-light">New Task</span>
          </button>
        </div>

        {isFormOpen && (
          <div className="bg-white/5 rounded-lg border border-white/10 p-6 shadow-sm mb-6">
            <h2 className="text-lg font-light tracking-tighter text-white mb-4">
              {editingTaskId ? "Edit Task" : "Create New Task"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-light text-white/70 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white placeholder:text-white/30"
                  placeholder="Task title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-light text-white/70 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white placeholder:text-white/30"
                  placeholder="Task description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-light text-white/70 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white"
                  />
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-light text-white/70 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-light text-white/70 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-white/20 text-white/70 hover:bg-white/5 font-light"
                >
                  <span className="text-xs">Cancel</span>
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/15 border border-white/10 font-light"
                >
                  <span className="text-xs">{editingTaskId ? "Update Task" : "Create Task"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="bg-white/5 rounded-lg border border-white/10 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/10 rounded-full">
                <CheckCircle className="h-8 w-8 text-white/50" />
              </div>
            </div>
            <h2 className="text-xl font-light tracking-tighter text-white mb-2">No tasks yet</h2>
            <p className="text-white/70 mb-6 max-w-md mx-auto font-light">
              Create your first task to start managing your business travel to-dos.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/15 inline-flex items-center gap-2 border border-white/10 font-light"
            >
              <PlusCircle size={14} className="text-white/70" />
              <span className="text-xs">Create Your First Task</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white/5 rounded-lg border ${
                  task.status === "completed" ? "border-white/10" : "border-white/10"
                } p-4 shadow-sm hover:border-white/20 transition-colors hover:bg-white/10`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleStatus(task.id)}
                      className="mt-1 flex-shrink-0 text-white/50 hover:text-white transition-colors"
                    >
                      {task.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-white/70" />
                      ) : (
                        <Circle className="h-5 w-5 text-white/70" />
                      )}
                    </button>
                    <div>
                      <h3
                        className={`font-light text-white ${task.status === "completed" ? "line-through text-white/50" : ""}`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p
                          className={`text-sm text-white/60 mt-1 font-light ${task.status === "completed" ? "line-through text-white/40" : ""}`}
                        >
                          {task.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-light ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </span>
                        <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-light text-white/70 border border-white/20">
                          <Calendar className="mr-1 h-3 w-3 text-white/50" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-1.5 text-white/50 hover:text-white transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1.5 text-white/50 hover:text-white/70 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
