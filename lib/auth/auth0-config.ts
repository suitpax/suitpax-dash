import { getSession as getAuth0Session, withApiAuthRequired, withPageAuthRequired } from "@auth0/nextjs-auth0"

// Configuración de Auth0 basada en las variables de entorno
const AUTH0_CONFIG = {
  baseURL: process.env.FE_BASE_URL || "http://localhost:3000",
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || `https://${process.env.AUTH0_DOMAIN_DEV}`,
  clientID: process.env.AUTH0_CLIENT_ID_DEV || "",
  clientSecret: process.env.AUTH0_CLIENT_SECRET_DEV || "",
  secret: process.env.SECRET_KEY || "",
  authorizationParams: {
    scope: "openid profile email",
    audience: undefined,
  },
  routes: {
    callback: "/api/auth/callback",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
  },
  session: {
    rollingDuration: 60 * 60 * 24, // 24 horas
  },
}

// Exportamos las funciones necesarias de Auth0
export const getSession = getAuth0Session
export const requireApiAuth = withApiAuthRequired
export const requirePageAuth = withPageAuthRequired

// Función auxiliar para verificar si el usuario está autenticado
export const isAuthenticated = async (req: Request, res: Response): Promise<boolean> => {
  const session = await getSession(req, res)
  return !!session?.user
}

// Función auxiliar para obtener el ID del usuario
export const getUserId = async (req: Request, res: Response): Promise<string | null> => {
  const session = await getSession(req, res)
  return session?.user?.sub || null
}

// Exportamos la configuración para uso en otros módulos
export { AUTH0_CONFIG }
