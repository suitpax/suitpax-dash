"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import AIQuickInput from "./ai-quick-input"

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
          <main className="flex-1 p-3">
            {/* AI Quick Input - Always visible */}
            <div className="max-w-md mb-4">
              <AIQuickInput placeholder="Ask Suitpax AI anything..." />
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

// Export both named and default
export { Layout }
export default Layout
