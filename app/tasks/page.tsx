import { Suspense } from "react"
import { TaskDashboard } from "@/components/tasks/task-dashboard"
import { TasksLoading } from "@/components/tasks/tasks-loading"

export const metadata = {
  title: "Task Management | Suitpax",
  description: "Manage your business travel tasks efficiently",
}

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-medium tracking-tighter">Task Management</h1>
      <Suspense fallback={<TasksLoading />}>
        <TaskDashboard />
      </Suspense>
    </div>
  )
}
