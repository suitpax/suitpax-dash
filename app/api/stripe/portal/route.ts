import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { createPortalSession } from "@/lib/services/stripe-service"
import { authOptions } from "@/lib/auth/auth-config"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { customerId, returnUrl } = await req.json()

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
    }

    // Create portal session
    const portalSession = await createPortalSession({
      customerId,
      returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error("Error creating portal session:", error)
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 })
  }
}
