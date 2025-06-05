"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FeatureCard } from "@/components/features/feature-card"
import {
  Airplane,
  CreditCard,
  ChartLineUp,
  ClipboardText,
  ArrowRight,
  Gear,
  Wallet,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react"

export default function Dashboard() {
  const [hasData, setHasData] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(
    typeof window !== "undefined" ? localStorage.getItem("onboardingComplete") === "true" : false,
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="space-y-4 pb-6 p-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-medium tracking-tighter mb-1 text-white">Welcome to Suitpax</h1>
          <p className="text-white/70 text-sm max-w-2xl">
            Your comprehensive platform for managing business travel, expenses, and optimizing the corporate travel
            experience.
          </p>
        </motion.div>

        {/* Onboarding configuration card */}
        {!onboardingComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border border-white/10 rounded-lg overflow-hidden mb-4 bg-black/95">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Gear className="h-5 w-5 text-white" weight="fill" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium tracking-tighter mb-0.5 text-white">Set up your account</h3>
                      <p className="text-white/70 text-xs">
                        Customize your Suitpax experience by completing the setup process
                      </p>
                    </div>
                  </div>
                  <Button asChild className="bg-white/10 text-white rounded-lg hover:bg-white/20 text-xs py-1.5 px-3">
                    <Link href="/onboarding">Configure now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!hasData ? <EmptyDashboard /> : <PopulatedDashboard />}
      </div>
    </div>
  )
}

function EmptyDashboard() {
  return (
    <div className="space-y-4">
      {/* Suitpax Virtual Card Section */}
      <SuitpaxCardSection />

      <Card className="border border-white/10 rounded-lg overflow-hidden bg-black/95">
        <CardHeader className="bg-black/30 pb-4 pt-3 px-4">
          <CardTitle className="text-lg font-medium tracking-tighter text-white">Get Started with Suitpax</CardTitle>
          <CardDescription className="text-white/70 text-xs">
            Complete these steps to set up your business travel management
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Airplane className="h-4 w-4" weight="duotone" />}
              title="Book Your First Trip"
              description="Set up your first business travel reservation"
              delay={0}
              className="h-full bg-black/95 border-white/10"
              iconClassName="bg-white/5 text-white"
              compact={true}
            >
              <Button
                asChild
                className="mt-auto bg-white/10 text-white rounded-lg hover:bg-white/20 text-xs py-1.5 px-3"
              >
                <Link href="/flights">Start</Link>
              </Button>
            </FeatureCard>

            <FeatureCard
              icon={<CreditCard className="h-4 w-4" weight="duotone" />}
              title="Configure Expenses"
              description="Set up tracking for your travel expenses"
              delay={1}
              className="h-full bg-black/95 border-white/10"
              iconClassName="bg-white/5 text-white"
              compact={true}
            >
              <Button
                asChild
                className="mt-auto bg-white/10 text-white rounded-lg hover:bg-white/20 text-xs py-1.5 px-3"
              >
                <Link href="/expenses">Configure</Link>
              </Button>
            </FeatureCard>

            <FeatureCard
              icon={<ChartLineUp className="h-4 w-4" weight="duotone" />}
              title="View Analytics"
              description="Explore your travel data and gain insights"
              delay={2}
              className="h-full bg-black/95 border-white/10"
              iconClassName="bg-white/5 text-white"
              compact={true}
            >
              <Button
                asChild
                className="mt-auto bg-white/10 text-white rounded-lg hover:bg-white/20 text-xs py-1.5 px-3"
              >
                <Link href="/analytics">Explore</Link>
              </Button>
            </FeatureCard>

            <FeatureCard
              icon={<ClipboardText className="h-4 w-4" weight="duotone" />}
              title="Manage Tasks"
              description="Organize your travel-related tasks"
              delay={3}
              className="h-full bg-black/95 border-white/10"
              iconClassName="bg-white/5 text-white"
              compact={true}
            >
              <Button
                asChild
                className="mt-auto bg-white/10 text-white rounded-lg hover:bg-white/20 text-xs py-1.5 px-3"
              >
                <Link href="/tasks">Organize</Link>
              </Button>
            </FeatureCard>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PopulatedDashboard() {
  return (
    <div className="space-y-4">
      {/* Suitpax Virtual Card Section */}
      <SuitpaxCardSection />

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-white/10 rounded-lg overflow-hidden bg-black/95">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm font-medium text-white">Upcoming Trips</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-white">3</div>
            <p className="text-xs text-white/70">Next: London, Jun 15-18</p>
            <div className="mt-3 flex items-center text-xs">
              <ArrowRight className="mr-1 h-3 w-3 text-white" weight="bold" />
              <Link href="/flights" className="text-white hover:text-white/70 underline">
                View all trips
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SuitpaxCardSection() {
  const [showBalance, setShowBalance] = useState(false)
  const [currentExpenses] = useState(2847.5)
  const [monthlyLimit] = useState(5000.0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border border-white/10 rounded-lg overflow-hidden bg-black/95">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-base font-medium tracking-tighter text-white">Your Suitpax Card</CardTitle>
          <CardDescription className="text-white/70 text-xs">Manage your business travel expenses</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Virtual Card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Suitpax Business</p>
                    <p className="text-xs text-white/70 mt-0.5">Corporate Travel Card</p>
                  </div>
                  <Wallet className="h-5 w-5 text-white/70" weight="duotone" />
                </div>

                <div className="mb-4">
                  <p className="text-base font-mono text-white tracking-wider">•••• •••• •••• 4829</p>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Cardholder</p>
                    <p className="text-xs text-white font-medium">John Doe</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/50 uppercase tracking-wider">Expires</p>
                    <p className="text-xs text-white font-medium">12/27</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expenses Overview */}
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-medium text-white">Current Balance</h4>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1 rounded hover:bg-white/5 transition-colors"
                  >
                    {showBalance ? (
                      <EyeSlash className="h-3 w-3 text-white/70" />
                    ) : (
                      <Eye className="h-3 w-3 text-white/70" />
                    )}
                  </button>
                </div>
                <p className="text-xl font-bold text-white">
                  {showBalance ? `$${currentExpenses.toLocaleString()}` : "••••••"}
                </p>
                <p className="text-xs text-white/50 mt-0.5">of ${monthlyLimit.toLocaleString()} monthly limit</p>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <h4 className="text-xs font-medium text-white mb-2">This Month</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">Travel</span>
                    <span className="text-white">$1,245.00</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">Hotels</span>
                    <span className="text-white">$892.50</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">Meals</span>
                    <span className="text-white">$410.00</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">Other</span>
                    <span className="text-white">$300.00</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild className="flex-1 bg-white/10 text-white rounded-lg hover:bg-white/20 text-xs py-1.5">
                  <Link href="/expenses">View Details</Link>
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-transparent border border-white/10 text-white rounded-lg hover:bg-white/5 text-xs py-1.5"
                >
                  <Link href="/smart-bank">Manage Card</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
