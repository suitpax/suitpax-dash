"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
  className?: string
  iconClassName?: string
  children?: React.ReactNode
}

export function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
  className,
  iconClassName,
  children,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={cn(
        "p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow flex flex-col",
        className,
      )}
    >
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", iconClassName)}>{icon}</div>
      <h3 className="font-medium tracking-tighter mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 flex-1">{description}</p>
      {children}
    </motion.div>
  )
}
