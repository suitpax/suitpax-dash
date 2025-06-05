"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  children?: ReactNode
  delay?: number
  className?: string
  iconClassName?: string
  compact?: boolean
}

export function FeatureCard({
  icon,
  title,
  description,
  children,
  delay = 0,
  className = "",
  iconClassName = "",
  compact = false,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={`border border-gray-200 rounded-lg p-4 ${compact ? "p-3" : "p-4"} flex flex-col ${className}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`rounded-lg p-2 ${compact ? "p-1.5" : "p-2"} ${iconClassName || "bg-gray-100"}`}>{icon}</div>
        <h3 className={`font-medium ${compact ? "text-sm" : "text-base"}`}>{title}</h3>
      </div>
      <p className={`text-gray-500 mb-4 ${compact ? "text-xs mb-3" : "text-sm mb-4"}`}>{description}</p>
      {children}
    </motion.div>
  )
}
