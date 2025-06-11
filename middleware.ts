import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Eliminamos la redirección automática al onboarding
  // Ahora el usuario podrá acceder directamente al dashboard

  return NextResponse.next()
}

// Solo ejecutamos el middleware en rutas específicas si es necesario
export const config = {
  matcher: [],
}
