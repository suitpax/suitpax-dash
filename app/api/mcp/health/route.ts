import { NextResponse } from "next/server"
import { mcpHealthCheck } from "@/lib/mcp/mcp-health-check"

export async function GET() {
  try {
    const health = await mcpHealthCheck.checkHealth()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      mcp: health,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        mcp: {
          status: "error",
          details: {
            serverRunning: false,
            toolsAvailable: 0,
            error: error instanceof Error ? error.message : "Health check failed",
          },
        },
      },
      { status: 500 },
    )
  }
}
