import Link from "next/link"
import { Check } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="rounded-full bg-white/10 p-4 mb-6">
        <Check className="h-12 w-12 text-white" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-4">Subscription Successful!</h1>

      <p className="text-white/70 text-center max-w-md mb-8">
        Thank you for subscribing to Suitpax. Your account has been successfully upgraded and you now have access to all
        the features included in your plan.
      </p>

      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-md bg-white/10 py-2 px-6 text-white hover:bg-white/20 transition-colors"
        >
          Go to Dashboard
        </Link>

        <Link
          href="/billing"
          className="rounded-md bg-white/5 py-2 px-6 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          Manage Subscription
        </Link>
      </div>
    </div>
  )
}
