"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Header } from "@/components/ui/header"
import { Sidebar } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"

interface ClientLayoutProps {
  children: React.ReactNode
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-black text-white">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className={cn("transition-all duration-300", sidebarOpen ? "lg:ml-64" : "lg:ml-16")}>
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
          <main className="pt-0">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default ClientLayout
