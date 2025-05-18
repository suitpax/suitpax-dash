import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/", "/sign-in", "/sign-up", "/api/auth"]

  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + "/"),
  )

  // Si la ruta es pública, permitir acceso
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Verificar si hay una cookie de sesión de Auth0
  const sessionCookie = request.cookies.get("appSession")

  // Si no hay cookie de sesión y la ruta no es pública, redirigir a sign-in
  if (!sessionCookie) {
    const signInUrl = new URL("/api/auth/login", request.url)
    signInUrl.searchParams.set("returnTo", request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Si hay cookie de sesión, permitir acceso
  return NextResponse.next()
}

// Configurar las rutas que deben ser procesadas por el middleware
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * 1. /api/auth (rutas de Auth0)
     * 2. /_next (archivos estáticos de Next.js)
     * 3. /fonts, /images (archivos estáticos)
     * 4. /favicon.ico, /sitemap.xml (archivos específicos)
     */
    "/((?!api/auth|_next|fonts|images|favicon.ico|sitemap.xml).*)",
  ],
}
