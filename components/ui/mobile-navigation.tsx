"use client"

import { X } from "lucide-react"
import type { AISection } from "./suitpax-chat"
import { cn } from "@/lib/utils"

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
  activeSection: AISection
  onSectionChange: (section: AISection) => void
}

export default function MobileNavigation({ isOpen, onClose, activeSection, onSectionChange }: MobileNavigationProps) {
  const sections: { id: AISection; label: string }[] = [
    { id: "business", label: "Business Travel" },
    { id: "expenses", label: "Expense Management" },
    { id: "tasks", label: "Task Management" },
    { id: "reporting", label: "Reporting & Analytics" },
    { id: "support", label: "Support" },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-sm font-medium text-white">Suitpax AI Sections</h2>
          <button onClick={onClose} className="text-white p-1 rounded-md hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-xs",
                  activeSection === section.id
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
