"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface ApiContextType {
  token: string | null
  setToken: (token: string | null) => void
  isAuthenticated: boolean
  logout: () => void
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export function ApiProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    // Recuperar el token del almacenamiento local al cargar la página
    const storedToken = localStorage.getItem("auth_token")
    if (storedToken) {
      setToken(storedToken)
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    // Actualizar el almacenamiento local cuando cambia el token
    if (token) {
      localStorage.setItem("auth_token", token)
      setIsAuthenticated(true)
    } else {
      localStorage.removeItem("auth_token")
      setIsAuthenticated(false)
    }
  }, [token])

  const logout = () => {
    setToken(null)
    router.push("/sign-in")
  }

  return <ApiContext.Provider value={{ token, setToken, isAuthenticated, logout }}>{children}</ApiContext.Provider>
}

export function useApi() {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error("useApi debe ser usado dentro de un ApiProvider")
  }
  return context
}
