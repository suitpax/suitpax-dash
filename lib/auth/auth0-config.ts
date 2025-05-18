import { initAuth0 } from "@auth0/nextjs-auth0"

export const auth0 = initAuth0({
  secret: process.env.AUTH0_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  routes: {
    callback: "/api/auth/callback",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
  },
  authorizationParams: {
    response_type: "code",
    scope: "openid profile email",
  },
  session: {
    rollingDuration: 60 * 60, // 1 hora (en segundos)
  },
})

// Exportamos getSession para usar en componentes del lado del servidor
export const getSession = auth0.getSession.bind(auth0)

// Exportamos withApiAuthRequired para proteger rutas API
export const withApiAuthRequired = auth0.withApiAuthRequired.bind(auth0)

// Exportamos withPageAuthRequired para proteger páginas
export const withPageAuthRequired = auth0.withPageAuthRequired.bind(auth0)
