"use client"

import { useState, useEffect } from "react"
import type { Task } from "@/types/task"
import { v4 as uuidv4 } from "uuid"

// Mock data for initial tasks
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Book flight to London",
    description: "Find and book a round-trip flight to London for the client meeting",
    status: "completed",
    priority: "high",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    relatedTo: "Flight Booking",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "2",
    title: "Reserve hotel in London",
    description: "Book a hotel near the client's office for the duration of the trip",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    relatedTo: "Hotel Booking",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "3",
    title: "Prepare presentation for client meeting",
    description: "Create slides for the upcoming client presentation",
    status: "pending",
    priority: "high",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    relatedTo: "Meeting",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "4",
    title: "Submit expense report for Paris trip",
    description: "Compile and submit all receipts and expenses from the Paris business trip",
    status: "pending",
    priority: "medium",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    relatedTo: "Expense Report",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "5",
    title: "Arrange airport transportation",
    description: "Book a car service for airport pickup and drop-off",
    status: "pending",
    priority: "low",
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
    relatedTo: "Car Rental",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
]

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const loadTasks = () => {
      try {
        setIsLoading(true)
        const savedTasks = localStorage.getItem("tasks")

        if (savedTasks) {
          setTasks(JSON.parse(savedTasks))
        } else {
          // Use initial mock data if no tasks in localStorage
          setTasks(initialTasks)
          localStorage.setItem("tasks", JSON.stringify(initialTasks))
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load tasks"))
        // Fallback to initial data on error
        setTasks(initialTasks)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
  }, [tasks, isLoading])

  // Create a new task
  const createTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString()
    const newTask: Task = {
      id: uuidv4(),
      ...taskData,
      createdAt: now,
      updatedAt: now,
    }

    setTasks((prevTasks) => [...prevTasks, newTask])
  }

  // Update an existing task
  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...taskData,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    )
  }

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
  }

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
  }
}
