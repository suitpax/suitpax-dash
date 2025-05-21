"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define the user type
type User = {
  sub: string
  name?: string
  email?: string
  picture?: string
}

// Define the Auth0 context type
type Auth0ContextType = {
  user: User | null
  isLoading: boolean
  error: Error | null
  isAuthenticated: boolean
  loginWithRedirect: () => void
  logout: () => void
}

// Create the context
const Auth0Context = createContext<Auth0ContextType | null>(null)

// Create a provider component
export function Auth0Provider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // In a real implementation, this would fetch the user from Auth0
    // For preview, we'll simulate a logged-in user if the cookie exists
    const hasSession = document.cookie.includes("appSession")

    if (hasSession) {
      setUser({
        sub: "preview-user",
        name: "Preview User",
        email: "preview@example.com",
        picture: "/abstract-geometric-shapes.png",
      })
    }

    setIsLoading(false)
  }, [])

  const loginWithRedirect = () => {
    window.location.href = "/api/auth/login"
  }

  const logout = () => {
    window.location.href = "/api/auth/logout"
  }

  return (
    <Auth0Context.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        loginWithRedirect,
        logout,
      }}
    >
      {children}
    </Auth0Context.Provider>
  )
}

// Create a hook to use the Auth0 context
export function useAuth0() {
  const context = useContext(Auth0Context)
  if (!context) {
    throw new Error("useAuth0 must be used within an Auth0Provider")
  }
  return context
}
