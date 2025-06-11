"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, CheckCircle2, Clock, Circle, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { EditTaskDialog } from "./edit-task-dialog"
import { DeleteTaskDialog } from "./delete-task-dialog"
import type { Task } from "@/types/task"

interface TaskListProps {
  tasks: Task[]
  onUpdateTask: (id: string, data: Partial<Task>) => void
  onDeleteTask: (id: string) => void
}

export function TaskList({ tasks, onUpdateTask, onDeleteTask }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    onUpdateTask(taskId, { status: newStatus })
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return <Circle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "completed":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "high":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-8 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm"
      >
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium mb-2">No se encontraron tareas</h3>
        <p className="text-sm text-gray-500 mb-4">Crea tu primera tarea para comenzar</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {tasks.map((task) => (
        <motion.div key={task.id} variants={itemVariants}>
          <Card className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={getStatusColor(task.status)}>
                      {getStatusIcon(task.status)} {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)}>
                      Prioridad: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                    {task.dueDate && (
                      <Badge variant="outline" className="border-gray-200">
                        Vence: {new Date(task.dueDate).toLocaleDateString()}
                      </Badge>
                    )}
                    {task.relatedTo && (
                      <Badge variant="outline" className="border-gray-200">
                        {task.relatedTo}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-row md:flex-col gap-2 self-end md:self-start">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 rounded-lg h-8"
                      onClick={() => setEditingTask(task)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 rounded-lg h-8"
                      onClick={() => setDeletingTaskId(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    {task.status !== "completed" && (
                      <Button
                        size="sm"
                        className="bg-black text-white rounded-lg h-8"
                        onClick={() => handleStatusChange(task.id, "completed")}
                      >
                        Completar
                      </Button>
                    )}
                    {task.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-200 rounded-lg h-8"
                        onClick={() => handleStatusChange(task.id, "in-progress")}
                      >
                        Iniciar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Creada {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                {task.updatedAt !== task.createdAt &&
                  ` • Actualizada ${formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}`}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onUpdateTask={(data) => {
            onUpdateTask(editingTask.id, data)
            setEditingTask(null)
          }}
        />
      )}

      {deletingTaskId && (
        <DeleteTaskDialog
          isOpen={!!deletingTaskId}
          onClose={() => setDeletingTaskId(null)}
          onConfirmDelete={() => {
            onDeleteTask(deletingTaskId)
            setDeletingTaskId(null)
          }}
        />
      )}
    </motion.div>
  )
}
