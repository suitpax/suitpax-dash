import type React from "react"
import { Sidebar } from "./sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-black/50 backdrop-blur-sm">
        <div className="h-full p-4 lg:p-6">{children}</div>
      </main>
    </div>
  )
}
