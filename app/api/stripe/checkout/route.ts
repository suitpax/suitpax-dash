import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { createCheckoutSession, createCustomer } from "@/lib/services/stripe-service"
import { authOptions } from "@/lib/auth/auth-config"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { priceId, successUrl, cancelUrl, metadata = {} } = await req.json()

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 })
    }

    // Get user from database or create a new customer in Stripe
    // This is a simplified example - you would typically check if the user already has a Stripe customer ID
    const customer = await createCustomer({
      email: session.user.email || "",
      name: session.user.name || undefined,
      metadata: {
        userId: session.user.id || "",
      },
    })

    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      priceId,
      successUrl: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
      cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
      customerId: customer.id,
      metadata: {
        userId: session.user.id || "",
        ...metadata,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
