// This script would combine all prompt files into a single array
// In a real implementation, this would be run as part of the build process
// For now, we'll create a combined file directly

const allPrompts = [
  // Flight Booking prompts
  {
    id: "flight-search-1",
    category: "Flight Booking",
    prompt: "Find me the cheapest flights from New York to London next month",
    tags: ["flights", "budget", "international"],
  },
  // ... more flight prompts ...

  // Hotel Booking prompts
  {
    id: "hotel-search-1",
    category: "Hotel Booking",
    prompt: "Find me a 5-star hotel in Paris with a view of the Eiffel Tower",
    tags: ["hotels", "luxury", "views", "international"],
  },
  // ... more hotel prompts ...

  // Travel Policy prompts
  {
    id: "policy-1",
    category: "Travel Policy",
    prompt: "What are our company's flight class policies for international travel?",
    tags: ["policy", "flights", "international"],
  },
  // ... more policy prompts ...

  // Expense Management prompts
  {
    id: "expense-1",
    category: "Expense Management",
    prompt: "How do I categorize a business meal with clients?",
    tags: ["expenses", "meals", "categorization"],
  },
  // ... more expense prompts ...

  // Task Management prompts
  {
    id: "task-1",
    category: "Task Management",
    prompt: "How do I create a pre-trip checklist for my business travel?",
    tags: ["tasks", "checklist", "preparation"],
  },
  // ... more task prompts ...

  // AI Assistance prompts
  {
    id: "ai-1",
    category: "AI Assistance",
    prompt: "Can you help me plan an itinerary for a 3-day business trip to London?",
    tags: ["ai", "itinerary", "planning", "international"],
  },
  // ... more AI prompts ...

  // General prompts
  {
    id: "general-1",
    category: "General",
    prompt: "What are the benefits of using Suitpax for business travel management?",
    tags: ["general", "benefits", "platform"],
  },
  // ... more general prompts ...
]

// In a real implementation, this would write to a file
// For now, we'll just log the count
console.log(`Combined ${allPrompts.length} prompts`)
