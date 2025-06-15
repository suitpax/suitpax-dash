"use client"

import { Crown, Sparkles, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface ProFeaturesBannerProps {
  isPro: boolean
  onUpgradeClick: () => void
}

const proFeatures = [
  {
    icon: <Sparkles className="h-4 w-4" />,
    text: "Advanced AI Analysis",
  },
  {
    icon: <Zap className="h-4 w-4" />,
    text: "Unlimited Requests",
  },
  {
    icon: <Shield className="h-4 w-4" />,
    text: "Priority Support",
  },
]

export function ProFeaturesBanner({ isPro, onUpgradeClick }: ProFeaturesBannerProps) {
  if (isPro) {
    return (
      <motion.div
        className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <Crown className="h-5 w-5 text-yellow-400" />
          <span className="font-medium text-white">Suitpax AI Pro Active</span>
          <Badge className="bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded-full">Premium</Badge>
        </div>
        <p className="text-sm text-white/70">
          You have access to all advanced features including MCP integration, unlimited requests, and priority support.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-yellow-400" />
          <span className="font-medium text-white">Upgrade to Pro</span>
        </div>
        <Button
          onClick={onUpgradeClick}
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs px-3 py-1 rounded-full"
        >
          Upgrade
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
        {proFeatures.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm text-white/70">
            <div className="text-purple-400">{feature.icon}</div>
            <span>{feature.text}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-white/50">
        Unlock advanced AI capabilities, document processing, and unlimited features.
      </p>
    </motion.div>
  )
}
