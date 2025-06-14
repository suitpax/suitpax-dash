"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Layout } from "@/components/ui/layout"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
      <Layout>{children}</Layout>
    </ThemeProvider>
  )
}
