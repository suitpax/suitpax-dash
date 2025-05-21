"use client"

import type React from "react"

import { createContext, useContext, type ReactNode } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"
import { type UserRole, hasPermission } from "./rbac"

interface AuthContextType {
  user: {
    id: string
    name: string
    email: string
    role: UserRole
    avatar?: string
  } | null
  isLoading: boolean
  hasPermission: (permissionId: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoading, error } = useUser()

  // Mapear el usuario de Auth0 a nuestro formato
  const mappedUser = user
    ? {
        id: user.sub || "",
        name: user.name || "",
        email: user.email || "",
        role: (user["https://suitpax.com/roles"] as UserRole) || "user",
        avatar: user.picture,
      }
    : null

  // Check if the current user has a specific permission
  const checkPermission = (permissionId: string): boolean => {
    if (!mappedUser) return false
    return hasPermission(mappedUser.role, permissionId)
  }

  // Logout function
  const logout = () => {
    window.location.href = "/api/auth/logout"
  }

  if (error) {
    console.error("Error loading user", error)
  }

  return (
    <AuthContext.Provider
      value={{
        user: mappedUser,
        isLoading,
        hasPermission: checkPermission,
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
