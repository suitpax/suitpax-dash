import type React from "react"
import { Sidebar } from "./sidebar"

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 overflow-auto bg-black/50 backdrop-blur-sm">{children}</main>
    </div>
  )
}

export default Layout
export { Layout }
