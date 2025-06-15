import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { createClient } from "@/lib/supabase/server"

// Enhanced Suitpax AI System with Supabase Integration
const SUITPAX_MASTER_PROMPT = `You are Suitpax AI, the world's most powerful business travel intelligence system created by Alberto (Founder & CEO).

🏢 SUITPAX COMPANY:
- Founded by: Alberto (Founder & CEO)
- Mission: AI-powered business travel revolution
- Domain: app.suitpax.com (authenticated users)
- Status: Leading global business travel platform

💰 REAL SUITPAX PRICING (3 PLANS ONLY):
✅ Free: €0/month - Basic features, limited queries
✅ Pro: €74/month (€51/month annually with 20% discount) - Advanced features
✅ Enterprise: Custom pricing - Unlimited everything, dedicated support

🎯 DYNAMIC DASHBOARD STATES:
- All data starts at ZERO state
- Users configure their own information
- Real-time data detection and updates
- Personalized based on user activity

🔧 ACTION DETECTION & EXECUTION:
When users request to CREATE, ADD, or MANAGE anything, automatically:
- Detect the intent (task, expense, booking, etc.)
- Extract relevant details from the message
- Execute the action in Supabase
- Confirm completion to user
- Guide them to the relevant page

ACTION TRIGGERS (Multi-language):
CREATE/ADD TASKS: "create task", "add task", "crear tarea", "添加任务", "criar tarefa", "создать задачу", "skapa uppgift", "créer tâche", "aufgabe erstellen"
CREATE/ADD EXPENSES: "add expense", "create expense", "añadir gasto", "添加费用", "adicionar despesa", "добавить расход", "lägg till kostnad", "ajouter dépense", "ausgabe hinzufügen"
BOOK TRAVEL: "book flight", "reserve hotel", "reservar vuelo", "预订航班", "reservar voo", "забронировать рейс", "boka flyg", "réserver vol", "flug buchen"

🌍 AUTOMATIC LANGUAGE DETECTION:
- Detect user's language from input automatically
- Respond in the same language
- Support: English, Spanish, Chinese, Portuguese, Russian, Swedish, French, German

📋 SUITPAX PLATFORM KNOWLEDGE:
DASHBOARD: Dynamic zero-state loading, real-time analytics, personalized insights
BOOKING: Flights (Duffel API), Hotels, Trains, Transfers with real pricing
FINANCIAL: Expenses, Budgets, Reports, Smart Bank with Supabase integration
TEAM: Management, Policies, Compliance, Vendor relations
COMMUNICATION: Mails (Nylas), Meetings, Tasks, Events
ADVANCED: Analytics, Forecasting, Sustainability, AI Agents

INTEGRATIONS: Duffel API, Nylas, Supabase Database, Neon, Banking APIs

RESPONSE STYLE:
- Detect language and respond accordingly
- Keep responses under 80 words
- Use bullet points for clarity
- Always confirm actions taken
- Guide users to relevant pages
- Be proactive with suggestions

PERSONALITY:
- Professional yet friendly
- Start with "Hey" in user's language
- Solution-oriented with immediate action
- Modern and efficient
- Confident about capabilities

DOMAIN AWARENESS:
- Users are on app.suitpax.com after authentication
- All actions are real and persistent
- Data is stored in Supabase
- Provide direct links to pages after actions

Remember: You are the most powerful travel AI. Take real actions, don't just talk about them.`

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, userProfile, plan = "free", thinkingMode = false } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Detect language automatically
    const detectedLanguage = detectLanguage(message)

    // Check for action triggers
    const actionResult = await detectAndExecuteAction(message, user.id, supabase)

    // Enhanced prompt with user context and action result
    const enhancedPrompt = `${message}

USER CONTEXT:
- User ID: ${user.id}
- Email: ${user.email}
- Plan: ${plan}
- Detected Language: ${detectedLanguage}
- Domain: app.suitpax.com
- Thinking Mode: ${thinkingMode ? "ON" : "OFF"}

${userProfile?.name ? `Name: ${userProfile.name}` : ""}
${userProfile?.company ? `Company: ${userProfile.company}` : ""}
${actionResult ? `Action Executed: ${JSON.stringify(actionResult)}` : ""}

Respond in ${detectedLanguage} language.`

    // Generate response
    const { text } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: SUITPAX_MASTER_PROMPT,
      prompt: enhancedPrompt,
      temperature: 1.0,
      maxTokens: thinkingMode ? 800 : 300,
    })

    return NextResponse.json({
      response: text,
      conversationId,
      timestamp: new Date().toISOString(),
      model: "claude-3-5-sonnet-20241022",
      detectedLanguage,
      plan,
      actionExecuted: !!actionResult,
      actionResult: actionResult || null,
      domain: "app.suitpax.com",
    })
  } catch (error) {
    console.error("Suitpax AI Error:", error)
    return NextResponse.json(
      {
        response: "Hey, I'm experiencing technical difficulties. Please try again in a moment!",
        error: "Technical issue",
      },
      { status: 500 },
    )
  }
}

// Language detection function
function detectLanguage(text: string): string {
  const languagePatterns = {
    Spanish: /\b(hola|crear|añadir|necesito|quiero|gracias|por favor)\b/i,
    Chinese: /[\u4e00-\u9fff]/,
    Portuguese: /\b(olá|criar|adicionar|preciso|quero|obrigado|por favor)\b/i,
    Russian: /[а-яё]/i,
    Swedish: /\b(hej|skapa|lägga till|behöver|vill|tack|snälla)\b/i,
    French: /\b(bonjour|créer|ajouter|besoin|veux|merci|s'il vous plaît)\b/i,
    German: /\b(hallo|erstellen|hinzufügen|brauche|möchte|danke|bitte)\b/i,
  }

  for (const [language, pattern] of Object.entries(languagePatterns)) {
    if (pattern.test(text)) {
      return language
    }
  }

  return "English"
}

// Action detection and execution
async function detectAndExecuteAction(message: string, userId: string, supabase: any) {
  const lowerMessage = message.toLowerCase()

  // Task creation triggers
  const taskTriggers = [
    "create task",
    "add task",
    "crear tarea",
    "添加任务",
    "criar tarefa",
    "создать задачу",
    "skapa uppgift",
    "créer tâche",
    "aufgabe erstellen",
    "i need to",
    "necesito",
    "preciso",
    "мне нужно",
    "jag behöver",
    "j'ai besoin",
    "ich brauche",
  ]

  // Expense creation triggers
  const expenseTriggers = [
    "add expense",
    "create expense",
    "añadir gasto",
    "添加费用",
    "adicionar despesa",
    "добавить расход",
    "lägg till kostnad",
    "ajouter dépense",
    "ausgabe hinzufügen",
  ]

  if (taskTriggers.some((trigger) => lowerMessage.includes(trigger))) {
    return await createTask(message, userId, supabase)
  }

  if (expenseTriggers.some((trigger) => lowerMessage.includes(trigger))) {
    return await createExpense(message, userId, supabase)
  }

  return null
}

// Create task function
async function createTask(message: string, userId: string, supabase: any) {
  try {
    // Extract task details using simple parsing
    const title = extractTaskTitle(message)
    const priority = extractPriority(message)
    const category = extractCategory(message)

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: userId,
        title,
        description: message,
        priority,
        category,
        status: "pending",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      })
      .select()

    if (error) throw error

    return {
      type: "task_created",
      data: data[0],
      message: "Task created successfully",
    }
  } catch (error) {
    console.error("Task creation error:", error)
    return null
  }
}

// Create expense function
async function createExpense(message: string, userId: string, supabase: any) {
  try {
    const amount = extractAmount(message)
    const title = extractExpenseTitle(message)
    const category = extractExpenseCategory(message)

    const { data, error } = await supabase
      .from("expenses")
      .insert({
        user_id: userId,
        title,
        amount,
        currency: "EUR",
        category,
        date: new Date().toISOString().split("T")[0],
        status: "pending",
      })
      .select()

    if (error) throw error

    return {
      type: "expense_created",
      data: data[0],
      message: "Expense created successfully",
    }
  } catch (error) {
    console.error("Expense creation error:", error)
    return null
  }
}

// Helper functions for extraction
function extractTaskTitle(message: string): string {
  const patterns = [
    /(?:create task|add task|crear tarea|criar tarefa|创建任务)(?:\s+(?:to|for|para|para|为))?\s+(.+)/i,
    /(?:i need to|necesito|preciso|我需要|мне нужно)\s+(.+)/i,
  ]

  for (const pattern of patterns) {
    const match = message.match(pattern)
    if (match) return match[1].trim()
  }

  return message.length > 50 ? message.substring(0, 50) + "..." : message
}

function extractPriority(message: string): "low" | "medium" | "high" {
  const highPriority = /\b(urgent|high|importante|urgente|高|срочно|brådskande|urgent|dringend)\b/i
  const lowPriority = /\b(low|bajo|baixo|低|низкий|låg|bas|niedrig)\b/i

  if (highPriority.test(message)) return "high"
  if (lowPriority.test(message)) return "low"
  return "medium"
}

function extractCategory(message: string): "travel" | "expense" | "meeting" | "general" {
  const travelKeywords = /\b(flight|hotel|travel|viaje|viagem|旅行|путешествие|resa|voyage|reise)\b/i
  const expenseKeywords = /\b(expense|cost|gasto|despesa|费用|расход|kostnad|dépense|ausgabe)\b/i
  const meetingKeywords = /\b(meeting|reunion|reunião|会议|встреча|möte|réunion|besprechung)\b/i

  if (travelKeywords.test(message)) return "travel"
  if (expenseKeywords.test(message)) return "expense"
  if (meetingKeywords.test(message)) return "meeting"
  return "general"
}

function extractAmount(message: string): number {
  const amountPattern = /(?:€|EUR|euro|euros?)\s*(\d+(?:\.\d{2})?)|(\d+(?:\.\d{2})?)\s*(?:€|EUR|euro|euros?)/i
  const match = message.match(amountPattern)
  return match ? Number.parseFloat(match[1] || match[2]) : 0
}

function extractExpenseTitle(message: string): string {
  const patterns = [
    /(?:add expense|create expense|añadir gasto|adicionar despesa)(?:\s+for)?\s+(.+?)(?:\s+€|\s+EUR|$)/i,
  ]

  for (const pattern of patterns) {
    const match = message.match(pattern)
    if (match) return match[1].trim()
  }

  return message.length > 50 ? message.substring(0, 50) + "..." : message
}

function extractExpenseCategory(message: string): string {
  const categories = {
    food: /\b(food|restaurant|dinner|lunch|breakfast|comida|restaurante|cena|almuerzo|desayuno)\b/i,
    transport: /\b(taxi|uber|transport|transporte|bus|metro|train|tren)\b/i,
    accommodation: /\b(hotel|accommodation|alojamiento|hospedagem)\b/i,
    other: /.*/,
  }

  for (const [category, pattern] of Object.entries(categories)) {
    if (pattern.test(message) && category !== "other") {
      return category
    }
  }

  return "other"
}
