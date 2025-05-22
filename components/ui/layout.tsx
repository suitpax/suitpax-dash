"use client"

import type React from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [currentSection, setCurrentSection] = useState("")

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  // Detectar la sección actual basada en la URL
  useEffect(() => {
    const path = window.location.pathname
    const section = path.split("/")[1] || "dashboard"
    setCurrentSection(section)
  }, [])

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      <Sidebar isOpen={!isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
        <main className="flex-1 overflow-y-auto bg-black/50 backdrop-blur-sm pt-14">
          <div
            className={cn(
              "h-full px-4 py-5 lg:px-6 lg:py-6",
              "transition-all duration-300 ease-in-out",
              "relative z-10",
            )}
          >
            {/* Decorative gradient background */}
            <div className="absolute inset-0 z-[-1] opacity-20">
              <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-purple-900/20 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
            </div>

            {/* Section title */}
            <div className="mb-6">
              <h1 className="text-2xl font-medium tracking-tighter text-white capitalize">
                {currentSection === "dashboard" ? "Dashboard" : currentSection}
              </h1>
              <p className="text-sm text-white/70">{getSectionDescription(currentSection)}</p>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

// Función para obtener la descripción de cada sección
function getSectionDescription(section: string): string {
  const descriptions: Record<string, string> = {
    dashboard: "Overview of your travel activity and quick actions",
    flights: "Search and book flights for your business trips",
    hotels: "Find and reserve accommodations worldwide",
    trains: "Book train tickets for your journey",
    transfers: "Arrange airport and city transfers",
    events: "Manage your business events and conferences",
    "travel-policy": "View and manage company travel policies",
    "ai-assistant": "Get help from your AI travel assistant",
    tasks: "Manage your travel-related tasks",
    expenses: "Track and manage your travel expenses",
    "team-management": "Manage your team's travel arrangements",
    "ai-agents": "Configure your AI travel agents",
    "voice-ai": "Voice-controlled AI assistant settings",
    profile: "Manage your personal profile",
    settings: "Configure your account settings",
    plans: "View and manage your subscription plans",
    workflows: "Automate your travel processes",
    meetings: "Schedule and manage your business meetings",
  }

  return descriptions[section] || "Manage your business travel efficiently"
}
