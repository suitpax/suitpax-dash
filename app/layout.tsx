import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { SettingsProvider } from "@/contexts/settings-context"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Suitpax - Business Travel Management",
  description:
    "Your comprehensive platform for managing business travel, expenses, and optimizing corporate travel experience.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SettingsProvider>
            <Navigation>{children}</Navigation>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
