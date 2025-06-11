"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task } from "@/types/task"

interface EditTaskDialogProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onUpdateTask: (task: Partial<Task>) => void
}

export function EditTaskDialog({ task, isOpen, onClose, onUpdateTask }: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "")
  const [priority, setPriority] = useState<Task["priority"]>(task.priority)
  const [status, setStatus] = useState<Task["status"]>(task.status)
  const [relatedTo, setRelatedTo] = useState(task.relatedTo || "")

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title)
      setDescription(task.description)
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "")
      setPriority(task.priority)
      setStatus(task.status)
      setRelatedTo(task.relatedTo || "")
    }
  }, [isOpen, task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedTask = {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      priority,
      status,
      relatedTo: relatedTo || null,
    }

    onUpdateTask(updatedTask)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] border border-black rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium tracking-tighter">Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="border-black rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                className="border-black rounded-xl"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="border-black rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value: Task["priority"]) => setPriority(value)}>
                  <SelectTrigger id="priority" className="border-black rounded-xl">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: Task["status"]) => setStatus(value)}>
                  <SelectTrigger id="status" className="border-black rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="relatedTo">Related To</Label>
                <Select value={relatedTo} onValueChange={setRelatedTo}>
                  <SelectTrigger id="relatedTo" className="border-black rounded-xl">
                    <SelectValue placeholder="Select related item" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="Flight Booking">Flight Booking</SelectItem>
                    <SelectItem value="Hotel Booking">Hotel Booking</SelectItem>
                    <SelectItem value="Car Rental">Car Rental</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Expense Report">Expense Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-black rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="bg-black text-white rounded-xl">
              Update Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
