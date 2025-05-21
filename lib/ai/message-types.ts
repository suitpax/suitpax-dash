export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: Date
}

export interface AIServiceResponse {
  response: Message
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}
