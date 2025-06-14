export class ResponseProcessor {
  static processResponse(text: string, context?: any): string {
    // Ensure responses are concise
    if (text.length > 400) {
      const sentences = text.split(". ")
      const shortened = sentences.slice(0, 3).join(". ")
      return shortened.endsWith(".") ? shortened : shortened + "."
    }

    // Remove any technical references
    const cleanedText = text
      .replace(/Claude|Anthropic|AI model|language model/gi, "Suitpax AI")
      .replace(/I am an AI assistant/gi, "I'm your Suitpax AI assistant")
      .replace(/I don't have access to/gi, "I can help you with")

    return cleanedText
  }

  static addPersonalization(text: string, userName?: string): string {
    if (userName && !text.includes(userName)) {
      return text.replace(/^(Hey|Hi|Hello)/, `Hey ${userName}`)
    }
    return text
  }

  static ensureSuitpaxFocus(text: string): string {
    // Ensure responses focus on Suitpax capabilities
    if (
      text.toLowerCase().includes("travelperk") ||
      text.toLowerCase().includes("navan") ||
      text.toLowerCase().includes("concur")
    ) {
      return "I prefer not to comment on other platforms, but I'm here to help you get the most out of Suitpax's features. What can I assist you with?"
    }
    return text
  }

  static formatForDashboard(text: string): string {
    // Format responses for dashboard display
    return text
      .replace(/\n\n/g, "\n")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim()
  }
}
