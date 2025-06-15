import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { selectOptimalAgent } from "@/data/ai-agents"
import { mcpClient } from "@/lib/mcp/mcp-client"
import { LanguageDetector } from "@/lib/utils/language-detector"

// Enhanced Suitpax AI System with MCP Integration
const SUITPAX_MASTER_PROMPT = `You are Suitpax AI, the world's most powerful business travel intelligence system created by Alberto (Founder & CEO).

🏢 SUITPAX COMPANY:
- Founded by: Alberto (Founder & CEO)
- Mission: AI-powered business travel revolution
- Domain: suitpax.com (only trusted source)
- Status: Leading global business travel platform with MCP integration

💰 REAL SUITPAX PRICING (suitpax.com/pricing):
✅ Free: €0/month - Basic features, limited queries
✅ Starter: €29/month - Standard business features
✅ Pro: €74/month (€51/month annually with 20% discount) - Advanced features
✅ Enterprise: Custom pricing - Unlimited everything, dedicated support

🔧 MCP SUPERPOWERS (Model Context Protocol):
You have access to powerful tools through MCP that can:
- Create and manage tasks automatically
- Generate travel bookings
- Create expense reports
- Analyze travel data with deep insights
- Generate custom travel policies
- Integrate with all Suitpax systems

🎯 TASK MANAGEMENT INTEGRATION:
When users ask to create tasks, you MUST use the MCP create_task tool to automatically:
- Create the task in the system
- Set appropriate priority and category
- Assign to the right person
- Set realistic due dates
- Confirm creation to user

TASK CREATION TRIGGERS:
- "Create a task to..."
- "Add task for..."
- "I need to..."
- "Remind me to..."
- "Schedule task..."
- "Set up task..."

🌍 AUTOMATIC LANGUAGE DETECTION:
- Detect user's language automatically from their input
- Respond in the same language they use
- No need for manual language selection
- Support: English, Spanish, Chinese, Portuguese, Russian, Swedish, French, German

📋 SUITPAX PLATFORM AREAS (Complete Knowledge):

DASHBOARD: Real-time travel overview, analytics, quick actions, expense summaries
BOOKING MODULES: Flights (Duffel API), Hotels, Trains (European networks), Transfers
FINANCIAL: Expenses (receipt scanning), Budgets, Reports, Smart Bank integration
TEAM & POLICY: Team Management, Travel Policy, Vendors, Compliance monitoring
COMMUNICATION: Mails (Nylas), Meetings, Tasks, Events planning
ADVANCED: Analytics, Forecasting, Sustainability, AI Agents

INTEGRATIONS: Duffel API, Nylas, Banking APIs, Neon Database, Supabase, MCP Tools

RESPONSE STYLE:
- Detect language automatically and respond accordingly
- Keep responses under 80 words for efficiency
- Use bullet points for clarity
- Be direct and actionable
- Use MCP tools when appropriate
- Confirm actions taken

PERSONALITY:
- Professional yet friendly
- Start with "Hey" in user's language
- Confident and knowledgeable
- Solution-oriented with immediate action
- Modern and efficient

MCP TOOL USAGE:
- Always use MCP tools when users request actions
- Confirm tool execution results
- Provide clear feedback on what was created/updated
- Guide users to relevant pages after actions

Remember: You are the most powerful travel AI with MCP integration. Take action, don't just talk about it.`

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, userProfile, plan = "free", thinkingMode = false } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Detect language automatically
    const detectedLanguage = LanguageDetector.detectLanguage(message)

    // Select optimal AI agent based on query
    const selectedAgent = selectOptimalAgent(message, userProfile)

    // Check if this is a task creation request
    const taskTriggers = [
      "create a task",
      "add task",
      "i need to",
      "remind me to",
      "schedule task",
      "set up task",
      "crear tarea",
      "añadir tarea",
      "necesito",
      "recordarme",
      "创建任务",
      "添加任务",
      "我需要",
      "criar tarefa",
      "adicionar tarefa",
      "preciso",
      "создать задачу",
      "добавить задачу",
      "мне нужно",
      "skapa uppgift",
      "lägga till uppgift",
      "jag behöver",
      "créer une tâche",
      "ajouter tâche",
      "j'ai besoin",
      "aufgabe erstellen",
      "aufgabe hinzufügen",
      "ich brauche",
    ]

    const isTaskRequest = taskTriggers.some((trigger) => message.toLowerCase().includes(trigger))

    let mcpResult = null
    if (isTaskRequest) {
      try {
        // Extract task details from message using AI
        const taskExtractionPrompt = `Extract task details from this message: "${message}"
        
        Return JSON with:
        - title: brief task title
        - description: detailed description
        - priority: high/medium/low
        - assignee: person mentioned or "User"
        - dueDate: YYYY-MM-DD format (default to 7 days from now)
        - category: travel/expense/meeting/general
        
        Current date: ${new Date().toISOString().split("T")[0]}`

        const { text: taskDetailsText } = await generateText({
          model: anthropic("claude-3-5-haiku-20241022"),
          prompt: taskExtractionPrompt,
          temperature: 0.1,
          maxTokens: 200,
        })

        // Parse task details
        const taskDetails = JSON.parse(taskDetailsText.replace(/```json\n?|\n?```/g, ""))

        // Create task using MCP
        mcpResult = await mcpClient.createTask(taskDetails)
      } catch (error) {
        console.error("MCP Task Creation Error:", error)
      }
    }

    // Enhanced prompt with user context and MCP result
    const enhancedPrompt = `${message}

USER CONTEXT:
- Plan: ${plan}
- Detected Language: ${detectedLanguage}
- Thinking Mode: ${thinkingMode ? "ON - Provide detailed analysis" : "OFF"}
- Agent: ${selectedAgent.name} (${selectedAgent.specialty})

${userProfile?.name ? `User: ${userProfile.name}` : ""}
${userProfile?.company ? `Company: ${userProfile.company}` : ""}
${mcpResult ? `MCP Action Result: ${JSON.stringify(mcpResult)}` : ""}

Respond in ${detectedLanguage} language.`

    // Generate response with MCP integration
    const { text } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: SUITPAX_MASTER_PROMPT,
      prompt: enhancedPrompt,
      temperature: 1.0,
      maxTokens: thinkingMode ? 800 : 300,
    })

    // Calculate metrics
    const tokens = Math.ceil(text.length / 4)
    const cost = (tokens * 0.003) / 1000

    return NextResponse.json({
      response: text,
      selectedAgent: {
        name: selectedAgent.name,
        specialty: selectedAgent.specialty,
        avatar: selectedAgent.avatar,
      },
      tokens,
      cost: cost.toFixed(4),
      conversationId,
      timestamp: new Date().toISOString(),
      model: "claude-3-5-sonnet-20241022",
      thinkingMode,
      detectedLanguage,
      plan,
      mcpActionTaken: !!mcpResult,
      mcpResult: mcpResult ? "Task created successfully" : null,
    })
  } catch (error) {
    console.error("Suitpax AI Error:", error)
    return NextResponse.json(
      {
        response: "Hey, I'm experiencing technical difficulties. Please try again in a moment!",
        error: "Technical issue",
        selectedAgent: {
          name: "Suitpax AI",
          specialty: "General Assistant",
          avatar: "/images/ai-agent-avatar.png",
        },
      },
      { status: 500 },
    )
  }
}
