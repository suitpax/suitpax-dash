import { auth0 } from "@/lib/auth/auth0-config"
import { NextResponse } from "next/server"

// Función para manejar errores y proporcionar respuestas amigables
const handleAuthWithErrorHandling = () => {
  try {
    // Intentar usar el manejador de Auth0
    return auth0.handleAuth()
  } catch (error) {
    // Si hay un error, devolver una respuesta JSON con información útil
    console.error("Error en la autenticación de Auth0:", error)
    return (req: Request) => {
      const url = new URL(req.url)
      const path = url.pathname.split("/").pop()

      // Proporcionar respuestas específicas según la ruta
      if (path === "login") {
        return NextResponse.json(
          {
            error: "Error al iniciar sesión",
            message:
              "No se pudo iniciar el proceso de login con Auth0. Por favor, intenta más tarde o contacta con soporte.",
            status: 500,
          },
          { status: 500 },
        )
      } else if (path === "callback") {
        return NextResponse.json(
          {
            error: "Error en el callback",
            message:
              "No se pudo completar la autenticación con Auth0. Por favor, intenta más tarde o contacta con soporte.",
            status: 500,
          },
          { status: 500 },
        )
      } else if (path === "logout") {
        return NextResponse.json(
          {
            error: "Error al cerrar sesión",
            message: "No se pudo cerrar la sesión correctamente. Por favor, intenta más tarde o contacta con soporte.",
            status: 500,
          },
          { status: 500 },
        )
      } else {
        return NextResponse.json(
          {
            error: "Error en la autenticación",
            message:
              "Ocurrió un error durante el proceso de autenticación. Por favor, intenta más tarde o contacta con soporte.",
            status: 500,
          },
          { status: 500 },
        )
      }
    }
  }
}

// Exportar los manejadores con manejo de errores
export const GET = handleAuthWithErrorHandling()
export const POST = handleAuthWithErrorHandling()
