"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { CheckIcon } from "@heroicons/react/24/solid"
import { CreditCardIcon, SparklesIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline"

export default function PlansPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const plans = [
    {
      name: "Free Starter",
      description: "Perfect for individuals and small teams just getting started with business travel.",
      price: { monthly: 0, yearly: 0 },
      features: [
        "Up to 5 team members",
        "Basic travel booking",
        "Email support",
        "Basic expense tracking",
        "Standard AI assistant",
      ],
      cta: "Get Started",
      icon: <BuildingOfficeIcon className="h-6 w-6 text-white" />,
      popular: false,
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      name: "Pro",
      description: "For growing businesses that need more features and team management capabilities.",
      price: { monthly: 89, yearly: 890 },
      features: [
        "Up to 20 team members",
        "Advanced travel booking",
        "Priority support",
        "Advanced expense tracking",
        "Enhanced AI assistant",
        "Travel policy enforcement",
        "Approval workflows",
        "Basic analytics",
      ],
      cta: "Upgrade to Pro",
      icon: <SparklesIcon className="h-6 w-6 text-white" />,
      popular: true,
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      name: "Enterprise",
      description: "Custom solutions for large organizations with complex travel management needs.",
      price: { monthly: "Custom", yearly: "Custom" },
      features: [
        "Unlimited team members",
        "Custom travel booking",
        "Dedicated account manager",
        "Advanced expense management",
        "Premium AI assistant",
        "Custom travel policies",
        "Advanced approval workflows",
        "Comprehensive analytics",
        "API access",
        "SSO integration",
      ],
      cta: "Contact Sales",
      icon: <CreditCardIcon className="h-6 w-6 text-white" />,
      popular: false,
      color: "from-amber-500/20 to-orange-500/20",
    },
  ]

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-3">Choose Your Plan</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Select the perfect plan for your business travel needs. All plans include our core features with different
            levels of support and capabilities.
          </p>

          {/* Billing toggle */}
          <div className="mt-6 inline-flex items-center bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                billingCycle === "monthly" ? "bg-white/10 text-white font-medium" : "text-white/70 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                billingCycle === "yearly" ? "bg-white/10 text-white font-medium" : "text-white/70 hover:text-white"
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-green-400">Save 15%</span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 relative overflow-hidden ${
                plan.popular ? "ring-2 ring-purple-500/50" : ""
              }`}
            >
              {/* Decorative gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-10 z-0`}></div>

              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-purple-500/20 text-purple-400 text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/5 rounded-lg">{plan.icon}</div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>

                <p className="text-white/70 text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-white">
                      {typeof plan.price[billingCycle] === "number"
                        ? `€${plan.price[billingCycle]}`
                        : plan.price[billingCycle]}
                    </span>
                    {typeof plan.price[billingCycle] === "number" && (
                      <span className="text-white/70 text-sm mb-1">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                    )}
                  </div>
                  {typeof plan.price[billingCycle] === "number" && (
                    <p className="text-white/50 text-xs mt-1">
                      {billingCycle === "monthly" ? "Billed monthly" : "Billed annually"}
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="mt-0.5 bg-white/10 rounded-full p-1">
                        <CheckIcon className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-white/70">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-medium text-white mb-3">Can I change my plan later?</h3>
              <p className="text-white/70 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes to your subscription will be prorated.
              </p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-medium text-white mb-3">What payment methods do you accept?</h3>
              <p className="text-white/70 text-sm">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-medium text-white mb-3">Is there a free trial?</h3>
              <p className="text-white/70 text-sm">
                Yes, you can try the Pro plan for 14 days before committing. No credit card required.
              </p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-medium text-white mb-3">What's included in the Enterprise plan?</h3>
              <p className="text-white/70 text-sm">
                Enterprise plans are customized to your organization's needs. Contact our sales team for a detailed
                quote.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
