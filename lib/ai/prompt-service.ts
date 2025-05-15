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
  // Datos mock para prompts
  private mockPrompts: Prompt[] = [
    {
      id: "mock-1",
      title: "Business Flight to New York",
      content: "I need to book a business class flight to New York next week",
      category: "flights",
      tags: ["business", "urgent", "international"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "mock-2",
      title: "Luxury Hotel in Paris",
      content: "Find me a 5-star hotel in central Paris for next month",
      category: "hotels",
      tags: ["luxury", "europe", "vacation"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "mock-3",
      title: "Car Rental in Los Angeles",
      content: "I need an SUV rental at LAX airport for 5 days",
      category: "cars",
      tags: ["rental", "usa", "business"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "mock-4",
      title: "Train from London to Paris",
      content: "I need to book a train from London to Paris next Friday",
      category: "trains",
      tags: ["europe", "business", "international"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  // Obtener todos los prompts
  async getAllPrompts(): Promise<Prompt[]> {
    return [...this.mockPrompts]
  }

  // Obtener prompts por categoría
  async getPromptsByCategory(category: string): Promise<Prompt[]> {
    return this.mockPrompts.filter((p) => p.category === category)
  }

  // Obtener un prompt por ID
  async getPromptById(id: string): Promise<Prompt | null> {
    return this.mockPrompts.find((p) => p.id === id) || null
  }

  // Crear un nuevo prompt
  async createPrompt(promptData: Omit<Prompt, "id" | "createdAt" | "updatedAt">): Promise<Prompt> {
    const newPrompt: Prompt = {
      id: generateId(),
      ...promptData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.mockPrompts.push(newPrompt)
    return newPrompt
  }

  // Actualizar un prompt existente
  async updatePrompt(id: string, promptData: Partial<Omit<Prompt, "id" | "createdAt" | "updatedAt">>): Promise<Prompt> {
    const index = this.mockPrompts.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error(`Prompt with id ${id} not found`)
    }

    const updatedPrompt = {
      ...this.mockPrompts[index],
      ...promptData,
      updatedAt: new Date(),
    }

    this.mockPrompts[index] = updatedPrompt
    return updatedPrompt
  }

  // Eliminar un prompt
  async deletePrompt(id: string): Promise<boolean> {
    const initialLength = this.mockPrompts.length
    this.mockPrompts = this.mockPrompts.filter((p) => p.id !== id)
    return initialLength > this.mockPrompts.length
  }
}

// Exportar una instancia del servicio
export const promptService = new PromptService()
