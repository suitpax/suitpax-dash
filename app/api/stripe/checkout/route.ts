import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@auth0/nextjs-auth0/edge" // Cambiado a importar desde /edge
import { createCheckoutSession } from "@/lib/services/stripe-service"

export async function POST(req: NextRequest) {
  // Verificar si la API key de Stripe está configurada
  if (!process.env.STRIPE_API_KEY) {
    return NextResponse.json(
      {
        error: "Stripe no está configurado",
        message: "La API key de Stripe no está configurada. Por favor, contacta con el administrador.",
      },
      { status: 503 },
    )
  }

  try {
    const session = await getSession(req, new NextResponse())

    // Verificar si el usuario está autenticado
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { planName } = body

    if (!planName) {
      return NextResponse.json({ error: "Plan name is required" }, { status: 400 })
    }

    // Crear sesión de checkout
    const checkoutSession = await createCheckoutSession({
      planName,
      customerId: session.user.sub, // Usar el ID de Auth0 como ID de cliente
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/billing/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/billing/cancel`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 })
  }
}
