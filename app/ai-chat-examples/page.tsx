"use client"
import AIChatSimulation from "@/components/ui/ai-chat-simulation"

// Sample AI responses for different queries
const sampleResponses = [
  {
    query: "I need to book a flight to London next week",
    response:
      "I'd be happy to help you book a flight to London next week. Could you please provide your preferred departure date, return date, and departure city? Also, do you have any preferences for flight times or airlines?",
  },
  {
    query: "What's our company policy on business class flights?",
    response:
      "According to your company's travel policy, business class flights are permitted for:\n\n1. Flights with a duration exceeding 6 hours\n2. Executive-level employees (Director and above) for any international flight\n3. Situations with pre-approved exceptions for business needs\n\nAll business class bookings should be made at least 14 days in advance when possible. Would you like me to check if your upcoming trip qualifies for business class?",
  },
  {
    query: "I lost my hotel receipt from my Chicago trip",
    response:
      "I understand you've lost your hotel receipt from your Chicago trip. Here's how to handle this situation:\n\n1. Contact the hotel directly - most can email you a copy of your receipt\n2. Check your email for an electronic receipt that may have been sent automatically\n3. Look for the charge on your credit card statement as supporting documentation\n4. If you can't obtain a duplicate receipt, you'll need to complete a missing receipt form in your expense system\n\nWould you like me to help you contact the hotel or prepare a missing receipt form?",
  },
  {
    query: "What hotels do you recommend in San Francisco?",
    response:
      "For business travel to San Francisco, I recommend these well-located options:\n\n**Financial District/Downtown:**\n- Hyatt Regency San Francisco - Great for business travelers with excellent workspaces\n- Hilton San Francisco Financial District - Convenient location with good business amenities\n\n**SoMa (South of Market):**\n- InterContinental San Francisco - Modern hotel near Moscone Convention Center\n- Hotel Via - Boutique option with good tech amenities\n\n**Union Square:**\n- Grand Hyatt San Francisco - Central location with excellent business services\n- Marriott Marquis - Spacious rooms and good meeting facilities\n\nAll these options have high-speed WiFi, business centers, and are compliant with your company's rate guidelines. Would you like more specific recommendations based on your meeting locations?",
  },
  {
    query: "Can you help me plan a business trip to Tokyo?",
    response:
      "I'd be happy to help you plan your business trip to Tokyo. Here's what we'll need to arrange:\n\n1. **Flights**: Based on your location, I can find flight options that align with your schedule\n2. **Accommodation**: Business-friendly hotels in districts like Marunouchi, Nihonbashi, or Shinagawa\n3. **Transportation**: Options from airport to hotel and around the city\n4. **Meeting venues**: If you need conference rooms or meeting spaces\n5. **Cultural considerations**: Business etiquette tips for Japan\n6. **Visa requirements**: Check if you need a business visa\n\nTo get started, could you share your travel dates, departure city, and the purpose of your trip?",
  },
]

export default function AIChatExamplesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-medium tracking-tighter mb-2">AI Chat Examples</h1>
          <p className="text-gray-600">
            Explore realistic conversations with our AI travel assistant. These examples demonstrate how our AI can help
            with various business travel scenarios.
          </p>
        </div>

        <AIChatSimulation />

        <div className="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-medium tracking-tighter mb-4">How Our AI Assistant Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Natural Conversations</h3>
              <p className="text-gray-600 text-sm">
                Our AI understands natural language and context, allowing you to communicate as you would with a human
                travel agent.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Travel Expertise</h3>
              <p className="text-gray-600 text-sm">
                The AI is trained on comprehensive travel data, company policies, and best practices to provide accurate
                and helpful guidance.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Personalized Assistance</h3>
              <p className="text-gray-600 text-sm">
                Get recommendations tailored to your preferences, travel history, and company guidelines for a seamless
                business travel experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
