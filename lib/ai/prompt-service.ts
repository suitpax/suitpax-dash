export interface Prompt {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export class PromptService {
  private prompts: Prompt[] = []

  async getAllPrompts(): Promise<Prompt[]> {
    return this.prompts
  }

  async getPromptById(id: string): Promise<Prompt | null> {
    return this.prompts.find((p) => p.id === id) || null
  }

  async getPromptsByCategory(category: string): Promise<Prompt[]> {
    return this.prompts.filter((p) => p.category === category)
  }

  async createPrompt(data: Omit<Prompt, "id" | "createdAt" | "updatedAt">): Promise<Prompt> {
    const prompt: Prompt = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.prompts.push(prompt)
    return prompt
  }

  async updatePrompt(id: string, data: Partial<Omit<Prompt, "id" | "createdAt" | "updatedAt">>): Promise<Prompt> {
    const index = this.prompts.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error("Prompt not found")
    }

    this.prompts[index] = {
      ...this.prompts[index],
      ...data,
      updatedAt: new Date(),
    }

    return this.prompts[index]
  }

  async deletePrompt(id: string): Promise<boolean> {
    const index = this.prompts.findIndex((p) => p.id === id)
    if (index === -1) {
      return false
    }

    this.prompts.splice(index, 1)
    return true
  }
}

export const promptService = new PromptService()
