"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface GlowBorderProps {
  children: ReactNode
  className?: string
}

export function GlowBorder({ children, className = "" }: GlowBorderProps) {
  return (
    <div className="relative">
      <motion.div
        className="absolute -inset-0.5 rounded-xl opacity-75 blur-sm"
        animate={{
          background: "rgb(125, 211, 252)",
          opacity: [0.5, 0.75, 0.5],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <div className={`relative bg-white rounded-xl ${className}`}>{children}</div>
    </div>
  )
}
