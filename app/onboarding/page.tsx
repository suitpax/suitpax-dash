import OnboardingForm from "@/components/onboarding/onboarding-form"
import { checkSubscription } from "@/lib/subscription"
import { redirect } from "next/navigation"

const OnboardingPage = async () => {
  const isPro = await checkSubscription()

  if (isPro) {
    redirect("/")
  }

  return (
    <div className="flex h-full items-center justify-center">
      <OnboardingForm />
    </div>
  )
}

export default OnboardingPage
