import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH0_SECRET })

  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/", "/sign-in", "/sign-up", "/api/auth"]

  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + "/"),
  )

  // Si la ruta es pública, permitir acceso
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Si no hay token y la ruta no es pública, redirigir a sign-in
  if (!token) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Si hay token, permitir acceso
  return NextResponse.next()
}

// Configurar las rutas que deben ser procesadas por el middleware
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * 1. /api/auth (rutas de NextAuth.js)
     * 2. /_next (archivos estáticos de Next.js)
     * 3. /fonts, /images (archivos estáticos)
     * 4. /favicon.ico, /sitemap.xml (archivos específicos)
     */
    "/((?!api/auth|_next|fonts|images|favicon.ico|sitemap.xml).*)",
  ],
}
