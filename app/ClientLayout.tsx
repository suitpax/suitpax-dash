"use client"

import type React from "react"
import { useState, Suspense } from "react"
import "./globals.css"
import "./glow-effects.css"
import { Sidebar } from "@/components/ui/sidebar"
import { Header } from "@/components/ui/header"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}>
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
          <Suspense fallback={<div className="flex items-center justify-center h-full text-white">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  )
}
