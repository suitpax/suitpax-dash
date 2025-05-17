"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2 } from "lucide-react"
import { getAvailablePlans } from "@/lib/services/stripe-service"

type Plan = {
  id: string
  name: string
  description: string | null
  priceId: string
  unitAmount: number | null
  currency: string
  interval: string | null
  features: string[]
  metadata: Record<string, string>
}

export function SubscriptionPlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function loadPlans() {
      try {
        const availablePlans = await getAvailablePlans()
        setPlans(availablePlans)
      } catch (error) {
        console.error("Error loading plans:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPlans()
  }, [])

  const handleSelectPlan = (priceId: string) => {
    setSelectedPlan(priceId)
  }

  const handleCheckout = async () => {
    if (!selectedPlan) return

    setCheckoutLoading(true)

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: selectedPlan,
          successUrl: `${window.location.origin}/billing/success`,
          cancelUrl: `${window.location.origin}/billing/cancel`,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
    } finally {
      setCheckoutLoading(false)
    }
  }

  const formatCurrency = (amount: number | null, currency: string) => {
    if (amount === null) return "Free"

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount / 100)
  }

  const formatInterval = (interval: string | null) => {
    if (!interval) return ""

    switch (interval) {
      case "month":
        return "/month"
      case "year":
        return "/year"
      case "week":
        return "/week"
      default:
        return `/${interval}`
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-white/70" />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-lg border ${
              selectedPlan === plan.priceId
                ? "border-white/30 bg-white/10"
                : "border-white/10 bg-black hover:bg-white/5"
            } p-6 transition-all duration-200 cursor-pointer`}
            onClick={() => handleSelectPlan(plan.priceId)}
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-xl font-medium text-white">{plan.name}</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold text-white">
                    {formatCurrency(plan.unitAmount, plan.currency)}
                  </span>
                  <span className="ml-1 text-white/70">{formatInterval(plan.interval)}</span>
                </div>
                <p className="mt-4 text-white/70">{plan.description}</p>
              </div>

              <div className="mt-6 space-y-4 flex-grow">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex">
                    <Check className="h-5 w-5 text-white flex-shrink-0 mr-2" />
                    <span className="text-white/70">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button
                  className={`w-full rounded-md py-2 px-4 text-sm font-medium ${
                    selectedPlan === plan.priceId
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
                  } transition-colors`}
                  onClick={() => handleSelectPlan(plan.priceId)}
                >
                  {selectedPlan === plan.priceId ? "Selected" : "Select Plan"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="mt-8 flex justify-center">
          <button
            className="rounded-md bg-white/10 py-2 px-6 text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCheckout}
            disabled={checkoutLoading}
          >
            {checkoutLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              "Proceed to Checkout"
            )}
          </button>
        </div>
      )}
    </div>
  )
}
