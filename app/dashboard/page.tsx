"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FeatureCard } from "@/components/features/feature-card"
import { Airplane, CreditCard, ChartLineUp, ClipboardText, ArrowRight, Gear } from "@phosphor-icons/react"

export default function Dashboard() {
  const [hasData, setHasData] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(
    typeof window !== "undefined" ? localStorage.getItem("onboardingComplete") === "true" : false,
  )

  return (
    <div className="space-y-6 pb-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-medium tracking-tighter mb-2">Welcome to Suitpax</h1>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl">
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
          <Card className="border border-gray-200 rounded-xl overflow-hidden mb-6 bg-gradient-to-r from-gray-50 to-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                    <Gear className="h-6 w-6 text-white" weight="fill" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium tracking-tighter mb-1">Set up your account</h3>
                    <p className="text-gray-500 text-sm">
                      Customize your Suitpax experience by completing the setup process
                    </p>
                  </div>
                </div>
                <Button asChild className="bg-black text-white rounded-xl">
                  <Link href="/onboarding">Configure now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!hasData ? <EmptyDashboard /> : <PopulatedDashboard />}
    </div>
  )
}

function EmptyDashboard() {
  return (
    <div className="space-y-8">
      <Card className="border border-gray-200 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-8">
          <CardTitle className="text-xl md:text-2xl font-medium tracking-tighter">Get Started with Suitpax</CardTitle>
          <CardDescription>Complete these steps to set up your business travel management</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 -mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Airplane className="h-5 w-5" weight="duotone" />}
              title="Book Your First Trip"
              description="Set up your first business travel reservation"
              delay={0}
              className="h-full"
              iconClassName="bg-transparent text-black"
            >
              <Button asChild className="mt-auto bg-black text-white rounded-xl">
                <Link href="/flights">Start</Link>
              </Button>
            </FeatureCard>

            <FeatureCard
              icon={<CreditCard className="h-5 w-5" weight="duotone" />}
              title="Configure Expenses"
              description="Set up tracking for your travel expenses"
              delay={1}
              className="h-full"
              iconClassName="bg-transparent text-black"
            >
              <Button asChild className="mt-auto bg-black text-white rounded-xl">
                <Link href="/expenses">Configure</Link>
              </Button>
            </FeatureCard>

            <FeatureCard
              icon={<ChartLineUp className="h-5 w-5" weight="duotone" />}
              title="View Analytics"
              description="Explore your travel data and gain insights"
              delay={2}
              className="h-full"
              iconClassName="bg-transparent text-black"
            >
              <Button asChild className="mt-auto bg-black text-white rounded-xl">
                <Link href="/analytics">Explore</Link>
              </Button>
            </FeatureCard>

            <FeatureCard
              icon={<ClipboardText className="h-5 w-5" weight="duotone" />}
              title="Manage Tasks"
              description="Organize your travel-related tasks"
              delay={3}
              className="h-full"
              iconClassName="bg-transparent text-black"
            >
              <Button asChild className="mt-auto bg-black text-white rounded-xl">
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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-gray-200 rounded-xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs">Next: London, Jun 15-18</p>
            <div className="mt-4 flex items-center text-xs">
              <ArrowRight className="mr-1 h-3 w-3" weight="bold" />
              <Link href="/flights" className="text-black underline">
                View all trips
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
