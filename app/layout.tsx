import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarProvider } from "@/contexts/sidebar-context"

export const metadata: Metadata = {
  title: "Suitpax",
  description: "Business Travel Management Platform",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <SidebarProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </SidebarProvider>
      </body>
    </html>
  )
}
