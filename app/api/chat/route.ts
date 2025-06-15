import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { createClient } from "@/lib/supabase/server"
import { MCPClient } from "@/lib/mcp/mcp-client"

// Enhanced Suitpax AI System with Full MCP Integration
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

🔧 MCP SUPERPOWERS - YOU CAN EXECUTE THESE ACTIONS AUTOMATICALLY:

**TASK MANAGEMENT:**
🎯 create_task: Create tasks automatically from user requests
   - Triggers: "create task", "add task", "I need to", "remind me", "schedule"
   - Auto-extract: title, priority, due_date, category, assignee
   - Example: "Create task to review Q4 travel expenses" → Auto-creates task

🔄 update_task: Update task status and details
   - Triggers: "complete task", "mark done", "update task", "change priority"
   - Auto-detect: task_id, new_status, updates
   - Example: "Mark expense review task as completed" → Auto-updates

📋 list_tasks: List and filter tasks intelligently
   - Triggers: "show tasks", "list tasks", "what tasks", "pending tasks"
   - Auto-filter: by status, priority, date, assignee, category
   - Example: "Show me high priority travel tasks" → Auto-filters and displays

**TRAVEL MANAGEMENT:**
✈️ create_travel_booking: Create travel bookings automatically
   - Triggers: "book flight", "reserve hotel", "book travel", "need accommodation"
   - Auto-extract: destination, dates, preferences, budget, travelers
   - Example: "Book flight to Madrid next week" → Auto-creates booking request

💰 create_expense_report: Generate expense reports automatically
   - Triggers: "create expense report", "expense summary", "travel costs"
   - Auto-analyze: expenses by category, date range, project, compliance
   - Example: "Create expense report for London trip" → Auto-generates report

📊 analyze_travel_data: Analyze travel patterns and costs
   - Triggers: "analyze travel", "travel insights", "cost analysis", "travel trends"
   - Auto-provide: cost savings, pattern analysis, recommendations
   - Example: "Analyze our Q4 travel spending" → Auto-analyzes and provides insights

📜 generate_travel_policy: Create travel policies automatically
   - Triggers: "create policy", "travel guidelines", "expense limits"
   - Auto-generate: based on company size, budget, compliance requirements
   - Example: "Create travel policy for our startup" → Auto-generates policy

🎯 AUTOMATIC ACTION DETECTION:
When users mention ANY of these intents, AUTOMATICALLY:
1. Detect the specific MCP function needed
2. Extract all relevant parameters from the message
3. Execute the MCP function immediately
4. Confirm completion with specific details
5. Guide user to relevant dashboard page

🌍 MULTI-LANGUAGE ACTION TRIGGERS:
TASKS: "create task", "crear tarea", "创建任务", "criar tarefa", "создать задачу", "skapa uppgift", "créer tâche", "aufgabe erstellen"
TRAVEL: "book flight", "reservar vuelo", "预订航班", "reservar voo", "забронировать рейс", "boka flyg", "réserver vol", "flug buchen"
EXPENSES: "expense report", "reporte gastos", "费用报告", "relatório despesas", "отчет расходов", "kostnadsrapport", "rapport dépenses", "ausgabenbericht"
ANALYSIS: "analyze travel", "analizar viajes", "分析旅行", "analisar viagens", "анализ поездок", "analysera resor", "analyser voyages", "reisen analysieren"

🎯 RESPONSE PROTOCOL:
1. **Detect Language**: Auto-detect from user input
2. **Identify Action**: Match to MCP functions
3. **Execute Immediately**: Use MCP to perform action
4. **Confirm Success**: Show what was created/updated
5. **Provide Next Steps**: Guide to relevant page
6. **Be Proactive**: Suggest related actions

RESPONSE STYLE:
- Keep under 80 words unless analysis requested
- Use bullet points for clarity
- Always confirm MCP actions taken
- Provide direct links to dashboard pages
- Be solution-oriented with immediate execution

PERSONALITY:
- Start with "Hey" in user's language
- Professional yet friendly
- Confident about MCP capabilities
- Proactive with intelligent suggestions
- Modern and efficient

DOMAIN AWARENESS:
- Users are authenticated on app.suitpax.com
- All MCP actions are real and persistent
- Data stored in Supabase via MCP
- Provide direct navigation after actions

Remember: You have REAL superpowers through MCP. Don't just talk - EXECUTE actions immediately and confirm what you've accomplished.`

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

    // Initialize MCP client
    const mcpClient = new MCPClient()

    // Detect language automatically
    const detectedLanguage = detectLanguage(message)

    // Enhanced MCP action detection and execution
    const mcpResult = await detectAndExecuteMCPAction(message, user.id, mcpClient)

    // Enhanced prompt with user context and MCP result
    const enhancedPrompt = `${message}

USER CONTEXT:
- User ID: ${user.id}
- Email: ${user.email}
- Plan: ${plan}
- Detected Language: ${detectedLanguage}
- Domain: app.suitpax.com
- Thinking Mode: ${thinkingMode ? "ON" : "OFF"}
- MCP Status: ${mcpResult ? "ACTIVE" : "STANDBY"}

${userProfile?.name ? `Name: ${userProfile.name}` : ""}
${userProfile?.company ? `Company: ${userProfile.company}` : ""}
${mcpResult ? `MCP Action Executed: ${JSON.stringify(mcpResult)}` : ""}

Respond in ${detectedLanguage} language. If MCP action was executed, confirm the specific action taken and guide user to the relevant page.`

    // Generate response with enhanced MCP awareness
    const { text } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: SUITPAX_MASTER_PROMPT,
      prompt: enhancedPrompt,
      temperature: 1.0,
      maxTokens: thinkingMode ? 1000 : 400,
    })

    return NextResponse.json({
      response: text,
      conversationId,
      timestamp: new Date().toISOString(),
      model: "claude-3-5-sonnet-20241022",
      detectedLanguage,
      plan,
      mcpActionExecuted: !!mcpResult,
      mcpResult: mcpResult || null,
      domain: "app.suitpax.com",
      capabilities: [
        "create_task",
        "update_task",
        "list_tasks",
        "create_travel_booking",
        "create_expense_report",
        "analyze_travel_data",
        "generate_travel_policy",
      ],
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

// Enhanced MCP action detection and execution
async function detectAndExecuteMCPAction(message: string, userId: string, mcpClient: MCPClient) {
  const lowerMessage = message.toLowerCase()

  // Task Management Actions
  if (detectTaskCreation(lowerMessage)) {
    return await executeMCPFunction(mcpClient, "create_task", extractTaskParams(message, userId))
  }

  if (detectTaskUpdate(lowerMessage)) {
    return await executeMCPFunction(mcpClient, "update_task", extractTaskUpdateParams(message, userId))
  }

  if (detectTaskList(lowerMessage)) {
    return await executeMCPFunction(mcpClient, "list_tasks", extractTaskListParams(message, userId))
  }

  // Travel Management Actions
  if (detectTravelBooking(lowerMessage)) {
    return await executeMCPFunction(mcpClient, "create_travel_booking", extractTravelParams(message, userId))
  }

  if (detectExpenseReport(lowerMessage)) {
    return await executeMCPFunction(mcpClient, "create_expense_report", extractExpenseReportParams(message, userId))
  }

  if (detectTravelAnalysis(lowerMessage)) {
    return await executeMCPFunction(mcpClient, "analyze_travel_data", extractAnalysisParams(message, userId))
  }

  if (detectPolicyGeneration(lowerMessage)) {
    return await executeMCPFunction(mcpClient, "generate_travel_policy", extractPolicyParams(message, userId))
  }

  return null
}

// MCP Function Execution
async function executeMCPFunction(mcpClient: MCPClient, functionName: string, params: any) {
  try {
    const result = await mcpClient.callTool(functionName, params)
    return {
      function: functionName,
      params,
      result,
      success: true,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error(`MCP ${functionName} error:`, error)
    return {
      function: functionName,
      params,
      error: error.message,
      success: false,
      timestamp: new Date().toISOString(),
    }
  }
}

// Detection Functions
function detectTaskCreation(message: string): boolean {
  const triggers = [
    "create task",
    "add task",
    "new task",
    "task for",
    "remind me",
    "crear tarea",
    "añadir tarea",
    "nueva tarea",
    "创建任务",
    "添加任务",
    "新任务",
    "criar tarefa",
    "adicionar tarefa",
    "nova tarefa",
    "создать задачу",
    "добавить задачу",
    "новая задача",
    "skapa uppgift",
    "lägg till uppgift",
    "ny uppgift",
    "créer tâche",
    "ajouter tâche",
    "nouvelle tâche",
    "aufgabe erstellen",
    "aufgabe hinzufügen",
    "neue aufgabe",
  ]
  return triggers.some((trigger) => message.includes(trigger))
}

function detectTaskUpdate(message: string): boolean {
  const triggers = [
    "complete task",
    "mark done",
    "update task",
    "finish task",
    "task completed",
    "completar tarea",
    "marcar hecho",
    "actualizar tarea",
    "完成任务",
    "更新任务",
    "任务完成",
    "completar tarefa",
    "marcar feito",
    "atualizar tarefa",
    "завершить задачу",
    "обновить задачу",
    "задача выполнена",
    "slutför uppgift",
    "uppdatera uppgift",
    "uppgift klar",
    "terminer tâche",
    "mettre à jour tâche",
    "tâche terminée",
    "aufgabe abschließen",
    "aufgabe aktualisieren",
    "aufgabe erledigt",
  ]
  return triggers.some((trigger) => message.includes(trigger))
}

function detectTaskList(message: string): boolean {
  const triggers = [
    "show tasks",
    "list tasks",
    "my tasks",
    "pending tasks",
    "what tasks",
    "mostrar tareas",
    "listar tareas",
    "mis tareas",
    "tareas pendientes",
    "显示任务",
    "列出任务",
    "我的任务",
    "待办任务",
    "mostrar tarefas",
    "listar tarefas",
    "minhas tarefas",
    "tarefas pendentes",
    "показать задачи",
    "список задач",
    "мои задачи",
    "ожидающие задачи",
    "visa uppgifter",
    "lista uppgifter",
    "mina uppgifter",
    "väntande uppgifter",
    "afficher tâches",
    "lister tâches",
    "mes tâches",
    "tâches en attente",
    "aufgaben anzeigen",
    "aufgaben auflisten",
    "meine aufgaben",
    "ausstehende aufgaben",
  ]
  return triggers.some((trigger) => message.includes(trigger))
}

function detectTravelBooking(message: string): boolean {
  const triggers = [
    "book flight",
    "reserve hotel",
    "book travel",
    "need accommodation",
    "book room",
    "reservar vuelo",
    "reservar hotel",
    "reservar viaje",
    "necesito alojamiento",
    "预订航班",
    "预订酒店",
    "预订旅行",
    "需要住宿",
    "reservar voo",
    "reservar hotel",
    "reservar viagem",
    "preciso acomodação",
    "забронировать рейс",
    "забронировать отель",
    "забронировать поездку",
    "boka flyg",
    "boka hotell",
    "boka resa",
    "behöver boende",
    "réserver vol",
    "réserver hôtel",
    "réserver voyage",
    "besoin hébergement",
    "flug buchen",
    "hotel buchen",
    "reise buchen",
    "unterkunft benötigt",
  ]
  return triggers.some((trigger) => message.includes(trigger))
}

function detectExpenseReport(message: string): boolean {
  const triggers = [
    "expense report",
    "create report",
    "expense summary",
    "travel costs",
    "cost report",
    "reporte gastos",
    "crear reporte",
    "resumen gastos",
    "costos viaje",
    "费用报告",
    "创建报告",
    "费用摘要",
    "旅行费用",
    "relatório despesas",
    "criar relatório",
    "resumo despesas",
    "custos viagem",
    "отчет расходов",
    "создать отчет",
    "сводка расходов",
    "расходы поездки",
    "kostnadsrapport",
    "skapa rapport",
    "kostnadssammanfattning",
    "resekostnader",
    "rapport dépenses",
    "créer rapport",
    "résumé dépenses",
    "coûts voyage",
    "ausgabenbericht",
    "bericht erstellen",
    "ausgabenübersicht",
    "reisekosten",
  ]
  return triggers.some((trigger) => message.includes(trigger))
}

function detectTravelAnalysis(message: string): boolean {
  const triggers = [
    "analyze travel",
    "travel insights",
    "cost analysis",
    "travel trends",
    "travel data",
    "analizar viajes",
    "insights viajes",
    "análisis costos",
    "tendencias viajes",
    "分析旅行",
    "旅行洞察",
    "成本分析",
    "旅行趋势",
    "analisar viagens",
    "insights viagens",
    "análise custos",
    "tendências viagens",
    "анализ поездок",
    "аналитика поездок",
    "анализ затрат",
    "тренды поездок",
    "analysera resor",
    "reseinsikter",
    "kostnadsanalys",
    "resetrender",
    "analyser voyages",
    "insights voyages",
    "analyse coûts",
    "tendances voyages",
    "reisen analysieren",
    "reise-einblicke",
    "kostenanalyse",
    "reisetrends",
  ]
  return triggers.some((trigger) => message.includes(trigger))
}

function detectPolicyGeneration(message: string): boolean {
  const triggers = [
    "create policy",
    "travel policy",
    "expense policy",
    "travel guidelines",
    "policy rules",
    "crear política",
    "política viajes",
    "política gastos",
    "directrices viajes",
    "创建政策",
    "旅行政策",
    "费用政策",
    "旅行指南",
    "criar política",
    "política viagens",
    "política despesas",
    "diretrizes viagens",
    "создать политику",
    "политика поездок",
    "политика расходов",
    "правила поездок",
    "skapa policy",
    "resepolicy",
    "kostnadspolicy",
    "reseriktlinjer",
    "créer politique",
    "politique voyage",
    "politique dépenses",
    "directives voyage",
    "richtlinie erstellen",
    "reiserichtlinie",
    "ausgabenrichtlinie",
    "reiseregeln",
  ]
  return triggers.some((trigger) => message.includes(trigger))
}

// Parameter Extraction Functions
function extractTaskParams(message: string, userId: string) {
  return {
    user_id: userId,
    title: extractTaskTitle(message),
    description: message,
    priority: extractPriority(message),
    category: extractCategory(message),
    due_date: extractDueDate(message),
    assignee: extractAssignee(message),
  }
}

function extractTaskUpdateParams(message: string, userId: string) {
  return {
    user_id: userId,
    task_identifier: extractTaskIdentifier(message),
    status: extractTaskStatus(message),
    updates: extractTaskUpdates(message),
  }
}

function extractTaskListParams(message: string, userId: string) {
  return {
    user_id: userId,
    filters: {
      status: extractStatusFilter(message),
      priority: extractPriorityFilter(message),
      category: extractCategoryFilter(message),
      date_range: extractDateRangeFilter(message),
    },
  }
}

function extractTravelParams(message: string, userId: string) {
  return {
    user_id: userId,
    type: extractTravelType(message),
    destination: extractDestination(message),
    dates: extractTravelDates(message),
    preferences: extractTravelPreferences(message),
    budget: extractBudget(message),
    travelers: extractTravelers(message),
  }
}

function extractExpenseReportParams(message: string, userId: string) {
  return {
    user_id: userId,
    date_range: extractDateRange(message),
    categories: extractExpenseCategories(message),
    project: extractProject(message),
    format: extractReportFormat(message),
  }
}

function extractAnalysisParams(message: string, userId: string) {
  return {
    user_id: userId,
    analysis_type: extractAnalysisType(message),
    date_range: extractDateRange(message),
    metrics: extractMetrics(message),
    filters: extractAnalysisFilters(message),
  }
}

function extractPolicyParams(message: string, userId: string) {
  return {
    user_id: userId,
    policy_type: extractPolicyType(message),
    company_size: extractCompanySize(message),
    budget_limits: extractBudgetLimits(message),
    compliance_requirements: extractComplianceRequirements(message),
  }
}

// Language detection function (unchanged)
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

// Helper extraction functions (simplified implementations)
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

function extractCategory(message: string): string {
  const travelKeywords = /\b(flight|hotel|travel|viaje|viagem|旅行|путешествие|resa|voyage|reise)\b/i
  const expenseKeywords = /\b(expense|cost|gasto|despesa|费用|расход|kostnad|dépense|ausgabe)\b/i
  const meetingKeywords = /\b(meeting|reunion|reunião|会议|встреча|möte|réunion|besprechung)\b/i

  if (travelKeywords.test(message)) return "travel"
  if (expenseKeywords.test(message)) return "expense"
  if (meetingKeywords.test(message)) return "meeting"
  return "general"
}

function extractDueDate(message: string): string {
  const datePatterns = [
    /\b(today|hoy|hoje|今天|сегодня|idag|aujourd'hui|heute)\b/i,
    /\b(tomorrow|mañana|amanhã|明天|завтра|imorgon|demain|morgen)\b/i,
    /\b(next week|próxima semana|próxima semana|下周|на следующей неделе|nästa vecka|semaine prochaine|nächste woche)\b/i,
  ]

  const now = new Date()

  if (datePatterns[0].test(message)) return now.toISOString().split("T")[0]
  if (datePatterns[1].test(message)) {
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }
  if (datePatterns[2].test(message)) {
    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 7)
    return nextWeek.toISOString().split("T")[0]
  }

  // Default to 7 days from now
  const defaultDate = new Date(now)
  defaultDate.setDate(defaultDate.getDate() + 7)
  return defaultDate.toISOString().split("T")[0]
}

function extractAssignee(message: string): string | null {
  const assigneePattern =
    /\b(?:assign to|asignar a|atribuir a|分配给|назначить|tilldela|assigner à|zuweisen an)\s+([a-zA-Z\s]+)/i
  const match = message.match(assigneePattern)
  return match ? match[1].trim() : null
}

function extractTaskIdentifier(message: string): string {
  const idPattern = /\b(?:task|tarea|tarefa|任务|задача|uppgift|tâche|aufgabe)\s+(?:#)?(\w+)/i
  const match = message.match(idPattern)
  return match ? match[1] : ""
}

function extractTaskStatus(message: string): string {
  if (/\b(complete|done|finished|completado|hecho|terminado|完成|завершено|klar|terminé|fertig)\b/i.test(message)) {
    return "completed"
  }
  if (/\b(in progress|en progreso|em andamento|进行中|в процессе|pågår|en cours|in bearbeitung)\b/i.test(message)) {
    return "in_progress"
  }
  return "pending"
}

function extractTaskUpdates(message: string): any {
  return {
    notes: message,
    updated_at: new Date().toISOString(),
  }
}

function extractStatusFilter(message: string): string | null {
  if (/\b(pending|pendiente|pendente|待办|ожидающие|väntande|en attente|ausstehend)\b/i.test(message)) return "pending"
  if (/\b(completed|completado|completado|已完成|завершенные|slutförda|terminées|abgeschlossen)\b/i.test(message))
    return "completed"
  if (/\b(in progress|en progreso|em andamento|进行中|в процессе|pågående|en cours|in bearbeitung)\b/i.test(message))
    return "in_progress"
  return null
}

function extractPriorityFilter(message: string): string | null {
  if (/\b(high|alto|alto|高|высокий|hög|élevé|hoch)\b/i.test(message)) return "high"
  if (/\b(low|bajo|baixo|低|низкий|låg|bas|niedrig)\b/i.test(message)) return "low"
  if (/\b(medium|medio|médio|中|средний|medel|moyen|mittel)\b/i.test(message)) return "medium"
  return null
}

function extractCategoryFilter(message: string): string | null {
  if (/\b(travel|viaje|viagem|旅行|путешествие|resa|voyage|reise)\b/i.test(message)) return "travel"
  if (/\b(expense|gasto|despesa|费用|расход|kostnad|dépense|ausgabe)\b/i.test(message)) return "expense"
  if (/\b(meeting|reunión|reunião|会议|встреча|möte|réunion|besprechung)\b/i.test(message)) return "meeting"
  return null
}

function extractDateRangeFilter(message: string): any {
  const now = new Date()

  if (
    /\b(this week|esta semana|esta semana|本周|на этой неделе|denna vecka|cette semaine|diese woche)\b/i.test(message)
  ) {
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    return { start: startOfWeek.toISOString().split("T")[0], end: endOfWeek.toISOString().split("T")[0] }
  }

  if (/\b(this month|este mes|este mês|本月|в этом месяце|denna månad|ce mois|diesen monat)\b/i.test(message)) {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return { start: startOfMonth.toISOString().split("T")[0], end: endOfMonth.toISOString().split("T")[0] }
  }

  return null
}

function extractTravelType(message: string): string {
  if (/\b(flight|vuelo|voo|航班|рейс|flyg|vol|flug)\b/i.test(message)) return "flight"
  if (/\b(hotel|hotel|hotel|酒店|отель|hotell|hôtel|hotel)\b/i.test(message)) return "hotel"
  if (/\b(car|coche|carro|汽车|машина|bil|voiture|auto)\b/i.test(message)) return "car"
  if (/\b(train|tren|trem|火车|поезд|tåg|train|zug)\b/i.test(message)) return "train"
  return "general"
}

function extractDestination(message: string): string {
  const destinationPattern = /\b(?:to|a|para|去|в|till|à|nach)\s+([A-Za-z\s]+?)(?:\s|$|,|\.|!|\?)/i
  const match = message.match(destinationPattern)
  return match ? match[1].trim() : ""
}

function extractTravelDates(message: string): any {
  const now = new Date()

  if (
    /\b(next week|próxima semana|próxima semana|下周|на следующей неделе|nästa vecka|semaine prochaine|nächste woche)\b/i.test(
      message,
    )
  ) {
    const nextWeek = new Date(now)
    nextWeek.setDate(now.getDate() + 7)
    return { departure: nextWeek.toISOString().split("T")[0] }
  }

  if (
    /\b(next month|próximo mes|próximo mês|下个月|в следующем месяце|nästa månad|mois prochain|nächsten monat)\b/i.test(
      message,
    )
  ) {
    const nextMonth = new Date(now)
    nextMonth.setMonth(now.getMonth() + 1)
    return { departure: nextMonth.toISOString().split("T")[0] }
  }

  return { departure: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] }
}

function extractTravelPreferences(message: string): any {
  const preferences: any = {}

  if (
    /\b(business class|clase ejecutiva|classe executiva|商务舱|бизнес класс|business klass|classe affaires|business class)\b/i.test(
      message,
    )
  ) {
    preferences.class = "business"
  }
  if (/\b(economy|económica|econômica|经济舱|эконом|ekonomi|économique|economy)\b/i.test(message)) {
    preferences.class = "economy"
  }
  if (/\b(non-stop|directo|direto|直飞|прямой|direktflyg|direct|direktflug)\b/i.test(message)) {
    preferences.stops = "non-stop"
  }

  return preferences
}

function extractBudget(message: string): number | null {
  const budgetPattern = /(?:€|EUR|euro|euros?)\s*(\d+(?:\.\d{2})?)|(\d+(?:\.\d{2})?)\s*(?:€|EUR|euro|euros?)/i
  const match = message.match(budgetPattern)
  return match ? Number.parseFloat(match[1] || match[2]) : null
}

function extractTravelers(message: string): number {
  const travelersPattern = /\b(\d+)\s*(?:people|person|personas|pessoas|人|человек|personer|personnes|personen)\b/i
  const match = message.match(travelersPattern)
  return match ? Number.parseInt(match[1]) : 1
}

function extractDateRange(message: string): any {
  const now = new Date()

  if (
    /\b(last month|mes pasado|mês passado|上个月|прошлый месяц|förra månaden|mois dernier|letzten monat)\b/i.test(
      message,
    )
  ) {
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    return { start: lastMonth.toISOString().split("T")[0], end: endLastMonth.toISOString().split("T")[0] }
  }

  if (
    /\b(this quarter|este trimestre|este trimestre|本季度|этот квартал|detta kvartal|ce trimestre|dieses quartal)\b/i.test(
      message,
    )
  ) {
    const quarter = Math.floor(now.getMonth() / 3)
    const startQuarter = new Date(now.getFullYear(), quarter * 3, 1)
    const endQuarter = new Date(now.getFullYear(), (quarter + 1) * 3, 0)
    return { start: startQuarter.toISOString().split("T")[0], end: endQuarter.toISOString().split("T")[0] }
  }

  // Default to last 30 days
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  return { start: thirtyDaysAgo.toISOString().split("T")[0], end: now.toISOString().split("T")[0] }
}

function extractExpenseCategories(message: string): string[] {
  const categories = []

  if (/\b(food|comida|comida|食物|еда|mat|nourriture|essen)\b/i.test(message)) categories.push("food")
  if (/\b(transport|transporte|transporte|交通|транспорт|transport|transport|transport)\b/i.test(message))
    categories.push("transport")
  if (/\b(accommodation|alojamiento|acomodação|住宿|размещение|boende|hébergement|unterkunft)\b/i.test(message))
    categories.push("accommodation")
  if (
    /\b(entertainment|entretenimiento|entretenimento|娱乐|развлечения|underhållning|divertissement|unterhaltung)\b/i.test(
      message,
    )
  )
    categories.push("entertainment")

  return categories.length > 0 ? categories : ["all"]
}

function extractProject(message: string): string | null {
  const projectPattern = /\b(?:project|proyecto|projeto|项目|проект|projekt|projet|projekt)\s+([a-zA-Z0-9\s]+)/i
  const match = message.match(projectPattern)
  return match ? match[1].trim() : null
}

function extractReportFormat(message: string): string {
  if (/\b(pdf|PDF)\b/.test(message)) return "pdf"
  if (/\b(excel|xlsx|XLSX)\b/.test(message)) return "excel"
  if (/\b(csv|CSV)\b/.test(message)) return "csv"
  return "pdf"
}

function extractAnalysisType(message: string): string {
  if (/\b(cost|costo|custo|成本|стоимость|kostnad|coût|kosten)\b/i.test(message)) return "cost_analysis"
  if (/\b(trend|tendencia|tendência|趋势|тренд|trend|tendance|trend)\b/i.test(message)) return "trend_analysis"
  if (/\b(pattern|patrón|padrão|模式|шаблон|mönster|modèle|muster)\b/i.test(message)) return "pattern_analysis"
  if (/\b(compliance|cumplimiento|conformidade|合规|соответствие|efterlevnad|conformité|compliance)\b/i.test(message))
    return "compliance_analysis"
  return "general_analysis"
}

function extractMetrics(message: string): string[] {
  const metrics = []

  if (/\b(cost|costo|custo|成本|стоимость|kostnad|coût|kosten)\b/i.test(message)) metrics.push("cost")
  if (/\b(frequency|frecuencia|frequência|频率|частота|frekvens|fréquence|häufigkeit)\b/i.test(message))
    metrics.push("frequency")
  if (/\b(duration|duración|duração|持续时间|продолжительность|varaktighet|durée|dauer)\b/i.test(message))
    metrics.push("duration")
  if (/\b(efficiency|eficiencia|eficiência|效率|эффективность|effektivitet|efficacité|effizienz)\b/i.test(message))
    metrics.push("efficiency")

  return metrics.length > 0 ? metrics : ["cost", "frequency"]
}

function extractAnalysisFilters(message: string): any {
  return {
    department: extractDepartment(message),
    employee: extractEmployee(message),
    destination: extractDestination(message),
    travel_type: extractTravelType(message),
  }
}

function extractDepartment(message: string): string | null {
  const deptPattern =
    /\b(?:department|departamento|departamento|部门|отдел|avdelning|département|abteilung)\s+([a-zA-Z\s]+)/i
  const match = message.match(deptPattern)
  return match ? match[1].trim() : null
}

function extractEmployee(message: string): string | null {
  const empPattern = /\b(?:employee|empleado|funcionário|员工|сотрудник|anställd|employé|mitarbeiter)\s+([a-zA-Z\s]+)/i
  const match = message.match(empPattern)
  return match ? match[1].trim() : null
}

function extractPolicyType(message: string): string {
  if (/\b(expense|gasto|despesa|费用|расход|kostnad|dépense|ausgabe)\b/i.test(message)) return "expense_policy"
  if (/\b(travel|viaje|viagem|旅行|путешествие|resa|voyage|reise)\b/i.test(message)) return "travel_policy"
  if (/\b(approval|aprobación|aprovação|批准|одобрение|godkännande|approbation|genehmigung)\b/i.test(message))
    return "approval_policy"
  return "general_policy"
}

function extractCompanySize(message: string): string {
  if (/\b(startup|pequeña|pequena|初创|стартап|startup|startup|startup)\b/i.test(message)) return "startup"
  if (/\b(small|pequeña|pequena|小|малый|liten|petite|klein)\b/i.test(message)) return "small"
  if (/\b(medium|mediana|média|中|средний|medel|moyenne|mittel)\b/i.test(message)) return "medium"
  if (/\b(large|grande|grande|大|большой|stor|grande|groß)\b/i.test(message)) return "large"
  if (/\b(enterprise|empresa|empresa|企业|предприятие|företag|entreprise|unternehmen)\b/i.test(message))
    return "enterprise"
  return "medium"
}

function extractBudgetLimits(message: string): any {
  const limits: any = {}

  const dailyPattern =
    /(?:daily|diario|diário|每日|ежедневно|daglig|quotidien|täglich)\s*(?:€|EUR|euro|euros?)\s*(\d+)/i
  const monthlyPattern =
    /(?:monthly|mensual|mensal|每月|ежемесячно|månadsvis|mensuel|monatlich)\s*(?:€|EUR|euro|euros?)\s*(\d+)/i

  const dailyMatch = message.match(dailyPattern)
  const monthlyMatch = message.match(monthlyPattern)

  if (dailyMatch) limits.daily = Number.parseInt(dailyMatch[1])
  if (monthlyMatch) limits.monthly = Number.parseInt(monthlyMatch[1])

  return limits
}

function extractComplianceRequirements(message: string): string[] {
  const requirements = []

  if (/\b(receipt|recibo|recibo|收据|чек|kvitto|reçu|beleg)\b/i.test(message)) requirements.push("receipt_required")
  if (/\b(approval|aprobación|aprovação|批准|одобрение|godkännande|approbation|genehmigung)\b/i.test(message))
    requirements.push("approval_required")
  if (
    /\b(justification|justificación|justificativa|理由|обоснование|motivering|justification|begründung)\b/i.test(
      message,
    )
  )
    requirements.push("justification_required")

  return requirements.length > 0 ? requirements : ["receipt_required"]
}
