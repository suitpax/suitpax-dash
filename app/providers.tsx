"use client"

import type React from "react"

// Este componente es un placeholder para el entorno de vista previa
// En producción, se reemplazará por el UserProvider real de Auth0
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// Instrucciones para producción:
// 1. Importar UserProvider: import { UserProvider } from "@auth0/nextjs-auth0/client"
// 2. Reemplazar el componente Providers por:
/*
export function Providers({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>
}
*/
