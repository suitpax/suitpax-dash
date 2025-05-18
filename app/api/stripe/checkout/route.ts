import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@auth0/nextjs-auth0"
import { createCheckoutSession } from "@/lib/services/stripe-service"

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req, new NextResponse())

    // Verificar si el usuario está autenticado
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { planName } = await req.json()

    if (!planName) {
      return NextResponse.json({ error: "Plan name is required" }, { status: 400 })
    }

    // Crear sesión de checkout
    const checkoutSession = await createCheckoutSession({
      planName,
      customerId: session.user.sub, // Usar el ID de Auth0 como ID de cliente
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
