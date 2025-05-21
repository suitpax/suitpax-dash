"use client"

import type { Policy } from "@/types/policy"
import { BookOpen, Building, Users, User, Check, Edit, Archive, Trash2, AlertCircle } from "lucide-react"

interface PolicyCardProps {
  policy: Policy
  onEdit: (policy: Policy) => void
  onArchive: (policy: Policy) => void
  onDelete: (policy: Policy) => void
}

export function PolicyCard({ policy, onEdit, onArchive, onDelete }: PolicyCardProps) {
  const getLevelIcon = () => {
    switch (policy.level) {
      case "company":
        return <Building className="h-4 w-4 text-white/70" />
      case "department":
        return <BookOpen className="h-4 w-4 text-white/70" />
      case "team":
        return <Users className="h-4 w-4 text-white/70" />
      case "employee":
        return <User className="h-4 w-4 text-white/70" />
      default:
        return <AlertCircle className="h-4 w-4 text-white/70" />
    }
  }

  const getStatusBadge = () => {
    switch (policy.status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-white">
            <Check className="mr-1 h-3 w-3 text-white/70" />
            Active
          </span>
        )
      case "draft":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-white/70">
            Draft
          </span>
        )
      case "archived":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-white/50">
            Archived
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-black border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="p-2 bg-white/5 rounded-lg mr-3">{getLevelIcon()}</div>
          <div>
            <h3 className="text-white font-medium">{policy.name}</h3>
            <p className="text-white/70 text-sm">
              {policy.category.charAt(0).toUpperCase() + policy.category.slice(1)} Policy
            </p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <p className="text-white/70 text-sm mb-4">{policy.description}</p>

      <div className="border-t border-white/10 pt-3 mt-3">
        <div className="flex justify-between items-center">
          <div className="text-white/50 text-xs">
            {policy.rules.length} rules • Updated {new Date(policy.updatedAt).toLocaleDateString()}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(policy)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onArchive(policy)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <Archive className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(policy)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
