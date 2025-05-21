import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { DashboardLayout } from "@/components/ui/dashboard-layout"

export const metadata: Metadata = {
  title: "Suitpax",
  description: "Plataforma de Viajes de Negocios",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  )
}
