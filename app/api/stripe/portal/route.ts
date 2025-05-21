import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@auth0/nextjs-auth0/edge" // Cambiado a importar desde /edge
import { createPortalSession } from "@/lib/services/stripe-service"

export async function GET(req: NextRequest) {
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

    // Crear sesión de portal
    const portalSession = await createPortalSession({
      customerId: session.user.sub, // Usar el ID de Auth0 como ID de cliente
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/billing`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error: any) {
    console.error("Error creating portal session:", error)
    return NextResponse.json({ error: error.message || "Failed to create portal session" }, { status: 500 })
  }
}
