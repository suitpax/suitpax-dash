import Anthropic from "@anthropic-ai/sdk"

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is required")
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export { anthropic }
export default anthropic

// Utility functions for Anthropic integration

export function buildTravelContext(): string {
  return `
## SUITPAX CORPORATE TRAVEL CONTEXT

### COMPANY PROFILE
- **Suitpax**: Premium corporate travel management platform
- **Focus**: Business travel optimization, cost reduction, policy compliance
- **Coverage**: Global operations, 24/7 support
- **Specialization**: Executive travel, group bookings, expense management

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

### RESPONSE GUIDELINES
- Always prioritize business-friendly options
- Include cost optimization suggestions
- Mention corporate benefits when applicable
- Keep responses concise and actionable
- Focus on time efficiency for executives
`
}

export function detectLanguage(text: string): "es" | "en" {
  // Simple language detection based on common patterns
  const spanishPatterns = /[ñáéíóúü]|(?:buscar|vuelo|hotel|viaje|madrid|barcelona|méxico|gracias|hola)/i
  return spanishPatterns.test(text) ? "es" : "en"
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
