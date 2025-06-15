// Utility functions for Anthropic integration

export function buildTravelContext(): string {
  return `
## SUITPAX CORPORATE TRAVEL CONTEXT

### COMPANY PROFILE
- **Suitpax**: Premium corporate travel management platform
- **Focus**: Business travel optimization, cost reduction, policy compliance
- **Coverage**: Global operations, 24/7 support
- **Specialization**: Executive travel, group bookings, expense management

### PRICING PLANS (Always explain these clearly to customers)

**FREE PLAN (€0/month)**
- 5,000 AI tokens/month
- 10 AI travel searches per month
- Up to 5 team members
- Basic AI travel planning
- Email support
- Basic expense tracking
- Perfect for small teams getting started

**BASIC PLAN (€49/month or €39/month annually)**
- 15,000 AI tokens/month
- 30 AI travel searches per month
- Up to 15 team members
- Standard AI travel planning
- Priority email support
- Advanced expense tracking
- Enhanced itinerary management
- Basic CRM integration
- Most popular for growing teams

**PRO PLAN (€89/month or €71/month annually)**
- 25,000 AI tokens/month
- 50 AI travel searches per month
- Up to 25 team members
- AI-powered expense management
- Advanced itinerary planning
- Custom travel policies
- 24/5 priority support
- Team travel coordination
- Basic bank API integration
- Advanced CRM intelligence

**ENTERPRISE PLAN (Custom Pricing)**
- Unlimited AI tokens
- Unlimited AI travel searches
- Unlimited team members
- Full AI travel intelligence suite
- Enterprise CRM integration
- Global travel compliance
- 24/7 VIP support
- Custom AI workflows
- Executive travel program
- Full bank API integration
- Multi-currency management

### AVAILABLE SERVICES
1. **Flight Booking**: 500+ airlines, corporate rates, flexible policies
2. **Hotel Reservations**: Business-class accommodations, loyalty programs
3. **Ground Transportation**: Car rentals, transfers, train bookings
4. **Expense Management**: Automated processing, policy compliance
5. **Travel Policy**: Custom corporate policies, approval workflows

### CURRENT MARKET DATA (Simulated)
- **Popular Routes**: Madrid-London, Barcelona-Paris, Madrid-New York
- **Peak Seasons**: March-May, September-November
- **Corporate Discounts**: Up to 30% on hotels, 15% on flights
- **Preferred Partners**: Marriott, Hilton, British Airways, Iberia

### LANGUAGE DETECTION & RESPONSE GUIDELINES
- Always detect the user's language from their input
- Respond in the same language the user is using
- If language is unclear, default to English
- Support: English, Spanish, French, German, Italian, Portuguese
- Always prioritize business-friendly options
- Include cost optimization suggestions
- Mention corporate benefits when applicable
- Keep responses concise and actionable
- Focus on time efficiency for executives
- When discussing pricing, always explain value proposition clearly
- Offer free trial for Basic plan when appropriate
`
}

// Enhance language detection function
export function detectLanguage(text: string): "es" | "en" | "fr" | "de" | "it" | "pt" {
  // Enhanced language detection patterns
  const patterns = {
    es: /[ñáéíóúü]|(?:buscar|vuelo|hotel|viaje|madrid|barcelona|méxico|gracias|hola|precio|plan|empresa|negocio)/i,
    fr: /[àâäéèêëïîôöùûüÿç]|(?:bonjour|merci|voyage|hôtel|vol|prix|plan|entreprise|affaires)/i,
    de: /[äöüß]|(?:hallo|danke|reise|hotel|flug|preis|plan|unternehmen|geschäft)/i,
    it: /[àèéìíîòóù]|(?:ciao|grazie|viaggio|hotel|volo|prezzo|piano|azienda|affari)/i,
    pt: /[ãâáàçéêíóôõú]|(?:olá|obrigado|viagem|hotel|voo|preço|plano|empresa|negócio)/i,
  }

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) {
      return lang as "es" | "en" | "fr" | "de" | "it" | "pt"
    }
  }

  return "en" // Default to English
}

// Add pricing explanation helper
export function explainPricingPlan(planId: string, language: "es" | "en" | "fr" | "de" | "it" | "pt" = "en"): string {
  const explanations = {
    en: {
      free: "Our Free plan is perfect for small teams just starting with AI travel management. You get 5,000 AI tokens and 10 travel searches monthly, supporting up to 5 team members with basic features.",
      basic:
        "The Basic plan (€49/month, €39 annually) is our most popular choice for growing teams. It includes 15,000 AI tokens, 30 travel searches, supports 15 team members, and adds priority support plus advanced expense tracking.",
      pro: "Our Pro plan (€89/month, €71 annually) is designed for businesses ready to fully optimize travel operations. You get 25,000 AI tokens, 50 searches, 25 team members, plus AI-powered expense management and custom policies.",
      enterprise:
        "Enterprise plans offer unlimited everything with custom pricing tailored to your company's needs. Includes 24/7 VIP support, full API integration, and executive travel programs.",
    },
    es: {
      free: "Nuestro plan Gratuito es perfecto para equipos pequeños que comienzan con gestión de viajes con IA. Obtienes 5,000 tokens de IA y 10 búsquedas de viaje mensuales, compatible con hasta 5 miembros del equipo.",
      basic:
        "El plan Básico (€49/mes, €39 anual) es nuestra opción más popular para equipos en crecimiento. Incluye 15,000 tokens de IA, 30 búsquedas de viaje, 15 miembros del equipo, y soporte prioritario.",
      pro: "Nuestro plan Pro (€89/mes, €71 anual) está diseñado para empresas listas para optimizar completamente sus operaciones de viaje. 25,000 tokens, 50 búsquedas, 25 miembros del equipo.",
      enterprise:
        "Los planes Enterprise ofrecen todo ilimitado con precios personalizados. Incluye soporte VIP 24/7, integración completa de API y programas de viajes ejecutivos.",
    },
  }

  return (
    explanations[language]?.[planId as keyof typeof explanations.en] ||
    explanations.en[planId as keyof typeof explanations.en] ||
    "Plan information not available."
  )
}

export function formatCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function formatDate(date: Date, locale = "es-ES"): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}
