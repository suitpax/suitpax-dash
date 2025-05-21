import Anthropic from "@anthropic-ai/sdk"

// Inicializar el cliente de Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

export interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

export interface ChatCompletionOptions {
  messages: Message[]
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

export async function generateChatCompletion({
  messages,
  model = "claude-3-opus-20240229",
  temperature = 0.7,
  maxTokens = 1024,
  systemPrompt = "",
}: ChatCompletionOptions) {
  try {
    // Convertir mensajes al formato esperado por Anthropic
    const anthropicMessages = messages
      .filter((msg) => msg.role !== "system")
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

    // Obtener el system prompt
    const system =
      systemPrompt ||
      messages.find((msg) => msg.role === "system")?.content ||
      "You are a helpful AI assistant for business travel."

    // Realizar la llamada a la API
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system,
      messages: anthropicMessages,
    })

    return {
      content: response.content[0].text,
      model: response.model,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
    }
  } catch (error) {
    console.error("Error calling Anthropic API:", error)
    throw error
  }
}
