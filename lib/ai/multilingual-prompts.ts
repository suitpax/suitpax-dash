export const MULTILINGUAL_SUITPAX_PROMPTS = {
  english: {
    greeting: "Hi! I'm Suitpax AI, your travel assistant. How can I help you today?",
    capabilities: "I can help with flights, hotels, trains, expenses, and bank connections.",
    short_response: "Keep responses under 80 words, be direct and helpful.",
  },
  spanish: {
    greeting: "¡Hola! Soy Suitpax AI, tu asistente de viajes. ¿Cómo puedo ayudarte hoy?",
    capabilities: "Puedo ayudarte con vuelos, hoteles, trenes, gastos y conexiones bancarias.",
    short_response: "Mantén respuestas bajo 80 palabras, sé directo y útil.",
  },
  french: {
    greeting: "Salut! Je suis Suitpax AI, votre assistant voyage. Comment puis-je vous aider aujourd'hui?",
    capabilities: "Je peux vous aider avec les vols, hôtels, trains, dépenses et connexions bancaires.",
    short_response: "Gardez les réponses sous 80 mots, soyez direct et utile.",
  },
  german: {
    greeting: "Hallo! Ich bin Suitpax AI, Ihr Reiseassistent. Wie kann ich Ihnen heute helfen?",
    capabilities: "Ich kann bei Flügen, Hotels, Zügen, Ausgaben und Bankverbindungen helfen.",
    short_response: "Antworten unter 80 Wörtern halten, direkt und hilfreich sein.",
  },
  arabic: {
    greeting: "مرحبا! أنا Suitpax AI، مساعد السفر الخاص بك. كيف يمكنني مساعدتك اليوم؟",
    capabilities: "يمكنني المساعدة في الرحلات والفنادق والقطارات والمصروفات والاتصالات المصرفية.",
    short_response: "احتفظ بالردود تحت 80 كلمة، كن مباشرًا ومفيدًا.",
  },
  japanese: {
    greeting: "こんにちは！私はSuitpax AI、あなたの旅行アシスタントです。今日はどのようにお手伝いできますか？",
    capabilities: "フライト、ホテル、電車、経費、銀行接続のお手伝いができます。",
    short_response: "回答は80語以下に保ち、直接的で役立つようにしてください。",
  },
}

export const SUITPAX_ONLY_FEATURES = {
  available: [
    "Flight booking with live API",
    "Hotel reservations",
    "Train ticket booking",
    "Expense management with receipt upload",
    "Bank account integration",
    "Team management and policies",
    "Calendar integration",
    "AI travel assistant",
    "Transfer booking",
    "Travel policy compliance",
  ],
  not_available: [
    "Car rentals", // We don't have this yet
    "Travel insurance", // Not implemented
    "Visa assistance", // Not our service
    "Currency exchange", // Not available
    "Travel rewards program", // Not implemented
  ],
}

export function detectLanguage(text: string): string {
  // Simple language detection based on common words/patterns
  if (/\b(hola|gracias|por favor|ayuda)\b/i.test(text)) return "spanish"
  if (/\b(bonjour|merci|s'il vous plaît|aide)\b/i.test(text)) return "french"
  if (/\b(hallo|danke|bitte|hilfe)\b/i.test(text)) return "german"
  if (/[\u0600-\u06FF]/.test(text)) return "arabic"
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) return "japanese"
  return "english"
}
