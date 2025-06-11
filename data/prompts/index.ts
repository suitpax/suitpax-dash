// Main file that exports all prompts organized by categories
import { businessTravelPrompts } from "./business-travel"
import { flightBookingPrompts } from "./flight-booking"
import { hotelBookingPrompts } from "./hotel-booking"
import { expenseManagementPrompts } from "./expense-management"
import { transportationPrompts } from "./transportation"

// Verify that prompts exist before using them
const ensureArray = (data: any) => (Array.isArray(data) ? data : [])

// Prompts for the AI assistant (responses that the AI can give)
export const aiPrompts = {
  businessTravel: ensureArray(businessTravelPrompts?.aiResponses),
  flightBooking: ensureArray(flightBookingPrompts?.aiResponses),
  hotelBooking: ensureArray(hotelBookingPrompts?.aiResponses),
  expenseManagement: ensureArray(expenseManagementPrompts?.aiResponses),
  transportation: ensureArray(transportationPrompts?.aiResponses),
}

// Prompts for users (questions that users can ask)
export const userPrompts = {
  businessTravel: ensureArray(businessTravelPrompts?.userQuestions),
  flightBooking: ensureArray(flightBookingPrompts?.userQuestions),
  hotelBooking: ensureArray(hotelBookingPrompts?.userQuestions),
  expenseManagement: ensureArray(expenseManagementPrompts?.userQuestions),
  transportation: ensureArray(transportationPrompts?.userQuestions),
}

// Categories to display in the interface
export const promptCategories = [
  { id: "businessTravel", name: "Business Travel", icon: "Briefcase" },
  { id: "flightBooking", name: "Flights", icon: "Plane" },
  { id: "hotelBooking", name: "Hotels", icon: "Building" },
  { id: "expenseManagement", name: "Expenses", icon: "Receipt" },
  { id: "transportation", name: "Transportation", icon: "Car" },
]

// Function to get random prompts from a specific category
export function getRandomPrompts(category: string, count = 3): string[] {
  const categoryPrompts = userPrompts[category as keyof typeof userPrompts] || []
  if (!Array.isArray(categoryPrompts) || categoryPrompts.length === 0) {
    return []
  }
  const shuffled = [...categoryPrompts].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

// Function to get random prompts from all categories
export function getRandomPromptsFromAll(count = 5): string[] {
  // Create an array with all available prompts
  const allPrompts: string[] = []

  // Add only if the array exists and has elements
  if (Array.isArray(userPrompts.businessTravel)) {
    allPrompts.push(...userPrompts.businessTravel)
  }
  if (Array.isArray(userPrompts.flightBooking)) {
    allPrompts.push(...userPrompts.flightBooking)
  }
  if (Array.isArray(userPrompts.hotelBooking)) {
    allPrompts.push(...userPrompts.hotelBooking)
  }
  if (Array.isArray(userPrompts.expenseManagement)) {
    allPrompts.push(...userPrompts.expenseManagement)
  }
  if (Array.isArray(userPrompts.transportation)) {
    allPrompts.push(...userPrompts.transportation)
  }

  // If there are no available prompts, return empty array
  if (allPrompts.length === 0) {
    return []
  }

  // Shuffle and return the requested number
  const shuffled = [...allPrompts].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

// Export everything for use in the application
export default {
  aiPrompts,
  userPrompts,
  promptCategories,
  getRandomPrompts,
  getRandomPromptsFromAll,
}
