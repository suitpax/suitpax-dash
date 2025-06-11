"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DeleteTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirmDelete: () => void
}

export function DeleteTaskDialog({ isOpen, onClose, onConfirmDelete }: DeleteTaskDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] border border-black rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium tracking-tighter">Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="border-black rounded-xl">
            Cancel
          </Button>
          <Button type="button" onClick={onConfirmDelete} className="bg-red-600 text-white hover:bg-red-700 rounded-xl">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
