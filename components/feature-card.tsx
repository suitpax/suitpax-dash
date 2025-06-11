"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
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
  className = "",
  iconClassName = "",
  children,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="group h-full"
    >
      <Card
        className={cn(
          "border border-white/10 rounded-lg overflow-hidden bg-white/5 h-full flex flex-col hover:bg-white/10 transition-colors",
          className,
        )}
      >
        <CardContent className="p-3 md:p-4 flex flex-col h-full">
          <div
            className={cn(
              "w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/10 flex items-center justify-center mb-3 group-hover:bg-white/20 transition-colors",
              iconClassName,
            )}
          >
            {icon}
          </div>
          <h3 className="text-sm md:text-base font-medium tracking-tighter mb-2 text-white">{title}</h3>
          <p className="text-xs md:text-sm text-white/70 mb-4 flex-1">{description}</p>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  )
}
