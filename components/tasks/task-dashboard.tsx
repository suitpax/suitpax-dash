"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, Calendar, Clock, CheckCircle2, Circle } from "lucide-react"
import { TaskList } from "./task-list"
import { CreateTaskDialog } from "./create-task-dialog"
import { useTasks } from "@/hooks/use-tasks"

export function TaskDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { tasks, isLoading, error, createTask, updateTask, deleteTask } = useTasks()
  const [activeTab, setActiveTab] = useState("all")

  const filteredTasks = tasks.filter((task) => {
    // Filter by search query
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status tab
    if (activeTab === "all") return matchesSearch
    if (activeTab === "pending") return matchesSearch && task.status === "pending"
    if (activeTab === "in-progress") return matchesSearch && task.status === "in-progress"
    if (activeTab === "completed") return matchesSearch && task.status === "completed"

    return matchesSearch
  })

  const handleCreateTask = (taskData) => {
    createTask(taskData)
    setIsCreateDialogOpen(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Card className="border border-gray-200 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-medium tracking-tighter">Tareas de viaje</CardTitle>
              <CardDescription>Gestiona y haz seguimiento de tus tareas relacionadas con viajes</CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-black text-white rounded-xl">
              <Plus className="mr-2 h-4 w-4" /> Crear tarea
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Buscar tareas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200 rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-gray-200 rounded-xl">
                  <Filter className="mr-2 h-4 w-4" /> Filtrar
                </Button>
                <Button variant="outline" className="border-gray-200 rounded-xl">
                  <Calendar className="mr-2 h-4 w-4" /> Fecha
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-100 rounded-xl p-1">
                <TabsTrigger
                  value="all"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:shadow-sm"
                >
                  Todas
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:shadow-sm"
                >
                  <Circle className="mr-2 h-4 w-4" /> Pendientes
                </TabsTrigger>
                <TabsTrigger
                  value="in-progress"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:shadow-sm"
                >
                  <Clock className="mr-2 h-4 w-4" /> En progreso
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:shadow-sm"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Completadas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <TaskList tasks={filteredTasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} />
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                <TaskList tasks={filteredTasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} />
              </TabsContent>

              <TabsContent value="in-progress" className="mt-6">
                <TaskList tasks={filteredTasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} />
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <TaskList tasks={filteredTasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateTask={handleCreateTask}
      />
    </motion.div>
  )
}
