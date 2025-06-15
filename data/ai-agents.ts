// Specialized AI Agents for Suitpax Platform
export interface AIAgent {
  id: string
  name: string
  specialty: string
  avatar: string
  description: string
  languages: string[]
  expertise: string[]
  capabilities: string[]
}

export const AI_AGENTS: AIAgent[] = [
  {
    id: "financial-analyst",
    name: "Sofia Chen",
    specialty: "Financial Analysis & Budget Optimization",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250404-WA0000.jpg-IFtn5wbJu4Kr3JQTWByiULJL2kOmgN.jpeg",
    description: "Expert in corporate travel budgets, expense optimization, and financial forecasting",
    languages: ["English", "Spanish", "Chinese", "Portuguese"],
    expertise: [
      "Budget analysis and optimization",
      "Expense categorization and tracking",
      "Financial forecasting and planning",
      "Cost reduction strategies",
      "ROI analysis for travel programs",
      "Currency exchange optimization",
    ],
    capabilities: [
      "Analyze spending patterns",
      "Identify cost-saving opportunities",
      "Generate financial reports",
      "Budget variance analysis",
      "Expense policy compliance",
    ],
  },
  {
    id: "travel-policy-expert",
    name: "Marcus Johnson",
    specialty: "Travel Policy & Compliance",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250405-WA0009.jpg-XnCM94FAs3Hu80FNwuobHwZViYGgUu.jpeg",
    description: "Specialist in corporate travel policies, compliance, and approval workflows",
    languages: ["English", "Spanish", "French", "German"],
    expertise: [
      "Corporate travel policy development",
      "Compliance monitoring and enforcement",
      "Approval workflow optimization",
      "Risk management and duty of care",
      "Vendor management and negotiations",
      "Regulatory compliance (GDPR, SOX, etc.)",
    ],
    capabilities: [
      "Policy approval/rejection decisions",
      "Compliance risk assessment",
      "Workflow automation",
      "Vendor evaluation",
      "Risk mitigation strategies",
    ],
  },
  {
    id: "global-travel-specialist",
    name: "Aria Nakamura",
    specialty: "Global Travel & Logistics",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250324-WA0007.jpg-ZkV0idWi0oV9Kp6KC0zvagvZu0fhO4.jpeg",
    description: "Expert in international travel, visas, and global logistics coordination",
    languages: ["English", "Japanese", "Korean", "Chinese", "Russian"],
    expertise: [
      "International travel requirements",
      "Visa and documentation assistance",
      "Global airline and hotel partnerships",
      "Multi-city itinerary optimization",
      "Cultural business etiquette",
      "Time zone and jet lag management",
    ],
    capabilities: [
      "Visa requirement checking",
      "Complex itinerary planning",
      "Cultural guidance",
      "Global vendor coordination",
      "Emergency travel assistance",
    ],
  },
  {
    id: "sustainability-advisor",
    name: "Emma Lindqvist",
    specialty: "Sustainable Travel & Carbon Management",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250405-WA0007.jpg-oFuAlxAvCyTii4a2GEsdRGcRZ7vovp.jpeg",
    description: "Focused on sustainable travel practices and carbon footprint reduction",
    languages: ["English", "Swedish", "Norwegian", "Danish", "German"],
    expertise: [
      "Carbon footprint calculation and reduction",
      "Sustainable travel alternatives",
      "Green hotel and airline partnerships",
      "ESG reporting for travel programs",
      "Renewable energy in travel",
      "Circular economy principles",
    ],
    capabilities: [
      "Carbon impact analysis",
      "Sustainable route planning",
      "Green vendor recommendations",
      "ESG compliance reporting",
      "Offset program management",
    ],
  },
  {
    id: "tech-integration-specialist",
    name: "Alex Rivera",
    specialty: "Technology Integration & Automation",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250327-WA0039.jpg-talwrBKz1iCREoDiqQ2iWRoT6Vzu3j.jpeg",
    description: "Expert in travel technology, API integrations, and workflow automation",
    languages: ["English", "Spanish", "Portuguese", "French"],
    expertise: [
      "API integrations and development",
      "Workflow automation design",
      "Data analytics and visualization",
      "Mobile app optimization",
      "AI/ML implementation",
      "Cybersecurity for travel data",
    ],
    capabilities: [
      "Custom integration development",
      "Automation workflow creation",
      "Data analysis and insights",
      "Technical troubleshooting",
      "Security assessment",
    ],
  },
  {
    id: "executive-assistant",
    name: "Zara Williams",
    specialty: "Executive Travel & VIP Services",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250326-WA0006_1.jpg-LgOmcA86wnY0q6ifPlUfaMZqhAVN8p.jpeg",
    description: "Specialized in C-level executive travel and premium service coordination",
    languages: ["English", "French", "Arabic", "Spanish"],
    expertise: [
      "Executive travel coordination",
      "VIP lounge and service access",
      "Private jet and luxury accommodations",
      "High-stakes meeting logistics",
      "Confidential travel arrangements",
      "Crisis management and contingency planning",
    ],
    capabilities: [
      "Executive itinerary management",
      "VIP service coordination",
      "Confidential booking handling",
      "Emergency response planning",
      "Luxury vendor management",
    ],
  },
]

// Agent selection based on query type
export function selectOptimalAgent(query: string, userProfile?: any): AIAgent {
  const queryLower = query.toLowerCase()

  // Financial keywords
  if (
    queryLower.includes("budget") ||
    queryLower.includes("cost") ||
    queryLower.includes("expense") ||
    queryLower.includes("financial") ||
    queryLower.includes("money") ||
    queryLower.includes("price")
  ) {
    return AI_AGENTS[0] // Sofia Chen - Financial Analyst
  }

  // Policy keywords
  if (
    queryLower.includes("policy") ||
    queryLower.includes("approval") ||
    queryLower.includes("compliance") ||
    queryLower.includes("rule") ||
    queryLower.includes("allowed")
  ) {
    return AI_AGENTS[1] // Marcus Johnson - Policy Expert
  }

  // International travel keywords
  if (
    queryLower.includes("visa") ||
    queryLower.includes("international") ||
    queryLower.includes("passport") ||
    queryLower.includes("global") ||
    queryLower.includes("country")
  ) {
    return AI_AGENTS[2] // Aria Nakamura - Global Travel
  }

  // Sustainability keywords
  if (
    queryLower.includes("carbon") ||
    queryLower.includes("sustainable") ||
    queryLower.includes("green") ||
    queryLower.includes("environment") ||
    queryLower.includes("offset")
  ) {
    return AI_AGENTS[3] // Emma Lindqvist - Sustainability
  }

  // Technology keywords
  if (
    queryLower.includes("api") ||
    queryLower.includes("integration") ||
    queryLower.includes("code") ||
    queryLower.includes("automation") ||
    queryLower.includes("tech")
  ) {
    return AI_AGENTS[4] // Alex Rivera - Tech Integration
  }

  // Executive keywords
  if (
    queryLower.includes("executive") ||
    queryLower.includes("vip") ||
    queryLower.includes("luxury") ||
    queryLower.includes("private") ||
    queryLower.includes("premium")
  ) {
    return AI_AGENTS[5] // Zara Williams - Executive Assistant
  }

  // Default to financial analyst for general queries
  return AI_AGENTS[0]
}
