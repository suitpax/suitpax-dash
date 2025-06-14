interface UserProfile {
  id: string
  name: string
  email: string
  company: string
  department?: string
  role: "traveler" | "manager" | "admin" | "finance"
  avatar?: string
  preferences: {
    currency: string
    timezone: string
    language: string
    notifications: boolean
  }
  subscription: {
    plan: "free" | "starter" | "pro" | "enterprise"
    status: "active" | "inactive" | "trial"
    expiresAt?: string
  }
  companySettings: {
    travelPolicy?: string
    approvalRequired: boolean
    budgetLimits?: {
      daily: number
      monthly: number
    }
  }
  stats: {
    totalTrips: number
    totalSpent: number
    savedAmount: number
    carbonOffset: number
  }
  lastActive: string
  createdAt: string
}

class UserProfileService {
  private storageKey = "suitpax_user_profile"

  // Get user profile
  getUserProfile(): UserProfile | null {
    if (typeof window === "undefined") return null

    const stored = localStorage.getItem(this.storageKey)
    if (!stored) {
      return this.initializeGuestProfile()
    }

    const profile = JSON.parse(stored)
    // Update last active
    profile.lastActive = new Date().toISOString()
    this.saveUserProfile(profile)

    return profile
  }

  // Save user profile
  saveUserProfile(profile: UserProfile): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.storageKey, JSON.stringify(profile))
  }

  // Initialize guest profile
  private initializeGuestProfile(): UserProfile {
    const guestProfile: UserProfile = {
      id: `guest_${Date.now()}`,
      name: "",
      email: "",
      company: "",
      role: "traveler",
      preferences: {
        currency: "USD",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: "en",
        notifications: true,
      },
      subscription: {
        plan: "free",
        status: "active",
      },
      companySettings: {
        approvalRequired: false,
      },
      stats: {
        totalTrips: 0,
        totalSpent: 0,
        savedAmount: 0,
        carbonOffset: 0,
      },
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    return guestProfile
  }

  // Register new user
  registerUser(userData: {
    name: string
    email: string
    company: string
    department?: string
    role?: "traveler" | "manager" | "admin" | "finance"
  }): UserProfile {
    const newProfile: UserProfile = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      company: userData.company,
      department: userData.department,
      role: userData.role || "traveler",
      preferences: {
        currency: "USD",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: "en",
        notifications: true,
      },
      subscription: {
        plan: "free",
        status: "trial",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days trial
      },
      companySettings: {
        approvalRequired: userData.role === "traveler",
      },
      stats: {
        totalTrips: 0,
        totalSpent: 0,
        savedAmount: 0,
        carbonOffset: 0,
      },
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    this.saveUserProfile(newProfile)
    return newProfile
  }

  // Update user profile
  updateProfile(updates: Partial<UserProfile>): UserProfile | null {
    const currentProfile = this.getUserProfile()
    if (!currentProfile) return null

    const updatedProfile = {
      ...currentProfile,
      ...updates,
      lastActive: new Date().toISOString(),
    }

    this.saveUserProfile(updatedProfile)
    return updatedProfile
  }

  // Get time of day for personalized greetings
  getTimeOfDay(): "morning" | "afternoon" | "evening" {
    const hour = new Date().getHours()
    if (hour < 12) return "morning"
    if (hour < 18) return "afternoon"
    return "evening"
  }

  // Check if user is registered
  isRegistered(): boolean {
    const profile = this.getUserProfile()
    return profile ? profile.name !== "" && profile.email !== "" : false
  }

  // Get user context for AI
  getUserContext(): {
    isRegistered: boolean
    profile?: UserProfile
    timeOfDay: string
    planFeatures?: any
  } {
    const profile = this.getUserProfile()
    const isRegistered = this.isRegistered()
    const timeOfDay = this.getTimeOfDay()

    return {
      isRegistered,
      profile: profile || undefined,
      timeOfDay,
    }
  }

  // Clear user data (logout)
  clearUserData(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.storageKey)
  }
}

// Crear instancia del servicio
const userProfileService = new UserProfileService()

// Exportaciones named
export { userProfileService, UserProfileService }
export type { UserProfile }
