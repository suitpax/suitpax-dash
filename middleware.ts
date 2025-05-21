import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple session check function that works in the preview environment
function checkSession(request: NextRequest) {
  // In a real environment, this would use Auth0's getSession
  // For preview purposes, we'll check for a cookie
  const authCookie = request.cookies.get("appSession")
  return authCookie ? { user: { sub: "preview-user" } } : null
}

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

  try {
    // For preview: use our simple session check
    // In production, you would use: const session = await getSession(request, NextResponse)
    const session = checkSession(request)

    // Si no hay sesión y la ruta no es pública, redirigir a sign-in
    if (!session?.user) {
      const signInUrl = new URL("/api/auth/login", request.url)
      signInUrl.searchParams.set("returnTo", request.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Si hay sesión, permitir acceso
    return NextResponse.next()
  } catch (error) {
    console.error("Error en middleware:", error)

    // En caso de error, redirigir a la página de inicio
    return NextResponse.redirect(new URL("/", request.url))
  }
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
