// Comprehensive knowledge base about Suitpax for AI responses
export const suitpaxKnowledge = {
  // Company Information
  company: {
    name: "Suitpax",
    description: "Advanced business travel management platform with AI-powered assistance",
    mission: "To revolutionize business travel through intelligent automation and seamless user experience",
    founded: "2024",
    headquarters: "Global (Remote-first)",
    website: "https://suitpax.com",
    tagline: "Smart Business Travel Made Simple",
  },

  // Contact Information
  contact: {
    emails: {
      ai: "ai@suitpax.com",
      general: "hello@suitpax.com",
      support: "support@suitpax.com",
    },
    socialMedia: {
      twitter: "@suitpax",
      linkedin: "linkedin.com/company/suitpax",
      instagram: "@suitpax",
      facebook: "facebook.com/suitpax",
      youtube: "youtube.com/@suitpax",
    },
    website: "https://suitpax.com",
  },

  // Pricing Plans (Updated with correct pricing)
  pricing: {
    free: {
      name: "Free",
      price: "$0",
      billing: "forever",
      description: "Perfect for getting started with business travel",
      features: [
        "Basic travel search",
        "Limited AI queries (10/month)",
        "Standard support",
        "Basic expense tracking",
        "Mobile app access",
      ],
      limits: {
        aiQueries: 10,
        bookings: 5,
        users: 1,
      },
    },
    starter: {
      name: "Starter",
      price: "$29",
      billing: "per month",
      description: "Essential features for small teams",
      features: [
        "Unlimited travel search",
        "AI travel assistant (500 queries/month)",
        "Expense tracking & reporting",
        "Email support",
        "Team collaboration (up to 5 users)",
        "Basic analytics",
      ],
      limits: {
        aiQueries: 500,
        bookings: 50,
        users: 5,
      },
    },
    pro: {
      name: "Pro",
      price: {
        monthly: "$74",
        annual: "$51", // when billed annually
      },
      billing: "per month (or $51/month billed annually)",
      description: "Advanced features for growing businesses",
      features: [
        "Everything in Starter",
        "Advanced AI assistant (2000 queries/month)",
        "Team management (up to 25 users)",
        "Custom travel policies",
        "Priority support",
        "Advanced analytics & reporting",
        "API access",
        "Custom integrations",
      ],
      limits: {
        aiQueries: 2000,
        bookings: 200,
        users: 25,
      },
    },
    enterprise: {
      name: "Enterprise",
      price: "Custom pricing",
      billing: "contact for quote",
      description: "Tailored solutions for large organizations",
      features: [
        "Everything in Pro",
        "Unlimited AI queries",
        "Unlimited users",
        "Dedicated account manager",
        "Custom workflows",
        "White-label options",
        "SLA guarantee",
        "Advanced security & compliance",
        "Custom integrations",
        "24/7 phone support",
      ],
      limits: {
        aiQueries: -1, // unlimited
        bookings: -1, // unlimited
        users: -1, // unlimited
      },
    },
  },

  // Platform Features
  features: {
    dashboard: {
      name: "Smart Dashboard",
      description: "Centralized hub for all travel activities with AI chat integration",
      capabilities: [
        "Real-time travel stats and analytics",
        "Quick action buttons for common tasks",
        "Integrated AI assistant for instant help",
        "Personalized greeting based on time of day and user profile",
        "Recent bookings and activity tracking",
        "Getting started tips for new users",
        "Company-specific travel policies display",
      ],
    },
    flights: {
      name: "Flight Search & Booking",
      description: "Powered by Duffel API for real-time flight data",
      capabilities: [
        "Live flight search across all major airlines",
        "Real-time pricing and availability",
        "Multiple cabin classes (Economy, Premium, Business, First)",
        "Advanced filtering and sorting options",
        "Travel policy compliance checking",
        "Instant booking confirmation",
        "Airport search with IATA codes",
      ],
    },
    hotels: {
      name: "Hotel Reservations",
      description: "Comprehensive hotel booking system",
      capabilities: [
        "Global hotel inventory",
        "Business-focused amenities filtering",
        "Corporate rate integration",
        "Location-based search",
        "Guest reviews and ratings",
        "Flexible cancellation policies",
      ],
    },
    trains: {
      name: "Train Booking",
      description: "European and global train reservation system",
      capabilities: [
        "High-speed rail connections",
        "Multiple class options",
        "Real-time schedules",
        "Route optimization",
        "Seat selection",
        "Digital tickets",
      ],
    },
    transfers: {
      name: "Ground Transportation",
      description: "Complete ground transport solution",
      capabilities: [
        "Airport transfers",
        "City-to-city transport",
        "Hourly car hire",
        "Multiple vehicle types",
        "Professional drivers",
        "Real-time tracking",
      ],
    },
    expenses: {
      name: "Expense Management",
      description: "Automated expense tracking and reporting",
      capabilities: [
        "Receipt scanning and OCR",
        "Automatic categorization",
        "Policy compliance checking",
        "Multi-currency support",
        "Integration with accounting systems",
        "Real-time reporting",
      ],
    },
    aiAgents: {
      name: "AI Agents",
      description: "Specialized AI assistants for different travel needs",
      capabilities: [
        "Flight booking assistance",
        "Hotel recommendations",
        "Expense management help",
        "Travel policy guidance",
        "24/7 support availability",
        "Multi-language support",
      ],
    },
    smartBank: {
      name: "Smart Bank AI",
      description: "Financial intelligence for business travel",
      capabilities: [
        "Expense forecasting",
        "Budget optimization",
        "Currency exchange insights",
        "Cost analysis and reporting",
        "Payment method recommendations",
        "Financial compliance monitoring",
      ],
    },
    suitpaxAI: {
      name: "Suitpax AI Assistant",
      description: "Main AI assistant for the platform",
      capabilities: [
        "Natural language travel booking",
        "Personalized recommendations based on user profile",
        "Travel itinerary management",
        "Real-time assistance",
        "Context-aware responses",
        "Integration with all platform features",
        "User recognition and personalization",
      ],
    },
  },

  // User Types and Roles
  userTypes: {
    traveler: {
      name: "Business Traveler",
      description: "Individual who books and manages their own travel",
      permissions: ["book travel", "manage expenses", "view reports"],
    },
    manager: {
      name: "Travel Manager",
      description: "Oversees team travel and approves bookings",
      permissions: ["approve bookings", "manage team", "view analytics", "set policies"],
    },
    admin: {
      name: "Company Administrator",
      description: "Full access to company travel management",
      permissions: ["full access", "user management", "billing", "integrations"],
    },
    finance: {
      name: "Finance Team",
      description: "Manages budgets and expense reporting",
      permissions: ["expense approval", "budget management", "financial reports"],
    },
  },

  // Technical Stack
  technology: {
    frontend: "Next.js 14 with TypeScript and Tailwind CSS",
    backend: "Node.js with API routes",
    database: "Neon PostgreSQL",
    ai: "Anthropic Claude 3.5 Sonnet",
    apis: [
      "Duffel API for flights",
      "Nylas API for email and calendar",
      "Google APIs for authentication",
      "Custom hotel and transport APIs",
    ],
    deployment: "Vercel with edge functions",
    styling: "Custom dark theme with glassmorphism effects",
  },

  // AI Personality
  aiPersonality: {
    tone: "Professional yet friendly, personalized and helpful",
    expertise: "Business travel, expense management, and platform navigation",
    responseStyle: "Personalized, concise responses with user-specific suggestions",
    greeting: "Personalized greeting using user's name and company context",
    capabilities: [
      "Recognize and remember user details",
      "Provide personalized recommendations",
      "Answer questions about platform features",
      "Help with booking processes",
      "Assist with expense management",
      "Guide through platform navigation",
      "Offer troubleshooting support",
      "Explain pricing plans and features",
    ],
  },

  // Support Information
  support: {
    availability: "24/7 AI assistance with human escalation",
    channels: ["In-app chat", "Email support (hello@suitpax.com)", "AI support (ai@suitpax.com)"],
    responseTime: "Instant AI responses, human support within 2 hours",
    languages: ["English", "Spanish", "French", "German", "Italian"],
  },
}

// Helper functions for AI responses
export const getFeatureInfo = (featureName: string) => {
  const feature = suitpaxKnowledge.features[featureName as keyof typeof suitpaxKnowledge.features]
  return feature || null
}

export const getPricingInfo = (planName: string) => {
  const plan = suitpaxKnowledge.pricing[planName as keyof typeof suitpaxKnowledge.pricing]
  return plan || null
}

export const getUserTypeInfo = (userType: string) => {
  const type = suitpaxKnowledge.userTypes[userType as keyof typeof suitpaxKnowledge.userTypes]
  return type || null
}

export const getPersonalizedGreeting = (userName?: string, company?: string, timeOfDay?: string) => {
  const greetings = {
    morning: ["Good morning", "Buenos días", "Morning"],
    afternoon: ["Good afternoon", "Buenas tardes", "Afternoon"],
    evening: ["Good evening", "Buenas noches", "Evening"],
    default: ["Hello", "Hi", "Welcome back"],
  }

  const timeGreeting = timeOfDay
    ? greetings[timeOfDay as keyof typeof greetings] || greetings.default
    : greetings.default
  const greeting = timeGreeting[Math.floor(Math.random() * timeGreeting.length)]

  if (userName && company) {
    return `${greeting} ${userName}! I'm your Suitpax AI Agent, ready to help with ${company}'s business travel needs.`
  } else if (userName) {
    return `${greeting} ${userName}! I'm your Suitpax AI Agent, how can I assist with your business travel today?`
  } else {
    return `${greeting}! I'm your Suitpax AI Agent, here to help streamline your business travel.`
  }
}

export const getContextualResponse = (userMessage: string, conversationHistory: any[] = [], userProfile?: any) => {
  const isFirstMessage = conversationHistory.length === 0
  const hasGreeted = conversationHistory.some(
    (msg) =>
      msg.role === "assistant" &&
      (msg.content.toLowerCase().includes("suitpax ai agent") ||
        msg.content.toLowerCase().includes("good morning") ||
        msg.content.toLowerCase().includes("hello")),
  )

  // Determine response style based on context
  if (isFirstMessage || !hasGreeted) {
    return {
      shouldIntroduce: true,
      tone: "welcoming",
      includeCapabilities: true,
      personalizeGreeting: true,
      userProfile,
    }
  }

  return {
    shouldIntroduce: false,
    tone: "conversational",
    includeCapabilities: false,
    personalizeGreeting: false,
    userProfile,
  }
}

export const getRandomTip = (userType?: string) => {
  const generalTips = [
    "Use the AI chat for quick bookings - just describe what you need!",
    "Set up travel policies to ensure compliance across your team.",
    "The expense scanner can automatically categorize receipts.",
    "Book flights early for better rates and availability.",
    "Use the dashboard analytics to optimize your travel budget.",
  ]

  const managerTips = [
    "Review team travel patterns in the analytics dashboard.",
    "Set up approval workflows for better expense control.",
    "Use bulk booking features for team travel.",
  ]

  const tips = userType === "manager" ? [...generalTips, ...managerTips] : generalTips
  return tips[Math.floor(Math.random() * tips.length)]
}
