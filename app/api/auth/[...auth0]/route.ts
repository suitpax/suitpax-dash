import { auth0 } from "@/lib/auth/auth0-config"

export const GET = auth0.handleAuth()
export const POST = auth0.handleAuth()

// Esta ruta manejará automáticamente:
// - /api/auth/login
// - /api/auth/logout
// - /api/auth/callback
// - /api/auth/me
