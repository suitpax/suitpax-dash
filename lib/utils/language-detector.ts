// Advanced language detection utility
export class LanguageDetector {
  private static languagePatterns = {
    en: {
      patterns: [
        /\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/gi,
        /\b(hello|hi|hey|what|how|when|where|why|who)\b/gi,
        /\b(flight|hotel|travel|trip|booking|expense)\b/gi,
      ],
      commonWords: ["the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"],
    },
    es: {
      patterns: [
        /\b(el|la|los|las|un|una|y|o|pero|en|con|por|para|de)\b/gi,
        /\b(hola|qué|cómo|cuándo|dónde|por qué|quién)\b/gi,
        /\b(vuelo|hotel|viaje|reserva|gasto|próximo)\b/gi,
      ],
      commonWords: ["el", "la", "los", "las", "un", "una", "y", "o", "pero", "en", "con", "por", "para", "de"],
    },
    zh: {
      patterns: [/[\u4e00-\u9fff]/g, /\b(的|是|在|有|我|你|他|她|它|们|这|那|什么|怎么|哪里|为什么)\b/gi],
      commonWords: ["的", "是", "在", "有", "我", "你", "他", "她", "它", "们", "这", "那"],
    },
    pt: {
      patterns: [
        /\b(o|a|os|as|um|uma|e|ou|mas|em|com|por|para|de)\b/gi,
        /\b(olá|oi|o que|como|quando|onde|por que|quem)\b/gi,
        /\b(voo|hotel|viagem|reserva|despesa|próxima)\b/gi,
      ],
      commonWords: ["o", "a", "os", "as", "um", "uma", "e", "ou", "mas", "em", "com", "por", "para", "de"],
    },
    ru: {
      patterns: [/[\u0400-\u04ff]/g, /\b(и|в|на|с|по|для|от|к|за|из|что|как|когда|где|почему|кто)\b/gi],
      commonWords: ["и", "в", "на", "с", "по", "для", "от", "к", "за", "из"],
    },
    sv: {
      patterns: [
        /\b(och|eller|men|i|på|av|för|med|till|från|vad|hur|när|var|varför|vem)\b/gi,
        /\b(hej|hallo|flyg|hotell|resa|bokning|kostnad)\b/gi,
      ],
      commonWords: ["och", "eller", "men", "i", "på", "av", "för", "med", "till", "från"],
    },
    fr: {
      patterns: [
        /\b(le|la|les|un|une|et|ou|mais|dans|avec|par|pour|de|du|des)\b/gi,
        /\b(bonjour|salut|quoi|comment|quand|où|pourquoi|qui)\b/gi,
        /\b(vol|hôtel|voyage|réservation|dépense|prochain)\b/gi,
      ],
      commonWords: ["le", "la", "les", "un", "une", "et", "ou", "mais", "dans", "avec", "par", "pour", "de"],
    },
    de: {
      patterns: [
        /\b(der|die|das|ein|eine|und|oder|aber|in|mit|von|zu|für|auf)\b/gi,
        /\b(hallo|was|wie|wann|wo|warum|wer)\b/gi,
        /\b(flug|hotel|reise|buchung|ausgabe|nächste)\b/gi,
      ],
      commonWords: ["der", "die", "das", "ein", "eine", "und", "oder", "aber", "in", "mit", "von", "zu", "für"],
    },
  }

  static detectLanguage(text: string): string {
    if (!text || text.trim().length === 0) {
      return "en" // Default to English
    }

    const scores: Record<string, number> = {}

    // Initialize scores
    Object.keys(this.languagePatterns).forEach((lang) => {
      scores[lang] = 0
    })

    // Score each language based on pattern matches
    Object.entries(this.languagePatterns).forEach(([lang, config]) => {
      config.patterns.forEach((pattern) => {
        const matches = text.match(pattern)
        if (matches) {
          scores[lang] += matches.length
        }
      })

      // Bonus for common words
      config.commonWords.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, "gi")
        const matches = text.match(regex)
        if (matches) {
          scores[lang] += matches.length * 2 // Higher weight for common words
        }
      })
    })

    // Find the language with the highest score
    const detectedLang = Object.entries(scores).reduce((a, b) => (scores[a[0]] > scores[b[0]] ? a : b))[0]

    // If no clear winner, default to English
    return scores[detectedLang] > 0 ? detectedLang : "en"
  }

  static getWelcomeMessage(detectedLanguage: string): string {
    const messages = {
      en: "Hey, I'm Suitpax AI. What's your next trip?",
      es: "Hey, soy Suitpax AI. ¿Cuál es tu próximo viaje?",
      zh: "嘿，我是Suitpax AI。你的下一次旅行是什么？",
      pt: "Hey, eu sou Suitpax AI. Qual é sua próxima viagem?",
      ru: "Привет, я Suitpax AI. Какая у вас следующая поездка?",
      sv: "Hej, jag är Suitpax AI. Vad är din nästa resa?",
      fr: "Salut, je suis Suitpax AI. Quel est votre prochain voyage?",
      de: "Hey, ich bin Suitpax AI. Was ist Ihre nächste Reise?",
    }

    return messages[detectedLanguage as keyof typeof messages] || messages.en
  }
}
