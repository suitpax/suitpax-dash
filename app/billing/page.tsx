"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { Download, Check, Star } from "lucide-react"

export default function BillingPage() {
  const [billingPeriod, setBillingPeriod] = useState("monthly")
  const [currentPlan, setCurrentPlan] = useState("business")

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: { monthly: 29, yearly: 290 },
      description: "Perfect for small teams",
      features: [
        "Up to 5 team members",
        "Basic travel booking",
        "Expense tracking",
        "Email support",
        "Mobile app access",
      ],
      popular: false,
    },
    {
      id: "business",
      name: "Business",
      price: { monthly: 79, yearly: 790 },
      description: "Most popular for growing companies",
      features: [
        "Up to 25 team members",
        "Advanced travel booking",
        "Expense management",
        "Travel policy enforcement",
        "Priority support",
        "Analytics & reporting",
        "API access",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: { monthly: 199, yearly: 1990 },
      description: "For large organizations",
      features: [
        "Unlimited team members",
        "Custom integrations",
        "Advanced analytics",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom travel policies",
        "SSO integration",
        "White-label options",
      ],
      popular: false,
    },
  ]

  const invoices = [
    {
      id: "INV-2024-001",
      date: "2024-05-01",
      amount: "$79.00",
      status: "Paid",
      plan: "Business Plan",
    },
    {
      id: "INV-2024-002",
      date: "2024-04-01",
      amount: "$79.00",
      status: "Paid",
      plan: "Business Plan",
    },
    {
      id: "INV-2024-003",
      date: "2024-03-01",
      amount: "$79.00",
      status: "Paid",
      plan: "Business Plan",
    },
  ]

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-md font-medium text-black mb-6">Billing & Subscription</h1>

        {/* Current Plan */}
        <div className="bg-white rounded-xl border border-black p-6 shadow-sm mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-medium text-black">Current Plan</h2>
              <p className="text-sm text-gray-600">You're currently on the Business plan</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-medium text-black">$79</p>
              <p className="text-sm text-gray-600">per month</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-black">Next billing date</h3>
              <p className="text-sm text-gray-600">June 1, 2024</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-black">Payment method</h3>
              <p className="text-sm text-gray-600">•••• •••• •••• 4242</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-black">Team members</h3>
              <p className="text-sm text-gray-600">12 of 25 used</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Upgrade Plan
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Manage Payment
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="bg-white rounded-xl border border-black p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-black">Choose Your Plan</h2>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  billingPeriod === "monthly" ? "bg-white text-black shadow-sm" : "text-gray-600"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  billingPeriod === "yearly" ? "bg-white text-black shadow-sm" : "text-gray-600"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative border rounded-xl p-6 transition-colors ${
                  plan.popular ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                } ${currentPlan === plan.id ? "ring-2 ring-black" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white px-3 py-1 text-xs rounded-full flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-black">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <span className="text-3xl font-medium text-black">${plan.price[billingPeriod]}</span>
                    <span className="text-gray-600">/{billingPeriod === "monthly" ? "month" : "year"}</span>
                  </div>
                  {billingPeriod === "yearly" && <p className="text-sm text-green-600">Save 17%</p>}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    currentPlan === plan.id
                      ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                      : plan.popular
                        ? "bg-black text-white hover:bg-gray-800"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id ? "Current Plan" : "Choose Plan"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-black">Billing History</h2>
            <button className="px-3 py-2 text-sm text-gray-600 hover:text-black transition-colors flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Download All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Plan</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-black">{invoice.id}</td>
                    <td className="py-3 px-4 text-gray-600">{invoice.date}</td>
                    <td className="py-3 px-4 text-gray-600">{invoice.plan}</td>
                    <td className="py-3 px-4 font-medium text-black">{invoice.amount}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-sm text-gray-600 hover:text-black transition-colors flex items-center ml-auto">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
