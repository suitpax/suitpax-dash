"use client"

import { DashboardLayout } from "@/components/ui/dashboard-layout"
import DashboardContent from "@/components/ui/dashboard-content"
import { useEffect } from "react"

export default function DashboardPage() {
  useEffect(() => {
    // Asegurar que la página se cargue desde arriba
    window.scrollTo(0, 0)
  }, [])

  return (
    <DashboardLayout>
      {/* Header específico del Dashboard */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-medium tracking-tighter text-white">Dashboard</h1>
            <p className="text-sm text-white/70 mt-1">Welcome back! Here's your travel overview</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
              <span className="text-xs font-medium text-white/70">Last updated</span>
              <span className="text-xs text-white/50">•</span>
              <span className="text-xs text-white/70">Just now</span>
            </div>
          </div>
        </div>
      </div>
      <DashboardContent />
    </DashboardLayout>
  )
}
