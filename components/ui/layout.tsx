"use client"

import type React from "react"
import { Sidebar } from "./sidebar" // Cambiado de importación por defecto a nombrada
import TopNav from "./top-nav" // Cambiado de importación nombrada a por defecto
import MobileNavigation from "./mobile-navigation" // Cambiado de importación nombrada a por defecto

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex flex-col h-screen">
        <header className="h-14 border-b border-white/10">
          <TopNav />
        </header>
        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden lg:block w-64 border-r border-white/10">
            <Sidebar />
          </aside>
          <main className="flex-1 overflow-y-auto p-3 sm:p-6">{children}</main>
        </div>
      </div>
      {/* Mobile navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black">
        <MobileNavigation isOpen={false} onClose={() => {}} activeSection="business" onSectionChange={() => {}} />
      </div>
    </div>
  )
}
