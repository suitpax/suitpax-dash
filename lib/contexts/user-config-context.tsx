"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type AccountType = "personal" | "business" | "enterprise"
export type UserRole = "admin" | "manager" | "employee" | "traveler"

export interface UserConfig {
  // Personal Info
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string

  // Account Settings
  accountType: AccountType
  role: UserRole
  isConfigured: boolean

  // Company Info (for business/enterprise)
  company?: {
    id: string
    name: string
    logo?: string
    domain: string
    industry: string
    size: string
    address?: string
    taxId?: string
  }

  // Preferences
  preferences: {
    theme: "light" | "dark" | "system"
    language: string
    currency: string
    timezone: string
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
  }

  // Travel Settings
  travelProfile?: {
    frequentFlyerNumbers: Record<string, string>
    preferredAirlines: string[]
    seatPreference: string
    mealPreference: string
    hotelChains: string[]
    roomPreference: string
    budgetLimits: {
      flight: number
      hotel: number
      daily: number
    }
  }
}

interface UserConfigContextType {
  userConfig: UserConfig | null
  isLoading: boolean
  updateUserConfig: (updates: Partial<UserConfig>) => Promise<void>
  switchAccountType: (type: AccountType) => Promise<void>
  completeSetup: () => Promise<void>
  resetConfig: () => void
}

const UserConfigContext = createContext<UserConfigContextType | undefined>(undefined)

const defaultConfig: Partial<UserConfig> = {
  accountType: "personal",
  role: "traveler",
  isConfigured: false,
  preferences: {
    theme: "dark",
    language: "en",
    currency: "USD",
    timezone: "UTC",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  },
}

export function UserConfigProvider({ children }: { children: ReactNode }) {
  const [userConfig, setUserConfig] = useState<UserConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user config on mount
  useEffect(() => {
    loadUserConfig()
  }, [])

  const loadUserConfig = async () => {
    try {
      setIsLoading(true)

      // Try to load from localStorage first
      const savedConfig = localStorage.getItem("suitpax_user_config")
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig)
        setUserConfig(parsed)
      } else {
        // Create new user with default config
        const newUser: UserConfig = {
          id: generateUserId(),
          firstName: "",
          lastName: "",
          email: "",
          ...defaultConfig,
        } as UserConfig

        setUserConfig(newUser)
      }
    } catch (error) {
      console.error("Failed to load user config:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserConfig = async (updates: Partial<UserConfig>) => {
    if (!userConfig) return

    try {
      const updatedConfig = { ...userConfig, ...updates }
      setUserConfig(updatedConfig)

      // Save to localStorage
      localStorage.setItem("suitpax_user_config", JSON.stringify(updatedConfig))

      // In a real app, you would also sync with your backend
      // await syncWithBackend(updatedConfig)
    } catch (error) {
      console.error("Failed to update user config:", error)
      throw error
    }
  }

  const switchAccountType = async (type: AccountType) => {
    if (!userConfig) return

    try {
      const updates: Partial<UserConfig> = {
        accountType: type,
        role: type === "personal" ? "traveler" : "employee",
      }

      // Clear company info if switching to personal
      if (type === "personal") {
        updates.company = undefined
      }

      await updateUserConfig(updates)
    } catch (error) {
      console.error("Failed to switch account type:", error)
      throw error
    }
  }

  const completeSetup = async () => {
    if (!userConfig) return

    try {
      await updateUserConfig({ isConfigured: true })
    } catch (error) {
      console.error("Failed to complete setup:", error)
      throw error
    }
  }

  const resetConfig = () => {
    localStorage.removeItem("suitpax_user_config")
    setUserConfig(null)
    loadUserConfig()
  }

  return (
    <UserConfigContext.Provider
      value={{
        userConfig,
        isLoading,
        updateUserConfig,
        switchAccountType,
        completeSetup,
        resetConfig,
      }}
    >
      {children}
    </UserConfigContext.Provider>
  )
}

export function useUserConfig() {
  const context = useContext(UserConfigContext)
  if (context === undefined) {
    throw new Error("useUserConfig must be used within a UserConfigProvider")
  }
  return context
}

// Helper functions
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
