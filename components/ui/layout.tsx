"use client"

import type React from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useState } from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      <Sidebar isOpen={!isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
        <main className="flex-1 overflow-y-auto bg-black/50 backdrop-blur-sm pt-14">
          <div className="h-full p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
