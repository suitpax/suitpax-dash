"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown, ArrowRight, Users, CreditCard, Shield, Headphones } from "lucide-react"

interface Plan {
  id: string
  name: string
  price: number
  period: "month" | "year"
  description: string
  features: string[]
  popular?: boolean
  current?: boolean
  icon: React.ComponentType<any>
  color: string
}

export default function PlansPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null)

  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      price: billingPeriod === "monthly" ? 29 : 290,
      period: billingPeriod === "monthly" ? "month" : "year",
      description: "Perfect for small teams getting started with business travel",
      features: [
        "Up to 5 team members",
        "Basic flight & hotel booking",
        "Expense tracking",
        "Email support",
        "Mobile app access",
        "Basic reporting",
      ],
      icon: Users,
      color: "blue",
    },
    {
      id: "professional",
      name: "Professional",
      price: billingPeriod === "monthly" ? 79 : 790,
      period: billingPeriod === "monthly" ? "month" : "year",
      description: "Advanced features for growing businesses",
      features: [
        "Up to 25 team members",
        "Advanced booking with preferences",
        "AI-powered expense management",
        "Travel policy enforcement",
        "Priority support",
        "Advanced analytics",
        "Custom approval workflows",
        "Integration with accounting software",
      ],
      popular: true,
      current: true,
      icon: Star,
      color: "purple",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: billingPeriod === "monthly" ? 199 : 1990,
      period: billingPeriod === "monthly" ? "month" : "year",
      description: "Complete solution for large organizations",
      features: [
        "Unlimited team members",
        "White-label solution",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "Advanced security & compliance",
        "Custom reporting & analytics",
        "API access",
        "Single sign-on (SSO)",
        "Multi-company management",
      ],
      icon: Crown,
      color: "gold",
    },
  ]

  const handleUpgrade = async (planId: string) => {
    setIsUpgrading(planId)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Here you would integrate with your payment processor
    console.log(`Upgrading to plan: ${planId}`)

    setIsUpgrading(null)
  }

  const getColorClasses = (color: string, variant: "bg" | "text" | "border") => {
    const colorMap = {
      blue: {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        border: "border-blue-500/30",
      },
      purple: {
        bg: "bg-purple-500/20",
        text: "text-purple-400",
        border: "border-purple-500/30",
      },
      gold: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        border: "border-yellow-500/30",
      },
    }
    return colorMap[color as keyof typeof colorMap]?.[variant] || ""
  }

  return (
    <div className="min-h-screen bg-black p-3 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <div className="text-center">
            <h1 className="text-3xl font-light text-white tracking-tight mb-2">Choose Your Plan</h1>
            <p className="text-white/70 text-lg font-light">
              Scale your business travel management with the right plan
            </p>
          </div>
        </header>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-lg text-sm font-light transition-all ${
                billingPeriod === "monthly" ? "bg-white text-black" : "text-white/70 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-2 rounded-lg text-sm font-light transition-all relative ${
                billingPeriod === "yearly" ? "bg-white text-black" : "text-white/70 hover:text-white"
              }`}
            >
              Yearly
              <Badge className="absolute -top-2 -right-2 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon
            return (
              <Card
                key={plan.id}
                className={`bg-white/5 border transition-all duration-300 hover:bg-white/8 relative ${
                  plan.popular
                    ? "border-purple-500/50 ring-2 ring-purple-500/20 scale-105"
                    : "border-white/10 hover:border-white/20"
                }`}
                style={{
                  animation: `fadeInUp 0.6s ${index * 0.1}s ease-out forwards`,
                  opacity: 0,
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {plan.current && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">Current Plan</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-xl ${getColorClasses(plan.color, "bg")} flex items-center justify-center mb-4`}
                  >
                    <IconComponent className={`h-8 w-8 ${getColorClasses(plan.color, "text")}`} />
                  </div>
                  <CardTitle className="text-2xl font-light text-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-light text-white">${plan.price}</span>
                      <span className="text-white/50 ml-2">/{plan.period}</span>
                    </div>
                    {billingPeriod === "yearly" && (
                      <p className="text-sm text-green-400 mt-1">
                        Save ${((plan.price * 12 * 0.2) / 12).toFixed(0)}/month
                      </p>
                    )}
                  </div>
                  <p className="text-white/70 text-sm font-light mt-3">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80 text-sm font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={plan.current || isUpgrading === plan.id}
                    className={`w-full py-3 rounded-xl font-light transition-all duration-300 ${
                      plan.current
                        ? "bg-white/10 text-white/50 cursor-not-allowed"
                        : plan.popular
                          ? "bg-purple-500 hover:bg-purple-600 text-white"
                          : "bg-white/10 hover:bg-white/15 text-white border border-white/20"
                    }`}
                  >
                    {isUpgrading === plan.id ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Processing...
                      </div>
                    ) : plan.current ? (
                      "Current Plan"
                    ) : (
                      <div className="flex items-center justify-center">
                        {plan.id === "enterprise" ? "Contact Sales" : "Upgrade Now"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Comparison */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-light text-white text-center">Why Choose Suitpax?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                  <Zap className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-medium text-white mb-2">AI-Powered</h3>
                <p className="text-white/70 text-sm font-light">
                  Smart recommendations and automated expense management
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-green-500/20 flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="font-medium text-white mb-2">Secure & Compliant</h3>
                <p className="text-white/70 text-sm font-light">Enterprise-grade security with SOC 2 compliance</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/20 flex items-center justify-center mb-3">
                  <CreditCard className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-medium text-white mb-2">Easy Integration</h3>
                <p className="text-white/70 text-sm font-light">Seamless integration with your existing tools</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-orange-500/20 flex items-center justify-center mb-3">
                  <Headphones className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="font-medium text-white mb-2">24/7 Support</h3>
                <p className="text-white/70 text-sm font-light">Round-the-clock support when you need it most</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-light text-white text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-white mb-2">Can I change plans anytime?</h3>
                <p className="text-white/70 text-sm font-light">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-white mb-2">Is there a free trial?</h3>
                <p className="text-white/70 text-sm font-light">
                  We offer a 14-day free trial for all plans. No credit card required to get started.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-white mb-2">What payment methods do you accept?</h3>
                <p className="text-white/70 text-sm font-light">
                  We accept all major credit cards, PayPal, and bank transfers for enterprise customers.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-white mb-2">Do you offer custom plans?</h3>
                <p className="text-white/70 text-sm font-light">
                  Yes, we can create custom plans for large organizations with specific requirements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
