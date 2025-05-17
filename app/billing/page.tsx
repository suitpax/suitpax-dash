import { SubscriptionPlans } from "@/components/ui/subscription-plans"

export default function BillingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Subscription Plans</h1>
        <p className="mt-2 text-white/70">Choose the plan that best fits your business needs</p>
      </div>

      <SubscriptionPlans />
    </div>
  )
}
