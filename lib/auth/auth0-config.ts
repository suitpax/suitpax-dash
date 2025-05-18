import { getSession as getAuth0Session, withApiAuthRequired, withPageAuthRequired } from "@auth0/nextjs-auth0"

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
