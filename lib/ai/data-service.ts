import { neon } from "@neondatabase/serverless"

// Clase para acceder a los datos de las tablas
export class DataService {
  private sql

  constructor() {
    this.sql = neon(process.env.DATABASE_URL || "")
  }

  // Ejecutar una consulta SQL personalizada
  async executeQuery(query: string, params: any[] = []): Promise<any[]> {
    try {
      const result = await this.sql.query(query, params)
      return result.rows || result
    } catch (error) {
      console.error("Error executing query:", error)
      throw error
    }
  }

  // Obtener información sobre las tablas disponibles
  async getTableInfo(): Promise<any[]> {
    try {
      const tables = await this.sql`
        SELECT 
          table_name,
          (
            SELECT json_agg(
              json_build_object(
                'column_name', column_name,
                'data_type', data_type,
                'is_nullable', is_nullable
              )
            )
            FROM information_schema.columns
            WHERE table_name = t.table_name
          ) as columns
        FROM information_schema.tables t
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      `
      return tables
    } catch (error) {
      console.error("Error fetching table information:", error)
      throw error
    }
  }

  // Obtener datos de una tabla específica
  async getTableData(tableName: string, limit = 100, offset = 0): Promise<any[]> {
    try {
      // Sanitizar el nombre de la tabla para evitar inyección SQL
      // Nota: Esto es una simplificación, en producción se necesitaría una validación más robusta
      if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
        throw new Error("Invalid table name")
      }

      const query = `SELECT * FROM "${tableName}" LIMIT $1 OFFSET $2`
      const result = await this.sql.query(query, [limit, offset])
      return result.rows || result
    } catch (error) {
      console.error(`Error fetching data from table ${tableName}:`, error)
      throw error
    }
  }

  // Buscar datos en una tabla
  async searchTableData(tableName: string, column: string, searchTerm: string, limit = 100): Promise<any[]> {
    try {
      // Sanitizar los nombres de tabla y columna
      if (!/^[a-zA-Z0-9_]+$/.test(tableName) || !/^[a-zA-Z0-9_]+$/.test(column)) {
        throw new Error("Invalid table or column name")
      }

      const query = `
        SELECT * FROM "${tableName}" 
        WHERE "${column}" ILIKE $1
        LIMIT $2
      `
      const result = await this.sql.query(query, [`%${searchTerm}%`, limit])
      return result.rows || result
    } catch (error) {
      console.error(`Error searching data in table ${tableName}:`, error)
      throw error
    }
  }
}

// Exportar una instancia del servicio
export const dataService = new DataService()
