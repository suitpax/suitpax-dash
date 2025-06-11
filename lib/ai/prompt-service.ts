import { neon } from "@neondatabase/serverless"
import { generateId } from "../utils"

// Tipos para los prompts
export interface Prompt {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// Clase para gestionar los prompts
export class PromptService {
  private sql

  constructor() {
    this.sql = neon(process.env.DATABASE_URL || "")
  }

  // Obtener todos los prompts
  async getAllPrompts(): Promise<Prompt[]> {
    try {
      const prompts = await this.sql`
        SELECT * FROM prompts
        ORDER BY "updatedAt" DESC
      `
      return prompts
    } catch (error) {
      console.error("Error fetching prompts:", error)
      throw error
    }
  }

  // Obtener prompts por categoría
  async getPromptsByCategory(category: string): Promise<Prompt[]> {
    try {
      const prompts = await this.sql`
        SELECT * FROM prompts
        WHERE category = ${category}
        ORDER BY "updatedAt" DESC
      `
      return prompts
    } catch (error) {
      console.error(`Error fetching prompts for category ${category}:`, error)
      throw error
    }
  }

  // Obtener un prompt por ID
  async getPromptById(id: string): Promise<Prompt | null> {
    try {
      const [prompt] = await this.sql`
        SELECT * FROM prompts
        WHERE id = ${id}
      `
      return prompt || null
    } catch (error) {
      console.error(`Error fetching prompt ${id}:`, error)
      throw error
    }
  }

  // Crear un nuevo prompt
  async createPrompt(promptData: Omit<Prompt, "id" | "createdAt" | "updatedAt">): Promise<Prompt> {
    try {
      const id = generateId()
      const now = new Date()

      const [newPrompt] = await this.sql`
        INSERT INTO prompts (
          id, title, content, category, tags, "createdAt", "updatedAt"
        ) VALUES (
          ${id}, ${promptData.title}, ${promptData.content}, 
          ${promptData.category}, ${JSON.stringify(promptData.tags)}, 
          ${now}, ${now}
        )
        RETURNING *
      `

      return newPrompt
    } catch (error) {
      console.error("Error creating prompt:", error)
      throw error
    }
  }

  // Actualizar un prompt existente
  async updatePrompt(id: string, promptData: Partial<Omit<Prompt, "id" | "createdAt" | "updatedAt">>): Promise<Prompt> {
    try {
      const now = new Date()

      // Construir dinámicamente la consulta SQL
      const updateFields = []
      const values: any[] = []

      if (promptData.title !== undefined) {
        updateFields.push('"title" = $1')
        values.push(promptData.title)
      }

      if (promptData.content !== undefined) {
        updateFields.push('"content" = $' + (values.length + 1))
        values.push(promptData.content)
      }

      if (promptData.category !== undefined) {
        updateFields.push('"category" = $' + (values.length + 1))
        values.push(promptData.category)
      }

      if (promptData.tags !== undefined) {
        updateFields.push('"tags" = $' + (values.length + 1))
        values.push(JSON.stringify(promptData.tags))
      }

      // Añadir siempre la fecha de actualización
      updateFields.push('"updatedAt" = $' + (values.length + 1))
      values.push(now)

      // Añadir el ID al final
      values.push(id)

      const query = `
        UPDATE prompts
        SET ${updateFields.join(", ")}
        WHERE id = $${values.length}
        RETURNING *
      `

      const [updatedPrompt] = await this.sql.query(query, values)
      return updatedPrompt
    } catch (error) {
      console.error(`Error updating prompt ${id}:`, error)
      throw error
    }
  }

  // Eliminar un prompt
  async deletePrompt(id: string): Promise<boolean> {
    try {
      const result = await this.sql`
        DELETE FROM prompts
        WHERE id = ${id}
      `

      return result.count > 0
    } catch (error) {
      console.error(`Error deleting prompt ${id}:`, error)
      throw error
    }
  }
}

// Exportar una instancia del servicio
export const promptService = new PromptService()
