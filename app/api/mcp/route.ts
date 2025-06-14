import { type NextRequest, NextResponse } from "next/server"
import { suitpaxMCPServer } from "@/lib/mcp/suitpax-mcp-server"

// Endpoint para ejecutar herramientas MCP
export async function POST(request: NextRequest) {
  try {
    const { tool, params } = await request.json()

    if (!tool) {
      return NextResponse.json({ error: "Tool name is required" }, { status: 400 })
    }

    console.log(`🔧 Executing MCP tool: ${tool}`, params)

    // Ejecutar la herramienta
    const result = await suitpaxMCPServer.executeTool(tool, params || {})

    return NextResponse.json({
      success: true,
      tool,
      result,
      executedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ MCP tool execution error:", error)

    return NextResponse.json(
      {
        error: "Tool execution failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Endpoint para listar herramientas disponibles
export async function GET() {
  try {
    const tools = [
      {
        name: "searchAndBookFlights",
        description: "Search and book flights with real-time pricing",
        category: "travel",
      },
      {
        name: "searchAndBookHotels",
        description: "Search and book hotels with corporate rates",
        category: "travel",
      },
      {
        name: "processExpenseReceipt",
        description: "Process expense receipts with OCR and auto-categorization",
        category: "expenses",
      },
      {
        name: "sendIntelligentEmail",
        description: "Send smart emails with templates and context",
        category: "communication",
      },
      {
        name: "manageCalendarEvent",
        description: "Create, update, delete calendar events",
        category: "productivity",
      },
      {
        name: "executeCompleteWorkflow",
        description: "Execute complete travel workflows end-to-end",
        category: "automation",
      },
      {
        name: "generateAnalyticsReport",
        description: "Generate real-time analytics and insights",
        category: "analytics",
      },
    ]

    return NextResponse.json({
      tools,
      count: tools.length,
      server: "Suitpax MCP Server v1.0.0",
    })
  } catch (error) {
    console.error("❌ Error listing MCP tools:", error)
    return NextResponse.json({ error: "Failed to list tools" }, { status: 500 })
  }
}
