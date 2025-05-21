// Servicio para interactuar con el Authentication Service

const BASE_URL = process.env.BASE_URL || "http://localhost:5010"

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  name: string
  lastName?: string
}

interface AuthResponse {
  access_token: string
  token_type: string
  user: {
    id: string
    email: string
    name: string
    lastName?: string
    role: string
  }
}

export const AuthService = {
  // Iniciar sesión con credenciales
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al iniciar sesión")
      }

      return await response.json()
    } catch (error) {
      console.error("Error en login:", error)
      throw error
    }
  },

  // Registrar un nuevo usuario
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al registrar usuario")
      }

      return await response.json()
    } catch (error) {
      console.error("Error en registro:", error)
      throw error
    }
  },

  // Iniciar sesión con Google
  async googleLogin(redirectUri: string): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/auth/google/login?redirect_uri=${encodeURIComponent(redirectUri)}`, {
        method: "GET",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al iniciar sesión con Google")
      }

      const data = await response.json()
      return data.authorization_url
    } catch (error) {
      console.error("Error en login con Google:", error)
      throw error
    }
  },

  // Verificar token
  async verifyToken(token: string): Promise<{ valid: boolean; user?: any }> {
    try {
      const response = await fetch(`${BASE_URL}/auth/verify-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return { valid: false }
      }

      const data = await response.json()
      return { valid: true, user: data.user }
    } catch (error) {
      console.error("Error al verificar token:", error)
      return { valid: false }
    }
  },

  // Cerrar sesión
  async logout(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.ok
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      return false
    }
  },

  // Solicitar restablecimiento de contraseña
  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/auth/request-password-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      return response.ok
    } catch (error) {
      console.error("Error al solicitar restablecimiento de contraseña:", error)
      return false
    }
  },

  // Restablecer contraseña
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, new_password: newPassword }),
      })

      return response.ok
    } catch (error) {
      console.error("Error al restablecer contraseña:", error)
      return false
    }
  },
}
