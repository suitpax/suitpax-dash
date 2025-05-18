import { SubscriptionPlans } from "@/components/ui/subscription-plans"

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Billing & Subscription</h1>
        <p className="text-white/70 mb-8">Manage your subscription and billing information</p>

        <SubscriptionPlans />
      </div>
    </div>
  )
}
