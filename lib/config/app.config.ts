export const APP_CONFIG = {
  name: "Suitpax",
  version: "1.0.0",
  description: "AI-Powered Business Travel Management Platform",

  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: 30000,
  },

  // AI Configuration
  ai: {
    provider: "anthropic",
    model: "claude-3-haiku-20240307",
    maxTokens: 1000,
  },

  // Storage Configuration
  storage: {
    prefix: "suitpax_",
    version: "1.0",
  },

  // Feature Flags
  features: {
    aiChat: true,
    expenseManagement: true,
    travelBooking: true,
    teamManagement: true,
    analytics: true,
  },

  // Default User Preferences
  defaults: {
    currency: "USD",
    timezone: "UTC",
    language: "en",
    theme: "dark",
  },

  // Pricing Plans
  pricing: {
    free: {
      name: "Free",
      price: 0,
      limits: {
        aiQueries: 10,
        trips: 5,
        expenses: 50,
        teamMembers: 1,
      },
    },
    starter: {
      name: "Starter",
      price: 29,
      limits: {
        aiQueries: 500,
        trips: 25,
        expenses: 500,
        teamMembers: 5,
      },
    },
    business: {
      name: "Business",
      price: 99,
      limits: {
        aiQueries: 2000,
        trips: 100,
        expenses: 2000,
        teamMembers: 25,
      },
    },
    enterprise: {
      name: "Enterprise",
      price: 299,
      limits: {
        aiQueries: -1, // unlimited
        trips: -1,
        expenses: -1,
        teamMembers: -1,
      },
    },
  },
} as const

export type AppConfig = typeof APP_CONFIG
export type PricingPlan = keyof typeof APP_CONFIG.pricing
