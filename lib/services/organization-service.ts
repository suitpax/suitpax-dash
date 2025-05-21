// Servicio para interactuar con el Organization Service

const BASE_URL = process.env.ORGANIZATION_SERVICE_URL || "http://localhost:5011"

interface Organization {
  id: string
  name: string
  description?: string
  logo?: string
  createdAt: string
  updatedAt: string
}

interface CreateOrganizationData {
  name: string
  description?: string
  logo?: string
}

interface UpdateOrganizationData {
  name?: string
  description?: string
  logo?: string
}

export const OrganizationService = {
  // Obtener todas las organizaciones
  async getOrganizations(token: string): Promise<Organization[]> {
    try {
      const response = await fetch(`${BASE_URL}/organizations`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al obtener organizaciones")
      }

      return await response.json()
    } catch (error) {
      console.error("Error al obtener organizaciones:", error)
      throw error
    }
  },

  // Obtener una organización por ID
  async getOrganization(id: string, token: string): Promise<Organization> {
    try {
      const response = await fetch(`${BASE_URL}/organizations/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al obtener la organización")
      }

      return await response.json()
    } catch (error) {
      console.error(`Error al obtener la organización ${id}:`, error)
      throw error
    }
  },

  // Crear una nueva organización
  async createOrganization(data: CreateOrganizationData, token: string): Promise<Organization> {
    try {
      const response = await fetch(`${BASE_URL}/organizations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al crear la organización")
      }

      return await response.json()
    } catch (error) {
      console.error("Error al crear la organización:", error)
      throw error
    }
  },

  // Actualizar una organización
  async updateOrganization(id: string, data: UpdateOrganizationData, token: string): Promise<Organization> {
    try {
      const response = await fetch(`${BASE_URL}/organizations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al actualizar la organización")
      }

      return await response.json()
    } catch (error) {
      console.error(`Error al actualizar la organización ${id}:`, error)
      throw error
    }
  },

  // Eliminar una organización
  async deleteOrganization(id: string, token: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/organizations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.ok
    } catch (error) {
      console.error(`Error al eliminar la organización ${id}:`, error)
      throw error
    }
  },

  // Obtener miembros de una organización
  async getOrganizationMembers(organizationId: string, token: string): Promise<any[]> {
    try {
      const response = await fetch(`${BASE_URL}/organizations/${organizationId}/members`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al obtener miembros de la organización")
      }

      return await response.json()
    } catch (error) {
      console.error(`Error al obtener miembros de la organización ${organizationId}:`, error)
      throw error
    }
  },

  // Añadir miembro a una organización
  async addOrganizationMember(organizationId: string, userId: string, role: string, token: string): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/organizations/${organizationId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, role }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al añadir miembro a la organización")
      }

      return await response.json()
    } catch (error) {
      console.error(`Error al añadir miembro a la organización ${organizationId}:`, error)
      throw error
    }
  },

  // Actualizar rol de miembro en una organización
  async updateOrganizationMember(organizationId: string, userId: string, role: string, token: string): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/organizations/${organizationId}/members/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al actualizar rol de miembro en la organización")
      }

      return await response.json()
    } catch (error) {
      console.error(`Error al actualizar rol de miembro en la organización ${organizationId}:`, error)
      throw error
    }
  },

  // Eliminar miembro de una organización
  async removeOrganizationMember(organizationId: string, userId: string, token: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/organizations/${organizationId}/members/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.ok
    } catch (error) {
      console.error(`Error al eliminar miembro de la organización ${organizationId}:`, error)
      throw error
    }
  },
}
