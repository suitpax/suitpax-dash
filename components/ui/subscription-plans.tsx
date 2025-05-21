"use client"

import { useState } from "react"
import { Check } from "lucide-react"

export function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "For ambitious startups willing to try the next gen of AI-powered travel planning",
      features: [
        "1,000 AI tokens/month",
        "3 AI travel searches per month",
        "Up to 5 team members",
        "AI-powered expense management (Add on)",
        "Standard itinerary planning",
        "Custom travel policies",
        "24/5 standard support",
      ],
      popular: false,
      action: "Get Started",
      actionUrl: "/api/stripe/checkout?plan=starter",
    },
    {
      name: "Pro",
      price: "$89",
      description: "For growing businesses looking to optimize their travel planning to the next level",
      features: [
        "10,000 AI tokens/month (300 tokens average per trip, 30 trips = 9000 tokens, not 15k)",
        "30 AI travel searches per month",
        "Up to 20 team members",
        "AI-powered expense management",
        "Advanced itinerary planning",
        "Custom travel policies",
        "24/5 premium support",
        "Basic TRM intelligence", // Corregido de CRM a TRM
        "Team travel coordination",
        "Basic bank API integration",
      ],
      popular: true,
      action: "Subscribe",
      actionUrl: "/api/stripe/checkout?plan=pro",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large enterprises looking to take their travel planning to the next level",
      features: [
        "50,000 AI tokens/month",
        "50 AI travel searches per month",
        "Up to 50 team members",
        "Corporate travel management",
        "Team travel planning",
        "Advanced TRM intelligence", // Corregido de CRM a TRM
        "Travel expense optimization",
        "Multi-entity management",
        "Integration with existing systems",
        "Team meeting coordination",
      ],
      popular: false,
      action: "Get a price quote",
      actionUrl: "/contact?plan=enterprise",
    },
  ]

  const handleSelectPlan = async (planUrl: string) => {
    window.location.href = planUrl
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">PRICING</h2>
        <p className="text-white/70 max-w-2xl mx-auto">Choose the plan that best fits your business needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-black border ${
              plan.popular ? "border-white/20" : "border-white/10"
            } rounded-lg p-6 flex flex-col relative ${plan.popular ? "transform md:-translate-y-4" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                {plan.price !== "Free" && plan.price !== "Custom" && <span className="text-white/50 ml-1">/month</span>}
              </div>
              <p className="text-white/70 mt-3 text-sm">{plan.description}</p>
            </div>

            <div className="flex-grow">
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-white/70 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/70 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(plan.actionUrl)}
              className="w-full py-2 px-4 rounded-lg font-medium transition-colors bg-white/10 text-white hover:bg-white/20"
            >
              {plan.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
