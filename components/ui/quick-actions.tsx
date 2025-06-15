"use client"

import { Button } from "@/components/ui/button"
import { Plane, Hotel, CreditCard, FileText, Calendar, Users } from "lucide-react"
import { motion } from "framer-motion"

interface QuickActionsProps {
  onActionClick: (query: string) => void
  isPro: boolean
}

const quickActions = [
  {
    icon: <Plane className="h-5 w-5" />,
    label: "Book Flight",
    query: "Help me book a flight",
    color: "from-blue-500 to-cyan-500",
    isPro: false,
  },
  {
    icon: <Hotel className="h-5 w-5" />,
    label: "Find Hotel",
    query: "Find me a hotel",
    color: "from-green-500 to-emerald-500",
    isPro: false,
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    label: "Track Expenses",
    query: "Help me track my expenses",
    color: "from-purple-500 to-violet-500",
    isPro: true,
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: "Create Report",
    query: "Generate a travel report",
    color: "from-orange-500 to-red-500",
    isPro: true,
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    label: "Plan Trip",
    query: "Help me plan a business trip",
    color: "from-pink-500 to-rose-500",
    isPro: false,
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "Team Travel",
    query: "Organize team travel",
    color: "from-indigo-500 to-purple-500",
    isPro: true,
  },
]

export function QuickActions({ onActionClick, isPro }: QuickActionsProps) {
  const availableActions = quickActions.filter((action) => !action.isPro || isPro)

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-white/60 flex items-center">
        <span className="mr-2">⚡</span>
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {availableActions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              onClick={() => onActionClick(action.query)}
              className={`w-full h-20 bg-gradient-to-br ${action.color}/20 hover:${action.color}/30 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2 group`}
              variant="ghost"
            >
              <div className="text-white group-hover:scale-110 transition-transform">{action.icon}</div>
              <span className="text-xs text-white/80 group-hover:text-white transition-colors">{action.label}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
