import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@auth0/nextjs-auth0"
import { createPortalSession } from "@/lib/services/stripe-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req, new NextResponse())

    // Verificar si el usuario está autenticado
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Crear sesión de portal
    const portalSession = await createPortalSession({
      customerId: session.user.sub, // Usar el ID de Auth0 como ID de cliente
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error("Error creating portal session:", error)
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 })
  }
}
