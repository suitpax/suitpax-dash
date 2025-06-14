export const SUITPAX_KNOWLEDGE = {
  company: {
    name: "Suitpax",
    founders: ["Alberto", "Alexis"],
    location: "Confidential location",
    mission: "Leading business travel platform with AI-powered assistance",
    tagline: "Your intelligent travel companion",
  },

  features: {
    travel: {
      flights: "Search and book business flights with real-time pricing",
      hotels: "Find and reserve business accommodations worldwide",
      trains: "Book train tickets for efficient ground transportation",
      transfers: "Airport and city transfer arrangements",
    },
    financial: {
      expenses: "Track, categorize and manage travel expenses",
      banking: "Connect bank accounts for automated expense tracking",
      reporting: "Generate detailed expense reports and analytics",
    },
    management: {
      team: "Manage team travel policies and approvals",
      calendar: "Integrate with calendar for seamless scheduling",
      notifications: "Smart alerts for travel updates and reminders",
    },
    ai: {
      assistant: "24/7 AI support for all travel needs",
      recommendations: "Personalized travel suggestions",
      automation: "Automated booking and expense processing",
    },
  },

  dashboard: {
    sections: [
      "Travel Management (Flights, Hotels, Trains, Transfers)",
      "Financial Management (Expenses, Bank Connect)",
      "Calendar & Meetings Integration",
      "Team Management & Notifications",
      "AI Assistant with Quick Input",
      "Real-time Stats & Analytics",
    ],
  },

  competitive_response:
    "I prefer not to comment on other platforms, but I'm here to help you get the most out of Suitpax's features.",

  specialties: [
    "Corporate travel booking",
    "Expense management automation",
    "Team travel coordination",
    "AI-powered travel assistance",
    "Financial integration",
    "Policy compliance",
  ],
}

export const RESPONSE_TEMPLATES = {
  greeting: "Hey! I'm Suitpax AI. How can I help with your travel needs today?",

  booking: {
    flight: "I can help you find flights. Where are you traveling and when?",
    hotel: "Looking for accommodation? I'll help you find the perfect business hotel.",
    train: "Need train tickets? I can search routes and schedules for you.",
  },

  expenses: {
    add: "Ready to add an expense? I can guide you through the process.",
    report: "I can help generate your expense report. What period do you need?",
  },

  banking: "Want to connect your bank? I'll walk you through our secure connection process.",

  team: "Need help with team management? I can assist with policies and approvals.",

  unknown:
    "I'm not sure about that, but I can help with flights, hotels, expenses, or team management. What would you like to do?",

  competitor: "I prefer not to comment on other platforms, but I'm here to help you get the most out of Suitpax.",
}
