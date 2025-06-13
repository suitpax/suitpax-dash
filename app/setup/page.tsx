"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserConfig } from "@/lib/contexts/user-config-context"
import { UserSetupWizard } from "@/components/ui/user-setup-wizard"

export default function SetupPage() {
  const { userConfig, isLoading } = useUserConfig()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && userConfig?.isConfigured) {
      router.push("/dashboard")
    }
  }, [userConfig, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return <UserSetupWizard />
}
