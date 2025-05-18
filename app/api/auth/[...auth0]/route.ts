import { handleLogin, handleLogout, handleCallback, handleProfile } from "@auth0/nextjs-auth0"
import { NextResponse } from "next/server"

// Función para manejar errores y proporcionar respuestas amigables
const createErrorHandler = (action: string) => {
  return (error: any) => {
    console.error(`Error en ${action}:`, error)
    return NextResponse.json(
      {
        error: `Error en ${action}`,
        message: `No se pudo completar la acción. Por favor, intenta más tarde o contacta con soporte.`,
        status: 500,
      },
      { status: 500 },
    )
  }
}

export async function GET(req: Request) {
  const { pathname } = new URL(req.url)

  try {
    if (pathname.endsWith("/login")) {
      return handleLogin(req, {
        returnTo: "/dashboard",
        authorizationParams: {
          prompt: "login",
        },
      })
    }

    if (pathname.endsWith("/callback")) {
      return handleCallback(req)
    }

    if (pathname.endsWith("/logout")) {
      return handleLogout(req, {
        returnTo: "/",
      })
    }

    if (pathname.endsWith("/me")) {
      return handleProfile(req)
    }

    // Si no coincide con ninguna ruta conocida
    return NextResponse.json({ error: "Ruta no encontrada" }, { status: 404 })
  } catch (error) {
    const action = pathname.split("/").pop() || "autenticación"
    return createErrorHandler(action)(error)
  }
}

export async function POST(req: Request) {
  // Para manejar solicitudes POST si es necesario
  return GET(req)
}
