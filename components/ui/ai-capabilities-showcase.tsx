"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import {
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  CreditCardIcon,
  MapIcon,
  CalendarIcon,
  LanguageIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"

interface CapabilityProps {
  icon: React.ReactNode
  title: string
  description: string
  examples: string[]
}

const capabilities: CapabilityProps[] = [
  {
    icon: <PaperAirplaneIcon className="h-6 w-6" />,
    title: "Flight Booking",
    description: "Find and book flights based on your preferences and company policy.",
    examples: [
      "Find me a flight from Chicago to Seattle next Tuesday",
      "What's the cheapest business class option to Tokyo next month?",
      "Are there any direct flights from Boston to San Francisco tomorrow?",
      "Can I get a window seat on my upcoming flight?",
    ],
  },
  {
    icon: <BuildingOfficeIcon className="h-6 w-6" />,
    title: "Hotel Recommendations",
    description: "Discover and book accommodations that meet your needs and budget.",
    examples: [
      "I need a hotel near the convention center in Dallas",
      "Find me a business-friendly hotel in London with gym access",
      "What hotels in Chicago offer corporate rates for our company?",
      "Book me a room at the Marriott in San Francisco for next week",
    ],
  },
  {
    icon: <DocumentTextIcon className="h-6 w-6" />,
    title: "Travel Policy Guidance",
    description: "Get instant answers about your company's travel policies and compliance.",
    examples: [
      "What's our policy on business class flights?",
      "Am I allowed to book a 5-star hotel for my client meeting?",
      "What's the per diem rate for meals in Tokyo?",
      "Do I need approval for my trip to Germany?",
    ],
  },
  {
    icon: <CreditCardIcon className="h-6 w-6" />,
    title: "Expense Management",
    description: "Simplify tracking, submitting, and managing your business travel expenses.",
    examples: [
      "How do I submit my taxi receipts from my Boston trip?",
      "What expenses are reimbursable for my upcoming conference?",
      "I lost a receipt for dinner last night, what should I do?",
      "Can you categorize my recent expenses by project?",
    ],
  },
  {
    icon: <MapIcon className="h-6 w-6" />,
    title: "Local Transportation",
    description: "Get guidance on ground transportation options at your destination.",
    examples: [
      "What's the best way to get from JFK airport to Manhattan?",
      "Should I rent a car in London or use public transport?",
      "Book me an airport transfer for my arrival in Singapore",
      "How much should a taxi cost from my hotel to the convention center?",
    ],
  },
  {
    icon: <CalendarIcon className="h-6 w-6" />,
    title: "Meeting Planning",
    description: "Organize and schedule business meetings during your travels.",
    examples: [
      "Find a meeting room for 10 people near our Chicago office",
      "Schedule a team dinner in Boston next Thursday",
      "What conference rooms are available at the Hilton?",
      "Book a video conference setup for my presentation",
    ],
  },
  {
    icon: <LanguageIcon className="h-6 w-6" />,
    title: "International Travel",
    description: "Get assistance with visa requirements, cultural tips, and local information.",
    examples: [
      "What documents do I need for my business trip to Japan?",
      "Are there any travel advisories for Brazil right now?",
      "What's the tipping etiquette in Germany?",
      "Do I need a visa for my 3-day trip to China?",
    ],
  },
  {
    icon: <ClockIcon className="h-6 w-6" />,
    title: "Itinerary Management",
    description: "Keep track of your travel plans and get timely updates and reminders.",
    examples: [
      "Show me my itinerary for next week's trip",
      "Add a dinner meeting to my London trip on Tuesday",
      "Will I have enough time to make my connecting flight?",
      "Remind me to check in for my flight tomorrow",
    ],
  },
]

export default function AICapabilitiesShowcase() {
  const [activeCapability, setActiveCapability] = useState(0)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-medium tracking-tighter">AI Assistant Capabilities</h2>
        <p className="text-gray-600 mt-2">
          Discover how our AI assistant can help streamline your business travel experience.
        </p>
      </div>

      <div className="grid md:grid-cols-3 divide-x divide-y divide-gray-200">
        <div className="md:col-span-1 border-r border-gray-200">
          <nav className="flex flex-col">
            {capabilities.map((capability, index) => (
              <button
                key={index}
                className={`flex items-center px-6 py-4 text-left transition-colors ${
                  activeCapability === index
                    ? "bg-gray-100 border-l-4 border-black"
                    : "hover:bg-gray-50 border-l-4 border-transparent"
                }`}
                onClick={() => setActiveCapability(index)}
              >
                <div className="mr-3 text-gray-700">{capability.icon}</div>
                <span className="font-medium">{capability.title}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="md:col-span-2 p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="mr-3 p-2 bg-gray-100 rounded-lg text-gray-700">{capabilities[activeCapability].icon}</div>
              <h3 className="text-xl font-medium">{capabilities[activeCapability].title}</h3>
            </div>
            <p className="text-gray-600">{capabilities[activeCapability].description}</p>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">Example Questions</h4>
            <ul className="space-y-2">
              {capabilities[activeCapability].examples.map((example, index) => (
                <li key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                  "{example}"
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-6">
            <div className="flex items-center mb-3">
              <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
                <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Try it now</h4>
                <p className="text-xs text-gray-500">
                  Ask our AI assistant about {capabilities[activeCapability].title.toLowerCase()}
                </p>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder={`Ask about ${capabilities[activeCapability].title.toLowerCase()}...`}
                className="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-black rounded-full text-white">
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
