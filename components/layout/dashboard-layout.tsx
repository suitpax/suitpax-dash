"use client"

import type React from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { useSidebar } from "@/contexts/sidebar-context"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isOpen, toggleSidebar } = useSidebar()

  return (
    <div className="min-h-screen bg-black">
      <Header toggleSidebar={toggleSidebar} isSidebarCollapsed={!isOpen} />

      <div className="flex pt-14">
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto w-full">{children}</main>
      </div>
    </div>
  )
}
