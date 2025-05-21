// Servicio para interactuar con el Migrations Service

const BASE_URL = process.env.MIGRATIONS_SERVICE_URL || "http://localhost:5014"

interface Migration {
  id: string
  name: string
  appliedAt: string
  status: "pending" | "applied" | "failed"
}

export const MigrationsService = {
  // Obtener todas las migraciones
  async getMigrations(token: string): Promise<Migration[]> {
    try {
      const response = await fetch(`${BASE_URL}/migrations`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al obtener migraciones")
      }

      return await response.json()
    } catch (error) {
      console.error("Error al obtener migraciones:", error)
      throw error
    }
  },

  // Aplicar todas las migraciones pendientes
  async applyMigrations(token: string): Promise<{ applied: number; failed: number }> {
    try {
      const response = await fetch(`${BASE_URL}/migrations/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al aplicar migraciones")
      }

      return await response.json()
    } catch (error) {
      console.error("Error al aplicar migraciones:", error)
      throw error
    }
  },

  // Revertir la última migración aplicada
  async revertLastMigration(token: string): Promise<{ reverted: boolean; migration: string }> {
    try {
      const response = await fetch(`${BASE_URL}/migrations/revert`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al revertir la última migración")
      }

      return await response.json()
    } catch (error) {
      console.error("Error al revertir la última migración:", error)
      throw error
    }
  },

  // Verificar el estado de la base de datos
  async checkDatabaseStatus(token: string): Promise<{ status: "ok" | "needs_migration" | "error"; message: string }> {
    try {
      const response = await fetch(`${BASE_URL}/migrations/status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al verificar el estado de la base de datos")
      }

      return await response.json()
    } catch (error) {
      console.error("Error al verificar el estado de la base de datos:", error)
      throw error
    }
  },
}
