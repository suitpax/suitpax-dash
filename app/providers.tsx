"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Auth0Provider } from "@/lib/auth/auth0-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Auth0Provider>{children}</Auth0Provider>
    </ThemeProvider>
  )
}
