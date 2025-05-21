// Este archivo reemplaza las funcionalidades que antes dependían de prompt-service.ts
import { v4 as uuidv4 } from "uuid"

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

// Clase para gestionar los prompts en memoria
export class AIStudioService {
  private prompts: Prompt[] = []

  constructor() {
    // Inicializar con algunos prompts de ejemplo
    this.prompts = [
      {
        id: uuidv4(),
        title: "Búsqueda de vuelos",
        content: "Busca vuelos de {origen} a {destino} para {fecha}",
        category: "flights",
        tags: ["vuelos", "búsqueda"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Reserva de hotel",
        content: "Encuentra hoteles en {ciudad} para {fechaEntrada} hasta {fechaSalida}",
        category: "hotels",
        tags: ["hoteles", "búsqueda"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Alquiler de coches",
        content: "Busca coches de alquiler en {ciudad} para {fechaRecogida} hasta {fechaEntrega}",
        category: "cars",
        tags: ["coches", "alquiler"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  }

  // Obtener todos los prompts
  async getAllPrompts(): Promise<Prompt[]> {
    return [...this.prompts]
  }

  // Obtener prompts por categoría
  async getPromptsByCategory(category: string): Promise<Prompt[]> {
    return this.prompts.filter((p) => p.category === category)
  }

  // Obtener un prompt por ID
  async getPromptById(id: string): Promise<Prompt | null> {
    return this.prompts.find((p) => p.id === id) || null
  }

  // Crear un nuevo prompt
  async createPrompt(promptData: Omit<Prompt, "id" | "createdAt" | "updatedAt">): Promise<Prompt> {
    const newPrompt: Prompt = {
      ...promptData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.prompts.push(newPrompt)
    return newPrompt
  }

  // Actualizar un prompt existente
  async updatePrompt(
    id: string,
    promptData: Partial<Omit<Prompt, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Prompt | null> {
    const index = this.prompts.findIndex((p) => p.id === id)
    if (index === -1) return null

    this.prompts[index] = {
      ...this.prompts[index],
      ...promptData,
      updatedAt: new Date(),
    }

    return this.prompts[index]
  }

  // Eliminar un prompt
  async deletePrompt(id: string): Promise<boolean> {
    const initialLength = this.prompts.length
    this.prompts = this.prompts.filter((p) => p.id !== id)
    return initialLength !== this.prompts.length
  }

  // Obtener categorías disponibles
  async getCategories(): Promise<string[]> {
    const categories = new Set<string>()
    this.prompts.forEach((prompt) => categories.add(prompt.category))
    return Array.from(categories)
  }

  // Obtener capacidades de la IA
  async getAICapabilities(): Promise<{
    availableTables: Array<{ name: string; columns: Array<{ name: string; type: string }> }>
    promptCategories: string[]
  }> {
    // Simular tablas disponibles
    const availableTables = [
      {
        name: "flights",
        columns: [
          { name: "id", type: "string" },
          { name: "airline", type: "string" },
          { name: "departure", type: "string" },
          { name: "arrival", type: "string" },
          { name: "price", type: "number" },
        ],
      },
      {
        name: "hotels",
        columns: [
          { name: "id", type: "string" },
          { name: "name", type: "string" },
          { name: "location", type: "string" },
          { name: "price", type: "number" },
          { name: "rating", type: "number" },
        ],
      },
      {
        name: "cars",
        columns: [
          { name: "id", type: "string" },
          { name: "type", type: "string" },
          { name: "company", type: "string" },
          { name: "price", type: "number" },
        ],
      },
    ]

    // Obtener categorías de prompts
    const promptCategories = await this.getCategories()

    return {
      availableTables,
      promptCategories,
    }
  }
}

// Exportar una instancia del servicio
export const aiStudioService = new AIStudioService()
