export interface Message {
  role: "user" | "assistant" | "system"
  content: string
  id?: string
  createdAt?: Date
}

interface AnthropicMessage {
  role: "user" | "assistant" | "system"
  content: {
    type: "text"
    text: string
  }[]
}

interface AnthropicResponse {
  id: string
  type: "message"
  role: "assistant"
  content: {
    type: "text"
    text: string
  }[]
  stop_reason: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

export class AnthropicService {
  private apiKey: string
  private model: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || ""
    this.model = "claude-3-7-sonnet-20250219"
    this.baseUrl = "https://api.anthropic.com/v1/messages"
  }

  async generateResponse(options: { messages: Message[]; systemPrompt?: string }): Promise<Message> {
    const { messages, systemPrompt } = options

    // Convertir mensajes al formato de Anthropic
    const anthropicMessages: AnthropicMessage[] = messages.map((msg) => ({
      role: msg.role,
      content: [{ type: "text", text: msg.content }],
    }))

    // Añadir system prompt si existe
    if (systemPrompt) {
      anthropicMessages.unshift({
        role: "system",
        content: [{ type: "text", text: systemPrompt }],
      })
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: this.model,
          messages: anthropicMessages,
          max_tokens: 4000,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Anthropic API error: ${response.status} ${errorData}`)
      }

      const data = (await response.json()) as AnthropicResponse

      return {
        id: data.id,
        role: "assistant",
        content: data.content[0].text,
        createdAt: new Date(),
      }
    } catch (error) {
      console.error("Error calling Anthropic API:", error)
      throw error
    }
  }
}

export const anthropicService = new AnthropicService()
