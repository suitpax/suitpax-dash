export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string | null
  relatedTo: string | null
  createdAt: string
  updatedAt: string
}
