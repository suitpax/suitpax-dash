import Link from "next/link"
import { X } from "lucide-react"

export default function CancelPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="rounded-full bg-white/10 p-4 mb-6">
        <X className="h-12 w-12 text-white/70" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-4">Subscription Cancelled</h1>

      <p className="text-white/70 text-center max-w-md mb-8">
        Your subscription process was cancelled. If you encountered any issues or have questions, please contact our
        support team.
      </p>

      <div className="flex gap-4">
        <Link
          href="/billing"
          className="rounded-md bg-white/10 py-2 px-6 text-white hover:bg-white/20 transition-colors"
        >
          Try Again
        </Link>

        <Link
          href="/dashboard"
          className="rounded-md bg-white/5 py-2 px-6 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
