"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { MicrophoneIcon } from "@heroicons/react/24/outline"
import { PaperClipIcon } from "@heroicons/react/24/outline"
import { GlowBorder } from "./glow-border"
import { useRouter } from "next/navigation"

// Sample conversation scenarios
const CONVERSATION_SCENARIOS = [
  {
    title: "Flight Booking",
    messages: [
      { text: "I need to book a flight from Madrid to London with British Airways for next week", isUser: true },
      {
        text: "I'd be happy to help you book a flight from Madrid to London with British Airways for next week. Let me search for available options...\n\nI've found several flights for next week:\n\n1. BA456 - Monday, May 20\n   Departure: 08:25 AM (MAD)\n   Arrival: 10:05 AM (LHR)\n   Price: €320\n\n2. BA782 - Monday, May 20\n   Departure: 14:40 PM (MAD)\n   Arrival: 16:20 PM (LHR)\n   Price: €295\n\n3. BA498 - Tuesday, May 21\n   Departure: 07:15 AM (MAD)\n   Arrival: 08:55 AM (LHR)\n   Price: €310\n\nWould you like me to book any of these options for you?",
        isUser: false,
      },
      { text: "The second option looks good. Can you book that one for me?", isUser: true },
      {
        text: "I'll book the second option for you:\n\nBritish Airways BA782\nMonday, May 20\nMadrid (MAD) to London Heathrow (LHR)\nDeparture: 14:40 PM\nArrival: 16:20 PM\nPrice: €295\n\nI've completed the booking and sent the confirmation to your email. Your booking reference is SUITPAX-BA782. You can view all the details in the Flights section of your dashboard.\n\nWould you like me to help with anything else for your trip, such as hotel accommodations or transportation in London?",
        isUser: false,
      },
    ],
  },
  {
    title: "Hotel Recommendation",
    messages: [
      { text: "I need a hotel in Chicago near the financial district for next week", isUser: true },
      {
        text: "I'll help you find a hotel in Chicago's financial district for next week. Based on your company's travel policy and your preferences from previous stays, here are my top recommendations:\n\n1. Hyatt Place Chicago/Downtown - The Loop\n   • €220/night (within your company's rate cap for Chicago)\n   • 4.5/5 rating from business travelers\n   • Includes breakfast and high-speed WiFi\n   • 5-minute walk to your meeting location\n   • Fitness center and business center available 24/7\n\n2. Kimpton Gray Hotel\n   • €245/night\n   • 4.7/5 rating from business travelers\n   • Complimentary wine hour and morning coffee\n   • 8-minute walk to your meeting location\n   • Rooftop bar and on-site restaurant\n\n3. Club Quarters Hotel, Central Loop\n   • €195/night\n   • 4.3/5 rating from business travelers\n   • Complimentary coffee/tea and purified bottled water\n   • 7-minute walk to your meeting location\n   • Smart TV with streaming capabilities\n\nWould you like me to book any of these options for you?",
        isUser: false,
      },
      { text: "The Hyatt Place sounds perfect. Can you book it for May 15-18?", isUser: true },
      {
        text: "I've booked your stay at Hyatt Place Chicago/Downtown - The Loop for May 15-18 (3 nights).\n\nConfirmation details:\n• Confirmation number: HYP-CHI-58721\n• Check-in: May 15, after 3:00 PM\n• Check-out: May 18, before 12:00 PM\n• Room type: King Bed with City View (as per your preference)\n• Rate: €220/night (€660 total + €79.20 taxes and fees = €739.20)\n• Payment: Charged to your corporate card ending in 4892\n• Cancellation policy: Free cancellation until May 13\n\nI've added this reservation to your calendar and sent the details to your email. The hotel is located at 28 N Franklin St, Chicago, IL 60606, which is a 5-minute walk from your meeting location at Willis Tower.\n\nWould you like me to arrange airport transportation or make any restaurant reservations for your stay?",
        isUser: false,
      },
    ],
  },
  {
    title: "Travel Policy Question",
    messages: [
      { text: "What's our company policy on business class flights?", isUser: true },
      {
        text: "According to your company's travel policy, business class flights are permitted under the following conditions:\n\n1. Flight duration:\n   • Flights over 6 hours: Business class permitted\n   • Flights under 6 hours: Economy class required\n\n2. Exceptions by position:\n   • C-level executives: Business class permitted for all flights\n   • Directors and VPs: Business class permitted for flights over 4 hours\n   • All other employees: Standard duration rule applies (6+ hours)\n\n3. Special circumstances (requires manager approval):\n   • Red-eye flights with immediate business meetings upon arrival\n   • Medical accommodations with proper documentation\n   • Client-mandated travel where the client is covering expenses\n\n4. Booking requirements:\n   • All business class bookings must be made at least 14 days in advance\n   • Must use the company's preferred airlines when available\n   • Must be booked through the Suitpax platform\n\nBased on your position as Senior Manager, you are eligible for business class on flights over 6 hours. Would you like me to check if your upcoming trip qualifies?",
        isUser: false,
      },
      { text: "Yes, please check for my trip to Tokyo next month", isUser: true },
      {
        text: "I've checked your upcoming trip to Tokyo scheduled for June 15-22:\n\nFlight details:\n• Madrid to Tokyo Haneda: 13 hours 25 minutes duration\n• Return Tokyo Haneda to Madrid: 14 hours 10 minutes duration\n\nBased on your company's travel policy, you are eligible for business class on both flights since:\n1. The flight duration exceeds 6 hours\n2. The booking is being made more than 14 days in advance\n3. The route is served by JAL, which is one of your company's preferred airlines\n\nWould you like me to search for business class options for these flights? The estimated cost difference between economy and business class is approximately €2,800 for the round trip, which is within your department's budget for international travel.",
        isUser: false,
      },
    ],
  },
  {
    title: "Travel Budget Planning",
    messages: [
      { text: "I need to create a travel budget for our team's quarterly meeting in Chicago.", isUser: true },
      {
        text: "I'd be happy to help you create a travel budget for your team's quarterly meeting in Chicago. To provide an accurate estimate, could you share:\n\n1. How many team members will be traveling?\n2. The planned dates for the meeting?\n3. Will everyone be traveling from the same location or different cities?\n4. Any specific requirements (hotel category, meal preferences, etc.)?",
        isUser: false,
      },
      {
        text: "We'll have 8 team members traveling from different cities (NYC, SF, Austin, and Miami) for a 3-day meeting from August 10-12. We usually stay at business hotels and need a meeting room for the full 3 days.",
        isUser: true,
      },
      {
        text: "Based on your requirements, I've prepared a comprehensive travel budget for your 8-person team meeting in Chicago from August 10-12. Here's the breakdown:\n\n**Airfare:**\n- NYC to Chicago (2 people): $350 × 2 = $700\n- SF to Chicago (2 people): $550 × 2 = $1,100\n- Austin to Chicago (2 people): $400 × 2 = $800\n- Miami to Chicago (2 people): $450 × 2 = $900\n**Total Airfare: $3,500**\n\n**Accommodation:**\n- Marriott Chicago Downtown: $259/night × 3 nights × 8 rooms = $6,216\n- Taxes and fees (17.4%): $1,082\n**Total Accommodation: $7,298**\n\n**Meeting Space:**\n- Conference room for 8-10 people: $800/day × 3 days = $2,400\n- AV equipment package: $250/day × 3 days = $750\n**Total Meeting Space: $3,150**\n\n**Ground Transportation:**\n- Airport transfers: $60/person × 8 people × 2 ways = $960\n- Daily transportation allowance: $30/day × 3 days × 8 people = $720\n**Total Transportation: $1,680**\n\n**Meals:**\n- Breakfast (included in hotel rate): $0\n- Lunch: $35/person × 3 days × 8 people = $840\n- Dinner: $75/person × 3 days × 8 people = $1,800\n- Snacks/coffee breaks: $20/person × 3 days × 8 people = $480\n**Total Meals: $3,120**\n\n**Miscellaneous:**\n- Wi-Fi and business center: Included in hotel rate\n- Contingency (10% of total): $1,875\n\n**ESTIMATED TOTAL BUDGET: $20,623**\n\nThis budget aligns with your company's travel policy guidelines. Would you like me to adjust any specific category or provide more detailed information?",
        isUser: false,
      },
    ],
  },
  {
    title: "Travel Insurance Claim",
    messages: [
      { text: "My flight was cancelled and I had to book a hotel. How do I file an insurance claim?", isUser: true },
      {
        text: "I'm sorry to hear about your flight cancellation. I'll help you file an insurance claim for your additional hotel expenses. Here's the step-by-step process for your company's travel insurance policy with AIG Business Travel:\n\n1. **Gather Documentation**:\n   - Flight cancellation notice/email from the airline\n   - Original flight itinerary and boarding pass\n   - Receipt for the hotel accommodation\n   - Any additional expenses receipts (meals, transportation)\n   - Any communication with the airline about compensation\n\n2. **Complete the Claim Form**:\n   - Log in to the AIG Business Travel portal at travel.aig.com/business\n   - Select \"New Claim\" and choose \"Trip Delay/Cancellation\"\n   - Enter your policy number: BT-4567890\n   - Complete all required fields with details of the cancellation\n   - Upload all documentation mentioned above\n\n3. **Submission Timeline**:\n   - Submit within 30 days of the incident for fastest processing\n   - Claims typically process within 7-10 business days\n\n4. **Reimbursement Method**:\n   - You can select direct deposit or check\n   - For company card expenses, reimbursement can go directly to the corporate account\n\nWould you like me to help you start this process now? I can pre-fill the claim form with the information I have from your travel profile.",
        isUser: false,
      },
      {
        text: "Yes, please help me start the claim. My United flight UA1234 from Chicago to Boston was cancelled yesterday due to weather. I had to stay at the Hilton Chicago O'Hare for one night ($225) and had additional meal expenses of about $65.",
        isUser: true,
      },
      {
        text: "I've started your claim process and pre-filled the form with the information you provided. Here's what I've done:\n\n1. **Created Claim #AIG-78945612** in the system\n\n2. **Pre-filled information:**\n   - Policy #: BT-4567890 (your company policy)\n   - Traveler: Your name and details from profile\n   - Incident date: May 15, 2023 (yesterday)\n   - Flight details: United Airlines UA1234, Chicago to Boston\n   - Reason for cancellation: Weather (this is covered under your policy)\n   - Accommodation: Hilton Chicago O'Hare - $225\n   - Meals: $65\n   - Total claim amount: $290\n\n3. **Required documentation** (marked as pending):\n   - United Airlines cancellation notice\n   - Hotel receipt\n   - Meal receipts\n\nThe partially completed claim is saved in your account. To finalize it:\n\n1. Log in to travel.aig.com/business with your company credentials\n2. Go to \"My Claims\" and select claim #AIG-78945612\n3. Upload the required documentation in the \"Documents\" section\n4. Review all information and submit\n\nI've also sent these instructions to your email. Your claim qualifies for expedited processing, so you should receive reimbursement within 5-7 business days after submission. Would you like me to set a reminder to follow up on the status next week?",
        isUser: false,
      },
    ],
  },
  {
    title: "Team Travel Planning",
    messages: [
      { text: "I need to organize travel for 5 team members to our conference in Berlin next month", isUser: true },
      {
        text: "I'll help you organize travel for your 5-team member trip to Berlin for the conference next month. Let me gather some key information first:\n\n1. The conference is TechEurope 2023 at Berlin ExpoCenter, June 15-17\n2. Your team members are located in: Madrid (2), Paris (1), London (1), and Rome (1)\n3. Based on your company policy, you'll need:\n   - Economy flights (under 6 hours)\n   - 4-star hotel accommodations\n   - Ground transportation\n   - Per diem allowances\n\nHere's my proposed travel plan:\n\n**Flights:**\n- Madrid to Berlin (2): Lufthansa LH1113, June 14, 10:25-13:05, €245/person\n- Paris to Berlin (1): Air France AF1734, June 14, 09:15-11:00, €220/person\n- London to Berlin (1): British Airways BA982, June 14, 08:30-11:15, €255/person\n- Rome to Berlin (1): Alitalia AZ422, June 14, 11:40-13:55, €265/person\n\n**Accommodation:**\n- Maritim Hotel Berlin (4-star)\n- 5 rooms, June 14-18 (4 nights)\n- €159/night per room (corporate rate)\n- 10-minute walk to the conference venue\n- Includes breakfast and WiFi\n\n**Ground Transportation:**\n- Airport transfers: Pre-arranged shuttle service, €25/person each way\n- Public transportation passes: €30/person for the duration\n\n**Estimated Total Budget: €8,975**\n\nWould you like me to proceed with these bookings or would you prefer alternative options?",
        isUser: false,
      },
      { text: "This looks good. Can you book everything and send calendar invites to the team?", isUser: true },
      {
        text: "I've completed all the bookings for your team's trip to Berlin and sent calendar invites to all team members. Here's a summary of what's been arranged:\n\n**Flights:** All booked and confirmed\n- Madrid team: Confirmation #LH7823945\n- Paris team: Confirmation #AF4567823\n- London team: Confirmation #BA9834521\n- Rome team: Confirmation #AZ6723451\n\n**Accommodation:**\n- Maritim Hotel Berlin: Confirmation #MHB-45678\n- 5 rooms, June 14-18\n- Check-in: After 3:00 PM\n- Check-out: Before 12:00 PM\n\n**Ground Transportation:**\n- Airport shuttle service: Confirmation #BER-78945\n- Public transportation passes: Will be available at hotel check-in\n\n**Calendar & Documentation:**\n- Calendar invites sent to all team members with complete itineraries\n- Travel documentation emailed to each traveler\n- Added to your company travel dashboard\n- Expense reports pre-populated with expected costs\n\n**Next Steps:**\n- Team members should check in online 24 hours before flights\n- I've scheduled a pre-trip briefing for June 7 at 10:00 AM\n- Would you like me to arrange a team dinner in Berlin for one of the evenings?",
        isUser: false,
      },
    ],
  },
]

export default function AIChatSimulation() {
  const [activeScenario, setActiveScenario] = useState(0)
  const [displayedMessages, setDisplayedMessages] = useState<{ text: string; isUser: boolean }[]>([])
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [userInput, setUserInput] = useState("")

  const router = useRouter()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [displayedMessages, isTyping])

  // Display messages one by one with typing animation
  useEffect(() => {
    const scenario = CONVERSATION_SCENARIOS[activeScenario]
    if (currentMessageIndex < scenario.messages.length) {
      const message = scenario.messages[currentMessageIndex]

      if (message.isUser) {
        // User messages appear immediately
        setDisplayedMessages((prev) => [...prev, message])
        setCurrentMessageIndex((prev) => prev + 1)
      } else {
        // AI messages have typing indicator first
        setIsTyping(true)
        const typingDelay = Math.min(1000 + message.text.length * 10, 3000)

        setTimeout(() => {
          setIsTyping(false)
          setDisplayedMessages((prev) => [...prev, message])
          setCurrentMessageIndex((prev) => prev + 1)
        }, typingDelay)
      }
    }
  }, [activeScenario, currentMessageIndex])

  const handleScenarioChange = (index: number) => {
    setActiveScenario(index)
    setDisplayedMessages([])
    setCurrentMessageIndex(0)
    setIsTyping(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) return

    // Add custom user message
    setDisplayedMessages((prev) => [...prev, { text: userInput, isUser: true }])

    // Check for flight booking commands
    const input = userInput.toLowerCase()
    const isFlightBooking =
      (input.includes("book") || input.includes("reserve")) &&
      input.includes("flight") &&
      (input.includes("to") || input.includes("from"))

    setUserInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false)

      if (isFlightBooking) {
        // Extract origin and destination from input
        let origin = "Madrid"
        let destination = "London"
        let airline = "British Airways"

        // Try to extract origin
        const fromMatch = input.match(/from\s+([a-zA-Z\s]+?)(?:\s+to|\s+with|\s+on|\s+for|\s+$)/i)
        if (fromMatch && fromMatch[1]) {
          origin = fromMatch[1].trim()
          // Capitalize first letter of each word
          origin = origin
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        }

        // Try to extract destination
        const toMatch = input.match(/to\s+([a-zA-Z\s]+?)(?:\s+with|\s+on|\s+for|\s+$)/i)
        if (toMatch && toMatch[1]) {
          destination = toMatch[1].trim()
          // Capitalize first letter of each word
          destination = destination
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        }

        // Try to extract airline
        const airlineMatch = input.match(/(?:with|on)\s+([a-zA-Z\s]+?)(?:\s+from|\s+to|\s+for|\s+$)/i)
        if (airlineMatch && airlineMatch[1]) {
          airline = airlineMatch[1].trim()
          // Capitalize first letter of each word
          airline = airline
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        }

        const date = new Date()
        date.setDate(date.getDate() + 7) // Default to 1 week from now
        const formattedDate = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

        setDisplayedMessages((prev) => [
          ...prev,
          {
            text: `I've found several flight options from ${origin} to ${destination} with ${airline} for ${formattedDate}:

1. ${airline} ${Math.floor(Math.random() * 1000) + 1000}
   Departure: 08:25 AM
   Arrival: 10:05 AM
   Price: €${Math.floor(Math.random() * 200) + 250}
   
2. ${airline} ${Math.floor(Math.random() * 1000) + 1000}
   Departure: 12:40 PM
   Arrival: 14:20 PM
   Price: €${Math.floor(Math.random() * 200) + 200}
   
3. ${airline} ${Math.floor(Math.random() * 1000) + 1000}
   Departure: 17:15 PM
   Arrival: 18:55 PM
   Price: €${Math.floor(Math.random() * 200) + 300}

Would you like me to book any of these options for you? Click on an option to proceed with booking.`,
            isUser: false,
          },
        ])

        // Redirect after a short delay to show the response
        setTimeout(() => {
          router.push("/flights")
        }, 3000)
      } else {
        setDisplayedMessages((prev) => [
          ...prev,
          {
            text: "I understand your question. Let me help you with that. Could you provide a few more details so I can give you the most accurate information? Try asking me to book a flight, find a hotel, or check travel policies.",
            isUser: false,
          },
        ])
      }
    }, 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
      <h2 className="text-lg font-medium tracking-tighter text-black mb-4">AI Assistant Chat Simulation</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Conversation Scenarios</h3>
          <div className="space-y-2">
            {CONVERSATION_SCENARIOS.map((scenario, index) => (
              <button
                key={index}
                onClick={() => handleScenarioChange(index)}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                  activeScenario === index ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {scenario.title}
              </button>
            ))}
          </div>
        </div>

        <div className="md:w-3/4">
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center">
              <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
                <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Suitpax AI Assistant</h3>
                <p className="text-xs text-gray-500">Business Travel Expert</p>
              </div>
            </div>

            <div className="h-96 overflow-y-auto p-4 bg-gray-50">
              {displayedMessages.map((message, index) => (
                <div key={index} className={`mb-4 flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  {!message.isUser && (
                    <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                      <Image src="/images/ai-agent-avatar.jpeg" alt="AI" fill className="object-cover" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-xl ${
                      message.isUser
                        ? "bg-black text-white rounded-tr-none"
                        : "bg-gray-200 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                    <Image src="/images/ai-agent-avatar.jpeg" alt="AI" fill className="object-cover" />
                  </div>
                  <div className="bg-gray-200 p-3 rounded-xl rounded-tl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-200">
              <form onSubmit={handleSubmit} className="relative">
                <GlowBorder>
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full pl-3 pr-24 py-2 border-0 rounded-xl focus:outline-none focus:ring-0 text-sm"
                  />
                </GlowBorder>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <button type="button" className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
                    <PaperClipIcon className="h-5 w-5" />
                  </button>
                  <button type="button" className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
                    <MicrophoneIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="submit"
                    className={`p-1.5 rounded-full ${
                      userInput.trim()
                        ? "bg-black text-white hover:bg-gray-800"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!userInput.trim()}
                  >
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
