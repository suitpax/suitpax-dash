import type React from "react"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
import "./glow-effects.css"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Suitpax - Plataforma de Viajes de Negocios",
  description: "Gestiona tus viajes de negocios de forma eficiente",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Suspense fallback={"Loading..."}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
