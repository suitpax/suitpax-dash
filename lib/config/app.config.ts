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
      id: "free",
      name: "Free",
      description: "For small business teams getting started with AI travel management",
      price: "€0",
      annualPrice: "€0",
      period: "forever",
      annualPeriod: "forever",
      features: [
        "5,000 AI tokens/month",
        "10 AI travel searches per month",
        "Up to 5 team members",
        "Basic AI travel planning",
        "Email support",
        "Basic expense tracking",
        "Simple itinerary management",
        "Basic travel policy templates",
      ],
      limits: {
        aiQueries: 10,
        trips: 5,
        expenses: 50,
        teamMembers: 5,
      },
      cta: "Get Started",
      badge: "Free",
      popular: false,
    },
    basic: {
      id: "basic",
      name: "Basic",
      description: "For growing teams ready to optimize their travel experience",
      price: "€49",
      annualPrice: "€39",
      period: "per month",
      annualPeriod: "per month, billed annually",
      features: [
        "15,000 AI tokens/month",
        "30 AI travel searches per month",
        "Up to 15 team members",
        "Standard AI travel planning",
        "Priority email support",
        "Advanced expense tracking",
        "Enhanced itinerary management",
        "Standard travel policy templates",
        "Basic CRM integration",
      ],
      limits: {
        aiQueries: 30,
        trips: 25,
        expenses: 500,
        teamMembers: 15,
      },
      cta: "Start 14-day trial",
      badge: "Starter",
      popular: true,
    },
    pro: {
      id: "pro",
      name: "Pro",
      description: "For businesses ready to fully optimize their travel operations",
      price: "€89",
      annualPrice: "€71",
      period: "per month",
      annualPeriod: "per month, billed annually",
      features: [
        "25,000 AI tokens/month",
        "50 AI travel searches per month",
        "Up to 25 team members",
        "AI-powered expense management",
        "Advanced itinerary planning",
        "Custom travel policies",
        "24/5 priority support",
        "Team travel coordination",
        "Basic bank API integration",
        "Advanced CRM intelligence",
      ],
      limits: {
        aiQueries: 50,
        trips: 100,
        expenses: 2000,
        teamMembers: 25,
      },
      cta: "Contact us",
      badge: "Advanced",
      popular: false,
    },
    enterprise: {
      id: "enterprise",
      name: "Enterprise",
      description: "Enterprise-grade travel management for global companies",
      price: "Custom Pricing",
      annualPrice: "Custom Pricing",
      period: "tailored for enterprise",
      annualPeriod: "tailored for enterprise",
      features: [
        "Unlimited AI tokens",
        "Unlimited AI travel searches",
        "Unlimited team members",
        "Full AI travel intelligence suite",
        "Enterprise CRM integration",
        "Global travel compliance",
        "24/7 VIP support",
        "Custom AI workflows",
        "Executive travel program",
        "Full bank API integration",
        "Multi-currency management",
      ],
      limits: {
        aiQueries: -1, // unlimited
        trips: -1,
        expenses: -1,
        teamMembers: -1,
      },
      cta: "Contact Sales",
      badge: "Enterprise",
      popular: false,
    },
  },
} as const

export type AppConfig = typeof APP_CONFIG
export type PricingPlan = keyof typeof APP_CONFIG.pricing
