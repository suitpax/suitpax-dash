import { AnthropicStream, StreamingTextResponse } from "ai"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

// Tipos para los mensajes y conversaciones
export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: Date
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

// Función para generar respuestas con Anthropic Claude
export async function generateClaudeResponse(messages: Message[], systemPrompt?: string) {
  try {
    // Convertir mensajes al formato que espera Anthropic
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Añadir el system prompt si existe
    if (systemPrompt) {
      formattedMessages.unshift({
        role: "system",
        content: systemPrompt,
      })
    }

    // Generar respuesta con Claude
    const { text } = await generateText({
      model: anthropic("claude-3-opus-20240229"),
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 1024,
    })

    return text
  } catch (error) {
    console.error("Error generating Claude response:", error)
    throw error
  }
}

// Función para generar respuestas en streaming
export async function generateClaudeStream(messages: Message[], systemPrompt?: string) {
  try {
    // Convertir mensajes al formato que espera Anthropic
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Añadir el system prompt si existe
    if (systemPrompt) {
      formattedMessages.unshift({
        role: "system",
        content: systemPrompt,
      })
    }

    // Crear la solicitud a la API de Anthropic
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        messages: formattedMessages,
        max_tokens: 1024,
        temperature: 0.7,
        stream: true,
      }),
    })

    // Crear un stream de texto a partir de la respuesta
    const stream = AnthropicStream(response)

    // Devolver una respuesta de texto en streaming
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error generating Claude stream:", error)
    throw error
  }
}

export class AnthropicService {
  async generateResponse(prompt: string, options?: any) {
    // Mock implementation
    return "Mock response from Anthropic service"
  }

  async streamResponse(prompt: string, options?: any) {
    // Mock streaming response
    return new Response("Mock streaming response", {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }
}

export const anthropicService = new AnthropicService()
