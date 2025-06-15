"use client"

import { Badge } from "@/components/ui/badge"
import { Plane, Hotel, CreditCard, FileText, TrendingUp, MapPin } from "lucide-react"
import { motion } from "framer-motion"

interface SmartSuggestionsProps {
  isPro: boolean
  onSuggestionClick: (query: string) => void
  userLocation?: string
}

const suggestions = [
  {
    icon: <Plane className="h-4 w-4" />,
    text: "Find flights to London next week",
    category: "Travel",
    isPro: false,
  },
  {
    icon: <Hotel className="h-4 w-4" />,
    text: "Book hotel near conference center",
    category: "Accommodation",
    isPro: false,
  },
  {
    icon: <CreditCard className="h-4 w-4" />,
    text: "Create expense report for Q4",
    category: "Expenses",
    isPro: true,
  },
  {
    icon: <FileText className="h-4 w-4" />,
    text: "Generate travel policy summary",
    category: "Policy",
    isPro: true,
  },
  {
    icon: <TrendingUp className="h-4 w-4" />,
    text: "Analyze travel spending trends",
    category: "Analytics",
    isPro: true,
  },
  {
    icon: <MapPin className="h-4 w-4" />,
    text: "Plan multi-city European trip",
    category: "Planning",
    isPro: false,
  },
]

export function SmartSuggestions({ isPro, onSuggestionClick, userLocation }: SmartSuggestionsProps) {
  const availableSuggestions = suggestions.filter((s) => !s.isPro || isPro)

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-white/60 flex items-center">
        <span className="mr-2">💡</span>
        Smart Suggestions
        {userLocation && <span className="ml-2 text-xs text-white/40">• From {userLocation}</span>}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {availableSuggestions.slice(0, 6).map((suggestion, index) => (
          <motion.button
            key={index}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all duration-200 border border-white/10 hover:border-white/20 group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-white/60 group-hover:text-white/80 transition-colors">{suggestion.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/80 group-hover:text-white transition-colors">{suggestion.text}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-white/10 text-white/50 text-xs px-2 py-0.5 rounded-full">
                  {suggestion.category}
                </Badge>
                {suggestion.isPro && (
                  <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 text-xs px-2 py-0.5 rounded-full border border-yellow-500/30">
                    Pro
                  </Badge>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
