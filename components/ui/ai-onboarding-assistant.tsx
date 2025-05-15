"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { GlowBorder } from "./glow-border"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AIOnboardingAssistantProps {
  onUpdateFormData: (data: any) => void
  formData: any
  onComplete: () => void
}

export default function AIOnboardingAssistant({ onUpdateFormData, formData, onComplete }: AIOnboardingAssistantProps) {
  const [inputValue, setInputValue] = useState("")
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your Suitpax setup assistant. I'm here to help you configure your business travel account. Tell me about your company and travel needs, and I'll help you complete the onboarding process. How can I help you today?",
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([
    "I'm a travel manager for a tech company with 200 employees",
    "We need to manage business trips for our sales team across Europe",
    "Our company has offices in Madrid, Barcelona and Valencia",
    "We travel frequently to client meetings and conferences",
    "We prefer business class for long flights and economy for short ones",
    "Our annual travel budget is around €500,000",
  ])
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom of chat when new messages are added
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatHistory])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      // Add user message to chat
      setChatHistory((prev) => [...prev, { role: "user", content: inputValue }])

      // Clear input and show typing indicator
      setInputValue("")
      setIsTyping(true)

      // Process the input and generate AI response
      setTimeout(() => {
        setIsTyping(false)
        processUserInput(inputValue)
      }, 1500)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const processUserInput = (input: string) => {
    // Analyze input and update form data based on content
    const lowerInput = input.toLowerCase()

    // Example processing logic - in a real app, this would be more sophisticated
    let response = "Thank you for sharing that information. "
    const updatedFormData = { ...formData }

    // Company size detection
    if (lowerInput.includes("employees")) {
      const employeeMatch = lowerInput.match(/(\d+)\s+employees/)
      if (employeeMatch && employeeMatch[1]) {
        const count = Number.parseInt(employeeMatch[1])
        if (count <= 10) updatedFormData.teamSize = "1-10"
        else if (count <= 50) updatedFormData.teamSize = "11-50"
        else if (count <= 200) updatedFormData.teamSize = "51-200"
        else if (count <= 500) updatedFormData.teamSize = "201-500"
        else if (count <= 1000) updatedFormData.teamSize = "501-1000"
        else updatedFormData.teamSize = "1001+"

        response += `I've noted that your company has about ${count} employees. `
      }
    }

    // Position detection
    if (lowerInput.includes("travel manager")) {
      updatedFormData.position = "Travel Manager"
      response += "I see you're a Travel Manager. That's great! "
    } else if (lowerInput.includes("hr") || lowerInput.includes("human resources")) {
      updatedFormData.position = "HR Manager"
      response += "I see you work in HR. "
    }

    // Industry detection
    if (lowerInput.includes("tech") || lowerInput.includes("technology")) {
      updatedFormData.industry = "technology"
      response += "I've marked your industry as Technology. "
    } else if (lowerInput.includes("finance") || lowerInput.includes("banking")) {
      updatedFormData.industry = "finance"
      response += "I've marked your industry as Finance. "
    }

    // Budget detection
    const budgetMatch = lowerInput.match(/budget.*?(\d[\d,.]*)\s*(k|thousand|million|m|€|\$)/i)
    if (budgetMatch) {
      let budget = budgetMatch[1].replace(/[,.]/g, "")
      if (budgetMatch[2].toLowerCase() === "k" || budgetMatch[2].toLowerCase() === "thousand") {
        budget += "000"
      } else if (budgetMatch[2].toLowerCase() === "m" || budgetMatch[2].toLowerCase() === "million") {
        budget += "000000"
      }
      updatedFormData.annualBudget = budget.includes("€") || budget.includes("$") ? budget : `€${budget}`
      response += `I've recorded your annual travel budget as ${updatedFormData.annualBudget}. `
    }

    // Travel types detection
    if (lowerInput.includes("conference")) {
      if (!updatedFormData.travelTypes.includes("conferences")) {
        updatedFormData.travelTypes = [...updatedFormData.travelTypes, "conferences"]
      }
      response += "I've added conferences to your travel types. "
    }
    if (lowerInput.includes("client") && lowerInput.includes("meeting")) {
      if (!updatedFormData.travelTypes.includes("client")) {
        updatedFormData.travelTypes = [...updatedFormData.travelTypes, "client"]
      }
      response += "I've added client meetings to your travel types. "
    }

    // Travel frequency detection
    if (lowerInput.includes("daily")) {
      updatedFormData.travelFrequency = "daily"
      response += "I see your team travels daily. "
    } else if (lowerInput.includes("weekly")) {
      updatedFormData.travelFrequency = "weekly"
      response += "I see your team travels weekly. "
    } else if (lowerInput.includes("monthly")) {
      updatedFormData.travelFrequency = "monthly"
      response += "I see your team travels monthly. "
    } else if (lowerInput.includes("frequently")) {
      updatedFormData.travelFrequency = "weekly"
      response += "I understand your team travels frequently. I've marked that as weekly. "
    }

    // Airline preferences
    const airlines = [
      "American Airlines",
      "Delta Air Lines",
      "United Airlines",
      "Southwest Airlines",
      "British Airways",
      "Lufthansa",
      "Air France",
      "Emirates",
      "Qatar Airways",
    ]
    for (const airline of airlines) {
      if (lowerInput.includes(airline.toLowerCase())) {
        if (!updatedFormData.preferredAirlines.includes(airline)) {
          updatedFormData.preferredAirlines = [...updatedFormData.preferredAirlines, airline]
        }
        response += `I've added ${airline} to your preferred airlines. `
      }
    }

    // Update form data
    onUpdateFormData(updatedFormData)

    // Ask follow-up questions based on what's missing
    if (!updatedFormData.companyName) {
      response += "Could you tell me the name of your company?"
    } else if (!updatedFormData.industry) {
      response += "What industry is your company in?"
    } else if (!updatedFormData.teamSize) {
      response += "Approximately how many employees does your company have?"
    } else if (!updatedFormData.travelFrequency) {
      response += "How frequently does your team travel for business?"
    } else if (updatedFormData.travelTypes.length === 0) {
      response +=
        "What types of business travel does your team typically do? For example, client meetings, conferences, etc."
    } else if (!updatedFormData.annualBudget) {
      response += "What's your approximate annual budget for business travel?"
    } else if (updatedFormData.preferredAirlines.length === 0) {
      response += "Do you have any preferred airlines for your business travel?"
    } else if (
      Object.values(updatedFormData).filter((v) => v && (typeof v === "string" ? v.length > 0 : v.length > 0)).length >
      8
    ) {
      // If we have enough information, offer to complete
      response +=
        "I think I have enough information to complete your onboarding. Would you like to review the information I've collected or add anything else before we finish?"
    }

    // Add AI response to chat
    setChatHistory((prev) => [...prev, { role: "assistant", content: response }])

    // Generate new suggestions based on what's missing
    generateNewSuggestions(updatedFormData)
  }

  const generateNewSuggestions = (data: typeof formData) => {
    const newSuggestions: string[] = []

    if (!data.companyName) {
      newSuggestions.push("Our company is called TechSolutions Inc.")
      newSuggestions.push("I work for Global Innovations")
    }

    if (!data.industry) {
      newSuggestions.push("We're in the technology sector")
      newSuggestions.push("Our company is in the healthcare industry")
    }

    if (!data.teamSize) {
      newSuggestions.push("We have about 150 employees")
      newSuggestions.push("Our team consists of 45 people")
    }

    if (!data.travelFrequency) {
      newSuggestions.push("We travel weekly for client meetings")
      newSuggestions.push("Our executives travel monthly for board meetings")
    }

    if (data.travelTypes.length === 0) {
      newSuggestions.push("We mainly travel for conferences and training")
      newSuggestions.push("Most of our travel is for client meetings and corporate retreats")
    }

    if (!data.annualBudget) {
      newSuggestions.push("Our annual travel budget is around €300,000")
      newSuggestions.push("We spend approximately $500K on travel each year")
    }

    if (data.preferredAirlines.length === 0) {
      newSuggestions.push("We prefer flying with Iberia and British Airways")
      newSuggestions.push("Our team usually flies with Lufthansa")
    }

    if (Object.values(data).filter((v) => v && (typeof v === "string" ? v.length > 0 : v.length > 0)).length > 8) {
      newSuggestions.push("That looks good, let's complete the onboarding")
      newSuggestions.push("Can you show me a summary of what you've collected?")
    }

    // If we have enough suggestions, use them; otherwise, keep some of the default ones
    if (newSuggestions.length >= 4) {
      setSuggestions(newSuggestions.slice(0, 6))
    } else {
      setSuggestions([...newSuggestions, ...suggestions].slice(0, 6))
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-3 mb-4 h-80 overflow-y-auto">
        <div className="space-y-3">
          {chatHistory.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-xl p-2.5 text-xs ${
                  message.role === "user" ? "bg-black text-white" : "bg-white border border-gray-200 text-black"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-xl p-2.5 text-xs">
                <div className="flex space-x-1 items-center">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-[10px] bg-gray-100 hover:bg-gray-200 rounded-full px-2.5 py-1 text-gray-700"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <GlowBorder className="glow-blue">
          <div className="flex items-center rounded-xl border-0 bg-white transition-colors overflow-hidden">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your travel preferences here..."
              className="w-full py-1.5 px-2.5 bg-transparent border-none focus:outline-none text-xs text-black"
            />
            <div className="flex items-center gap-1 mr-1">
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className={`p-1.5 rounded-xl transition-colors duration-200 ${
                  inputValue.trim() && !isTyping
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ArrowRightIcon className="h-3 w-3" />
              </button>
            </div>
          </div>
        </GlowBorder>
      </form>

      {/* Complete button - only show when we have enough information */}
      {Object.values(formData).filter((v) => v && (typeof v === "string" ? v.length > 0 : v.length > 0)).length > 8 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={onComplete}
            className="flex items-center px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800"
          >
            <span className="text-xs">Complete Setup</span>
          </button>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mt-4">
        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
          <span>Progress</span>
          <span>
            {Math.min(
              Math.round(
                (Object.values(formData).filter((v) => v && (typeof v === "string" ? v.length > 0 : v.length > 0))
                  .length /
                  10) *
                  100,
              ),
              100,
            )}
            %
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-black h-1 rounded-full transition-all duration-300 ease-in-out"
            style={{
              width: `${Math.min(
                Math.round(
                  (Object.values(formData).filter((v) => v && (typeof v === "string" ? v.length > 0 : v.length > 0))
                    .length /
                    10) *
                    100,
                ),
                100,
              )}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}
