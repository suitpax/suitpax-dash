// Servicio para interactuar con el User Service

const BASE_URL = process.env.USER_SERVICE_URL || "http://localhost:5013"

interface User {
  id: string
  email: string
  name: string
  lastName?: string
  role: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

interface UpdateUserData {
  name?: string
  lastName?: string
  avatar?: string
}

export const UserService = {
  // Obtener todos los usuarios
  async getUsers(token: string): Promise<User[]> {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al obtener usuarios")
      }

      return await response.json()
    } catch (error) {
      console.error("Error al obtener usuarios:", error)
      throw error
    }
  },

  // Obtener un usuario por ID
  async getUser(id: string, token: string): Promise<User> {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al obtener el usuario")
      }

      return await response.json()
    } catch (error) {
      console.error(`Error al obtener el usuario ${id}:`, error)
      throw error
    }
  },

  // Obtener el perfil del usuario actual
  async getCurrentUser(token: string): Promise<User> {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al obtener el perfil del usuario")
      }

      return await response.json()
    } catch (error) {
      console.error("Error al obtener el perfil del usuario:", error)
      throw error
    }
  },

  // Actualizar el perfil del usuario actual
  async updateCurrentUser(data: UpdateUserData, token: string): Promise<User> {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al actualizar el perfil del usuario")
      }

      return await response.json()
    } catch (error) {
      console.error("Error al actualizar el perfil del usuario:", error)
      throw error
    }
  },

  // Actualizar un usuario por ID (solo para administradores)
  async updateUser(id: string, data: UpdateUserData, token: string): Promise<User> {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al actualizar el usuario")
      }

      return await response.json()
    } catch (error) {
      console.error(`Error al actualizar el usuario ${id}:`, error)
      throw error
    }
  },

  // Eliminar un usuario por ID (solo para administradores)
  async deleteUser(id: string, token: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.ok
    } catch (error) {
      console.error(`Error al eliminar el usuario ${id}:`, error)
      throw error
    }
  },

  // Cambiar contraseña del usuario actual
  async changePassword(currentPassword: string, newPassword: string, token: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/users/me/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      return response.ok
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error)
      throw error
    }
  },
}
