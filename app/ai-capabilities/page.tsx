import AICapabilitiesShowcase from "@/components/ui/ai-capabilities-showcase"

export default function AICapabilitiesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-medium tracking-tighter mb-2">AI Assistant Capabilities</h1>
          <p className="text-gray-600">
            Explore the full range of capabilities our AI travel assistant offers to streamline your business travel
            experience.
          </p>
        </div>

        <AICapabilitiesShowcase />

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-medium tracking-tighter mb-4">Personalized Recommendations</h2>
            <p className="text-gray-600 mb-4">
              Our AI assistant learns from your preferences and travel history to provide increasingly personalized
              recommendations over time.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-black">•</span>
                <span className="text-gray-600">Flight preferences based on past bookings</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-black">•</span>
                <span className="text-gray-600">Hotel recommendations matching your typical choices</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-black">•</span>
                <span className="text-gray-600">Proactive suggestions for frequent destinations</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-black">•</span>
                <span className="text-gray-600">Expense categorization based on your history</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-medium tracking-tighter mb-4">Policy Compliance</h2>
            <p className="text-gray-600 mb-4">
              Stay compliant with your company's travel policies with real-time guidance and recommendations.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-black">•</span>
                <span className="text-gray-600">Automatic policy checks during booking</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-black">•</span>
                <span className="text-gray-600">Alerts for out-of-policy selections</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-black">•</span>
                <span className="text-gray-600">Guidance on approval requirements</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-black">•</span>
                <span className="text-gray-600">Expense compliance verification</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
