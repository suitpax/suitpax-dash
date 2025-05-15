"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type UserRole, hasPermission } from "./rbac"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  hasPermission: (permissionId: string) => boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for demonstration
const mockUser: User = {
  id: "1",
  name: "Genevieve McLean",
  email: "genevieve@acmecorp.com",
  role: "admin",
  avatar: "/images/team/genevieve-mclean.jpeg",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading the user on initial render
  useEffect(() => {
    // In a real app, this would check for an existing session
    const loadUser = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // For demo purposes, we'll auto-login with the mock user
        setUser(mockUser)
      } catch (error) {
        console.error("Failed to load user", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Check if the current user has a specific permission
  const checkPermission = (permissionId: string): boolean => {
    if (!user) return false
    return hasPermission(user.role, permissionId)
  }

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUser(mockUser)
    } catch (error) {
      console.error("Login failed", error)
      throw new Error("Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  // Mock logout function
  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        hasPermission: checkPermission,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// HOC to protect routes that require authentication
export function withAuth<P extends object>(Component: React.ComponentType<P>, requiredPermission?: string) {
  return function ProtectedRoute(props: P) {
    const { user, isLoading, hasPermission } = useAuth()

    if (isLoading) {
      return <div>Loading...</div>
    }

    if (!user) {
      // In a real app, redirect to login
      return <div>Please log in to access this page</div>
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      return <div>You don't have permission to access this page</div>
    }

    return <Component {...props} />
  }
}
