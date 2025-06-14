import { NextResponse } from "next/server"
import { suitpaxMCPServer } from "@/lib/mcp/suitpax-mcp-server"

// Endpoint para iniciar el servidor MCP
export async function POST() {
  try {
    await suitpaxMCPServer.start(3100)

    return NextResponse.json({
      success: true,
      message: "Suitpax MCP Server started successfully",
      port: 3100,
      capabilities: [
        "Flight search and booking",
        "Hotel search and booking",
        "Expense processing",
        "Email automation",
        "Calendar management",
        "Complete workflows",
        "Analytics generation",
      ],
    })
  } catch (error) {
    console.error("Failed to start MCP server:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to start MCP server",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
